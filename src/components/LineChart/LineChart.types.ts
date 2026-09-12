import type {ChartSeries} from '../../base/ChartBase';
import type {ComponentPropsWithoutRef} from 'react';

export interface ChartDataset extends ChartSeries {
	color: string;
}

/**
 * Свойства `LineChart`.
 */
export interface LineChartProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
	categories: string[];
	datasets: ChartDataset[];
	height?: number;
}
