import React from 'react';
import {ButtonIcon} from '../ButtonIcon/ButtonIcon';
import {Calendar} from '../Calendar/Calendar';
import {MOBILE_MEDIA_QUERY, useMediaQuery} from '../../hooks/useMediaQuery';
import {useLocale} from '../../locales/localeContext';
import {FieldPopupDropdown, useMaskedPopupField} from '../../base/FieldPopup';

export {FieldPopupDropdown, useMaskedPopupField};

interface CalendarMobileChromeOptions {
	isMobile: boolean;
	closeLabel: string;
	onClose: () => void;
}

/**
 * Преобразует локальную дату в цифры маски DDMMYYYY.
 */
export const formatDateToDigits = (date: Date | undefined): string => {
	if (!date) return '';
	const day = date.getDate();
	const month = date.getMonth() + 1;
	const year = date.getFullYear();
	return `${day < 10 ? `0${day}` : day}${month < 10 ? `0${month}` : month}${year}`;
};

/**
 * Создаёт локальную дату из восьми цифр DDMMYYYY, отклоняя несуществующие даты.
 */
export const parseDigitsToDate = (digits: string): Date | undefined => {
	if (digits.length !== 8) return undefined;

	const day = Number.parseInt(digits.slice(0, 2), 10);
	const month = Number.parseInt(digits.slice(2, 4), 10) - 1;
	const year = Number.parseInt(digits.slice(4, 8), 10);
	if (Number.isNaN(day) || Number.isNaN(month) || Number.isNaN(year) || year <= 1000) {
		return undefined;
	}

	const date = new Date(year, month, day);
	return date.getDate() === day && date.getMonth() === month && date.getFullYear() === year
		? date
		: undefined;
};

/**
 * Общие mobile-слоты календаря для DateField и DateRangeField.
 */
export const getCalendarMobileChrome = ({
	isMobile,
	closeLabel,
	onClose,
}: CalendarMobileChromeOptions) => ({
	mobileTitle: isMobile ? <Calendar.Title /> : undefined,
	mobileLeftControls: isMobile ? <Calendar.Nav direction='prev' /> : undefined,
	mobileRightControls: isMobile ? (
		<>
			<Calendar.Nav direction='next' />
			<ButtonIcon
				variant='ghost'
				size='sm'
				aria-label={closeLabel}
				onClick={onClose}
			>
				✕
			</ButtonIcon>
		</>
	) : undefined,
});

/**
 * Попап календаря: маска + mobile chrome DateField / DateRangeField.
 */
export function useCalendarPopupField({
	disabled,
	readOnly,
}: {
	disabled?: boolean;
	readOnly?: boolean;
}) {
	const {t} = useLocale();
	const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY);
	const popup = useMaskedPopupField({
		disabled,
		readOnly,
	});
	const mobileChrome = getCalendarMobileChrome({
		isMobile,
		closeLabel: t('common.close'),
		onClose: popup.close,
	});

	return {
		...popup,
		isMobile,
		mobileChrome,
	};
}

const CalendarDropdownPanel: React.FC<{isMobile: boolean}> = ({isMobile}) => (
	<Calendar.Root style={isMobile ? {width: '100%'} : undefined}>
		{!isMobile && (
			<Calendar.Header>
				<Calendar.Nav direction='prev' />
				<Calendar.Title />
				<Calendar.Nav direction='next' />
			</Calendar.Header>
		)}
		<Calendar.Body />
	</Calendar.Root>
);

/**
 * Dropdown-оболочка поля с календарём.
 */
export const CalendarFieldDropdown: React.FC<Omit<React.ComponentProps<typeof FieldPopupDropdown>, 'children'> & {
	isMobile: boolean;
}> = ({
	isMobile,
	contentPadding = 'md',
	...props
}) => (
	<FieldPopupDropdown
		{...props}
		contentPadding={contentPadding}
	>
		<CalendarDropdownPanel isMobile={isMobile} />
	</FieldPopupDropdown>
);
