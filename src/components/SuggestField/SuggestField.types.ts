import type React from 'react';
import type {Ref} from 'react';
import type {FieldBaseProps} from '../TextField/TextField.types';
import type {SelectOption} from '../Select/Select';
import {type ListboxFilterFn} from '../../core/utils/listboxOptions';

/**
 * Публичный тип `SuggestFieldOption`.
 */
export type SuggestFieldOption = SelectOption;

/**
 * Свойства `SuggestField` — прокси над `Select` с печатным триггером (`inputProps`).
 * Ввод фильтрует список; freestyle — у `AutocompleteField`.
 */
export interface SuggestFieldProps extends FieldBaseProps {
	options: SuggestFieldOption[];
	value?: string;
	defaultValue?: string;
	placeholder?: string;
	className?: string;
	name?: string;
	required?: boolean;
	filterFn?: ListboxFilterFn<SuggestFieldOption>;
	noOptionsText?: string;
	onChange?: (value: string) => void;
	onFocus?: React.FocusEventHandler<HTMLInputElement>;
	onBlur?: React.FocusEventHandler<HTMLInputElement>;
	onClick?: React.MouseEventHandler<HTMLInputElement>;
	onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
	/** DOM-узел поля ввода. */
	inputRef?: Ref<HTMLInputElement>;
	id?: string;
	'aria-label'?: string;
}
