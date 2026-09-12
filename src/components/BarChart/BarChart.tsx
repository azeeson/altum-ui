import type {BarChartProps} from './BarChart.types';
export type {
	BarChartDataset,
	BarChartProps,
} from './BarChart.types';

import {forwardRef, useState} from 'react';
import styles from './BarChart.module.css';
import series from '../../styles/chartSeries.module.css';
import {cn} from '../../utils/cn';
import {
	ChartCartesian,
	ChartHoverBubble,
	chartBandX,
} from '../../base/ChartBase';

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
	const [hover, setHover] = useState<[number, number] | null>(null);

	return (
		<ChartCartesian
			ref={ref}
			categories={categories}
			datasets={datasets}
			height={height}
			className={className}
			getX={chartBandX}
			aria-label='Столбчатый график'
			onPlotLeave={() => setHover(null)}
			{...rest}
		>
			{(plot) => {
				const n = Math.max(1, datasets.length);
				const band = plot.plotW / Math.max(1, categories.length);
				const barW = Math.max(4, (band - 4 * (n + 1)) / n);
				const inner = n * barW + 4 * (n - 1);
				const barX = (group: number, seriesIndex: number) =>
					plot.getX(group) - inner / 2 + seriesIndex * (barW + 4);
				const hovered = hover && datasets[hover[1]];

				return (
					<>
						{categories.map((_, groupIndex) =>
							datasets.map((dataset, seriesIndex) => {
								const value = dataset.data[groupIndex] ?? 0;
								const x = barX(groupIndex, seriesIndex);
								const y = plot.getY(value);
								const on = hover?.[0] === groupIndex && hover[1] === seriesIndex;
								return (
									<g key={`${groupIndex}-${seriesIndex}`}>
										<rect
											x={x}
											y={y}
											width={barW}
											height={Math.max(0, plot.top + plot.plotH - y)}
											rx={3}
											fill={plot.items[seriesIndex].color}
											className={cn(
												series.item,
												hover && !on && series.dimmed,
												on && series.active,
											)}
											onMouseEnter={showHoverValue ? () => setHover([groupIndex, seriesIndex]) : undefined}
										>
											<title>
												{`${dataset.name}: ${value}`}
											</title>
										</rect>
										{showValues && value > 0 && (
											<text
												x={x + barW / 2}
												y={y - 4}
												className={styles.value}
												textAnchor='middle'
											>
												{value}
											</text>
										)}
									</g>
								);
							}))}
						{showHoverValue && hovered && hover && (
							<ChartHoverBubble
								x={barX(hover[0], hover[1]) + barW / 2}
								y={plot.getY(hovered.data[hover[0]] ?? 0)}
								canvasWidth={plot.width}
								color={plot.items[hover[1]].color}
								label={datasets.length > 1
									? `${categories[hover[0]]} · ${hovered.name}: ${hovered.data[hover[0]] ?? 0}`
									: `${categories[hover[0]]}: ${hovered.data[hover[0]] ?? 0}`}
							/>
						)}
					</>
				);
			}}
		</ChartCartesian>
	);
});

BarChart.displayName = 'BarChart';
