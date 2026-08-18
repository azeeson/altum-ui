import type {
	NumberFieldProps,
} from './NumberField.types';
export type {
	NumberFieldProps,
} from './NumberField.types';

import React, {forwardRef, useState} from 'react';
import styles from './NumberField.module.css';
import {TextField} from '../TextField/TextField';
import {ButtonGroup} from '../ButtonGroup/ButtonGroup';
import {IconMinus} from '../../icons/icons/IconMinus';
import {IconPlus} from '../../icons/icons/IconPlus';
import {getFormControlState} from '../../utils/formControl';
import {cn} from '../../utils/cn';
import {useLocale} from '../LocaleProvider/LocaleProvider';

function clampNumber(value: number, min?: number, max?: number): number {
	let next = value;
	if (min !== undefined) next = Math.max(min, next);
	if (max !== undefined) next = Math.min(max, next);
	return next;
}

/**
 * Числовое поле с кнопками ± и clamp по min/max.
 *
 * @component
 * @example
 * <NumberField
 *   label="Количество"
 *   value={qty}
 *   min={1}
 *   max={99}
 *   onChange={setQty}
 *   onClear={() => setQty(undefined)}
 * />
 */
export const NumberField = forwardRef<HTMLInputElement, NumberFieldProps>(function NumberField(
	{
		value,
		min,
		max,
		step = 1,
		onChange,
		onClear,
		onBlur,
		clearLabel,
		postfix: iconEnd,
		disabled,
		readOnly,
		size = 'md',
		wrapperClassName = '',
		className,
		...props
	},
	ref,
) {
	const {t} = useLocale();
	const [draft, setDraft] = useState<string | null>(null);
	const displayValue = value !== undefined ? clampNumber(value, min, max) : undefined;
	const shown = draft !== null
		? draft
		: (displayValue !== undefined ? String(displayValue) : '');
	const currentVal = displayValue ?? min ?? 0;
	const {isReadOnly} = getFormControlState({
		disabled,
		readOnly
	});
	const atMin = displayValue !== undefined && min !== undefined && currentVal <= min;
	const atMax = displayValue !== undefined && max !== undefined && currentVal >= max;

	const handleIncrement = () => {
		if (isReadOnly || disabled || atMax) return;
		if (displayValue === undefined) {
			onChange?.(clampNumber(min ?? step, min, max));
			return;
		}
		onChange?.(clampNumber(displayValue + step, min, max));
	};

	const handleDecrement = () => {
		if (isReadOnly || disabled || atMin) return;
		if (displayValue === undefined) {
			onChange?.(clampNumber(min ?? 0, min, max));
			return;
		}
		onChange?.(clampNumber(displayValue - step, min, max));
	};

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (isReadOnly || disabled) return;
		const raw = event.target.value;
		setDraft(raw);
		if (raw === '' || raw === '-' || raw === '.' || raw === '-.') {
			onChange?.(undefined);
			return;
		}
		if (raw.endsWith('.') || raw.endsWith('-')) return;
		const val = parseFloat(raw);
		if (!Number.isNaN(val)) {
			onChange?.(clampNumber(val, min, max));
		}
	};

	const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
		setDraft(null);
		if (!isReadOnly && !disabled) {
			const raw = event.target.value.trim();
			if (raw !== '' && raw !== '-' && raw !== '.' && raw !== '-.') {
				const val = parseFloat(raw);
				if (!Number.isNaN(val)) {
					const clamped = clampNumber(val, min, max);
					if (clamped !== value) {
						onChange?.(clamped);
					}
				}
			}
		}
		onBlur?.(event);
	};

	const handleClear = () => {
		onChange?.(undefined);
		onClear?.();
	};

	const showSpinButtons = !disabled && !isReadOnly && !iconEnd;

	const internalIconEnd = showSpinButtons ? (
		<span className={styles.spinSlot}>
			<ButtonGroup
				size={size}
				focusable={false}
				variant='ghost'
				borderless
				className={styles.spinControls}
				aria-label={t('numberField.group')}
			>
				<ButtonGroup.Item
					icon={<IconMinus />}
					aria-label={t('numberField.decrement')}
					disabled={atMin}
					onClick={handleDecrement}
				/>
				<ButtonGroup.Item
					icon={<IconPlus />}
					aria-label={t('numberField.increment')}
					disabled={atMax}
					onClick={handleIncrement}
				/>
			</ButtonGroup>
		</span>
	) : null;

	return (
		<TextField
			ref={ref}
			{...props}
			size={size}
			type='number'
			className={cn(styles.numberInput, className)}
			min={min}
			max={max}
			step={step}
			disabled={disabled}
			readOnly={readOnly}
			value={shown}
			onChange={handleChange}
			onBlur={handleBlur}
			onClear={onClear ? handleClear : undefined}
			clearLabel={clearLabel}
			postfix={iconEnd || internalIconEnd || undefined}
			wrapperClassName={cn(
				showSpinButtons ? styles.withSpinButtons : '',
				showSpinButtons && size === 'sm' ? styles.spinSizeSm : '',
				wrapperClassName,
			)}
		/>
	);
});

NumberField.displayName = 'NumberField';
