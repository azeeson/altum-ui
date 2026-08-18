import type React from 'react';
import type {
	ComponentPropsWithoutRef,
} from 'react';
import type {SpacingToken} from '../../types';

/**
 * Ориентация (`SeparatorOrientation`).
 */
export type SeparatorOrientation = 'horizontal' | 'vertical';

/**
 * Отступ `start` / `end`: токен spacing или число (px) / CSS-строка.
 */
export type SeparatorSpace = SpacingToken | number | string;

/**
 * Свойства `Separator` (также бывший `Spacer`).
 */
export interface SeparatorProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
	/** Направление. @default 'horizontal' */
	orientation?: SeparatorOrientation;
	/**
	 * Если `true` — только визуальный разделитель (`aria-hidden`).
	 * @default false
	 */
	decorative?: boolean;
	/** Текст на линии (как бывший Spacer) */
	children?: React.ReactNode;
	/** Отступ перед разделителем (block-start / inline-start). */
	start?: SeparatorSpace;
	/** Отступ после разделителя (block-end / inline-end). */
	end?: SeparatorSpace;
}

export type SpacerProps = Pick<SeparatorProps, 'children' | 'className' | 'start' | 'end' | 'decorative' | 'style'>;
