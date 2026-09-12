import type {ReactNode} from 'react';
import type {ComponentPropsWithoutRef} from 'react';
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
export interface ItemProps extends Omit<ComponentPropsWithoutRef<'div'>, 'title'> {
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
	 * Не вкладывайте кнопки в `actions` в этом режиме.
	 */
	interactive?: boolean;
	/**
	 * HTML-тег поверхности (`Box`).
	 * @default `onClick` + `interactive` → `'button'`, иначе `'div'`
	 */
	as?: BoxAs;
	media?: ReactNode;
	/** Внешний вид media. @default 'icon' */
	mediaVariant?: ItemMediaVariant;
	mediaClassName?: string;
	title?: ReactNode;
	titleClassName?: string;
	description?: ReactNode;
	descriptionClassName?: string;
	actions?: ReactNode;
	actionsClassName?: string;
}
