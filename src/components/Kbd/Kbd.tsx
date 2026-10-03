import type {
	KbdProps,
	KbdGroupProps,
} from './Kbd.types';
export type {
	KbdProps,
	KbdGroupProps,
} from './Kbd.types';

import styles from './Kbd.module.css';
import utilities from '../../styles/utilities.module.css';
import {cn} from '../../core/utils/cn';

/**
 * Отображает клавишу или сочетание ввода с клавиатуры.
 *
 * @component
 * @example
 * <Kbd>⌘</Kbd>
 * <Kbd symbol>↑</Kbd>
 */
export const Kbd = ({
	children,
	symbol,
	className,
	rootRef,
	...rest
}: KbdProps) => {
	return (
		<kbd
			ref={rootRef}
			className={cn(utilities.fCenter, styles.kbd, className)}
			data-symbol={symbol ? '' : undefined}
			{...rest}
		>
			{children}
		</kbd>
	);
};

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
export const KbdGroup = ({
	children,
	className,
	rootRef,
	...rest
}: KbdGroupProps) => {
	return (
		<span
			ref={rootRef}
			className={cn(styles.kbdGroup, className)}
			{...rest}
			role='group'
		>
			{children}
		</span>
	);
};
