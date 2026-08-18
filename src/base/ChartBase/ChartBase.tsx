import {forwardRef} from 'react';
import {cn} from '../../utils/cn';
import {composeRefs} from '../../utils/composeRefs';
import styles from './ChartBase.module.css';
import type {
	ChartBaseProps,
	ChartHoverBubbleProps,
	ChartLegendProps,
	ChartPadding,
	ChartYGridProps,
} from './ChartBase.types';

export type {
	ChartPadding,
	ChartYGridProps,
	ChartLegendItem,
	ChartLegendProps,
	ChartHoverBubbleProps,
	ChartBaseProps,
} from './ChartBase.types';

export const DEFAULT_CHART_PADDING: ChartPadding = {
	left: 40,
	right: 16,
	top: 20,
	bottom: 40,
};

/** Хешированный класс подписи категории оси X. Продукты не импортируют CSS-модуль базы. */
export function chartCategoryClassName(): string {
	return styles.category;
}

export function chartPlotRect(
	width: number,
	height: number,
	padding: ChartPadding = DEFAULT_CHART_PADDING,
): {
	width: number;
	height: number;
} {
	return {
		width: Math.max(0, width - padding.left - padding.right),
		height: Math.max(0, height - padding.top - padding.bottom),
	};
}

/** Равномерные тики от 0 до `maxVal` включительно. */
export function linearYTicks(maxVal: number, count = 5): number[] {
	if (count <= 1) return [Math.round(maxVal)];
	return Array.from({length: count}, (_, index) => Math.round((maxVal / (count - 1)) * index));
}

/**
 * Горизонтальная сетка и подписи оси Y.
 */
export function ChartYGrid({
	ticks,
	getY,
	x1,
	x2,
	labelX,
}: ChartYGridProps) {
	const tickAnchorX = labelX ?? x1 - 8;
	return (
		<>
			{ticks.map((tick) => {
				const y = getY(tick);
				return (
					<g key={tick}>
						<line
							x1={x1}
							x2={x2}
							y1={y}
							y2={y}
							className={styles.grid}
						/>
						<text
							x={tickAnchorX}
							y={y + 4}
							className={styles.tick}
							textAnchor='end'
						>
							{tick}
						</text>
					</g>
				);
			})}
		</>
	);
}
ChartYGrid.displayName = 'ChartYGrid';

/**
 * Легенда серий (скрывается, если серия одна — см. `showWhenSingle`).
 */
export function ChartLegend({
	items,
	className,
	showWhenSingle = false,
	layout = 'inline',
	onItemHover,
}: ChartLegendProps) {
	if (items.length === 0) return null;
	if (!showWhenSingle && items.length <= 1) return null;
	return (
		<div
			className={cn(
				styles.legend,
				layout === 'stack' ? styles.legendStack : '',
				className,
			)}
		>
			{items.map((item) => {
				const itemKey = item.id ?? item.name;
				return (
					<span
						key={itemKey}
						className={cn(
							styles.legendItem,
							item.active ? styles.legendItemActive : '',
						)}
						onMouseEnter={onItemHover ? () => onItemHover(itemKey) : undefined}
						onMouseLeave={onItemHover ? () => onItemHover(null) : undefined}
					>
						<span
							className={styles.swatch}
							style={{background: item.color}}
						/>
						<span className={styles.legendLabel}>
							{item.name}
						</span>
						{item.detail != null && (
							<span className={styles.legendDetail}>
								{item.detail}
							</span>
						)}
					</span>
				);
			})}
		</div>
	);
}
ChartLegend.displayName = 'ChartLegend';

/**
 * SVG-подсказка у точки/столбца.
 */
export function ChartHoverBubble({
	x,
	y,
	canvasWidth,
	label,
	color,
}: ChartHoverBubbleProps) {
	const approxWidth = Math.min(canvasWidth - 16, Math.max(56, label.length * 6.5 + 16));
	const boxX = Math.min(
		Math.max(8, x - approxWidth / 2),
		canvasWidth - approxWidth - 8,
	);
	const boxY = Math.max(4, y - 28);
	return (
		<g pointerEvents='none'>
			<rect
				x={boxX}
				y={boxY}
				width={approxWidth}
				height={22}
				rx={4}
				className={styles.hoverBubble}
			/>
			{color != null && (
				<circle
					cx={boxX + 10}
					cy={boxY + 11}
					r={3.5}
					fill={color}
				/>
			)}
			<text
				x={boxX + (color != null ? 18 : 8)}
				y={boxY + 15}
				className={styles.hoverText}
			>
				{label}
			</text>
		</g>
	);
}

ChartHoverBubble.displayName = 'ChartHoverBubble';

/**
 * Внутренняя база SVG-графика (`ChartBase`): контейнер + слот легенды снаружи.
 */
export const ChartBase = forwardRef<HTMLDivElement, ChartBaseProps>(function ChartBase(
	{
		children,
		className,
		containerRef,
		...rest
	},
	ref,
) {
	return (
		<div
			ref={composeRefs(ref, containerRef)}
			className={cn(styles.root, className)}
			{...rest}
		>
			{children}
		</div>
	);
});
ChartBase.displayName = 'ChartBase';
