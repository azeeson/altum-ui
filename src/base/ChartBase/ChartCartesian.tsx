import {useRef} from 'react';
import {uRef} from '../../core/utils/bundle';
import {ChartBase} from './ChartBase';
import {ChartLegend} from './ChartLegend';
import {ChartYGrid} from './ChartYGrid';
import {chartScale} from './cartesian';
import {chartSeriesColor} from './colors';
import {useChartWidth} from './useChartWidth';
import plotStyles from './ChartPlot.module.css';
import type {ChartCartesianProps} from './ChartBase.types';

/**
 * Декартова рамка: измерение ширины, сетка Y, подписи категорий, легенда.
 * Серии рисует `children(plot)`.
 *
 * @component
 */
export const ChartCartesian = ({
	categories,
	datasets,
	height,
	className,
	getX: xScale,
	onPlotLeave,
	children,
	rootRef,
	'aria-label': ariaLabel,
	...rest
}: ChartCartesianProps) => {
	const box = useRef<HTMLDivElement>(null);
	const width = useChartWidth(box);
	const scale = chartScale(width, height, datasets);
	const getX = (index: number) => xScale(index, categories.length, scale.left, scale.plotW);
	const items = datasets.map((dataset, index) => ({
		name: dataset.name,
		color: chartSeriesColor(index, dataset.color),
	}));

	return (
		<ChartBase
			rootRef={uRef(rootRef, box)}
			className={className}
			{...rest}
		>
			<svg
				width={width}
				height={height}
				role='img'
				aria-label={ariaLabel}
				onMouseLeave={onPlotLeave}
			>
				<ChartYGrid
					ticks={scale.ticks}
					getY={scale.getY}
					x1={scale.left}
					x2={width - scale.right}
				/>
				{categories.map((category, index) => (
					<text
						key={index}
						className={plotStyles.category}
						x={getX(index)}
						y={height - 12}
						textAnchor='middle'
					>
						{category}
					</text>
				))}
				{children({
					...scale,
					width,
					height,
					getX,
					items,
				})}
			</svg>
			<ChartLegend items={items} />
		</ChartBase>
	);
};
