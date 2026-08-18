import type React from 'react';
import type {
	ComponentPropsWithoutRef,
} from 'react';

import type {ControlSize} from '../../types';

export type ProgressVariant = 'auto' | 'primary' | 'success' | 'warning' | 'error' | 'info';

/**
 * Свойства линейного `Progress`.
 */
export interface ProgressProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
	/** Процент 0–100; игнорируется при `indeterminate` */
	percentage?: number;
	indeterminate?: boolean;
	label?: React.ReactNode;
	valueText?: React.ReactNode;
	/** Показать valueText. @default true */
	showValueText?: boolean;
	/** @default 'md' */
	size?: ControlSize;
	/** @default 'auto' */
	variant?: ProgressVariant;
}

/**
 * Свойства кругового `ProgressCircle`.
 */
export interface ProgressCircleProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
	percentage?: number;
	indeterminate?: boolean;
	/** Токен размера. @default `'md'` */
	size?: ControlSize;
	/** Диаметр SVG в px; перекрывает токен `size`. */
	diameter?: number;
	label?: React.ReactNode;
	valueText?: React.ReactNode;
	/** Показать valueText. @default true */
	showValueText?: boolean;
	variant?: ProgressVariant;
}
