import {useLayoutEffect, useRef, useState, type ChangeEvent, type KeyboardEvent, type MouseEvent} from 'react';
import {
	getFormattedValue,
	getRemainingGuides,
	getStaticDigitsPrefix,
} from '../components/MaskedField/MaskedField.utils';

/**
 * Цифровая маска (`9` = слот): каретка, Backspace/Delete, formatted value.
 *
 * @returns Значение для инпута, гиды, обработчики.
 */
export function useDigitMask(options: {
	mask: string;
	value: string;
	disabled?: boolean;
	readOnly?: boolean;
	onChange: (digits: string) => void;
}) {
	const {mask, value, disabled, readOnly, onChange} = options;
	const inputRef = useRef<HTMLInputElement | null>(null);
	const caretRef = useRef<number | null>(null);
	const [caretTick, setCaretTick] = useState(0);
	const locked = !!disabled || !!readOnly;
	const cleanDigits = value.replace(/\D/g, '');
	const displayVal = cleanDigits ? getFormattedValue(value, mask) : '';

	const scheduleCaret = (position: number) => {
		caretRef.current = position;
		setCaretTick((tick) => tick + 1);
	};

	useLayoutEffect(() => {
		const input = inputRef.current;
		if (input && caretRef.current !== null) {
			input.setSelectionRange(caretRef.current, caretRef.current);
			caretRef.current = null;
		}
	}, [value, caretTick]);

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		if (locked) return;
		const input = event.target;
		const originalSelectionStart = input.selectionStart || 0;
		const rawInput = input.value;
		let cleanInput = rawInput.replace(/\D/g, '');
		const staticPrefix = getStaticDigitsPrefix(mask);
		if (staticPrefix && cleanInput.startsWith(staticPrefix)) {
			cleanInput = cleanInput.slice(staticPrefix.length);
		}
		const truncatedDigits = cleanInput.slice(0, mask.replace(/[^9]/g, '').length);
		const formatted = getFormattedValue(truncatedDigits, mask);
		scheduleCaret(
			originalSelectionStart >= rawInput.length - 1
				? formatted.length
				: originalSelectionStart,
		);
		onChange(truncatedDigits);
	};

	const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
		if (locked) return;
		const input = event.currentTarget;
		const start = input.selectionStart;
		const end = input.selectionEnd;
		if (start === null || start !== end) return;

		const deleteDigitAtMaskIndex = (maskIndex: number) => {
			let digitCount = 0;
			for (let i = 0; i < maskIndex; i++) {
				if (mask[i] === '9') digitCount++;
			}
			const digits = value.replace(/\D/g, '');
			const newDigits = digits.slice(0, digitCount) + digits.slice(digitCount + 1);
			scheduleCaret(getFormattedValue(newDigits.slice(0, digitCount), mask).length);
			onChange(newDigits);
		};

		if (event.key === 'Backspace' && start > 0) {
			let prevCharIndex = start - 1;
			while (prevCharIndex >= 0 && mask[prevCharIndex] !== '9') prevCharIndex--;
			event.preventDefault();
			if (prevCharIndex >= 0) deleteDigitAtMaskIndex(prevCharIndex);
		}

		if (event.key === 'Delete' && start < mask.length) {
			let nextCharIndex = start;
			while (nextCharIndex < mask.length && mask[nextCharIndex] !== '9') nextCharIndex++;
			if (nextCharIndex < mask.length) {
				event.preventDefault();
				deleteDigitAtMaskIndex(nextCharIndex);
			}
		}
	};

	const handleClick = (event: MouseEvent<HTMLInputElement>) => {
		const input = event.currentTarget;
		if (input.selectionStart !== null && input.selectionStart > displayVal.length) {
			input.setSelectionRange(displayVal.length, displayVal.length);
		}
	};

	return {
		inputRef,
		displayVal,
		remainingGuides: getRemainingGuides(displayVal, mask),
		handleChange,
		handleKeyDown,
		handleClick,
	};
}
