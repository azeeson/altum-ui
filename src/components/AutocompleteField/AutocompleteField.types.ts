import type React from 'react';
import type {Ref} from 'react';
import type {FieldBaseProps} from '../TextField/TextField.types';
import type {SelectOption} from '../Select/Select';
import {type ListboxFilterFn} from '../../core/utils/listboxOptions';

/**
 * Публичный тип `AutocompleteFieldOption`.
 */
export type AutocompleteFieldOption = SelectOption;

/**
 * Свойства `AutocompleteField` — freestyle-прокси над `Select` с печатным триггером (`inputProps`).
 * Фильтр без свободного текста — у `SuggestField`.
 */
export interface AutocompleteFieldProps extends FieldBaseProps {
	options: AutocompleteFieldOption[];
	value?: string;
	defaultValue?: string;
	placeholder?: string;
	className?: string;
	name?: string;
	required?: boolean;
	filterFn?: ListboxFilterFn<AutocompleteFieldOption>;
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
