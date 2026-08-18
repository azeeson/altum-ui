import type {
	ComponentPropsWithoutRef,
} from 'react';

export interface ChartDataset {
	name: string;
	color: string;
	data: number[];
}

/**
 * Свойства `LineChart`.
 */
export interface LineChartProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
	categories: string[];
	datasets: ChartDataset[];
	height?: number;
}
