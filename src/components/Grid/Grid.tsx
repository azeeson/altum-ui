import type {
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

import {forwardRef, type CSSProperties} from 'react';
import {As} from '../../base/As';
import styles from './Grid.module.css';
import {cn} from '../../utils/cn';
import {mergeStyles} from '../../utils/mergeStyles';
import {
	resolveAutoColumnsTemplate,
	resolveColumnsTemplate,
	resolveGapCss,
	resolveGridRowValue,
	setGridItemColumnVars,
	setResponsive,
} from './Grid.utils';
export {GRID_BREAKPOINTS} from './Grid.utils';

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
		className,
		style,
		as = 'div',
		...rest
	},
	ref,
) {
	const vars: Record<string, string | number | undefined> = {};
	const colsFallback = 'repeat(1, minmax(0, 1fr))';

	if (mode === 'autoFit' || mode === 'autoFill') {
		setResponsive(
			vars,
			'--altum-grid-cols',
			resolveAutoColumnsTemplate(mode, minColumnWidth),
			(value) => value,
			colsFallback,
		);
	} else {
		setResponsive<number | string>(vars, '--altum-grid-cols', columns, resolveColumnsTemplate, colsFallback);
	}

	setResponsive<number | string>(vars, '--altum-grid-gap', gap, resolveGapCss, 'var(--altum-g-space-3)');

	return (
		<As
			ref={ref}
			as={as}
			className={cn(styles.grid, className)}
			style={mergeStyles(vars as CSSProperties, style)}
			{...rest}
		/>
	);
});

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
		className,
		style,
		as = 'div',
		...rest
	},
	ref,
) {
	const vars: Record<string, string | number | undefined> = {};

	setGridItemColumnVars(vars, span, colStart, colEnd);
	if (rowSpan !== undefined) {
		setResponsive<number>(vars, '--altum-grid-item-row', rowSpan, resolveGridRowValue, 'auto');
	}

	return (
		<As
			ref={ref}
			as={as}
			className={cn(styles.gridItem, className)}
			style={mergeStyles(vars as CSSProperties, style)}
			{...rest}
		/>
	);
});

Grid.displayName = 'Grid';
GridItem.displayName = 'GridItem';
