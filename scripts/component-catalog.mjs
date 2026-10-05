/**
 * Обновляет список и размер компонентов для Storybook About.
 * В каталог попадают папки, которые экспортирует `src/index.ts`.
 * `src/components/internal/` туда не входит: эти узлы не экспортируются.
 *
 * `bytes` — минифицированный бандл `index.ts` папки. CSS минифицирует esbuild.
 * react / react-dom и импорты вне папки — external, их код не входит.
 * Stories не импортируются из `index.ts`, поэтому в замер не попадают.
 * Существующие `description` не перезаписываются.
 *
 * node scripts/component-catalog.mjs
 * npm run catalog
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import esbuild from 'esbuild';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const catalogPath = path.join(root, 'src/storybook/componentCatalog.ts');
const storiesPath = path.join(root, 'src/storybook/AboutComponents.stories.tsx');

const cssText = {
	name: 'css-text',
	setup(build) {
		build.onLoad({filter: /\.css$/}, async (args) => {
			const {code} = await esbuild.transform(fs.readFileSync(args.path, 'utf8'), {
				loader: 'css',
				minify: true,
				legalComments: 'none',
			});
			return {
				contents: `export default ${JSON.stringify(code)};`,
				loader: 'js',
			};
		});
	},
};

function publicNames() {
	const index = fs.readFileSync(path.join(root, 'src/index.ts'), 'utf8');
	return [...new Set([...index.matchAll(/from '\.\/components\/([^'/]+)'/g)].map((match) => match[1]))].sort();
}

function tsString(value) {
	if (!value.includes('\'')) return `'${value}'`;
	if (!value.includes('"') && !value.includes('\\')) return `"${value}"`;
	return `'${value.replace(/\\/g, '\\\\').replace(/'/g, '\\\'')}'`;
}

function prose(block) {
	const lines = block
		.split('\n')
		.map((line) => line.replace(/^\s*\*\s?/, '').trim())
		.filter((line) => line && !line.startsWith('@') && !line.startsWith('<'));
	const sentence = lines.join(' ').split(/(?<=[.!?])\s/)[0].replace(/\s+/g, ' ').trim();
	return sentence.replace(/`/g, '').replace(/\.+$/, '.');
}

function descriptionFromSource(name) {
	const dir = path.join(root, 'src/components', name);
	const target = [`${name}.tsx`, `${name}.ts`]
		.map((file) => path.join(dir, file))
		.find((file) => fs.existsSync(file));
	if (!target) return name;
	const text = fs.readFileSync(target, 'utf8');
	const blocks = [...text.matchAll(/\/\*\*([\s\S]*?)\*\//g)].map((match) => match[1]);
	const component = blocks.find((block) => block.includes('@component'));
	return prose(component || blocks[0] || '') || name;
}

function readCatalog(source) {
	const descriptions = new Map();
	const re = /name:\s*(['"])([^'"]+)\1,[\s\S]*?description:\s*(['"])([\s\S]*?)\3,/g;
	for (const match of source.matchAll(re)) {
		descriptions.set(match[2], match[4]);
	}
	const declared = (source.match(/\bname:\s*['"]/g) || []).length;
	if (declared !== descriptions.size) {
		throw new Error('Не удалось разобрать описания в src/storybook/componentCatalog.ts');
	}
	return descriptions;
}

function renderCatalog(rows) {
	const body = rows.map((row) => (
		`\t{\n\t\tname: ${tsString(row.name)},\n\t\tbytes: ${row.bytes},\n\t\tdescription: ${tsString(row.description)},\n\t}`
	)).join(',\n');
	const total = rows.reduce((sum, row) => sum + row.bytes, 0);
	return `/**
 * Каталог для Storybook About.
 * Список и \`bytes\` обновляет \`npm run catalog\`. Описания скрипт не перезаписывает.
 * \`bytes\` — минифицированный бандл папки: свой код и свой минифицированный CSS.
 * Stories и код из других папок не входят, сумма не считает общее дважды.
 */
export const componentCatalog = [
${body},
] as const;

