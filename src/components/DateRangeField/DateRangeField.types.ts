import type {ComponentPropsWithoutRef} from 'react';
import type {FieldBaseProps} from '../../base/FieldBase';
import {type DateRangeValue} from '../Calendar/Calendar.utils';

export type {DateRangeValue};

/**
 * Свойства `DateRangeField` — chrome поля как у `DateField` / `FieldBaseProps`.
 */
export interface DateRangeFieldProps extends
	Omit<FieldBaseProps, 'label'>,
	Omit<
		ComponentPropsWithoutRef<'div'>,
		'onChange' | 'defaultValue' | 'children' | keyof FieldBaseProps
	> {
	value: DateRangeValue;
	onChange: (range: DateRangeValue) => void;
	/** Общий лейбл поля диапазона. По умолчанию — `messages.dateRangeField.label`. */
	label?: string;
	startLabel?: string;
	endLabel?: string;
	/** Расположение полей. @default 'single' */
	layout?: 'single' | 'split';
}
