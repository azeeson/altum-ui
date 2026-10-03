import type React from 'react';
import type {ComponentPropsWithoutRef, Ref} from 'react';
import type {SpacingToken} from '../../types/spacing';

/** Токенный gap как у `Stack` / `Inline`. */
export type GridGapToken = SpacingToken;

export type GridMode = 'fixed' | 'autoFit' | 'autoFill';

/**
 * Свойства `Grid`.
 */
export interface GridProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
	columns?: number | string;
	/**
	 * Отступ: число (px), CSS-значение или токен `xs`…`xl` / `none`
	 * (как у Layout: `md` → `var(--altum-g-space-3)`).
	 */
	gap?: number | string;
	/** `fixed` — фиксированное число колонок; `autoFit` / `autoFill` — карточная сетка по min-width. */
	mode?: GridMode;
	/** Минимальная ширина колонки для `autoFit` / `autoFill` (по умолчанию `240px`). */
	minColumnWidth?: number | string;
	children: React.ReactNode;
	className?: string;
	as?: 'div' | 'section' | 'ul' | 'ol';
	/** DOM-узел сетки. */
	rootRef?: Ref<HTMLElement>;
}

/**
 * Свойства `GridItem`.
 */
export interface GridItemProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
	/** Сколько колонок занимает (1 = одна ячейка). */
	span?: number;
	/** Начальная линия колонки (1-based). */
	colStart?: number;
	/** Конечная линия колонки (exclusive, как в CSS grid-line). */
	colEnd?: number;
	/** Сколько строк занимает. */
	rowSpan?: number;
	children?: React.ReactNode;
	className?: string;
	as?: 'div' | 'section' | 'article' | 'aside' | 'li';
	/** DOM-узел ячейки. */
	rootRef?: Ref<HTMLElement>;
}
