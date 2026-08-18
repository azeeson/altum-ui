import type {ComponentPropsWithoutRef} from 'react';
import {type DateRangeValue} from '../Calendar/Calendar.utils';

export type {DateRangeValue};

/**
 * Свойства `DateRangePicker`.
 */
export interface DateRangePickerProps extends Omit<
	ComponentPropsWithoutRef<'div'>,
	'onChange' | 'defaultValue' | 'children'
> {
	value: DateRangeValue;
	onChange: (range: DateRangeValue) => void;
	/** Общий лейбл поля диапазона. По умолчанию — `messages.dateRangePicker.label`. */
	label?: string;
	startLabel?: string;
	endLabel?: string;
	/** Расположение полей. @default 'single' */
	layout?: 'single' | 'split';
	size?: 'sm' | 'md' | 'lg';
	/** Расположение лейбла — как у MaskedField / TextField. @default 'inline' */
	labelPlacement?: 'inline' | 'outside' | 'none';
	disabled?: boolean;
	readOnly?: boolean;
}
