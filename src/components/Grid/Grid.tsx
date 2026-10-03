import type {
	GridProps,
	GridItemProps,
} from './Grid.types';
export type {
	GridGapToken,
	GridMode,
	GridProps,
	GridItemProps,
} from './Grid.types';

import {type CSSProperties} from 'react';
import styles from './Grid.module.css';
import {cn} from '../../core/utils/cn';
import {spacingCss} from '../../core/utils/spacing';
import {toCssSize} from '../../core/utils/cssSize';

function resolveColumnsTemplate(value: number | string): string {
	if (typeof value === 'number') {
		return `repeat(${value}, minmax(0, 1fr))`;
	}
	return value;
}

function resolveAutoColumnsTemplate(
	mode: 'autoFit' | 'autoFill',
	minColumnWidth: number | string,
): string {
	const autoFn = mode === 'autoFit' ? 'auto-fit' : 'auto-fill';
	return `repeat(${autoFn}, minmax(${toCssSize(minColumnWidth)}, 1fr))`;
}

function resolveGridColumnValue(
	span?: number,
	colStart?: number,
	colEnd?: number,
): string | undefined {
	if (colStart !== undefined && colEnd !== undefined) {
		return `${colStart} / ${colEnd}`;
	}
	if (colStart !== undefined && span !== undefined) {
		return `${colStart} / span ${span}`;
	}
	if (span !== undefined) {
		return `span ${span}`;
	}
	if (colStart !== undefined) {
		return String(colStart);
	}
	return undefined;
}

/**
 * CSS Grid-контейнер с колонками и отступами через CSS-переменные.
 *
 * @component
 * @example
 * <Grid columns={4} gap="md">
 *   {cards.map((card) => <GridItem key={card.id}>{card.title}</GridItem>)}
 * </Grid>
 */
export function Grid({
	columns = 1,
	gap = 'md',
	mode = 'fixed',
	minColumnWidth = 240,
	className,
	style,
	as: Comp = 'div',
	rootRef,
	...rest
}: GridProps) {
	const vars: Record<string, string | number | undefined> = {
		'--altum-grid-gap': spacingCss(gap),
		'--altum-grid-cols': mode === 'autoFit' || mode === 'autoFill'
			? resolveAutoColumnsTemplate(mode, minColumnWidth)
			: resolveColumnsTemplate(columns),
	};

	return (
		<Comp
			{...(rest as Record<string, unknown>)}
			ref={rootRef as never}
			className={cn(styles.grid, className)}
			style={{
				...vars,
				...style
			} as CSSProperties}
		/>
	);
}

/**
 * Ячейка CSS Grid со span и позиционированием по колонкам/строкам.
 *
 * @component
 * @example
 * <Grid columns={12} gap="md">
 *   <GridItem span={3}>Боковая панель</GridItem>
 *   <GridItem span={9}>Основное</GridItem>
 * </Grid>
 */
export function GridItem({
	span,
	colStart,
	colEnd,
	rowSpan,
	className,
	style,
	as: Comp = 'div',
	rootRef,
	...rest
}: GridItemProps) {
	const vars: Record<string, string | number | undefined> = {};
	const col = resolveGridColumnValue(span, colStart, colEnd);
	if (col !== undefined) {
		vars['--altum-grid-item-col'] = col;
	}
	if (rowSpan !== undefined) {
		vars['--altum-grid-item-row'] = `span ${rowSpan}`;
	}

	return (
		<Comp
			{...(rest as Record<string, unknown>)}
			ref={rootRef as never}
			className={cn(styles.gridItem, className)}
			style={{
				...vars,
				...style
			} as CSSProperties}
		/>
	);
}
