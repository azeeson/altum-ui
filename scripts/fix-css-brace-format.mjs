/**
 * Дополняет stylelint --fix: перенос после `{` и перед `}`.
 * Нужен, когда autofix stylelint оставил первое свойство на строке с `{`.
 * В конфиге обязательно `block-*-brace-space-*: never-single-line`, иначе
 * `space-after: never` конфликтует с `newline-after: always`.
 *
 * Запуск: node scripts/fix-css-brace-format.mjs [glob-root]
 */
import fs from 'node:fs';
import path from 'node:path';
import postcss from 'postcss';

const root = path.resolve(import.meta.dirname, '..');
const targetDir = process.argv[2]
	? path.resolve(process.cwd(), process.argv[2])
	: path.join(root, 'src');

function collectCssFiles(dir, files = []) {
	if (!fs.existsSync(dir)) return files;

	for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
		const fullPath = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			if (entry.name === 'node_modules' || entry.name === 'dist') continue;
			collectCssFiles(fullPath, files);
			continue;
		}
		if (entry.name.endsWith('.css')) files.push(fullPath);
	}

	return files;
}

function firstBlockChild(statement) {
	let node = statement.first;
	while (node && node.type === 'comment') node = node.next();
	return node;
}

function fixBlockStatement(statement) {
	if (!statement.nodes?.length) return false;

	let changed = false;

	const first = firstBlockChild(statement);
	if (first) {
		const before = first.raws.before ?? '';
		if (!/\r?\n/.test(before)) {
			first.raws.before = `\n  ${before.replace(/^\s*/, '')}`;
			changed = true;
		}
	}

	const after = statement.raws.after ?? '';
	if (!/\r?\n/.test(after)) {
		statement.raws.after = `\n${after.replace(/^\s*/, '')}`;
		changed = true;
	}

	return changed;
}

function fixCss(source) {
	const result = postcss.parse(source, {from: undefined});
	let changed = false;

	result.walkRules((rule) => {
		if (fixBlockStatement(rule)) changed = true;
	});

	result.walkAtRules((atRule) => {
		if (!atRule.nodes?.length) return;
		if (fixBlockStatement(atRule)) changed = true;
	});

	if (!changed) return null;

	return `${result.toString()}\n`;
}

let updated = 0;

for (const file of collectCssFiles(targetDir)) {
	const source = fs.readFileSync(file, 'utf8');
	const next = fixCss(source);
	if (next === null || next === source) continue;
	fs.writeFileSync(file, next);
	updated += 1;
}

if (updated > 0) {
	process.stdout.write(`fix-css-brace-format: updated ${updated} file(s)\n`);
}
