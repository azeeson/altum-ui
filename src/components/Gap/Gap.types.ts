import type {ComponentPropsWithoutRef, Ref} from 'react';
import type {SpacingValue} from '../../types';

/**
 * Направление зазора (`GapOrientation`).
 * `horizontal` — высота между блоками, `vertical` — ширина в ряду.
 */
export type GapOrientation = 'horizontal' | 'vertical';

/**
 * Свойства `Gap`.
 */
export interface GapProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
	/** DOM-узел зазора. */
	rootRef?: Ref<HTMLDivElement>;
	/**
	 * Размер зазора: токен spacing, число (px) или CSS-строка.
	 * @default 'md'
	 */
	size?: SpacingValue;
	/**
	 * Направление.
	 * `horizontal` — высота между блоками, `vertical` — ширина в ряду.
	 * @default 'horizontal'
	 */
	orientation?: GapOrientation;
}
