import type {
	DonutSegment,
	DonutChartProps,
} from './DonutChart.types';
export type {
	DonutSegment,
	DonutChartProps,
} from './DonutChart.types';

import React, {forwardRef, useMemo, useState} from 'react';
import styles from './DonutChart.module.css';
import {cn} from '../../utils/cn';
import {useLocale} from '../LocaleProvider/LocaleProvider';
import {chartSeriesColor, ChartBase, ChartLegend} from '../../base/ChartBase';

/** Насколько радиус/толщина растут у активного сегмента */
const HOVER_GROW = 6;

function polar(cx: number, cy: number, r: number, angle: number) {
	const rad = ((angle - 90) * Math.PI) / 180;
	return {
		x: cx + r * Math.cos(rad),
		y: cy + r * Math.sin(rad),
	};
}

function arcPath(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
	const start = polar(cx, cy, r, endAngle);
	const end = polar(cx, cy, r, startAngle);
	const large = endAngle - startAngle > 180 ? 1 : 0;
	return `M ${start.x} ${start.y} A ${r} ${r} 0 ${large} 0 ${end.x} ${end.y}`;
}

/**
 * Кольцевая (donut) диаграмма без внешних зависимостей.
 * При `hoverExpand` наведение увеличивает сегмент и показывает его значение в центре.
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
export const DonutChart = forwardRef<HTMLDivElement, DonutChartProps>(function DonutChart(
	{
		segments,
		size = 160,
		thickness = 22,
		centerLabel,
		centerValue,
		className,
		showLegend = true,
		hoverExpand = true,
		...rest
	},
	ref,
) {
	const {t} = useLocale();
	const [hoveredKey, setHoveredKey] = useState<string | null>(null);

	const total = useMemo(
		() => segments.reduce((sum, segment) => sum + Math.max(0, segment.value), 0),
		[segments],
	);

	/**
	 * Запас на полный рост при наведении: radius +½ grow и stroke +grow сдвигают внешний
	 * край на HOVER_GROW целиком — половинный запас всё ещё обрезал активный сегмент.
	 */
	const radius = (size - thickness) / 2 - (hoverExpand ? HOVER_GROW : 0);
	const cx = size / 2;
	const cy = size / 2;

	const arcs = segments.reduce<{
		list: Array<DonutSegment & {
			key: string;
			start: number;
			end: number;
			color: string;
			value: number;
			percent: number;
		}>;
		angle: number;
	}>((state, segment, index) => {
		const value = Math.max(0, segment.value);
		const sweep = total > 0 ? (value / total) * 360 : 0;
		const start = state.angle;
		const end = start + sweep;
		const key = segment.id ?? `${segment.label}-${index}`;
		return {
			angle: end,
			list: [
				...state.list,
				{
					...segment,
					key,
					start,
					end: sweep >= 359.9 ? start + 359.9 : end,
					color: chartSeriesColor(index, segment.color),
					value,
					percent: total > 0 ? Math.round((value / total) * 100) : 0,
				},
			],
		};
	}, {
		list: [],
		angle: 0
	}).list;

	const hovered = arcs.find((arc) => arc.key === hoveredKey) ?? null;

	const displayValue = hovered && hoverExpand
		? hovered.value
		: centerValue;
	const displayLabel = hovered && hoverExpand
		? hovered.label
		: centerLabel;
	const showCenter = displayValue != null || displayLabel != null
		|| (hoverExpand && hovered != null);

	return (
		<ChartBase
			containerRef={ref}
			className={cn(styles.root, className)}
			{...rest}
		>
			<div
				className={styles.chartWrap}
				style={{
					width: size,
					height: size,
				}}
			>
				<svg
					width={size}
					height={size}
					role='img'
					aria-label={t('charts.donut')}
					onMouseLeave={() => setHoveredKey(null)}
				>
					<circle
						cx={cx}
						cy={cy}
						r={radius}
						fill='none'
						stroke='var(--altum-color-border)'
						strokeWidth={thickness}
						className={styles.track}
					/>
					{total > 0 && arcs.map((arc) => {
						const isHovered = hoverExpand && hoveredKey === arc.key;
						const isDimmed = hoverExpand && hoveredKey != null && !isHovered;
						const r = isHovered ? radius + HOVER_GROW / 2 : radius;
						const strokeW = isHovered ? thickness + HOVER_GROW : thickness;
						const basePath = arcPath(cx, cy, radius, arc.start, arc.end);

						return (
							<g key={arc.key}>
								{/* Стабильная hit-area — геометрия не меняется при enlarge */}
								{hoverExpand && (
									<path
										d={basePath}
										fill='none'
										stroke='transparent'
										strokeWidth={thickness + HOVER_GROW}
										strokeLinecap='butt'
										className={styles.segmentHit}
										onMouseEnter={() => setHoveredKey(arc.key)}
									>
										<title>
											{`${arc.label}: ${arc.value}`}
										</title>
									</path>
								)}
								<path
									d={arcPath(cx, cy, r, arc.start, arc.end)}
									fill='none'
									stroke={arc.color}
									strokeWidth={strokeW}
									strokeLinecap='butt'
									pointerEvents={hoverExpand ? 'none' : 'auto'}
									className={cn(
										styles.segment,
										isHovered && styles.active,
										isDimmed && styles.dimmed,
									)}
								>
									{!hoverExpand && (
										<title>
											{`${arc.label}: ${arc.value}`}
										</title>
									)}
								</path>
							</g>
						);
					})}
				</svg>
				{showCenter && (
					<div className={cn(styles.center, hovered && hoverExpand && styles.centerHover)}>
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
					layout='stack'
					showWhenSingle
					onItemHover={hoverExpand ? setHoveredKey : undefined}
					items={arcs.map((arc) => ({
						id: arc.key,
						name: arc.label,
						color: arc.color,
						active: hoverExpand && hoveredKey === arc.key,
						detail: total > 0 ? `${arc.value} · ${arc.percent}%` : String(arc.value),
					}))}
				/>
			)}
		</ChartBase>
	);
});

DonutChart.displayName = 'DonutChart';
