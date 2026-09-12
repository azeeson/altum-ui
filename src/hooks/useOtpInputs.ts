import {useCallback, useRef, useState, type ClipboardEvent, type KeyboardEvent} from 'react';

function sanitize(raw: string, length: number, numeric: boolean): string {
	const cleaned = numeric ? raw.replace(/\D/g, '') : raw.replace(/\s/g, '');
	return cleaned.slice(0, length);
}

/**
 * OTP/PIN: sanitize, смена ячейки, Backspace, paste, фокус.
 *
 * @returns Значение, массив символов и обработчики ячеек.
 */
export function useOtpInputs(options: {
	length: number;
	numeric: boolean;
	value?: string;
	defaultValue: string;
	disabled: boolean;
	onChange?: (value: string) => void;
	onComplete?: (value: string) => void;
}) {
	const {length, numeric, disabled, onChange, onComplete} = options;
	const isControlled = options.value !== undefined;
	const [uncontrolled, setUncontrolled] = useState(() =>
		sanitize(options.defaultValue, length, numeric));
	const value = sanitize(isControlled ? options.value! : uncontrolled, length, numeric);
	const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

	const setValue = useCallback((next: string) => {
		const clean = sanitize(next, length, numeric);
		if (!isControlled) setUncontrolled(clean);
		onChange?.(clean);
		if (clean.length === length) onComplete?.(clean);
	}, [
		isControlled,
		length,
		numeric,
		onChange,
		onComplete
	]);

	const chars = Array.from({length}, (_, index) => value[index] ?? '');

	const focusAt = (index: number) => {
		const el = inputsRef.current[Math.max(0, Math.min(length - 1, index))];
		el?.focus();
		el?.select();
	};

	const handleChange = (index: number, raw: string) => {
		if (disabled) return;
		const incoming = sanitize(raw, length, numeric);
		if (!incoming) {
			const next = chars.slice();
			next[index] = '';
			setValue(next.join(''));
			return;
		}
		if (incoming.length > 1) {
			const merged = (value.slice(0, index) + incoming).slice(0, length);
			setValue(merged);
			focusAt(Math.min(length - 1, index + incoming.length));
			return;
		}
		const next = chars.slice();
		next[index] = incoming;
		setValue(next.join(''));
		if (index < length - 1) focusAt(index + 1);
	};

	const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
		if (disabled) return;
		if (event.key === 'Backspace') {
			event.preventDefault();
			if (chars[index]) {
				const next = chars.slice();
				next[index] = '';
				setValue(next.join(''));
			} else if (index > 0) {
				const next = chars.slice();
				next[index - 1] = '';
				setValue(next.join(''));
				focusAt(index - 1);
			}
			return;
		}
		if (event.key === 'ArrowLeft') {
			event.preventDefault();
			focusAt(index - 1);
		}
		if (event.key === 'ArrowRight') {
			event.preventDefault();
			focusAt(index + 1);
		}
	};

	const handlePaste = (index: number, event: ClipboardEvent<HTMLInputElement>) => {
		event.preventDefault();
		const clean = sanitize(event.clipboardData.getData('text'), length, numeric);
		if (!clean) return;
		const merged = (value.slice(0, index) + clean).slice(0, length);
		setValue(merged);
		focusAt(Math.min(length - 1, index + clean.length - 1));
	};

	return {
		value,
		chars,
		inputsRef,
		handleChange,
		handleKeyDown,
		handlePaste,
	};
}
