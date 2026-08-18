import type React from 'react';
import {MaskedFieldProps} from '../MaskedField/MaskedField';

/**
 * Свойства `TimePicker`.
 */
export interface TimePickerProps extends Omit<React.ComponentPropsWithoutRef<'div'>, 'onChange' | 'defaultValue'> {
	value: string;
	onChange: (time: string) => void;
	/** Без собственной «карточки» — для Dropdown / Sheet */
	embedded?: boolean;
	/** Панель открыта — для корректного скролла к выбранному значению */
	active?: boolean;
}

/**
 * Свойства `TimePickerField`.
 */
export interface TimePickerFieldProps extends Omit<MaskedFieldProps, 'mask'> {
	value: string;
}
