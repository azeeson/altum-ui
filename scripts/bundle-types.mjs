import {rollup} from 'rollup';
import dts from 'rollup-plugin-dts';
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const typesRoot = path.join(root, 'types');

const entries = [
	{input: 'src/index.ts', output: 'types/index.d.ts'},
	{input: 'src/entries/hooks.ts', output: 'types/entries/hooks.d.ts'},
	{input: 'src/entries/utils.ts', output: 'types/entries/utils.d.ts'},
	{input: 'src/entries/icons.ts', output: 'types/entries/icons.d.ts'},
];

fs.rmSync(typesRoot, {recursive: true, force: true});
fs.mkdirSync(path.join(typesRoot, 'entries'), {recursive: true});

for (const {input, output} of entries) {
	const bundle = await rollup({
		input: path.join(root, input),
		plugins: [
			{
				name: 'ignore-css',
				resolveId(source) {
					if (source.endsWith('.css')) return `\0css:${source}`;
					return null;
				},
				load(id) {
					if (id.startsWith('\0css:') || id.endsWith('.css')) {
						return 'export default {};';
					}
					return null;
				},
			},
			dts({
				tsconfig: path.join(root, 'tsconfig.types.json'),
				compilerOptions: {
					removeComments: true,
				},
			}),
		],
	});

	await bundle.write({
		file: path.join(root, output),
		format: 'es',
	});
}
