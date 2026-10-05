import type {CSSProperties, MouseEvent} from 'react';
import type {DonutChartProps} from './DonutChart.types';
export type {DonutSegment, DonutChartProps} from './DonutChart.types';

import {useState} from 'react';
import styles from './DonutChart.module.css';
import utilities from '../../styles/utilities.module.css';
import {cn} from '../../core/utils/cn';
import {toCssSize} from '../../core/utils/cssSize';
import {ChartBase, ChartLegend, chartSeriesColor} from '../../base/ChartBase';

const TAU = Math.PI / 180;

function xy(cx: number, cy: number, r: number, angle: number) {
	const rad = (angle - 90) * TAU;
	return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)] as const;
}

function arcPath(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
	const [sx, sy] = xy(cx, cy, r, endAngle);
	const [ex, ey] = xy(cx, cy, r, startAngle);
	return `M${sx} ${sy}A${r} ${r} 0 ${endAngle - startAngle > 180 ? 1 : 0} 0 ${ex} ${ey}`;
}

/**
 * Кольцевая (donut) диаграмма без внешних зависимостей.
 * При `hoverExpand` наведение увеличивает сегмент и показывает его значение в центре.
 * Наведение читается на кольце (`data-segment`) и в легенде.
 *
 * @component
 * @example
 * <DonutChart
 *   segments={[
 *     { label: 'Готово', value: 42 },
 *     { label: 'В работе', value: 18 },
 *   ]}
 *   centerValue="60"
 *   centerLabel="задач"
 *   hoverExpand
 * />
 */
export const DonutChart = ({
	segments,
	size = 160,
	thickness = 22,
	centerLabel,
	centerValue,
	className,
	showLegend = true,
	hoverExpand = true,
	rootRef,
	style,
	...rest
}: DonutChartProps) => {
	const [hoveredKey, setHoveredKey] = useState<string | null>(null);
	const total = segments.reduce((sum, segment) => sum + Math.max(0, segment.value), 0);
	const radius = (size - thickness) / 2;
	const cx = size / 2;
	const cy = size / 2;

	let angle = 0;
	const arcs = segments.map((segment, index) => {
		const value = Math.max(0, segment.value);
		const sweep = total > 0 ? (value / total) * 360 : 0;
		const start = angle;
		angle += sweep;
		return {
			key: segment.id ?? `${segment.label}-${index}`,
			label: segment.label,
			value,
			start,
			end: sweep >= 359.9 ? start + 359.9 : angle,
			color: chartSeriesColor(index, segment.color),
			percent: total > 0 ? Math.round((value / total) * 100) : 0,
		};
	});

	const hovered = arcs.find((arc) => arc.key === hoveredKey) ?? null;
	const displayValue = hovered && hoverExpand ? hovered.value : centerValue;
	const displayLabel = hovered && hoverExpand ? hovered.label : centerLabel;
	const showCenter = displayValue != null || displayLabel != null || (hoverExpand && hovered != null);

	function clearHover() {
		setHoveredKey((prev) => (prev == null ? prev : null));
	}

	function onArcOver(event: MouseEvent<SVGSVGElement>) {
		if (!hoverExpand) return;
		const target = event.target;
		if (!(target instanceof Element)) return;
		const key = target.closest('[data-segment]')?.getAttribute('data-segment') ?? null;
		if (!key) return;
		setHoveredKey((prev) => (prev === key ? prev : key));
	}

	return (
		<ChartBase
			rootRef={rootRef}
			className={cn(styles.root, className)}
			{...rest}
			style={{
				'--altum-donut-size': toCssSize(size),
				'--altum-donut-thickness': toCssSize(thickness),
				...style,
			} as CSSProperties}
		>
			<div
				className={styles.chartWrap}
				role='img'
				aria-label='Круговая диаграмма'
			>
				<svg
					width={size}
					height={size}
					aria-hidden
					onMouseOver={onArcOver}
					onMouseLeave={clearHover}
				>
					<circle
						className={styles.track}
						cx={cx}
						cy={cy}
						r={radius}
					/>
					{total > 0 && arcs.map((arc) => {
						const isHovered = hoverExpand && hoveredKey === arc.key;
						const isDimmed = hoverExpand && hoveredKey != null && !isHovered;
						return (
							<path
								key={arc.key}
								className={styles.segment}
								d={arcPath(cx, cy, radius, arc.start, arc.end)}
								data-segment={arc.key}
								data-active={isHovered ? '' : undefined}
								data-dimmed={isDimmed ? '' : undefined}
								style={{'--local-color': arc.color} as CSSProperties}
							/>
						);
					})}
				</svg>
				{showCenter && (
					<div className={cn(utilities.fColumn, utilities.fCenter, styles.center)}>
						{displayValue != null && (
							<span className={styles.centerValue}>
								{displayValue}
							</span>
						)}
						{displayLabel != null && (
							<span className={styles.centerLabel}>
								{displayLabel}
							</span>
						)}
						{hovered && hoverExpand && (
							<span className={styles.centerPercent}>
								{hovered.percent}
								%
							</span>
						)}
					</div>
				)}
			</div>
			{showLegend && (
				<ChartLegend
					className={styles.legendStack}
					layout='stack'
					showWhenSingle
					onItemHover={hoverExpand ? setHoveredKey : undefined}
					items={arcs.map((arc) => ({
						id: arc.key,
						name: arc.label,
						color: arc.color,
						active: hoverExpand && hoveredKey === arc.key,
						detail: total > 0 ? `${arc.percent}%` : String(arc.value),
					}))}
				/>
			)}
		</ChartBase>
	);
};
