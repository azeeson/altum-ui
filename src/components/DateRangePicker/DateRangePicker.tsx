import type {
	DateRangePickerProps,
} from './DateRangePicker.types';
export type {
	DateRangeValue,
	DateRangePickerProps,
} from './DateRangePicker.types';

import React, {forwardRef, useEffect, useId, useState, useCallback} from 'react';
import {MaskedField} from '../MaskedField/MaskedField';
import {Calendar} from '../Calendar/Calendar';
import {MOBILE_MEDIA_QUERY, useMediaQuery} from '../../hooks/useMediaQuery';
import {type DateRangeValue} from '../Calendar/Calendar.utils';
import styles from './DateRangePicker.module.css';
import {cn} from '../../utils/cn';
import {useLocale} from '../LocaleProvider/LocaleProvider';
import {
	formatDateToDigits,
	getCalendarMobileChrome,
	parseDigitsToDate,
	CalendarFieldDropdown,
} from '../DatePicker/DatePicker.utils';

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
 * <DateRangePicker
 *   value={range}
 *   onChange={setRange}
 *   label="Период отчёта"
 * />
 */
export const DateRangePicker = forwardRef<HTMLInputElement, DateRangePickerProps>(
	function DateRangePicker({
		value,
		onChange,
		label,
		startLabel,
		endLabel,
		layout = 'single',
		size = 'md',
		labelPlacement = 'inline',
		className = '',
		disabled = false,
		readOnly = false,
		...rest
	}, ref) {
		const {messages, t} = useLocale();
		const resolvedLabel = label ?? messages.dateRangePicker.label;
		const resolvedStartLabel = startLabel ?? messages.dateRangePicker.start;
		const resolvedEndLabel = endLabel ?? messages.dateRangePicker.end;
		const [isOpen, setIsOpen] = useState(false);
		const [viewDate, setViewDate] = useState(value.end ?? value.start ?? new Date());
		const [singleDigits, setSingleDigits] = useState(formatRangeDisplay(value));
		const [startDigits, setStartDigits] = useState(formatDateToDigits(value.start));
		const [endDigits, setEndDigits] = useState(formatDateToDigits(value.end));
		const fieldId = useId();
		const isInteractive = !disabled && !readOnly;
		const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY);

		const closeDropdown = useCallback(() => setIsOpen(false), []);
		const mobileChrome = getCalendarMobileChrome({
			isMobile,
			closeLabel: t('common.close'),
			onClose: closeDropdown,
		});

		useEffect(() => {
			 
			setSingleDigits(formatRangeDisplay(value));
			setStartDigits(formatDateToDigits(value.start));
			setEndDigits(formatDateToDigits(value.end));
			if (value.end) setViewDate(value.end);
			else if (value.start) setViewDate(value.start);
		}, [value]);

		const handleRangeChange = (range: DateRangeValue) => {
			onChange(range);
			if (range.start && range.end) {
				setIsOpen(false);
			}
		};

		const openOnFocus = () => isInteractive && setIsOpen(true);

		const trigger = layout === 'split' ? (
			<div
				className={cn(
					styles.splitFields,
					size === 'sm' ? styles.sizeSm
						: size === 'lg' ? styles.sizeLg
							: styles.sizeMd,
				)}
			>
				<div className={styles.fieldSlot}>
					<MaskedField
						ref={ref}
						label={resolvedStartLabel}
						size={size}
						labelPlacement={labelPlacement}
						mask='99.99.9999'
						value={startDigits}
						onChange={(digits) => {
							if (readOnly) return;
							setStartDigits(digits);
							const parsed = parseDigitsToDate(digits);
							if (parsed) {
								const nextEnd = value.end && parsed > value.end ? undefined : value.end;
								onChange({
									start: parsed,
									end: nextEnd,
								});
							} else if (!digits) {
								onChange({
									start: undefined,
									end: value.end,
								});
							}
						}}
						onFocus={openOnFocus}
						active={isOpen}
						disabled={disabled}
						readOnly={readOnly}
					/>
				</div>
				<span className={styles.dash} aria-hidden>
					—
				</span>
				<div className={styles.fieldSlot}>
					<MaskedField
						label={resolvedEndLabel}
						size={size}
						labelPlacement={labelPlacement}
						mask='99.99.9999'
						value={endDigits}
						onChange={(digits) => {
							if (readOnly) return;
							setEndDigits(digits);
							const parsed = parseDigitsToDate(digits);
							if (parsed) {
								if (value.start && parsed < value.start) {
									onChange({
										start: parsed,
										end: value.start,
									});
								} else {
									onChange({
										start: value.start,
										end: parsed,
									});
								}
							} else if (!digits) {
								onChange({
									start: value.start,
									end: undefined,
								});
							}
						}}
						onFocus={openOnFocus}
						active={isOpen}
						disabled={disabled}
						readOnly={readOnly}
					/>
				</div>
			</div>
		) : (
			<MaskedField
				ref={ref}
				label={resolvedLabel}
				size={size}
				labelPlacement={labelPlacement}
				mask='99.99.9999 — 99.99.9999'
				value={singleDigits}
				onChange={(digits) => {
					if (readOnly) return;
					setSingleDigits(digits);
					if (!digits) {
						onChange({
							start: undefined,
							end: undefined,
						});
						return;
					}
					const startDigitsPart = digits.slice(0, 8);
					const endDigitsPart = digits.slice(8, 16);
					const parsedStart = startDigitsPart.length === 8
						? parseDigitsToDate(startDigitsPart)
						: undefined;
					const parsedEnd = endDigitsPart.length === 8
						? parseDigitsToDate(endDigitsPart)
						: undefined;
					let nextStart = startDigitsPart.length === 8
						? parsedStart
						: (startDigitsPart.length === 0 ? undefined : value.start);
					let nextEnd = endDigitsPart.length === 8
						? parsedEnd
						: (endDigitsPart.length === 0 ? undefined : value.end);
					if (nextStart && nextEnd && nextEnd < nextStart) {
						[nextStart, nextEnd] = [nextEnd, nextStart];
					}
					if (nextStart !== value.start || nextEnd !== value.end) {
						onChange({
							start: nextStart,
							end: nextEnd,
						});
					}
				}}
				onFocus={openOnFocus}
				active={isOpen}
				disabled={disabled}
				readOnly={readOnly}
				id={fieldId}
			/>
		);

		return (
			<div className={cn(styles.root, className)} {...rest}>
				<Calendar.Provider
					selectionMode='range'
					rangeValue={value}
					onRangeChange={handleRangeChange}
					viewDate={viewDate}
					onViewDateChange={setViewDate}
				>
					<CalendarFieldDropdown
						open={isOpen}
						onClose={closeDropdown}
						onOpen={openOnFocus}
						isMobile={isMobile}
						mobileChrome={mobileChrome}
						trigger={trigger}
					/>
				</Calendar.Provider>
			</div>
		);
	},
);

DateRangePicker.displayName = 'DateRangePicker';
