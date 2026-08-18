#!/usr/bin/env node
/**
 * Создаёт папку публичного компонента Altum (5 файлов).
 *
 * Использование: npm run scaffold -- Name
 * Печатает фрагмент `src/index.ts` для вставки.
 */
import fs from 'node:fs';
import path from 'node:path';

const name = process.argv[2]?.trim();
const PASCAL = /^[A-Z][A-Za-z0-9]*$/;

if (!name) {
	console.error('Использование: npm run scaffold -- ComponentName');
	process.exit(1);
}
if (!PASCAL.test(name)) {
	console.error(`Имя должно быть PascalCase (получено "${name}").`);
	process.exit(1);
}

const root = path.resolve('src/components', name);
if (fs.existsSync(root)) {
	console.error(`Папка уже существует: ${path.relative(process.cwd(), root)}`);
	process.exit(1);
}

const tsx = `import {forwardRef, type ComponentPropsWithoutRef} from 'react';
import styles from './${name}.module.css';
import {cn} from '../../utils/cn';
import type {${name}Props} from './${name}.types';

export type {${name}Props};

/**
 * ${name}.
 *
 * @component
 * @example
 * <${name}>…</${name}>
 */
export const ${name} = forwardRef<HTMLDivElement, ${name}Props>(function ${name}(
	{className, children, ...rest},
	ref,
) {
	return (
		<div
			ref={ref}
			className={cn(styles.root, className)}
			{...rest}
		>
			{children}
		</div>
	);
});

${name}.displayName = '${name}';
`;

const types = `import type {ComponentPropsWithoutRef, ReactNode} from 'react';

/**
 * Свойства \`${name}\`.
 */
export interface ${name}Props extends ComponentPropsWithoutRef<'div'> {
	children?: ReactNode;
}
`;

const css = `.root {
  color: var(--altum-color-field-text);

  &:focus-visible {
    outline: var(--altum-focus-ring-width) solid var(--altum-focus-ring-color);
    outline-offset: var(--altum-focus-ring-offset);
  }
}
`;

const stories = `import type {Meta} from '@storybook/react';
import {${name}, type ${name}Props} from './${name}';
import {componentParameters, story, type Story} from '../../storybook/meta';

export default {
	title: 'altum/Components/${name}',
	component: ${name},
	tags: ['autodocs'],
	parameters: componentParameters('${name}.'),
} satisfies Meta<typeof ${name}>;

export const Playground: Story<${name}Props> = {
	args: {
		children: '${name}',
	},
	parameters: story('Базовый вид.'),
};
`;

const index = `export {${name}} from './${name}';
export type {${name}Props} from './${name}.types';
`;

fs.mkdirSync(root, {recursive: true});
fs.writeFileSync(path.join(root, `${name}.tsx`), tsx);
fs.writeFileSync(path.join(root, `${name}.types.ts`), types);
fs.writeFileSync(path.join(root, `${name}.module.css`), css);
fs.writeFileSync(path.join(root, `${name}.stories.tsx`), stories);
fs.writeFileSync(path.join(root, 'index.ts'), index);

const rel = path.relative(process.cwd(), root);
console.log(`Создано ${rel}/`);
console.log(`  ${name}.tsx`);
console.log(`  ${name}.types.ts`);
console.log(`  ${name}.module.css`);
console.log(`  ${name}.stories.tsx`);
console.log('  index.ts');
console.log('');
console.log('Добавьте в src/index.ts:');
console.log('');
console.log(`export {${name}} from './components/${name}';`);
console.log(`export type {${name}Props} from './components/${name}';`);
console.log('');
console.log('Добавьте запись в CHANGELOG.md [Unreleased], затем при необходимости задокументируйте токены.');
