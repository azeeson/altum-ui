import type {DateRangeFieldProps} from './DateRangeField.types';
export type {
	DateRangeValue,
	DateRangeFieldProps,
} from './DateRangeField.types';

import {forwardRef, useEffect, useId, useState} from 'react';
import {MaskedField} from '../MaskedField/MaskedField';
import {Calendar} from '../Calendar/Calendar';
import {type DateRangeValue} from '../Calendar/Calendar.utils';
import styles from './DateRangeField.module.css';
import {cn} from '../../utils/cn';
import {useLocale} from '../../locales/localeContext';
import {
	formatDateToDigits,
	parseDigitsToDate,
	CalendarFieldDropdown,
	useCalendarPopupField,
} from '../DateField/DateField.utils';

const formatRangeDisplay = (range: DateRangeValue): string => {
	if (!range.start && !range.end) return '';
	if (range.start && !range.end) return formatDateToDigits(range.start);
	if (range.start && range.end) {
		return `${formatDateToDigits(range.start)}${formatDateToDigits(range.end)}`;
	}
	return '';
};

/**
 * Выбор диапазона дат: маскированное поле + календарь в режиме range.
 *
 * @component
 * @example
 * <DateRangeField value={range} onChange={setRange} label="Период отчёта" />
 */
export const DateRangeField = forwardRef<HTMLInputElement, DateRangeFieldProps>(
	function DateRangeField({
		value,
		onChange,
		label,
		startLabel,
		endLabel,
		layout = 'single',
		size = 'md',
		width = 'md',
		labelPlacement = 'inline',
		className = '',
		disabled = false,
		readOnly = false,
		error,
		helperText,
		prefix,
		postfix,
		onClear,
		clearLabel,
		...rest
	}, ref) {
		const {messages} = useLocale();
		const {
			open,
			setOpen,
			close,
			openPopup,
			isMobile,
			mobileChrome,
		} = useCalendarPopupField({
			disabled,
			readOnly
		});
		const [viewDate, setViewDate] = useState(value.end ?? value.start ?? new Date());
		const [singleDigits, setSingleDigits] = useState(formatRangeDisplay(value));
		const [startDigits, setStartDigits] = useState(formatDateToDigits(value.start));
		const [endDigits, setEndDigits] = useState(formatDateToDigits(value.end));
		const fieldId = useId();

		useEffect(() => {
			setSingleDigits(formatRangeDisplay(value));
			setStartDigits(formatDateToDigits(value.start));
			setEndDigits(formatDateToDigits(value.end));
			if (value.end) setViewDate(value.end);
			else if (value.start) setViewDate(value.start);
		}, [value]);

		const commitRangeDigits = (digits: string, bound: 'start' | 'end' | 'range') => {
			if (readOnly) return;
			if (bound === 'range') {
				setSingleDigits(digits);
				if (!digits) {
					onChange({
						start: undefined,
						end: undefined
					});
					return;
				}
				const startPart = digits.slice(0, 8);
				const endPart = digits.slice(8, 16);
				let nextStart = startPart.length === 8
					? parseDigitsToDate(startPart)
					: (startPart.length === 0 ? undefined : value.start);
				let nextEnd = endPart.length === 8
					? parseDigitsToDate(endPart)
					: (endPart.length === 0 ? undefined : value.end);
				if (nextStart && nextEnd && nextEnd < nextStart) {
					[nextStart, nextEnd] = [nextEnd, nextStart];
				}
				if (nextStart !== value.start || nextEnd !== value.end) {
					onChange({
						start: nextStart,
						end: nextEnd
					});
				}
				return;
			}
			if (bound === 'start') setStartDigits(digits);
			else setEndDigits(digits);
			const parsed = parseDigitsToDate(digits);
			if (parsed) {
				onChange(bound === 'start'
					? {
						start: parsed,
						end: value.end && parsed > value.end ? undefined : value.end,
					}
					: (value.start && parsed < value.start
						? {
							start: parsed,
							end: value.start
						}
						: {
							start: value.start,
							end: parsed
						}));
				return;
			}
			if (!digits) {
				onChange(bound === 'start'
					? {
						start: undefined,
						end: value.end
					}
					: {
						start: value.start,
						end: undefined
					});
			}
		};

		const trigger = layout === 'split' ? (
			<div className={styles.splitFields} data-size={size}>
				<div className={styles.fieldSlot}>
					<MaskedField
						ref={ref}
						label={startLabel ?? messages.dateRangeField.start}
						size={size}
						labelPlacement={labelPlacement}
						mask='99.99.9999'
						type='text'
						value={startDigits}
						onChange={(digits) => commitRangeDigits(digits, 'start')}
						onFocus={openPopup}
						active={open}
						disabled={disabled}
						readOnly={readOnly}
					/>
				</div>
				<span className={styles.dash} aria-hidden>
					—
				</span>
				<div className={styles.fieldSlot}>
					<MaskedField
						label={endLabel ?? messages.dateRangeField.end}
						size={size}
						labelPlacement={labelPlacement}
						mask='99.99.9999'
						type='text'
						value={endDigits}
						onChange={(digits) => commitRangeDigits(digits, 'end')}
						onFocus={openPopup}
						active={open}
						disabled={disabled}
						readOnly={readOnly}
					/>
				</div>
			</div>
		) : (
			<MaskedField
				ref={ref}
				label={label ?? messages.dateRangeField.label}
				size={size}
				width={width}
				labelPlacement={labelPlacement}
				mask='99.99.9999 — 99.99.9999'
				type='text'
				value={singleDigits}
				error={error}
				helperText={helperText}
				prefix={prefix}
				postfix={postfix}
				onClear={onClear}
				clearLabel={clearLabel}
				onChange={(digits) => commitRangeDigits(digits, 'range')}
				onFocus={openPopup}
				active={open}
				disabled={disabled}
				readOnly={readOnly}
				id={fieldId}
			/>
		);

		return (
			<div
				className={cn(
					styles.root,
					layout === 'split' ? styles.layoutSplit : '',
					width === 'full' ? styles.widthFull : '',
					className,
				)}
				{...rest}
			>
				<Calendar.Provider
					selectionMode='range'
					value={value}
					onChange={(next) => {
						if (next instanceof Date) return;
						onChange(next);
						if (next.start && next.end) setOpen(false);
					}}
					viewDate={viewDate}
					onViewDateChange={setViewDate}
				>
					<CalendarFieldDropdown
						open={open}
						onClose={close}
						onOpen={openPopup}
						isMobile={isMobile}
						mobileChrome={mobileChrome}
						trigger={trigger}
					/>
				</Calendar.Provider>
			</div>
		);
	},
);

DateRangeField.displayName = 'DateRangeField';
