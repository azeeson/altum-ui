import type {
	DatePickerProps,
} from './DatePicker.types';
export type {
	DatePickerProps,
} from './DatePicker.types';

import React, {forwardRef, useState, useEffect, useId, useCallback} from 'react';
import {MaskedField} from '../MaskedField/MaskedField';
import {Calendar} from '../Calendar/Calendar';
import {FieldBase} from '../../base/FieldBase';
import {IconCalendar} from '../../icons/icons/IconCalendar';
import {MOBILE_MEDIA_QUERY, useMediaQuery} from '../../hooks/useMediaQuery';
import {useLocale} from '../LocaleProvider/LocaleProvider';
import {
	formatDateToDigits,
	getCalendarMobileChrome,
	parseDigitsToDate,
	CalendarFieldDropdown,
} from './DatePicker.utils';
import {cn} from '../../utils/cn';
import {composeEventHandlers} from '../../utils/composeEvents';

/**
 * Поле даты с маской ввода и выпадающим календарём; на мобильных — Sheet.
 *
 * @component
 * @example
 * <DatePicker
 *   label="Дата рождения"
 *   value={date}
 *   onChange={setDate}
 *   onClear={() => {}}
 * />
 */
export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(function DatePicker({
	value,
	onChange,
	label,
	size = 'md',
	width,
	className = '',
	labelPlacement,
	maskAsPlaceholder,
	disabled = false,
	readOnly = false,
	error,
	prefix,
	postfix,
	onClear,
	clearLabel,
	id: providedId,
	onFocus,
	...rest
}, ref) {
	const {t} = useLocale();
	const [isOpen, setIsOpen] = useState(false);
	const [inputValue, setInputValue] = useState(formatDateToDigits(value));
	const [viewDate, setViewDate] = useState(value ?? new Date());
	const generatedId = useId();
	const fieldId = providedId || generatedId;
	const isInteractive = !disabled && !readOnly;
	const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY);

	const closeDropdown = useCallback(() => setIsOpen(false), []);
	const mobileChrome = getCalendarMobileChrome({
		isMobile,
		closeLabel: t('common.close'),
		onClose: closeDropdown,
	});

	useEffect(() => {
		setInputValue(formatDateToDigits(value));
		if (value) {
			setViewDate(value);
		}
	}, [value]);

	const handleInputChange = (val: string) => {
		if (readOnly) return;
		setInputValue(val);
		const parsed = parseDigitsToDate(val);
		if (parsed) {
			onChange(parsed);
		} else if (!val) {
			// Сбрасывать родителя только когда маска пуста — незавершённые правки оставляют локальные цифры
			onChange(undefined);
		}
	};

	const handleClear = () => {
		setInputValue('');
		onChange(undefined);
		onClear?.();
	};

	const handleCalendarChange = (date: Date | undefined) => {
		onChange(date);
		setIsOpen(false);
	};

	const trigger = (
		<MaskedField
			ref={ref}
			label={label}
			size={size}
			width={width}
			labelPlacement={labelPlacement}
			maskAsPlaceholder={maskAsPlaceholder}
			mask='99.99.9999'
			value={inputValue}
			onChange={handleInputChange}
			active={isOpen}
			className={cn(className)}
			disabled={disabled}
			readOnly={readOnly}
			error={error}
			prefix={prefix ?? (
				<FieldBase.Icon>
					<IconCalendar />
				</FieldBase.Icon>
			)}
			postfix={postfix}
			id={fieldId}
			onClear={onClear ? handleClear : undefined}
			clearLabel={clearLabel}
			{...rest}
			onFocus={composeEventHandlers(onFocus, () => {
				if (isInteractive) setIsOpen(true);
			})}
		/>
	);

	return (
		<Calendar.Provider
			value={value}
			viewDate={viewDate}
			onViewDateChange={setViewDate}
			onChange={handleCalendarChange}
		>
			<CalendarFieldDropdown
				open={isOpen}
				onClose={closeDropdown}
				onOpen={() => isInteractive && setIsOpen(true)}
				isMobile={isMobile}
				mobileChrome={mobileChrome}
				trigger={trigger}
				contentPadding='md'
			/>
		</Calendar.Provider>
	);
});

DatePicker.displayName = 'DatePicker';
