import type {ComponentPropsWithoutRef, ElementType, ReactNode, Ref} from 'react';

/**
 * Корень layout-узла.
 * Союз рефов нужен, потому что `Ref<HTMLDivElement>` не присваивается `Ref<HTMLElement>`.
 */
type LayoutNodeRef = Ref<HTMLElement>
	| Ref<HTMLDivElement>
	| Ref<HTMLSpanElement>
	| Ref<HTMLUListElement>
	| Ref<HTMLOListElement>
	| Ref<HTMLLIElement>;

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

/** Шаг `padding` у `Layout`: `sm` 12px, `md` 20px, `lg` 28px. `gap` — 12 / 16 / 24. */
export type LayoutSpacing = 'sm' | 'md' | 'lg';

/** Заливка липкой шапки или подвала после сдвига скролла. */
export type LayoutChromeVariant = 'primary' | 'tinted' | 'secondary';

export interface LayoutRootProps extends ComponentPropsWithoutRef<'div'> {
	children?: ReactNode;
	/** DOM-узел корня. */
	rootRef?: LayoutNodeRef;
	as?: ElementType;
	/** Отступ панели. На секциях, не на scrollport — при скролле контент не вылезает к краям. */
	padding?: LayoutSpacing;
	/** Промежуток между секциями. Половина — нижнее поле шапки и верхнее поле подвала, вторая половина — зазор. */
	gap?: LayoutSpacing;
}

export interface LayoutHeaderProps extends ComponentPropsWithoutRef<'header'> {
	children?: ReactNode;
	/** DOM-узел шапки. */
	rootRef?: LayoutNodeRef;
	/** Закрепить у верхнего края scrollport `Layout` (`position: sticky; top: 0`). Без пропа шапка уезжает со скроллом. */
	sticky?: boolean;
	/**
	 * Фон после сдвига скролла от верха. Без пропа шапка остаётся прозрачной.
	 * Действует только вместе с `sticky`.
	 */
	variant?: LayoutChromeVariant;
	as?: ElementType;
}

export interface LayoutContentProps extends ComponentPropsWithoutRef<'div'> {
	children?: ReactNode;
	/** DOM-узел середины. */
	rootRef?: LayoutNodeRef;
	as?: ElementType;
}

/** Выравнивание содержимого `Layout.Footer`. */
export type LayoutFooterAlign = 'start' | 'center' | 'end' | 'space-between';

export interface LayoutFooterProps extends Omit<ComponentPropsWithoutRef<'footer'>, 'align'> {
	children?: ReactNode;
	/** DOM-узел подвала. */
	rootRef?: LayoutNodeRef;
	/** Закрепить у нижнего края scrollport `Layout` (`position: sticky; bottom: 0`). Без пропа футер уезжает со скроллом. */
	sticky?: boolean;
	/**
	 * Фон, пока скролл не у нижнего края. Без пропа подвал остаётся прозрачным.
	 * Действует только вместе с `sticky`.
	 */
	variant?: LayoutChromeVariant;
	/**
	 * Выравнивание действий по главной оси.
	 * @default 'start'
	 */
	align?: LayoutFooterAlign;
	as?: ElementType;
}

export interface StackProps extends ComponentPropsWithoutRef<'div'> {
	children?: ReactNode;
	/** DOM-узел стека. */
	rootRef?: LayoutNodeRef;
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
	/** DOM-узел ряда. */
	rootRef?: LayoutNodeRef;
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
	/** DOM-узел ряда. */
	rootRef?: LayoutNodeRef;
	/** Промежуток между блоками. @default 'md' */
	gap?: LayoutGap;
	/** Выравнивание по поперечной оси. @default 'center' */
	align?: LayoutAlign;
}

export interface LayoutItemProps extends ComponentPropsWithoutRef<'div'> {
	children?: ReactNode;
	/** DOM-узел ячейки. */
	rootRef?: LayoutNodeRef;
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
	/** DOM-узел ряда. */
	rootRef?: LayoutNodeRef;
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
