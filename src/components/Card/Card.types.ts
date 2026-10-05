import type React from 'react';
import type {
	ComponentPropsWithoutRef,
	Ref,
} from 'react';
import {type BoxAs, type BoxRadius, type BoxVariant} from '../Box/Box';

/**
 * Вариант оформления карточки (subset `BoxVariant`).
 */
export type CardVariant = Extract<BoxVariant, 'outlined' | 'elevated'>;

/**
 * Свойства `Card`.
 */
export interface CardProps extends ComponentPropsWithoutRef<'div'> {
	children?: React.ReactNode;
	header?: React.ReactNode;
	media?: React.ReactNode;
	actions?: React.ReactNode;
	hoverable?: boolean;
	/** @default 'outlined' */
	variant?: CardVariant;
	/** @default 'lg' */
	radius?: BoxRadius;
	/** Спиннер поверх карточки */
	loading?: boolean;
	/**
	 * HTML-тег поверхности (`Box`).
	 * @default `onClick` без `as` и без `role` → `'button'`, иначе `'div'`
	 */
	as?: BoxAs;
	/** Корень поверхности. */
	rootRef?: Ref<HTMLElement>;
}
