#!/usr/bin/env node
/**
 * Проверяет владение CSS:
 * - TSX может импортировать только `./Something.module.css` из своей папки
 * - Нет CSS в src/styles/** или src/components/common/**
 * - Нет `composes:` у CSS Modules
 *
 * Использование: node scripts/audit-css-ownership.mjs
 * Код выхода 1 при нарушениях.
 */
import fs from 'node:fs';
import path from 'node:path';

const SRC = path.resolve('src');
const violations = [];

function walk(dir, acc = []) {
	if (!fs.existsSync(dir)) return acc;
	for (const name of fs.readdirSync(dir)) {
		const p = path.join(dir, name);
		if (fs.statSync(p).isDirectory()) walk(p, acc);
		else acc.push(p);
	}
	return acc;
}

const allFiles = walk(SRC);

// 1) Запрещённые места для CSS
for (const file of allFiles) {
	const rel = path.relative(SRC, file);
	if (!file.endsWith('.css')) continue;
	if (rel.startsWith(`styles${path.sep}`) || rel === 'styles') {
		violations.push(`Запрещённый общий CSS: src/${rel}`);
	}
	if (rel.startsWith(`components${path.sep}common${path.sep}`)) {
		violations.push(`Запрещённый CSS в common: src/${rel}`);
	}
}

// 2) Без composes
for (const file of allFiles) {
	if (!file.endsWith('.css')) continue;
	const text = fs.readFileSync(file, 'utf8');
	if (/\bcomposes\s*:/.test(text)) {
		violations.push(`Найден composes: ${path.relative(process.cwd(), file)}`);
	}
}

// 3) Импорты .module.css из чужой папки в TS/TSX
const importRe = /from\s+['"]([^'"]+\.module\.css)['"]/g;
for (const file of allFiles) {
	if (!/\.(tsx?|jsx?)$/.test(file)) continue;
	if (file.includes(`${path.sep}common${path.sep}`) && /stories\.(tsx?|jsx?)$/.test(file)) {
		// stories в common будут удалены; всё равно проверяем
	}
	const text = fs.readFileSync(file, 'utf8');
	const fileDir = path.dirname(file);
	let match;
	while ((match = importRe.exec(text)) !== null) {
		const spec = match[1];
		const resolved = path.resolve(fileDir, spec);
		const resolvedDir = path.dirname(resolved);
		if (resolvedDir !== fileDir) {
			violations.push(
				`Импорт CSS из чужой папки: ${path.relative(process.cwd(), file)} → ${spec}`,
			);
		}
	}
}

// 4) Пространство токенов: CSS компонента может объявлять/использовать только --altum-* (HEX только в ThemeProvider)
const TOKEN_RE = /--[a-zA-Z][a-zA-Z0-9-]*/g;
const HEX_RE = /#[0-9a-fA-F]{3,8}\b/;
for (const file of allFiles) {
	if (!file.endsWith('.css')) continue;
	const rel = path.relative(process.cwd(), file);
	if (rel.includes(`${path.sep}Examples${path.sep}`)) continue;
	if (rel.includes('.stories.module.css')) continue;
	const isTheme = rel.includes(`${path.sep}ThemeProvider${path.sep}`);
	const text = fs.readFileSync(file, 'utf8');
	if (!isTheme && HEX_RE.test(text.replace(/\/\*[\s\S]*?\*\//g, ''))) {
		violations.push(`HEX/RGB вне ThemeProvider: ${rel}`);
	}
	const tokens = text.match(TOKEN_RE) ?? [];
	for (const token of tokens) {
		if (!token.startsWith('--altum-')) {
			violations.push(`Токен не --altum-* ${token} в ${rel}`);
		}
	}
}

if (violations.length) {
	console.error(`Аудит владения CSS не пройден (${violations.length}):\n`);
	for (const v of violations) console.error(`  • ${v}`);
	process.exit(1);
}

console.log('Аудит владения CSS пройден.');
