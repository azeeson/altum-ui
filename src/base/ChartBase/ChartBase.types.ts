import type {ComponentPropsWithoutRef, ReactNode} from 'react';

export type ChartPadding = {
	left: number;
	right: number;
	top: number;
	bottom: number;
};

export interface ChartSeries {
	name: string;
	color?: string;
	data: number[];
}

export interface ChartYGridProps {
	ticks: number[];
	getY: (value: number) => number;
	x1: number;
	x2: number;
}

export interface ChartLegendItem {
	name: string;
	color: string;
	/** Стабильный ключ; иначе `name`. */
	id?: string;
	/** Доп. подпись (значение / процент). */
	detail?: ReactNode;
	active?: boolean;
}

export interface ChartLegendProps {
	items: ChartLegendItem[];
	className?: string;
	/**
	 * `inline` — ряд с переносом (декартовы графики).
	 * `stack` — колонка «сватч / имя / значение» (DonutChart).
	 * @default 'inline'
	 */
	layout?: 'inline' | 'stack';
	/**
	 * Показывать легенду, если серия одна (декартовы графики).
	 * @default false
	 */
	showWhenSingle?: boolean;
	onItemHover?: (name: string | null) => void;
}

export interface ChartHoverBubbleProps {
	x: number;
	y: number;
	canvasWidth: number;
	label: string;
	color?: string;
}

export interface ChartBaseProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
	children: ReactNode;
}

export type ChartXScale = (
	index: number,
	count: number,
	left: number,
	plotW: number,
) => number;

export interface CartesianPlot {
	width: number;
	height: number;
	left: number;
	right: number;
	top: number;
	bottom: number;
	plotW: number;
	plotH: number;
	maxVal: number;
	getX: (index: number) => number;
	getY: (value: number) => number;
	ticks: number[];
	items: ChartLegendItem[];
}

export interface ChartCartesianProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
	categories: string[];
	datasets: ChartSeries[];
	height: number;
	getX: ChartXScale;
	onPlotLeave?: () => void;
	children: (plot: CartesianPlot) => ReactNode;
}
