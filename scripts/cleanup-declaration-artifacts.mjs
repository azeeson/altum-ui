import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dist = path.resolve(__dirname, '../dist');

const leakedName = /(^|[\\/])(Examples|test-stories)([\\/]|$)|\.stories(\.module)?\.(css|js|d\.ts)$/i;
const leaked = [];

/**
 * Удаляет лишние `.d.ts` в `dist/` после эмита JS.
 * Не удаляйте целые папки (`components`, `hooks`, …) — Rollup
 * `preserveModules` пишет туда настоящий ESM-граф.
 */
function walk(dir) {
	if (!fs.existsSync(dir)) return;

	for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
		const fullPath = path.join(dir, entry.name);
		const rel = path.relative(dist, fullPath);
		if (leakedName.test(rel)) {
			leaked.push(rel);
		}
		if (entry.isDirectory()) {
			walk(fullPath);
			continue;
		}
		if (entry.name.endsWith('.d.ts')) {
			fs.rmSync(fullPath, {force: true});
		}
	}
}

walk(dist);

const useClientErrors = [];

function shouldMarkUseClient(rel) {
	const normalized = rel.replace(/\\/g, '/');
	return (
		normalized === 'index.js'
		|| normalized === 'entries/hooks.js'
		|| normalized.startsWith('components/')
		|| normalized.startsWith('base/')
		|| normalized.startsWith('hooks/')
		|| normalized.startsWith('styles/')
	);
}

function walkUseClient(dir) {
	if (!fs.existsSync(dir)) return;

	for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
		const fullPath = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			walkUseClient(fullPath);
			continue;
		}
		if (!entry.name.endsWith('.js')) continue;
		const rel = path.relative(dist, fullPath);
		const head = fs.readFileSync(fullPath, 'utf8').slice(0, 24);
		const hasDirective = head.startsWith('\'use client\';') || head.startsWith('"use client";');
		const expected = shouldMarkUseClient(rel);
		if (expected && !hasDirective) {
			useClientErrors.push(`${rel}: нет 'use client'`);
		}
		if (!expected && hasDirective) {
			useClientErrors.push(`${rel}: лишний 'use client'`);
		}
	}
}

walkUseClient(dist);

if (leaked.length) {
	console.error('В dist попали файлы только для разработки:\n' + leaked.map((f) => `  ${f}`).join('\n'));
	process.exit(1);
}

if (useClientErrors.length) {
	console.error('Расположение \'use client\':\n' + useClientErrors.map((line) => `  ${line}`).join('\n'));
	process.exit(1);
}
