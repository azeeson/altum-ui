import type {
	ComponentPropsWithoutRef,
} from 'react';

export interface BarChartDataset {
	name: string;
	color?: string;
	data: number[];
}

/**
 * Свойства `BarChart`.
 */
export interface BarChartProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
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
