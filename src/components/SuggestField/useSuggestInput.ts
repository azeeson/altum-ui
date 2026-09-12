import {useCallback, useEffect, useMemo, useState} from 'react';
import {
	type ListboxFilterFn,
	filterListboxOptions,
	getListboxDisplayValue,
	matchListboxOption,
} from '../../utils/listboxOptions';
import {getFormControlState} from '../../utils/formControl';
import type {SuggestFieldOption} from './SuggestField.types';

/**
 * Текст комбобокса SuggestField: фильтр, commit, highlight.
 */
export function useSuggestInput(options: {
	optionsList: SuggestFieldOption[];
	controlledValue?: string;
	defaultValue: string;
	disabled: boolean;
	readOnly: boolean;
	allowCustom: boolean;
	filterFn: ListboxFilterFn<SuggestFieldOption>;
	onChange?: (value: string) => void;
	onClear?: () => void;
}) {
	const {
		optionsList,
		controlledValue,
		defaultValue,
		disabled,
		readOnly,
		allowCustom,
		filterFn,
		onChange,
		onClear,
	} = options;
	const [internalValue, setInternalValue] = useState(defaultValue);
	const isControlled = controlledValue !== undefined;
	const currentValue = isControlled ? controlledValue : internalValue;
	const [isOpen, setIsOpen] = useState(false);
	const [isFocused, setIsFocused] = useState(false);
	const [inputText, setInputText] = useState(() => getListboxDisplayValue(optionsList, currentValue));
	const [highlightedIndex, setHighlightedIndex] = useState(-1);
	const {isReadOnly, isInteractive} = getFormControlState({
		disabled,
		readOnly
	});

	const filteredLen = useMemo(
		() => filterListboxOptions({
			options: optionsList,
			query: inputText,
			filterFn,
		}).length,
		[filterFn, inputText, optionsList],
	);

	const syncInputFromValue = useCallback(() => {
		setInputText(getListboxDisplayValue(optionsList, currentValue));
	}, [currentValue, optionsList]);

	useEffect(() => {
		if (!isFocused) {
			// eslint-disable-next-line react-hooks/set-state-in-effect -- синхронизация текста с value вне фокуса
			syncInputFromValue();
		}
	}, [isFocused, syncInputFromValue]);

	useEffect(() => {
		if (!isOpen) {
			// eslint-disable-next-line react-hooks/set-state-in-effect -- сброс подсветки при закрытии
			setHighlightedIndex(-1);
			return;
		}
		setHighlightedIndex((prev) => {
			if (filteredLen === 0) return -1;
			if (prev < 0) return 0;
			return Math.min(prev, filteredLen - 1);
		});
	}, [filteredLen, isOpen]);

	const commitValue = useCallback((nextValue: string, displayText?: string) => {
		if (!isControlled) setInternalValue(nextValue);
		onChange?.(nextValue);
		setInputText(displayText ?? getListboxDisplayValue(optionsList, nextValue));
	}, [isControlled, onChange, optionsList]);

	return {
		currentValue,
		isOpen,
		setIsOpen,
		isFocused,
		setIsFocused,
		inputText,
		setInputText,
		highlightedIndex,
		setHighlightedIndex,
		isReadOnly,
		isInteractive,
		syncInputFromValue,
		commitValue,
		handleClear: () => {
			commitValue('');
			setIsOpen(false);
			onClear?.();
		},
		handleValueChange: (next: string | string[]) => {
			const nextValue = typeof next === 'string' ? next : (next[0] ?? '');
			commitValue(nextValue);
			setIsOpen(false);
		},
		handleInputChange: (nextText: string) => {
			if (!isInteractive) return;
			setInputText(nextText);
			setIsOpen(true);
			if (!allowCustom) return;
			if (!isControlled) setInternalValue(nextText);
			onChange?.(nextText);
		},
		handleBlurCommit: () => {
			if (allowCustom) {
				syncInputFromValue();
				return;
			}
			const matched = matchListboxOption(optionsList, inputText);
			if (matched) commitValue(matched.value);
			else syncInputFromValue();
		},
		handleEnterCustom: () => {
			if (allowCustom) {
				commitValue(inputText);
				setIsOpen(false);
				return;
			}
			const matched = matchListboxOption(optionsList, inputText);
			if (matched) {
				commitValue(matched.value);
				setIsOpen(false);
			}
		},
	};
}
