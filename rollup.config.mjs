import path from 'path';
import {fileURLToPath} from 'url';
import fs from 'node:fs';
import resolve from '@rollup/plugin-node-resolve';
import esbuild from 'rollup-plugin-esbuild';
import postcss from 'rollup-plugin-postcss';
import postcssNesting from 'postcss-nesting';
import autoprefixer from 'autoprefixer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname);
const distDir = path.join(root, 'dist');

const externals = ['react', 'react-dom', 'react/jsx-runtime'];

const entryInputs = {
	index: path.join(root, 'src/index.ts'),
	'entries/hooks': path.join(root, 'src/entries/hooks.ts'),
	'entries/utils': path.join(root, 'src/entries/utils.ts'),
	'entries/icons': path.join(root, 'src/entries/icons.ts'),
	'entries/locales': path.join(root, 'src/entries/locales.ts'),
};

/** Ядро symbol-shrink — дублирует [`src/core/utils/cssShrinkTokens.ts`](src/core/utils/cssShrinkTokens.ts). */
const CSS_SHRINK_MAX_TOKENS = 30;
const CSS_SHRINK_CORE = [
	'var(--altum-color-',
	'var(--altum-g-space-',
	'var(--altum-g-font-size-',
	'var(--altum-g-font-weight-',
	'var(--altum-g-radius',
	'var(--altum-field-',
	'background-color:var(--altum-',
	'border-radius:var(--altum-',
	'box-shadow:var(--altum-',
	'border-color:var(--altum-',
	'1px solid var(--altum-',
	'font-size:var(--altum-',
	'font-weight:var(--altum-',
	'color:var(--altum-',
	'height:var(--altum-',
	'padding:var(--altum-',
	'gap:var(--altum-',
	'color-mix(in srgb,',
	'var(--altum-',
	'--altum-',
	'[data-orientation=',
	'[data-variant=',
	'[data-layout=',
	'[data-status=',
	'[data-state=',
	'[data-size=',
	'[data-side=',
	'[data-mode=',
	'[data-disabled',
	'box-sizing:border-box',
];

function compressCssWithSymbols(css, tokens) {
	const indexed = tokens.map((token, i) => ({
		token,
		sym: String.fromCharCode(1 + i),
	}));
	indexed.sort((a, b) => b.token.length - a.token.length);

	let out = css;
	for (const {token, sym} of indexed) {
		if (!token) continue;
		out = out.split(token).join(sym);
	}
	return out;
}

/** Извлекает CSS-строку, которую передают в `injectCss` (с учётом minify-алиаса). */
function extractCssVarAssignment(code) {
	const importMatch = code.match(/import\s*\{\s*injectCss(?:\s+as\s+(\w+))?\s*\}/);
	if (!importMatch) return null;
	const fnName = importMatch[1] ?? 'injectCss';
	const call = code.match(new RegExp(`${fnName}\\((\\w+)\\)`));
	if (!call) return null;
	const name = call[1];
	const re = new RegExp(
		`((?:var|const|let) ${name})\\s*=\\s*("(?:\\\\.|[^"\\\\])*"|'(?:\\\\.|[^'\\\\])*')`,
	);
	const match = code.match(re);
	if (!match) return null;
	const literal = match[2];
	const css = Function(`return ${literal}`)();
	return {full: match[0], decl: match[1], name, css};
}

/**
 * Symbol-shrink: длинные CSS-подстроки → `\x01…\x1E` в бандле, разворот в `injectCss`.
 * Жёсткий лимит 30 токенов: дальше начинаются печатаемые ASCII и ломают CSS.
 */
