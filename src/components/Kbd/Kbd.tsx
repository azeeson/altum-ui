import type {
	KbdProps,
	KbdGroupProps,
} from './Kbd.types';
export type {
	KbdProps,
	KbdGroupProps,
} from './Kbd.types';

import {forwardRef} from 'react';
import styles from './Kbd.module.css';
import {cn} from '../../utils/cn';

const ARROW_RE = /^[↑↓←→⟵⟶⇧⌃⌥⌘]$/u;

/**
 * Отображает клавишу или сочетание ввода с клавиатуры.
 *
 * @component
 * @example
 * <Kbd>⌘</Kbd>
 * <Kbd symbol>↑</Kbd>
 */
export const Kbd = forwardRef<HTMLElement, KbdProps>(function Kbd(
	{
		children,
		symbol,
		className,
		...rest
	},
	ref,
) {
	const isSymbol = symbol ?? (
		typeof children === 'string' && ARROW_RE.test(children.trim())
	);

	return (
		<kbd
			ref={ref}
			className={cn(styles.kbd, isSymbol ? styles.kbdSymbol : '', className)}
			{...rest}
		>
			{children}
		</kbd>
	);
});

Kbd.displayName = 'Kbd';

/**
 * Группа клавиш / комбинация (⌘ ⇧ ⌥ или Ctrl + B).
 *
 * @component
 * @example
 * <KbdGroup>
 *   <Kbd>Ctrl</Kbd>
 *   <span>+</span>
 *   <Kbd>B</Kbd>
 * </KbdGroup>
 */
export const KbdGroup = forwardRef<HTMLSpanElement, KbdGroupProps>(function KbdGroup(
	{children, className, ...rest},
	ref,
) {
	return (
		<span
			ref={ref}
			className={cn(styles.kbdGroup, className)}
			{...rest}
			role='group'
		>
			{children}
		</span>
	);
});

KbdGroup.displayName = 'KbdGroup';
