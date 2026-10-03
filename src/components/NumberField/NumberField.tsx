import {useRef, type ChangeEvent, type FocusEvent} from 'react';
import type {NumberFieldProps} from './NumberField.types';
export type {NumberFieldProps} from './NumberField.types';

import styles from './NumberField.module.css';
import {TextField, FieldBaseButton} from '../TextField/TextField';
import {IconMinus} from '../../icons/icons/IconMinus';
import {IconPlus} from '../../icons/icons/IconPlus';
import {clamp} from '../../core/utils/math';
import {uRef} from '../../core/utils/bundle';
import {cn} from '../../core/utils/cn';
import {useLocale} from '../../locales/localeContext';
import {ruSlice as ru_numberField} from '../../locales/slices/numberField.ru';

const localeFallback = {
	numberField: ru_numberField,
};

/**
 * Числовое поле с кнопками ± и clamp по min/max.
 * Отдельного черновика строки нет: в `onChange` уходит только число (`valueAsNumber`).
 *
 * @component
 * @example
 * <NumberField label="Количество" value={qty} min={1} max={99} onChange={setQty} />
 */
export function NumberField({
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
	inputRef,
	...props
}: NumberFieldProps) {
	const {t} = useLocale(localeFallback);
	const fieldRef = useRef<HTMLInputElement>(null);
	const locked = !!readOnly || !!disabled;
	const limit = (n: number) => clamp(n, min ?? -Infinity, max ?? Infinity);
	const currentVal = value ?? min ?? 0;
	const atMin = value !== undefined && min !== undefined && currentVal <= min;
	const atMax = value !== undefined && max !== undefined && currentVal >= max;

	const nudge = (dir: 1 | -1) => {
		const node = fieldRef.current;
		if (!node || locked || (dir > 0 ? atMax : atMin)) return;
		if (dir > 0) node.stepUp();
		else node.stepDown();
		const parsed = node.valueAsNumber;
		onChange?.(Number.isNaN(parsed) ? undefined : parsed);
	};
	const decrement = () => nudge(-1);
	const increment = () => nudge(1);
	const clearValue = () => {
		onChange?.(undefined);
		onClear?.();
	};

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		if (locked) return;
		const raw = event.target.value;
		if (raw === '') {
			onChange?.(undefined);
			return;
		}
		const parsed = event.target.valueAsNumber;
		if (!Number.isNaN(parsed)) onChange?.(limit(parsed));
	};

	const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
		if (!locked && value !== undefined) onChange?.(limit(value));
		onBlur?.(event);
	};

	return (
		<TextField
			inputRef={uRef(inputRef, fieldRef)}
			{...props}
			type='number'
			className={cn(styles.numberInput, className)}
			min={min}
			max={max}
			step={step}
			disabled={disabled}
			readOnly={readOnly}
			value={value}
			onChange={handleChange}
			onBlur={handleBlur}
			onClear={onClear ? clearValue : undefined}
			clearLabel={clearLabel}
			postfix={iconEnd || (!locked ? (
				<>
					<FieldBaseButton
						aria-label={t('numberField.decrement')}
						disabled={atMin}
						onClick={decrement}
						icon={<IconMinus />}
					/>
					<FieldBaseButton
						aria-label={t('numberField.increment')}
						disabled={atMax}
						onClick={increment}
						icon={<IconPlus />}
					/>
				</>
			) : undefined)}
		/>
	);
}
