import type React from 'react';
import type {FieldBaseProps} from '../../base/FieldBase';
import {type CustomSelectOption} from '../CustomSelect/CustomSelect';
import {type ListboxFilterFn} from '../../utils/listboxOptions';

/**
 * Публичный тип `SuggestFieldOption`.
 */
export type SuggestFieldOption = CustomSelectOption;

/**
 * Свойства `SuggestField`.
 * База поля наследуется от `FieldBaseProps`.
 */
export interface SuggestFieldProps
	extends FieldBaseProps,
	Omit<
		React.HTMLAttributes<HTMLDivElement>,
		'className' | 'onChange' | 'prefix' | 'onFocus' | 'onBlur' | 'onClick' | 'onKeyDown' | keyof FieldBaseProps
	> {
	options: SuggestFieldOption[];
	value?: string;
	defaultValue?: string;
	/** Placeholder при `labelPlacement` `outside` / `none`; в `inline` скрыт. */
	placeholder?: string;
	className?: string;
	name?: string;
	required?: boolean;
	/**
	 * Разрешить значение, которого нет в `options`.
	 * `false` — только выбор из списка (ввод используется как фильтр).
	 * @default true
	 */
	allowCustom?: boolean;
	filterFn?: ListboxFilterFn<SuggestFieldOption>;
	noOptionsText?: string;
	onChange?: (value: string) => void;
	onFocus?: React.FocusEventHandler<HTMLInputElement>;
	onBlur?: React.FocusEventHandler<HTMLInputElement>;
	onClick?: React.MouseEventHandler<HTMLInputElement>;
	onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
}
