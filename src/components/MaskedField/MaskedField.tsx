import type {ChangeEvent, KeyboardEvent, MouseEvent} from 'react';
import type {MaskedFieldProps} from './MaskedField.types';
export type {MaskedFieldProps} from './MaskedField.types';

import {TextField, fieldOverlayClassName} from '../TextField/TextField';
import styles from './MaskedField.module.css';
import {
	NON_DIGITS,
	getFormattedValue,
	getRemainingGuides,
	getStaticDigitsPrefix,
} from './MaskedField.utils';

export {
	getFormattedValue,
	getRemainingGuides,
	getStaticDigitsPrefix,
} from './MaskedField.utils';

/**
 * Текстовое поле с маской ввода: хранит только цифры, отображает форматированное значение.
 *
 * @component
 * @example
 * <MaskedField label="Телефон" mask="+7 (999) 999-99-99" value={phone} onChange={setPhone} />
 */
export function MaskedField({
	mask,
	value,
	onChange,
	onClear,
	clearLabel,
	onKeyDown,
	disabled,
	readOnly,
	maskAsPlaceholder = false,
	placeholder: placeholderProp,
	onClick,
	inputRef,
	...props
}: MaskedFieldProps) {
	const locked = !!disabled || !!readOnly;
	const storedDigits = value.replace(NON_DIGITS, '');
	const display = storedDigits ? getFormattedValue(value, mask) : '';
	const guides = getRemainingGuides(display, mask);
	const slots = mask.split('9').length - 1;

	const commit = (
		input: HTMLInputElement,
		digits: string,
		caret: number,
		formatted = getFormattedValue(digits, mask),
	) => {
		onChange(digits);
		input.value = digits ? formatted : '';
		input.setSelectionRange(caret, caret);
	};

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		if (locked) return;
		const input = event.target;
		const start = input.selectionStart || 0;
		const raw = input.value;
		let clean = raw.replace(NON_DIGITS, '');
		const prefix = getStaticDigitsPrefix(mask);
		if (prefix && clean.startsWith(prefix)) clean = clean.slice(prefix.length);
		const digits = clean.slice(0, slots);
		const formatted = getFormattedValue(digits, mask);
		commit(input, digits, start >= raw.length - 1 ? formatted.length : start, formatted);
	};

	const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
		onKeyDown?.(event);
		if (locked || event.defaultPrevented) return;
		const input = event.currentTarget;
		const start = input.selectionStart;
		const end = input.selectionEnd;
		if (start === null || start !== end) return;

		const dir = event.key === 'Backspace' ? -1 : event.key === 'Delete' ? 1 : 0;
		if (!dir || (dir < 0 && start === 0) || (dir > 0 && start >= mask.length)) return;

		let index = dir < 0 ? start - 1 : start;
		while (index >= 0 && index < mask.length && mask[index] !== '9') index += dir;
		if (dir < 0) event.preventDefault();
		if (index < 0 || index >= mask.length) return;
		if (dir > 0) event.preventDefault();

		let count = 0;
		for (let i = 0; i < index; i += 1) if (mask[i] === '9') count += 1;
		const next = storedDigits.slice(0, count) + storedDigits.slice(count + 1);
		commit(input, next, getFormattedValue(next.slice(0, count), mask).length);
	};

	const handleClick = (event: MouseEvent<HTMLInputElement>) => {
		onClick?.(event);
		if (event.defaultPrevented) return;
		const input = event.currentTarget;
		if (input.selectionStart !== null && input.selectionStart > display.length) {
			input.setSelectionRange(display.length, display.length);
		}
	};

	return (
		<TextField
			{...props}
			inputRef={inputRef}
			type='text'
			value={display}
			disabled={disabled}
			readOnly={readOnly}
			onChange={handleChange}
			onKeyDown={handleKeyDown}
			onClick={handleClick}
			placeholder={maskAsPlaceholder ? getRemainingGuides('', mask) : placeholderProp}
			onClear={onClear ? () => {
				onChange('');
				onClear();
			} : undefined}
			clearLabel={clearLabel}
			controlOverlay={guides.length > 0 ? (
				<div
					className={fieldOverlayClassName()}
					aria-hidden='true'
					data-testid='masked-overlay'
				>
					<span className={styles.guide} data-fill={display}>
						{guides}
					</span>
				</div>
			) : null}
		/>
	);
}