const cssSymbolShrinkPlugin = () => ({
	name: 'css-symbol-shrink',

	generateBundle(_options, bundle) {
		const cssModuleChunks = [];

		for (const fileName in bundle) {
			const chunk = bundle[fileName];
			if (chunk.type !== 'chunk') continue;
			if (!fileName.endsWith('.module.css.js') && !chunk.code.includes('injectCss')) continue;

			const extracted = extractCssVarAssignment(chunk.code);
			if (!extracted) continue;

			cssModuleChunks.push({fileName, chunk, extracted});
		}

		if (cssModuleChunks.length === 0) return;

		const dictionary = [...new Set(CSS_SHRINK_CORE)].slice(0, CSS_SHRINK_MAX_TOKENS);
		if (dictionary.length > CSS_SHRINK_MAX_TOKENS) {
			this.warn(`css-symbol-shrink: словарь обрезан до ${CSS_SHRINK_MAX_TOKENS} токенов`);
		}

		for (const {chunk, extracted} of cssModuleChunks) {
			const compressed = compressCssWithSymbols(extracted.css, dictionary);
			const newAssignment = `${extracted.decl}=${JSON.stringify(compressed)}`;
			chunk.code = chunk.code.replace(extracted.full, newAssignment);
		}

		const tokensChunkKey = Object.keys(bundle).find(
			(k) => k.replace(/\\/g, '/').endsWith('utils/cssShrinkTokens.js'),
		);
		if (tokensChunkKey && bundle[tokensChunkKey].type === 'chunk') {
			bundle[tokensChunkKey].code = `export const CSS_SHRINK_MAX_TOKENS=${CSS_SHRINK_MAX_TOKENS};export const CSS_SHRINK_TOKENS=${JSON.stringify(dictionary)};`;
		}
	},
});

/** @type {import('rollup').RollupOptions} */
const config = {
	input: entryInputs,
	external: externals,
	plugins: [
		{
			name: 'clean-dist',
			buildStart() {
				fs.rmSync(distDir, {recursive: true, force: true});
			},
		},
		resolve({
			extensions: ['.ts', '.tsx', '.js', '.jsx'],
		}),
		{
			name: 'reject-dev-only-modules',
			resolveId(source) {
				if (
					/\.stories(\.module)?\.(css|[cm]?[jt]sx?)$/.test(source)
					|| /(^|\/)test-stories(\/|$)/.test(source)
					|| /(^|\/)Examples(\/|$)/.test(source)
				) {
					throw new Error(`Модуль только для разработки не должен попадать в бандл библиотеки: ${source}`);
				}
				return null;
			},
		},
		esbuild({
			include: /\.[jt]sx?$/,
			exclude: /node_modules/,
			target: 'es2020',
			jsx: 'automatic',
			minify: true,
			legalComments: 'none',
			define: {
				'process.env.NODE_ENV': JSON.stringify('production'),
			},
			tsconfig: path.join(root, 'tsconfig.json'),
		}),
		postcss({
			modules: {
				generateScopedName: '[hash:base64:5]',
			},
			autoModules: (id) => id.endsWith('.module.css'),
			extract: false,
			minimize: {
				preset: ['default', {discardComments: {removeAll: true}}],
			},
			plugins: [
				postcssNesting(),
				autoprefixer(),
			],
			inject: (cssVariableName, id) => {
				const fromDir = path.dirname(id);
				const injectFile = path.join(root, 'src/core/utils/injectCss.ts');
				let rel = path.relative(fromDir, injectFile).replace(/\\/g, '/');
				if (!rel.startsWith('.')) rel = `./${rel}`;
				rel = rel.replace(/\.ts$/, '.js');
				return `import {injectCss} from '${rel}';injectCss(${cssVariableName});`;
			},
		}),
	
		cssSymbolShrinkPlugin(),
	],
	output: {
		dir: distDir,
		format: 'esm',
		preserveModules: true,
		preserveModulesRoot: path.join(root, 'src'),
		sourcemap: false,
		hoistTransitiveImports: false,
		generatedCode: {
			constBindings: true,
		},
		banner(chunk) {
			const name = chunk.name.replace(/\\/g, '/');
			if (
				name === 'index'
				|| name === 'entries/hooks'
				|| name === 'entries/locales'
				|| name.startsWith('components/')
				|| name.startsWith('base/')
				|| name.startsWith('hooks/')
				|| name.startsWith('styles/')
			) {
				return '\'use client\';';
			}
			return '';
		},
	},
	treeshake: {
		moduleSideEffects: (id, external) => (
			external
			|| id.endsWith('.css')
			|| id.endsWith('.module.css')
		),
		propertyReadSideEffects: false,
		unknownGlobalSideEffects: false,
		tryCatchDeoptimization: false,
	},
};

export default config;
