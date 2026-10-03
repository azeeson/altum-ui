import type {ChartSeries} from '../../base/ChartBase';
import type {ComponentPropsWithoutRef, Ref} from 'react';

export interface ChartDataset extends ChartSeries {
	color: string;
}

/**
 * Свойства `LineChart`.
 */
export interface LineChartProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
	/** DOM-узел графика. */
	rootRef?: Ref<HTMLDivElement>;
	categories: string[];
	datasets: ChartDataset[];
	height?: number;
}
