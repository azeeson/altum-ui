import {execFileSync} from 'node:child_process';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const forbidden = /^(src|scripts|tests|\.storybook|Examples|design-system|\.cursor)\//;

const raw = execFileSync('npm', ['pack', '--dry-run', '--json'], {
	cwd: root,
	encoding: 'utf8',
	stdio: ['ignore', 'pipe', 'inherit'],
});

/** @type {Array<{filename: string, files: Array<{path: string}>}>} */
const packs = JSON.parse(raw);
const files = packs.flatMap((item) => item.files.map((file) => file.path));
const leaked = files.filter((file) => forbidden.test(file));

if (leaked.length) {
	console.error('Запрещённые пути в npm pack:\n' + leaked.map((file) => `  ${file}`).join('\n'));
	process.exit(1);
}

console.log(`npm pack ок: ${files.length} файлов, нет src/scripts/tests/.storybook/Examples`);
