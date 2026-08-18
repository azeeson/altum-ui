import type React from 'react';
import type {
	ComponentPropsWithoutRef,
} from 'react';
import {type BoxAs, type BoxVariant} from '../Box/Box';

/**
 * Вариант оформления карточки (subset `BoxVariant`).
 */
export type CardVariant = Extract<BoxVariant, 'outlined' | 'elevated' | 'ghost'>;

/**
 * Свойства `Card`.
 */
export interface CardProps extends ComponentPropsWithoutRef<'div'> {
	children?: React.ReactNode;
	hoverable?: boolean;
	/** @default 'outlined' */
	variant?: CardVariant;
	/** Спиннер поверх карточки */
	loading?: boolean;
	/**
	 * HTML-тег поверхности (`Box`).
	 * @default `onClick` без `as` и без `role` → `'button'`, иначе `'div'`
	 */
	as?: BoxAs;
}

/**
 * Свойства секции карточки.
 */
export interface CardSectionProps extends ComponentPropsWithoutRef<'div'> {
	children?: React.ReactNode;
}
