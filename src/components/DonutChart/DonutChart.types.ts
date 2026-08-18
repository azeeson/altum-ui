import type React from 'react';
import type {
	ComponentPropsWithoutRef,
} from 'react';

/**
 * Сегмент круговой диаграммы.
 */
export interface DonutSegment {
	id?: string;
	label: string;
	value: number;
	color?: string;
}

/**
 * Свойства `DonutChart`.
 */
export interface DonutChartProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
	segments: DonutSegment[];
	/** Диаметр. @default 160 */
	size?: number;
	/** Толщина кольца. @default 22 */
	thickness?: number;
	/** Центральная подпись */
	centerLabel?: React.ReactNode;
	centerValue?: React.ReactNode;
	/** Показать легенду. @default true */
	showLegend?: boolean;
	/**
	 * При наведении увеличивать сегмент и показывать его значение в центре.
	 * @default true
	 */
	hoverExpand?: boolean;
}
