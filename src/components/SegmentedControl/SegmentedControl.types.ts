import type {ComponentPropsWithoutRef} from 'react';
import type {SurfaceVariant} from '../../types';

export interface SegmentOption<T = string> {
	label: string;
	value: T;
}

export type SegmentedItemFit = 'equal' | 'content';

export interface SegmentedControlProps<T = string> extends Omit<
	ComponentPropsWithoutRef<'div'>,
	'onChange' | 'children' | 'defaultValue'
> {
	options: SegmentOption<T>[];
	value: T;
	onChange: (value: T) => void;
	variant?: SurfaceVariant;
	size?: 'sm' | 'md' | 'lg';
	/**
	 * Ширина сегментов:
	 * - `equal` — равные доли трека (по умолчанию);
	 * - `content` — от контента, оставшееся место распределяется; суммарно 100% трека.
	 * @default 'equal'
	 */
	itemFit?: SegmentedItemFit;
	readOnly?: boolean;
	disabled?: boolean;
	/**
	 * Без рамки у трека.
	 * @default false
	 */
	borderless?: boolean;
}
