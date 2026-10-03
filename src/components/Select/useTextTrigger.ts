import {
	useState,
	type ChangeEvent,
	type FocusEvent,
	type KeyboardEvent,
	type MouseEvent,
	type Ref,
} from 'react';
import {useControlledState} from '../../hooks/useControlledState';
import {getListboxDisplayValue, matchListboxOption} from '../../core/utils/listboxOptions';
import {isKey} from '../../core/utils/keyboard';
import {popoverFromInvoker, showPopover} from '../../core/utils/popover';
import type {SelectInputProps, SelectOption} from './Select.types';

type UseTextTriggerArgs = {
	options: SelectOption[];
	value?: string;
	defaultValue?: string;
	onChange?: (value: string) => void;
	/** `true` — значение может быть свободным текстом. */
	allowCustom?: boolean;
	placeholder?: string;
	name?: string;
	required?: boolean;
	inputRef?: Ref<HTMLInputElement>;
	onFocus?: (event: FocusEvent<HTMLInputElement>) => void;
	onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
	onClick?: (event: MouseEvent<HTMLInputElement>) => void;
	onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
};

/**
 * Печатный триггер для `Select`: текст, фильтр и `inputProps`.
 * Freestyle коммитит значение на каждый ввод; иначе — точный матч на blur.
 */
export function useTextTrigger({
	options,
	value: controlledValue,
	defaultValue = '',
	onChange,
	allowCustom = false,
	placeholder,
	name,
	required,
	inputRef,
	onFocus,
	onBlur,
	onClick,
	onKeyDown,
}: UseTextTriggerArgs): {
	value: string;
	onChange: (next: string | string[]) => void;
	filterQuery: string;
	inputProps: SelectInputProps;
} {
	const [value, setValue] = useControlledState(controlledValue, defaultValue);
	const [focused, setFocused] = useState(false);
	const display = getListboxDisplayValue(options, value);
	const [text, setText] = useState(display);
	const [seenDisplay, setSeenDisplay] = useState(display);
	/* Пока поле не в фокусе, подпись следует за выбранным value. */
	if (!focused && seenDisplay !== display) {
		setSeenDisplay(display);
		setText(display);
	}

	const commit = (next: string) => {
		setValue(next);
		onChange?.(next);
		const label = getListboxDisplayValue(options, next);
		setSeenDisplay(label);
		setText(label);
	};

	return {
		value,
		onChange: (next) => {
			commit(typeof next === 'string' ? next : (next[0] ?? ''));
		},
		filterQuery: text,
		inputProps: {
			as: 'input',
			name,
			required,
			inputRef,
			placeholder,
			value: text,
			autoComplete: 'off',
			role: 'combobox',
			'aria-autocomplete': 'list',
			children: null,
			onChange: (event: ChangeEvent<HTMLInputElement>) => {
				const nextText = event.target.value;
				setFocused(true);
				setText(nextText);
				if (allowCustom) {
					setValue(nextText);
					onChange?.(nextText);
				}
				showPopover(popoverFromInvoker(event.currentTarget));
			},
			onFocus: (event) => {
				onFocus?.(event);
				setText(display);
				setFocused(true);
			},
			onBlur: (event) => {
				onBlur?.(event);
				setFocused(false);
				if (allowCustom) {
					const label = getListboxDisplayValue(options, value);
					setSeenDisplay(label);
					setText(label);
					return;
				}
				const matched = matchListboxOption(options, text);
				if (matched) commit(matched.value);
				else {
					setSeenDisplay(display);
					setText(display);
				}
			},
			onClick: (event) => {
				onClick?.(event);
			},
			onKeyDown: (event) => {
				onKeyDown?.(event);
				if (event.defaultPrevented) return;
				if (isKey(event, 'Escape')) setText(display);
			},
		},
	};
}
