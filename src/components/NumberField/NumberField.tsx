import type {NumberFieldProps} from './NumberField.types';
export type {NumberFieldProps} from './NumberField.types';

import {forwardRef, useState, type ChangeEvent, type FocusEvent} from 'react';
import styles from './NumberField.module.css';
import {TextField} from '../TextField/TextField';
import {FieldBaseButton} from '../../base/FieldBase';
import {IconMinus} from '../../icons/icons/IconMinus';
import {IconPlus} from '../../icons/icons/IconPlus';
import {getFormControlState} from '../../utils/formControl';
import {clamp} from '../../utils/clamp';
import {cn} from '../../utils/cn';
import {useLocale} from '../../locales/localeContext';

const DRAFT = /^(?:|-|\.|-\.)$/;

/**
 * Числовое поле с кнопками ± и clamp по min/max.
 *
 * @component
 * @example
 * <NumberField label="Количество" value={qty} min={1} max={99} onChange={setQty} />
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
		className,
		...props
	},
	ref,
) {
	const {t} = useLocale();
	const [draft, setDraft] = useState<string | null>(null);
	const limit = (n: number) => clamp(n, min ?? -Infinity, max ?? Infinity);
	const displayValue = value !== undefined ? limit(value) : undefined;
	const shown = draft !== null ? draft : (displayValue !== undefined ? String(displayValue) : '');
	const currentVal = displayValue ?? min ?? 0;
	const {isReadOnly} = getFormControlState({
		disabled,
		readOnly
	});
	const atMin = displayValue !== undefined && min !== undefined && currentVal <= min;
	const atMax = displayValue !== undefined && max !== undefined && currentVal >= max;
	const locked = isReadOnly || disabled;

	const stepBy = (dir: 1 | -1) => {
		if (locked || (dir > 0 ? atMax : atMin)) return;
		onChange?.(limit(
			displayValue === undefined
				? (dir > 0 ? (min ?? step) : (min ?? 0))
				: displayValue + dir * step,
		));
	};

	const commit = (raw: string, fromBlur = false) => {
		if (locked) return;
		const trimmed = raw.trim();
		if (DRAFT.test(trimmed)) {
			if (!fromBlur) onChange?.(undefined);
			return;
		}
		if (!fromBlur && (raw.endsWith('.') || raw.endsWith('-'))) return;
		const parsed = parseFloat(raw);
		if (Number.isNaN(parsed)) return;
		const next = limit(parsed);
		if (!fromBlur || next !== value) onChange?.(next);
	};

	return (
		<TextField
			ref={ref}
			{...props}
			type='number'
			className={cn(styles.numberInput, className)}
			min={min}
			max={max}
			step={step}
			disabled={disabled}
			readOnly={readOnly}
			value={shown}
			onChange={(event: ChangeEvent<HTMLInputElement>) => {
				setDraft(event.target.value);
				commit(event.target.value);
			}}
			onBlur={(event: FocusEvent<HTMLInputElement>) => {
				setDraft(null);
				commit(event.target.value, true);
				onBlur?.(event);
			}}
			onClear={onClear ? () => {
				onChange?.(undefined);
				onClear();
			} : undefined}
			clearLabel={clearLabel}
			postfix={iconEnd || (!locked ? (
				<>
					<FieldBaseButton
						aria-label={t('numberField.decrement')}
						disabled={atMin}
						onClick={() => stepBy(-1)}
						icon={<IconMinus />}
					/>
					<FieldBaseButton
						aria-label={t('numberField.increment')}
						disabled={atMax}
						onClick={() => stepBy(1)}
						icon={<IconPlus />}
					/>
				</>
			) : undefined)}
		/>
	);
});

NumberField.displayName = 'NumberField';
