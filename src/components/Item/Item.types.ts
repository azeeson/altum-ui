import type React from 'react';
import type {
	ComponentPropsWithoutRef,
} from 'react';
import {type BoxAs, type BoxVariant} from '../Box/Box';

/**
 * Размер (`ItemSize`).
 */
export type ItemSize = 'sm' | 'md' | 'lg';

/**
 * Вариант media-слота (`ItemMediaVariant`).
 */
export type ItemMediaVariant = 'icon' | 'image' | 'avatar';

/**
 * Вариант поверхности строки (`BoxVariant`).
 */
export type ItemVariant = BoxVariant;

/**
 * Свойства `Item`.
 */
export interface ItemProps extends ComponentPropsWithoutRef<'div'> {
	children: React.ReactNode;
	/** Плотность строки. @default 'md' */
	size?: ItemSize;
	/**
	 * Вариант поверхности (`Box`).
	 * @default 'ghost'
	 */
	variant?: ItemVariant;
	/**
	 * Интерактивная строка (hover / курсор).
	 * При `onClick` без `as` и без `role` корень рендерится как `<button type="button">`.
	 * Не вкладывайте кнопки в `Item.Actions` в этом режиме.
	 */
	interactive?: boolean;
	/**
	 * HTML-тег поверхности (`Box`).
	 * @default `onClick` + `interactive` → `'button'`, иначе `'div'`
	 */
	as?: BoxAs;
}

/**
 * Свойства `Item.Media`.
 */
export interface ItemMediaProps extends ComponentPropsWithoutRef<'div'> {
	children: React.ReactNode;
	/** Внешний вид media-слота. @default 'icon' */
	variant?: ItemMediaVariant;
}

/**
 * Свойства `Item.Content`.
 */
export interface ItemContentProps extends ComponentPropsWithoutRef<'div'> {
	children: React.ReactNode;
}

/**
 * Свойства `Item.Title`.
 */
export interface ItemTitleProps extends ComponentPropsWithoutRef<'div'> {
	children: React.ReactNode;
}

/**
 * Свойства `Item.Description`.
 */
export interface ItemDescriptionProps extends ComponentPropsWithoutRef<'div'> {
	children: React.ReactNode;
}

/**
 * Свойства `Item.Actions`.
 */
export interface ItemActionsProps extends ComponentPropsWithoutRef<'div'> {
	children: React.ReactNode;
}
