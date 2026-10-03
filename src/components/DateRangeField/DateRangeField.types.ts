import type {ComponentPropsWithoutRef, Ref} from 'react';
import type {FieldBaseProps} from '../TextField/TextField.types';
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
	/** DOM-узел корня. */
	rootRef?: Ref<HTMLDivElement>;
	/** Поле ввода: единственное либо поле «от» в `split`. */
	inputRef?: Ref<HTMLInputElement>;
}
