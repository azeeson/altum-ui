import type {
	ComponentPropsWithoutRef,
} from 'react';

/** Пара значений для режима диапазона. */
export type RangeValue = [number, number];

type SliderSharedProps = Omit<ComponentPropsWithoutRef<'div'>, 'onChange' | 'defaultValue'> & {
	min?: number;
	max?: number;
	step?: number;
	disabled?: boolean;
	readOnly?: boolean;
	/** Показывать значения над ползунками. @default true */
	showValues?: boolean;
};

/**
 * Одиночный ползунок: `value` — число.
 */
export type SliderSingleProps = SliderSharedProps & {
	range?: false;
	value: number;
	onChange: (value: number) => void;
};

/**
 * Диапазон: `value` — `[from, to]`, либо `range={true}`.
 */
export type SliderRangeProps = SliderSharedProps & {
	range?: true;
	value: RangeValue;
	onChange: (value: RangeValue) => void;
};

/**
 * Свойства `Slider` — одиночный или диапазон (по типу `value` / флагу `range`).
 */
export type SliderProps = SliderSingleProps | SliderRangeProps;
