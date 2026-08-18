import type {PinInputProps} from './PinInput.types';
export type {
	PinInputProps,
} from './PinInput.types';

import {forwardRef, useCallback, useId, useRef, useState} from 'react';
import styles from './PinInput.module.css';
import {cn} from '../../utils/cn';
import {useLocale} from '../LocaleProvider/LocaleProvider';
import {FieldBase, fieldSurfaceClassName} from '../../base/FieldBase';

function sanitize(raw: string, length: number, numeric: boolean): string {
	const cleaned = numeric ? raw.replace(/\D/g, '') : raw.replace(/\s/g, '');
	return cleaned.slice(0, length);
}

/**
 * Поле ввода PIN / OTP (2FA, код из SMS).
 *
 * @component
 * @example
 * <PinInput length={6} value={code} onChange={setCode} onComplete={verify} />
 */
export const PinInput = forwardRef<HTMLDivElement, PinInputProps>(function PinInput(
	{
		length = 6,
		size = 'md',
		value: controlledValue,
		defaultValue = '',
		onChange,
		onComplete,
		numeric = true,
		disabled = false,
		masked = false,
		autoFocus = false,
		'aria-label': ariaLabel,
		className,
		style,
		error,
		label,
		helperText,
		name,
		labelPlacement = 'none',
		width = 'full',
		...rest
	},
	ref,
) {
	const {t} = useLocale();
	const isControlled = controlledValue !== undefined;
	const [uncontrolled, setUncontrolled] = useState(() =>
		sanitize(defaultValue, length, numeric),);
	const value = sanitize(isControlled ? controlledValue! : uncontrolled, length, numeric);
	const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
	const groupId = useId();

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
		const joined = next.join('');
		setValue(joined);
		if (index < length - 1) focusAt(index + 1);
	};

	const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
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

	const handlePaste = (index: number, event: React.ClipboardEvent<HTMLInputElement>) => {
		event.preventDefault();
		const text = event.clipboardData.getData('text');
		const clean = sanitize(text, length, numeric);
		if (!clean) return;
		const merged = (value.slice(0, index) + clean).slice(0, length);
		setValue(merged);
		focusAt(Math.min(length - 1, index + clean.length - 1));
	};

	const hasError = !!error;
	const sizeClass =
		size === 'sm' ? styles.sm
			: size === 'lg' ? styles.lg
				: styles.md;

	return (
		<FieldBase.Layout
			ref={ref}
			label={label ?? ''}
			size={size}
			width={width}
			labelPlacement={labelPlacement}
			error={error}
			helperText={helperText}
			disabled={disabled}
			hasValue={value.length > 0}
			className={cn(styles.root, sizeClass, className)}
			id={`${groupId}-0`}
			rootProps={{
				style,
				...rest,
			}}
			control={(
				<div
					className={cn(styles.group, hasError ? styles.groupError : '')}
					role='group'
					aria-label={ariaLabel ?? label ?? t('pinInput.ariaLabel')}
					id={groupId}
				>
					{name && (
						<input
							type='hidden'
							name={name}
							value={value}
						/>
					)}
					{chars.map((char, index) => (
						<input
							key={index}
							id={index === 0 ? `${groupId}-0` : undefined}
							ref={(node) => {
								inputsRef.current[index] = node;
							}}
							className={cn(fieldSurfaceClassName(), styles.cell)}
							type={masked ? 'password' : 'text'}
							inputMode={numeric ? 'numeric' : 'text'}
							autoComplete={index === 0 ? 'one-time-code' : 'off'}
							maxLength={length}
							value={char}
							disabled={disabled}
							aria-invalid={hasError || undefined}
							aria-label={t('pinInput.digit', {index: index + 1})}
							autoFocus={autoFocus && index === 0}
							onChange={(event) => handleChange(index, event.target.value)}
							onKeyDown={(event) => handleKeyDown(index, event)}
							onPaste={(event) => handlePaste(index, event)}
							onFocus={(event) => event.currentTarget.select()}
						/>
					))}
				</div>
			)}
		/>
	);
});

PinInput.displayName = 'PinInput';