export const componentCatalogBytes = ${total};
`;
}

async function ownMin(name) {
	const dir = path.join(root, 'src/components', name);
	const entry = path.join(dir, 'index.ts');
	if (!fs.existsSync(entry)) {
		throw new Error(`${name} экспортируется из src/index.ts, но нет ${path.relative(root, entry)}`);
	}
	const result = await esbuild.build({
		absWorkingDir: root,
		entryPoints: [entry],
		bundle: true,
		minify: true,
		format: 'esm',
		platform: 'browser',
		target: 'es2020',
		write: false,
		legalComments: 'none',
		jsx: 'automatic',
		external: ['react', 'react-dom', 'react/jsx-runtime'],
		plugins: [{
			name: 'own-only',
			setup(build) {
				build.onResolve({filter: /.*/}, (args) => {
					if (args.kind === 'entry-point') return null;
					if (!args.path.startsWith('.') && !path.isAbsolute(args.path)) {
						return {path: args.path, external: true};
					}
					const abs = path.resolve(args.resolveDir, args.path);
					if (!abs.startsWith(dir + path.sep)) return {path: args.path, external: true};
					return null;
				});
			},
		}, cssText],
		logLevel: 'silent',
	});
	return Buffer.byteLength(result.outputFiles[0].text);
}

function readIcons(source) {
	const start = source.indexOf('const ICONS: Record<string, FC<IconProps>> = {');
	if (start < 0) throw new Error('Не найден список ICONS в AboutComponents.stories.tsx');
	const brace = source.indexOf('{', start);
	const end = source.indexOf('\n};', brace);
	if (end < 0) throw new Error('Не найден конец списка ICONS');
	const icons = new Map();
	for (const line of source.slice(brace + 1, end).split('\n')) {
		if (!line.trim()) continue;
		const match = line.match(/^\t([A-Za-z0-9]+): icons\.([A-Za-z0-9]+),$/);
		if (!match) throw new Error(`Неожиданная строка в ICONS: ${line}`);
		icons.set(match[1], match[2]);
	}
	return {icons, brace, end};
}

function renderIcons(source, names, icons) {
	const parsed = readIcons(source);
	const lines = names.map((name) => `\t${name}: icons.${icons.get(name) ?? parsed.icons.get(name) ?? 'IconBox'},`);
	return `${source.slice(0, parsed.brace + 1)}\n${lines.join('\n')}${source.slice(parsed.end)}`;
}

const names = publicNames();
const previousSource = fs.existsSync(catalogPath) ? fs.readFileSync(catalogPath, 'utf8') : '';
const previous = previousSource ? readCatalog(previousSource) : new Map();
const previousBytes = new Map();
if (previousSource) {
	for (const match of previousSource.matchAll(/name:\s*(['"])([^'"]+)\1,\s*bytes:\s*(\d+),/g)) {
		previousBytes.set(match[2], Number(match[3]));
	}
}

const rows = [];
for (const name of names) {
	const bytes = await ownMin(name);
	const description = previous.get(name) ?? descriptionFromSource(name);
	rows.push({name, bytes, description});
}

const nextCatalog = renderCatalog(rows);
const storiesSource = fs.readFileSync(storiesPath, 'utf8');
const iconState = readIcons(storiesSource);
const nextStories = renderIcons(storiesSource, names, iconState.icons);

const added = names.filter((name) => !previous.has(name));
const removed = [...previous.keys()].filter((name) => !names.includes(name));
const resized = rows.filter((row) => previousBytes.has(row.name) && previousBytes.get(row.name) !== row.bytes);
const newIcons = names.filter((name) => !iconState.icons.has(name));

if (nextCatalog !== previousSource) fs.writeFileSync(catalogPath, nextCatalog);
if (nextStories !== storiesSource) fs.writeFileSync(storiesPath, nextStories);

const total = rows.reduce((sum, row) => sum + row.bytes, 0);
if (added.length === 0 && removed.length === 0 && resized.length === 0 && newIcons.length === 0) {
	console.log(`Каталог без изменений: ${names.length} компонентов, ${total} байт`);
} else {
	for (const name of added) {
		const row = rows.find((item) => item.name === name);
		console.log(`+ ${name} ${row.bytes}`);
	}
	for (const name of removed) console.log(`- ${name}`);
	for (const row of resized) {
		console.log(`~ ${row.name} ${previousBytes.get(row.name)} → ${row.bytes}`);
	}
	if (newIcons.length) console.log(`Иконка по умолчанию (IconBox): ${newIcons.join(', ')}`);
	console.log(`${names.length} компонентов, ${total} байт`);
}
