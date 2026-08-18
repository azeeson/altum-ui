import type {
	LineChartProps,
} from './LineChart.types';
export type {
	ChartDataset,
	LineChartProps,
} from './LineChart.types';

import React, {forwardRef, useId, useRef, useState} from 'react';
import styles from './LineChart.module.css';
import {composeRefs} from '../../utils/composeRefs';
import {
	ChartBase,
	ChartHoverBubble,
	ChartLegend,
	ChartYGrid,
	DEFAULT_CHART_PADDING,
	chartCategoryClassName,
	chartPlotRect,
	linearYTicks,
	useChartContainerSize,
} from '../../base/ChartBase';

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
	const containerRef = useRef<HTMLDivElement>(null);
	const gradientUid = useId().replace(/:/g, '');
	const dimensions = useChartContainerSize(containerRef, height);
	const [hoveredNode, setHoveredNode] = useState<{
		x: number;
		y: number;
		label: string;
		datasetName: string;
		value: number;
		color: string;
	} | null>(null);

	const padding = {
		...DEFAULT_CHART_PADDING,
		right: 20,
	};
	const {width: chartWidth, height: chartHeight} = chartPlotRect(
		dimensions.width,
		dimensions.height,
		padding,
	);

	const allValues = datasets.flatMap((d) => d.data);
	const maxVal = allValues.length ? Math.max(...allValues) : 100;
	const yTicks = linearYTicks(maxVal);

	const getX = (index: number) => {
		const span = Math.max(1, categories.length - 1);
		return padding.left + (chartWidth / span) * index;
	};

	const getY = (val: number) => {
		return padding.top + chartHeight - (val / (maxVal || 1)) * chartHeight;
	};

	// Строка path кубического сплайна (математическая формулировка)
	const getSplinePath = (data: number[]) => {
		if (data.length === 0) return '';
		let d = `M ${getX(0)} ${getY(data[0])}`;

		for (let i = 0; i < data.length - 1; i++) {
			const x0 = getX(i);
			const y0 = getY(data[i]);
			const x1 = getX(i + 1);
			const y1 = getY(data[i + 1]);

			// Смещения контрольных точек для горизонтальных касательных Безье
			const cp1x = x0 + (x1 - x0) / 2;
			const cp1y = y0;
			const cp2x = x0 + (x1 - x0) / 2;
			const cp2y = y1;

			d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x1} ${y1}`;
		}
		return d;
	};

	// Замкнутая строка path сплайна для заливки градиентом
	const getAreaPath = (data: number[]) => {
		if (data.length === 0) return '';
		const startX = getX(0);
		const startY = getY(data[0]);
		const bottomY = getY(0);

		// Начать снизу левой оси и подняться к первой точке кривой
		let d = `M ${startX} ${bottomY} L ${startX} ${startY}`;

		// Сплайн той же формы, что и линия
		for (let i = 0; i < data.length - 1; i++) {
			const x0 = getX(i);
			const y0 = getY(data[i]);
			const x1 = getX(i + 1);
			const y1 = getY(data[i + 1]);

			const cp1x = x0 + (x1 - x0) / 2;
			const cp1y = y0;
			const cp2x = x0 + (x1 - x0) / 2;
			const cp2y = y1;

			d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x1} ${y1}`;
		}

		// Опуститься вниз вправо, вернуться к старту, замкнуть контур
		const endX = getX(data.length - 1);
		d += ` L ${endX} ${bottomY} Z`;
		return d;
	};

	return (
		<ChartBase
			containerRef={composeRefs(ref, containerRef)}
			className={className}
			{...rest}
		>
			<svg
				className={styles.chartSvg}
				width={dimensions.width}
				height={dimensions.height}
			>
				<defs>
					{datasets.map((dataset, idx) => (
						<linearGradient
							key={idx}
							id={`${gradientUid}-${idx}`}
							x1='0'
							y1='0'
							x2='0'
							y2='1'
						>
							<stop
								offset='0%'
								stopColor={dataset.color}
								stopOpacity='0.25'
							/>
							<stop
								offset='100%'
								stopColor={dataset.color}
								stopOpacity='0.0'
							/>
						</linearGradient>
					))}
				</defs>

				<ChartYGrid
					ticks={yTicks}
					getY={getY}
					x1={padding.left}
					x2={dimensions.width - padding.right}
					labelX={padding.left - 10}
				/>

				{categories.map((cat, idx) => {
					const x = getX(idx);
					return (
						<text
							key={idx}
							className={chartCategoryClassName()}
							x={x}
							y={dimensions.height - padding.bottom + 20}
							textAnchor='middle'
						>
							{cat}
						</text>
					);
				})}

				{/* Полупрозрачные градиентные области под кривыми */}
				{datasets.map((dataset, dIdx) => (
					<path
						key={`area-${dataset.name}`}
						d={getAreaPath(dataset.data)}
						fill={`url(#${gradientUid}-${dIdx})`}
					/>
				))}

				{/* Нарисовать линии кривых */}
				{datasets.map((dataset, _dIdx) => (
					<path
						key={dataset.name}
						className={styles.chartLine}
						d={getSplinePath(dataset.data)}
						style={{stroke: dataset.color}}
					/>
				))}

				{/* Точки-триггеры интерактива */}
				{datasets.map((dataset) =>
					dataset.data.map((val, idx) => {
						const x = getX(idx);
						const y = getY(val);
						return (
							<circle
								key={`${dataset.name}-${idx}`}
								className={styles.nodePoint}
								cx={x}
								cy={y}
								r={hoveredNode?.x === x && hoveredNode?.y === y ? 6 : 4}
								fill={dataset.color}
								stroke='var(--altum-color-surface)'
								strokeWidth={hoveredNode?.x === x && hoveredNode?.y === y ? 3 : 1}
								onMouseEnter={(_e) => {
									setHoveredNode({
										x,
										y,
										label: categories[idx],
										datasetName: dataset.name,
										value: val,
										color: dataset.color,
									});
								}}
								onMouseLeave={() => setHoveredNode(null)}
							/>
						);
					}))}
				{hoveredNode && (
					<ChartHoverBubble
						x={hoveredNode.x}
						y={hoveredNode.y}
						canvasWidth={dimensions.width}
						color={hoveredNode.color}
						label={`${hoveredNode.label} · ${hoveredNode.datasetName}: ${hoveredNode.value}`}
					/>
				)}
			</svg>
			<ChartLegend items={datasets} />
		</ChartBase>
	);
});

LineChart.displayName = 'LineChart';
