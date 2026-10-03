import type {ChartSeries} from '../../base/ChartBase';
import type {ComponentPropsWithoutRef, Ref} from 'react';

export type BarChartDataset = ChartSeries;

/**
 * Свойства `BarChart`.
 */
export interface BarChartProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
	/** DOM-узел графика. */
	rootRef?: Ref<HTMLDivElement>;
	categories: string[];
	datasets: BarChartDataset[];
	height?: number;
	/** Показывать значения над столбцами всегда. @default false */
	showValues?: boolean;
	/**
	 * Показывать значение столбца при наведении (подсказка у вершины).
	 * @default true
	 */
	showHoverValue?: boolean;
}
