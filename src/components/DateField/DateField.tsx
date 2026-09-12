import type {DateFieldProps} from './DateField.types';
export type {DateFieldProps} from './DateField.types';

import {forwardRef, useEffect, useState} from 'react';
import {MaskedField} from '../MaskedField/MaskedField';
import {Calendar} from '../Calendar/Calendar';
import {FieldBaseIcon} from '../../base/FieldBase';
import {IconCalendar} from '../../icons/icons/IconCalendar';
import {
	formatDateToDigits,
	parseDigitsToDate,
	CalendarFieldDropdown,
	useCalendarPopupField,
} from './DateField.utils';
import {commitMaskedValue} from '../../utils/commitMaskedValue';
import {composeEventHandlers} from '../../utils/composeEvents';

/**
 * Поле даты с маской ввода и выпадающим календарём; на мобильных — Sheet.
 *
 * @component
 * @example
 * <DateField label="Дата рождения" value={date} onChange={setDate} />
 */
export const DateField = forwardRef<HTMLInputElement, DateFieldProps>(function DateField({
	value,
	onChange,
	label,
	width = 'md',
	disabled = false,
	readOnly = false,
	prefix,
	onClear,
	onFocus,
	...rest
}, ref) {
	const {
		open,
		setOpen,
		close,
		openPopup,
		digits,
		setDigits,
		isMobile,
		mobileChrome,
	} = useCalendarPopupField({
		disabled,
		readOnly
	});
	const [viewDate, setViewDate] = useState(value ?? new Date());

	useEffect(() => {
		setDigits(formatDateToDigits(value));
		if (value) setViewDate(value);
	}, [setDigits, value]);

	return (
		<Calendar.Provider
			value={value}
			viewDate={viewDate}
			onViewDateChange={setViewDate}
			onChange={(next) => {
				if (next instanceof Date) {
					onChange(next);
					setOpen(false);
				}
			}}
		>
			<CalendarFieldDropdown
				open={open}
				onClose={close}
				onOpen={openPopup}
				isMobile={isMobile}
				mobileChrome={mobileChrome}
				trigger={(
					<MaskedField
						{...rest}
						ref={ref}
						label={label}
						width={width}
						mask='99.99.9999'
						value={digits}
						onChange={(val) => {
							if (readOnly) return;
							setDigits(val);
							commitMaskedValue(val, parseDigitsToDate, onChange);
						}}
						active={open}
						disabled={disabled}
						type='text'
						readOnly={readOnly}
						prefix={prefix ?? (
							<FieldBaseIcon>
								<IconCalendar />
							</FieldBaseIcon>
						)}
						onClear={onClear ? () => {
							setDigits('');
							onChange(undefined);
							onClear();
						} : undefined}
						onFocus={composeEventHandlers(onFocus, openPopup)}
					/>
				)}
			/>
		</Calendar.Provider>
	);
});

DateField.displayName = 'DateField';
