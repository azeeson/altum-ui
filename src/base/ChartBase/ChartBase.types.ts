import type {ComponentPropsWithoutRef, ReactNode, Ref} from 'react';

export type ChartPadding = {
	left: number;
	right: number;
	top: number;
	bottom: number;
};

export interface ChartYGridProps {
	ticks: number[];
	getY: (value: number) => number;
	x1: number;
	x2: number;
	labelX?: number;
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
	 * Показывать легенду, если серия одна (декартовы графики).
	 * @default false
	 */
	showWhenSingle?: boolean;
	/** Колонка с деталями vs inline-ряд. @default 'inline' */
	layout?: 'inline' | 'stack';
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
	containerRef?: Ref<HTMLDivElement>;
}
