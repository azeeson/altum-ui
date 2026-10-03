import type {MouseEvent} from 'react';
import type {BarChartProps} from './BarChart.types';
export type {BarChartDataset, BarChartProps} from './BarChart.types';

import {useState} from 'react';
import styles from './BarChart.module.css';
import {cn} from '../../core/utils/cn';
import {ChartCartesian, ChartHoverBubble, chartBandX} from '../../base/ChartBase';

/**
 * Столбчатый SVG-график без внешних зависимостей.
 * При `showHoverValue` наведение на столбец показывает его значение.
 * Наведение читается на общей группе (`data-bar`).
 *
 * @component
 * @example
 * <BarChart
 *   categories={['Пн', 'Вт', 'Ср']}
 *   datasets={[{ name: 'Заказы', data: [12, 19, 8] }]}
 *   showHoverValue
 * />
 */
export const BarChart = ({
	categories,
	datasets,
	height = 280,
	className,
	showValues = false,
	showHoverValue = true,
	rootRef,
	...rest
}: BarChartProps) => {
	const [hover, setHover] = useState<[number, number] | null>(null);

	function clearHover() {
		setHover((prev) => (prev == null ? prev : null));
	}

	function onBarOver(event: MouseEvent<SVGGElement>) {
		if (!showHoverValue) return;
		const target = event.target;
		if (!(target instanceof Element)) return;
		const node = target.closest('[data-bar]');
		if (!node) return;
		const group = Number(node.getAttribute('data-group'));
		const seriesIndex = Number(node.getAttribute('data-series'));
		if (Number.isNaN(group) || Number.isNaN(seriesIndex)) return;
		setHover((prev) => (
			prev && prev[0] === group && prev[1] === seriesIndex ? prev : [group, seriesIndex]
		));
	}

	return (
		<ChartCartesian
			rootRef={rootRef}
			categories={categories}
			datasets={datasets}
			height={height}
			className={cn(styles.root, className)}
			getX={chartBandX}
			aria-label='Столбчатый график'
			onPlotLeave={clearHover}
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
					<g
						onMouseOver={onBarOver}
						onMouseLeave={clearHover}
					>
						{categories.map((_, groupIndex) =>
							datasets.map((dataset, seriesIndex) => {
								const value = dataset.data[groupIndex] ?? 0;
								const x = barX(groupIndex, seriesIndex);
								const y = plot.getY(value);
								const on = hover?.[0] === groupIndex && hover[1] === seriesIndex;
								return (
									<g
										key={`${groupIndex}-${seriesIndex}`}
										data-bar=''
										data-group={groupIndex}
										data-series={seriesIndex}
									>
										<rect
											className={styles.bar}
											x={x}
											y={y}
											width={barW}
											height={Math.max(0, plot.top + plot.plotH - y)}
											rx={3}
											fill={plot.items[seriesIndex].color}
											data-dimmed={hover && !on ? '' : undefined}
											data-active={on ? '' : undefined}
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
					</g>
				);
			}}
		</ChartCartesian>
	);
};
