import type {ComponentPropsWithoutRef, ReactNode, Ref} from 'react';
import type {SurfaceVariant} from '../../types';
import type {ButtonGroupItemFit, ButtonGroupOrientation} from '../ButtonGroup/ButtonGroup.types';

export interface SegmentOption<T = string> {
	label: ReactNode;
	value: T;
	/** Пункт недоступен, даже если контрол включён. */
	disabled?: boolean;
	id?: string;
	/** `aria-controls` — панель, которой управляет сегмент. */
	controls?: string;
}

/** Алиас `ButtonGroupItemFit`: `equal` | `content`. */
export type SegmentedItemFit = ButtonGroupItemFit;

/**
 * Вариант трека. `pill` — скруглённый трек (бывший default `secondary`);
 * остальные — `SurfaceVariant` / `ButtonGroup`.
 */
export type SegmentedControlVariant = 'pill' | SurfaceVariant;

export interface SegmentedControlProps<T = string> extends Omit<
	ComponentPropsWithoutRef<'div'>,
	'onChange' | 'children' | 'defaultValue'
> {
	options: SegmentOption<T>[];
	value: T;
	onChange: (value: T) => void;
	/** @default 'pill' */
	variant?: SegmentedControlVariant;
	size?: 'sm' | 'md' | 'lg';
	/**
	 * Ширина сегментов:
	 * - `equal` — равные доли трека (по умолчанию);
	 * - `content` — от контента, оставшееся место распределяется; суммарно 100% трека.
	 * @default 'equal'
	 */
	itemFit?: SegmentedItemFit;
	/**
	 * Ряд или колонка. Бегунок едет по той же оси.
	 * @default 'horizontal'
	 */
	orientation?: ButtonGroupOrientation;
	readOnly?: boolean;
	disabled?: boolean;
	/**
	 * `full` — на ширину колонки. `auto` — по содержимому.
	 * @default 'full'
	 */
	width?: 'auto' | 'full';
	/**
	 * Роль пункта. `tab` — список вкладок поверх сегментов.
	 * Без неё пункт — `radio`.
	 */
	itemRole?: 'tab';
	/** Корень трека. */
	rootRef?: Ref<HTMLDivElement>;
}
