import type {LineChartProps} from './LineChart.types';
export type {
	ChartDataset,
	LineChartProps,
} from './LineChart.types';

import {forwardRef, useId, useState} from 'react';
import styles from './LineChart.module.css';
import series from '../../styles/chartSeries.module.css';
import {cn} from '../../utils/cn';
import {
	ChartCartesian,
	ChartHoverBubble,
	chartPointX,
} from '../../base/ChartBase';

function bezier(
	data: number[],
	getX: (index: number) => number,
	getY: (value: number) => number,
): string {
	let d = '';
	for (let i = 0; i < data.length - 1; i++) {
		const x0 = getX(i);
		const x1 = getX(i + 1);
		const mid = (x0 + x1) / 2;
		d += `C${mid} ${getY(data[i])} ${mid} ${getY(data[i + 1])} ${x1} ${getY(data[i + 1])}`;
	}
	return d;
}

function splinePath(
	data: number[],
	getX: (index: number) => number,
	getY: (value: number) => number,
): string {
	if (data.length === 0) return '';
	return `M${getX(0)} ${getY(data[0])}${bezier(data, getX, getY)}`;
}

function areaPath(
	data: number[],
	getX: (index: number) => number,
	getY: (value: number) => number,
): string {
	if (data.length === 0) return '';
	const startX = getX(0);
	const endX = getX(data.length - 1);
	const zero = getY(0);
	return `M${startX} ${zero}L${startX} ${getY(data[0])}${bezier(data, getX, getY)}L${endX} ${zero}Z`;
}

/**
 * Линейный SVG-график с несколькими сериями данных и hover-подсказками.
 *
 * @component
 * @example
 * <LineChart
 *   categories={['Пн', 'Вт', 'Ср']}
 *   datasets={[{ name: 'Продажи', color: '#3b82f6', data: [12, 19, 8] }]}
 * />
 */
export const LineChart = forwardRef<HTMLDivElement, LineChartProps>(function LineChart(
	{
		categories,
		datasets,
		height = 300,
		className,
		...rest
	},
	ref,
) {
	const gradientUid = useId().replace(/:/g, '');
	const [hover, setHover] = useState<[number, number] | null>(null);

	return (
		<ChartCartesian
			ref={ref}
			categories={categories}
			datasets={datasets}
			height={height}
			className={className}
			getX={chartPointX}
			onPlotLeave={() => setHover(null)}
			{...rest}
		>
			{(plot) => {
				const point = hover && datasets[hover[0]];
				return (
					<>
						<defs>
							{datasets.map((dataset, index) => (
								<linearGradient
									key={index}
									id={`${gradientUid}-${index}`}
									x1='0'
									y1='0'
									x2='0'
									y2='1'
								>
									<stop
										offset='0%'
										stopColor={plot.items[index].color}
										stopOpacity='0.25'
									/>
									<stop
										offset='100%'
										stopColor={plot.items[index].color}
										stopOpacity='0'
									/>
								</linearGradient>
							))}
						</defs>
						{datasets.map((dataset, datasetIndex) => {
							const seriesOn = hover?.[0] === datasetIndex;
							return (
								<g key={dataset.name}>
									<path
										d={areaPath(dataset.data, plot.getX, plot.getY)}
										fill={`url(#${gradientUid}-${datasetIndex})`}
										className={cn(hover && !seriesOn && series.dimmed)}
									/>
									<path
										className={cn(
											styles.line,
											series.item,
											hover && !seriesOn && series.dimmed,
											seriesOn && series.active,
										)}
										d={splinePath(dataset.data, plot.getX, plot.getY)}
										style={{stroke: plot.items[datasetIndex].color}}
									/>
									{dataset.data.map((value, index) => {
										const on = seriesOn && hover?.[1] === index;
										return (
											<circle
												key={index}
												className={cn(
													styles.node,
													series.item,
													hover && !on && series.dimmed,
													on && series.active,
												)}
												cx={plot.getX(index)}
												cy={plot.getY(value)}
												r={4}
												fill={plot.items[datasetIndex].color}
												onMouseEnter={() => setHover([datasetIndex, index])}
											/>
										);
									})}
								</g>
							);
						})}
						{point && hover && (
							<ChartHoverBubble
								x={plot.getX(hover[1])}
								y={plot.getY(point.data[hover[1]])}
								canvasWidth={plot.width}
								color={plot.items[hover[0]].color}
								label={`${categories[hover[1]]} · ${point.name}: ${point.data[hover[1]]}`}
							/>
						)}
					</>
				);
			}}
		</ChartCartesian>
	);
});

LineChart.displayName = 'LineChart';
