import type {ComponentPropsWithoutRef, ElementType, ReactNode} from 'react';

/** Шкала отступов layout-компонентов → CSS variables 8pt grid. */
export type LayoutGap = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type LayoutAlign = 'start' | 'center' | 'end' | 'baseline' | 'stretch';

export type LayoutJustify =
	| 'start'
	| 'center'
	| 'end'
	| 'between'
	| 'around'
	| 'evenly';

export interface LayoutRootProps extends ComponentPropsWithoutRef<'div'> {
	children?: ReactNode;
	as?: ElementType;
}

export interface LayoutHeaderProps extends ComponentPropsWithoutRef<'header'> {
	children?: ReactNode;
	/** Закрепить у верхнего края scrollport `Layout` (`position: sticky; top: 0`). Без пропа шапка уезжает со скроллом. */
	sticky?: boolean;
	as?: ElementType;
}

export interface LayoutContentProps extends ComponentPropsWithoutRef<'div'> {
	children?: ReactNode;
	as?: ElementType;
}

/** Выравнивание содержимого `Layout.Footer`. */
export type LayoutFooterAlign = 'start' | 'center' | 'end' | 'space-between';

export interface LayoutFooterProps extends Omit<ComponentPropsWithoutRef<'footer'>, 'align'> {
	children?: ReactNode;
	/** Закрепить у нижнего края scrollport `Layout` (`position: sticky; bottom: 0`). Без пропа футер уезжает со скроллом. */
	sticky?: boolean;
	/**
	 * Выравнивание действий по главной оси.
	 * @default 'start'
	 */
	align?: LayoutFooterAlign;
	as?: ElementType;
}

export interface StackProps extends ComponentPropsWithoutRef<'div'> {
	children?: ReactNode;
	/** Вертикальный промежуток (8pt-токены). @default 'md' */
	gap?: LayoutGap;
	/** Выравнивание по поперечной оси. @default 'stretch' */
	align?: LayoutAlign;
	/** Распределение по главной оси. @default 'start' */
	justify?: LayoutJustify;
	as?: 'div' | 'section' | 'ul' | 'ol' | 'nav';
}

export interface InlineProps extends ComponentPropsWithoutRef<'div'> {
	children?: ReactNode;
	/** Горизонтальный промежуток. @default 'sm' */
	gap?: LayoutGap;
	/** Выравнивание по поперечной оси. @default 'center' */
	align?: LayoutAlign;
	/** Распределение по главной оси. @default 'start' */
	justify?: LayoutJustify;
	/** Перенос на следующую строку. @default true */
	wrap?: boolean;
	as?: 'div' | 'ul' | 'ol' | 'nav' | 'span';
}

export interface SplitProps extends ComponentPropsWithoutRef<'div'> {
	children?: ReactNode;
	/** Промежуток между блоками. @default 'md' */
	gap?: LayoutGap;
	/** Выравнивание по поперечной оси. @default 'center' */
	align?: LayoutAlign;
}

export interface LayoutItemProps extends ComponentPropsWithoutRef<'div'> {
	children?: ReactNode;
	/**
	 * Занять оставшееся место по главной оси (`flex: 1`).
	 * Типично для поля поиска в тулбаре или основного блока рядом с кнопкой.
	 */
	grow?: boolean;
	/**
	 * Разрешить сжатие. `false` — кнопка/чип не сжимаются при нехватке места.
	 * @default true
	 */
	shrink?: boolean;
	/** Корень. Для `Stack as="ul"` / `ol` передайте `'li'`. @default `'div'` */
	as?: 'div' | 'li';
}

export interface ControlRowProps extends ComponentPropsWithoutRef<'div'> {
	children?: ReactNode;
	/** Промежуток между контролами. @default 'sm' */
	gap?: LayoutGap;
	/**
	 * Выравнивание по высоте.
	 * @default 'center'
	 */
	align?: LayoutAlign;
	/** Распределение по главной оси. @default 'start' */
	justify?: LayoutJustify;
	/** Перенос. @default true */
	wrap?: boolean;
}
