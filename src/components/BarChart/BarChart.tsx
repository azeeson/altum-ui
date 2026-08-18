import type {
	BarChartProps,
} from './BarChart.types';
export type {
	BarChartDataset,
	BarChartProps,
} from './BarChart.types';

import React, {forwardRef, useMemo, useRef, useState} from 'react';
import styles from './BarChart.module.css';
import {cn} from '../../utils/cn';
import {composeRefs} from '../../utils/composeRefs';
import {useLocale} from '../LocaleProvider/LocaleProvider';
import {
	ChartBase,
	ChartHoverBubble,
	ChartLegend,
	ChartYGrid,
	DEFAULT_CHART_PADDING,
	chartCategoryClassName,
	chartPlotRect,
	chartSeriesColor,
	linearYTicks,
	useChartContainerWidth,
} from '../../base/ChartBase';

interface HoverBar {
	groupIndex: number;
	seriesIndex: number;
	category: string;
	seriesName: string;
	value: number;
	x: number;
	y: number;
	color: string;
}

/**
 * Столбчатый SVG-график без внешних зависимостей.
 * При `showHoverValue` наведение на столбец показывает его значение.
 *
 * @component
 * @example
 * <BarChart
 *   categories={['Пн', 'Вт', 'Ср']}
 *   datasets={[{ name: 'Заказы', data: [12, 19, 8] }]}
 *   showHoverValue
 * />
 */
export const BarChart = forwardRef<HTMLDivElement, BarChartProps>(function BarChart(
	{
		categories,
		datasets,
		height = 280,
		className,
		showValues = false,
		showHoverValue = true,
		...rest
	},
	ref,
) {
	const {t} = useLocale();
	const containerRef = useRef<HTMLDivElement>(null);
	const width = useChartContainerWidth(containerRef);
	const [hover, setHover] = useState<HoverBar | null>(null);

	const padding = DEFAULT_CHART_PADDING;
	const {width: chartWidth, height: chartHeight} = chartPlotRect(width, height, padding);

	const maxVal = useMemo(() => {
		const values = datasets.flatMap((d) => d.data);
		return Math.max(1, ...(values.length ? values : [1]));
	}, [datasets]);

	const groupCount = Math.max(1, categories.length);
	const seriesCount = Math.max(1, datasets.length);
	const groupWidth = chartWidth / groupCount;
	const barGap = 4;
	const barWidth = Math.max(4, (groupWidth - 16 - barGap * (seriesCount - 1)) / seriesCount);

	const getY = (value: number) => padding.top + chartHeight - (value / maxVal) * chartHeight;
	const ticks = linearYTicks(maxVal);
	const multiSeries = datasets.length > 1;

	return (
		<ChartBase
			containerRef={composeRefs(ref, containerRef)}
			className={className}
			{...rest}
		>
			<svg
				width={width}
				height={height}
				role='img'
				aria-label={t('charts.bar')}
				onMouseLeave={() => setHover(null)}
			>
				<ChartYGrid
					ticks={ticks}
					getY={getY}
					x1={padding.left}
					x2={width - padding.right}
				/>

				{categories.map((category, groupIndex) => {
					const groupX = padding.left + groupWidth * groupIndex + 8;
					return (
						<g key={category}>
							{datasets.map((dataset, seriesIndex) => {
								const value = dataset.data[groupIndex] ?? 0;
								const x = groupX + seriesIndex * (barWidth + barGap);
								const y = getY(value);
								const barHeight = Math.max(0, padding.top + chartHeight - y);
								const color = chartSeriesColor(seriesIndex, dataset.color);
								const isHovered =
									hover?.groupIndex === groupIndex && hover?.seriesIndex === seriesIndex;
								const isDimmed = hover != null && !isHovered;

								return (
									<g key={`${dataset.name}-${groupIndex}`}>
										<rect
											x={x}
											y={y}
											width={barWidth}
											height={barHeight}
											rx={3}
											fill={color}
											className={cn(styles.bar, isDimmed && styles.dimmed, isHovered && styles.active)}
											onMouseEnter={() => {
												if (!showHoverValue) return;
												setHover({
													groupIndex,
													seriesIndex,
													category,
													seriesName: dataset.name,
													value,
													x: x + barWidth / 2,
													y,
													color,
												});
											}}
											onMouseLeave={() => {
												if (!showHoverValue) return;
												setHover(null);
											}}
										>
											<title>
												{`${dataset.name}: ${value}`}
											</title>
										</rect>
										{showValues && value > 0 && (
											<text
												x={x + barWidth / 2}
												y={y - 4}
												className={styles.value}
												textAnchor='middle'
											>
												{value}
											</text>
										)}
									</g>
								);
							})}
							<text
								x={groupX + (seriesCount * barWidth + barGap * (seriesCount - 1)) / 2}
								y={height - 12}
								className={chartCategoryClassName()}
								textAnchor='middle'
							>
								{category}
							</text>
						</g>
					);
				})}

				{showHoverValue && hover && (
					<ChartHoverBubble
						x={hover.x}
						y={hover.y}
						canvasWidth={width}
						color={hover.color}
						label={multiSeries
							? `${hover.category} · ${hover.seriesName}: ${hover.value}`
							: `${hover.category}: ${hover.value}`}
					/>
				)}
			</svg>
			<ChartLegend
				items={datasets.map((dataset, index) => ({
					name: dataset.name,
					color: chartSeriesColor(index, dataset.color),
				}))}
			/>
		</ChartBase>
	);
});

BarChart.displayName = 'BarChart';
