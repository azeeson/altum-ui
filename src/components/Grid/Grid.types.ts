import type React from 'react';
import type {ComponentPropsWithoutRef} from 'react';
import {type AdaptiveValue, type GridGapToken} from './Grid.utils';

export type {AdaptiveValue, GridGapToken};

export type GridMode = 'fixed' | 'autoFit' | 'autoFill';

/**
 * Свойства `Grid`.
 */
export interface GridProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
	columns?: number | string | AdaptiveValue<number | string>;
	/**
	 * Отступ: число (px), CSS-значение или токен `xs`…`xl` / `none`
	 * (как у Layout: `md` → `var(--altum-g-space-3)`).
	 */
	gap?: number | string | AdaptiveValue<number | string>;
	/** `fixed` — фиксированное число колонок; `autoFit` / `autoFill` — карточная сетка по min-width. */
	mode?: GridMode;
	/** Минимальная ширина колонки для `autoFit` / `autoFill` (по умолчанию `240px`). */
	minColumnWidth?: number | string;
	children: React.ReactNode;
	className?: string;
	as?: 'div' | 'section' | 'ul' | 'ol';
}

/**
 * Свойства `GridItem`.
 */
export interface GridItemProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
	/** Сколько колонок занимает (1 = одна ячейка). */
	span?: number | AdaptiveValue<number>;
	/** Начальная линия колонки (1-based). */
	colStart?: number | AdaptiveValue<number>;
	/** Конечная линия колонки (exclusive, как в CSS grid-line). */
	colEnd?: number | AdaptiveValue<number>;
	/** Сколько строк занимает. */
	rowSpan?: number | AdaptiveValue<number>;
	children?: React.ReactNode;
	className?: string;
	as?: 'div' | 'section' | 'article' | 'aside' | 'li';
}
