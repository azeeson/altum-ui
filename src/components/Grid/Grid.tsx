import type {
	AdaptiveValue,
	GridProps,
	GridItemProps,
} from './Grid.types';
export type {
	AdaptiveValue,
	GridGapToken,
	GridMode,
	GridProps,
	GridItemProps,
} from './Grid.types';

import {forwardRef, type CSSProperties, type ElementType} from 'react';
import styles from './Grid.module.css';
import {cn} from '../../utils/cn';
import {mergeStyles} from '../../utils/mergeStyles';
import {
	applyAdaptiveVars,
	isAdaptiveValue,
	resolveAutoColumnsTemplate,
	resolveColumnsTemplate,
	resolveGapCss,
	resolveGridColumnValue,
	resolveGridRowValue,
} from './Grid.utils';
export {GRID_BREAKPOINTS} from './Grid.utils';

function applyColumnsVars(
	target: Record<string, string | number | undefined>,
	columns: number | string | AdaptiveValue<number | string>,
): void {
	if (isAdaptiveValue<number | string>(columns)) {
		applyAdaptiveVars(target, columns, '--altum-grid-cols', resolveColumnsTemplate);
		return;
	}
	target['--altum-grid-cols-xs'] = resolveColumnsTemplate(columns);
}

function applyAutoColumnsVars(
	target: Record<string, string | number | undefined>,
	mode: 'autoFit' | 'autoFill',
	minColumnWidth: number | string,
): void {
	const template = resolveAutoColumnsTemplate(mode, minColumnWidth);
	target['--altum-grid-cols-xs'] = template;
}

function applyGapVars(
	target: Record<string, string | number | undefined>,
	gap: number | string | AdaptiveValue<number | string>,
): void {
	if (isAdaptiveValue<number | string>(gap)) {
		applyAdaptiveVars(target, gap, '--altum-grid-gap', resolveGapCss);
		return;
	}
	target['--altum-grid-gap-xs'] = resolveGapCss(gap);
}

/**
 * CSS Grid-контейнер с адаптивными колонками и отступами через breakpoints.
 *
 * @component
 * @example
 * <Grid columns={{ xs: 2, md: 4, xl: 6 }} gap="md">
 *   {cards.map((card) => <GridItem key={card.id}>{card.title}</GridItem>)}
 * </Grid>
 */
export const Grid = forwardRef<HTMLElement, GridProps>(function Grid(
	{
		columns = 1,
		gap = 'md',
		mode = 'fixed',
		minColumnWidth = 240,
		children,
		className,
		style,
		as: Component = 'div',
		...rest
	},
	ref,
) {
	const customStyles: Record<string, string | number | undefined> = {};

	if (mode === 'autoFit' || mode === 'autoFill') {
		applyAutoColumnsVars(customStyles, mode, minColumnWidth);
	} else {
		applyColumnsVars(customStyles, columns);
	}

	applyGapVars(customStyles, gap);

	const Element = Component as ElementType;

	return (
		<Element
			ref={ref as never}
			className={cn(styles.grid, className)}
			style={mergeStyles(customStyles as CSSProperties, style)}
			{...rest}
		>
			{children}
		</Element>
	);
});

function applyGridItemColumnVars(
	target: Record<string, string | number | undefined>,
	span?: number | AdaptiveValue<number>,
	colStart?: number | AdaptiveValue<number>,
	colEnd?: number | AdaptiveValue<number>,
): void {
	const applyAt = (
		prefix: string,
		s?: number,
		start?: number,
		end?: number,
	) => {
		const value = resolveGridColumnValue(s, start, end);
		if (value !== undefined) {
			target[prefix] = value;
		}
	};

	if (
		isAdaptiveValue(span)
		|| isAdaptiveValue(colStart)
		|| isAdaptiveValue(colEnd)
	) {
		for (const key of [
			'xs',
			'sm',
			'md',
			'lg',
			'xl'
		] as const) {
			const s = isAdaptiveValue(span) ? span[key] : span;
			const start = isAdaptiveValue(colStart) ? colStart[key] : colStart;
			const end = isAdaptiveValue(colEnd) ? colEnd[key] : colEnd;
			if (s !== undefined || start !== undefined || end !== undefined) {
				applyAt(`--altum-grid-item-col-${key}`, s, start, end);
			}
		}
		return;
	}

	applyAt('--altum-grid-item-col-xs', span, colStart, colEnd);
}

function applyGridItemRowVars(
	target: Record<string, string | number | undefined>,
	rowSpan?: number | AdaptiveValue<number>,
): void {
	if (rowSpan === undefined) return;

	if (isAdaptiveValue(rowSpan)) {
		applyAdaptiveVars(target, rowSpan, '--altum-grid-item-row', resolveGridRowValue);
		return;
	}

	const value = resolveGridRowValue(rowSpan);
	if (value !== undefined) {
		target['--altum-grid-item-row-xs'] = value;
	}
}

/**
 * Ячейка CSS Grid с адаптивным span и позиционированием по колонкам/строкам.
 *
 * @component
 * @example
 * <Grid columns={12} gap="md">
 *   <GridItem span={{ xs: 12, lg: 3 }}>Боковая панель</GridItem>
 *   <GridItem span={{ xs: 12, lg: 9 }}>Основное</GridItem>
 * </Grid>
 */
export const GridItem = forwardRef<HTMLElement, GridItemProps>(function GridItem(
	{
		span,
		colStart,
		colEnd,
		rowSpan,
		children,
		className,
		style,
		as: Component = 'div',
		...rest
	},
	ref,
) {
	const customStyles: Record<string, string | number | undefined> = {};

	applyGridItemColumnVars(customStyles, span, colStart, colEnd);
	applyGridItemRowVars(customStyles, rowSpan);

	const Element = Component as ElementType;

	return (
		<Element
			ref={ref as never}
			className={cn(styles.gridItem, className)}
			style={mergeStyles(customStyles as CSSProperties, style)}
			{...rest}
		>
			{children}
		</Element>
	);
});

Grid.displayName = 'Grid';
GridItem.displayName = 'GridItem';
