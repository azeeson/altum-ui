import type {TimeFieldProps} from './TimeField.types';
export type {TimeFieldProps} from './TimeField.types';

import {forwardRef} from 'react';
import styles from './TimeField.module.css';
import {MaskedField} from '../MaskedField/MaskedField';
import {FieldBaseIcon} from '../../base/FieldBase';
import {IconClock} from '../../icons/icons/IconClock';
import {cn} from '../../utils/cn';
import {FieldPopupDropdown, useMaskedPopupField} from '../../base/FieldPopup';
import {commitMaskedValue} from '../../utils/commitMaskedValue';
import {WheelTimePicker, type TimeValue} from '../WheelTimePicker';

const pad2 = (n: number) => (n < 10 ? `0${n}` : `${n}`);

const parseDigitsToTime = (digits: string): string | undefined => {
	if (digits.length !== 4) return undefined;
	const h = parseInt(digits.slice(0, 2), 10);
	const m = parseInt(digits.slice(2, 4), 10);
	if (h < 0 || h > 23 || m < 0 || m > 59) return undefined;
	return `${digits.slice(0, 2)}:${digits.slice(2, 4)}`;
};

const parseTime = (value: string): TimeValue | null => {
	if (!value) return null;
	const [hoursPart, minutesPart] = value.split(':');
	const hours = Number(hoursPart);
	const minutes = Number(minutesPart);
	if (!Number.isInteger(hours) || !Number.isInteger(minutes)) return null;
	if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;
	return {
		hours,
		minutes
	};
};

const formatTime = ({hours, minutes}: TimeValue): string => (
	`${pad2(hours)}:${pad2(minutes)}`
);

/**
 * Поле времени (маска HH:MM) с выпадающими барабанами часов и минут.
 * Значение — строка вида `09:30`.
 *
 * @component
 * @example
 * <TimeField label="Начало" value={time} onChange={setTime} />
 */
export const TimeField = forwardRef<HTMLInputElement, TimeFieldProps>(
	function TimeField({
		value,
		onChange,
		label,
		className = '',
		disabled = false,
		readOnly = false,
		onClear,
		clearLabel,
		prefix,
		...props
	}, ref) {
		const {
			open,
			close,
			openPopup,
			digits,
			setDigits,
		} = useMaskedPopupField({
			disabled,
			readOnly,
			digitsFromValue: value.replace(/\D/g, ''),
		});

		return (
			<FieldPopupDropdown
				open={open}
				onOpen={openPopup}
				onClose={close}
				align='right'
				mobileChrome={{mobileTitle: label}}
				trigger={(
					<MaskedField
						{...props}
						ref={ref}
						label={label}
						mask='99:99'
						value={digits}
						className={cn(styles.field, className)}
						onChange={(next) => {
							if (readOnly) return;
							setDigits(next);
							commitMaskedValue(next, parseDigitsToTime, (time) => onChange(time ?? ''));
						}}
						onFocus={openPopup}
						active={open}
						type='text'
						disabled={disabled}
						readOnly={readOnly}
						prefix={prefix ?? (
							<FieldBaseIcon>
								<IconClock />
							</FieldBaseIcon>
						)}
						onClear={onClear ? () => {
							setDigits('');
							onChange('');
							onClear();
						} : undefined}
						clearLabel={clearLabel}
					/>
				)}
			>
				<WheelTimePicker
					active={open}
					value={parseTime(value)}
					onChange={(next) => onChange(formatTime(next))}
				/>
			</FieldPopupDropdown>
		);
	},
);

TimeField.displayName = 'TimeField';
