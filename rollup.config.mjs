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

/** @type {import('rollup').ExternalOption} */
const externals = [
	'react',
	'react-dom',
	'react/jsx-runtime',
];

/**
 * Ключи совпадают с путями вывода при preserveModulesRoot (`src/`), поэтому точки входа
 * попадают в `dist/entries/*.js`, а общие модули — в `dist/{components,hooks,utils}/…`
 * (не используйте `entryFileNames: 'entries/${name}.js'` — это вкладывает весь граф в entries/).
 *
 * @type {Record<string, string>}
 */
const entryInputs = {
	index: path.join(root, 'src/index.ts'),
	'entries/hooks': path.join(root, 'src/entries/hooks.ts'),
	'entries/utils': path.join(root, 'src/entries/utils.ts'),
	'entries/icons': path.join(root, 'src/entries/icons.ts'),
};

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
		// CSS Modules → инжект <style> при загрузке JS-модуля (без style-inject).
		postcss({
			modules: {
				generateScopedName: '[folder]_[hash:base64:5]',
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
			inject: (cssVariableName) => (
				`(function(c){if(typeof document==='undefined')return;var e=document.createElement('style');e.textContent=c;document.head.appendChild(e);})(${cssVariableName});`
			),
		}),
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
				|| name.startsWith('components/')
				|| name.startsWith('base/')
				|| name.startsWith('hooks/')
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
