import React from 'react';
import {ButtonIcon} from '../ButtonIcon/ButtonIcon';
import {Calendar} from '../Calendar/Calendar';
import {Dropdown} from '../Dropdown/Dropdown';

interface CalendarMobileChromeOptions {
	isMobile: boolean;
	closeLabel: string;
	onClose: () => void;
}

interface CalendarDropdownPanelProps {
	isMobile: boolean;
}

interface CalendarFieldDropdownProps {
	open: boolean;
	onOpen: () => void;
	onClose: () => void;
	isMobile: boolean;
	mobileChrome: {
		mobileTitle?: React.ReactNode;
		mobileLeftControls?: React.ReactNode;
		mobileRightControls?: React.ReactNode;
	};
	trigger: React.ReactElement;
	contentPadding?: 'md';
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
 * Общие mobile-слоты календаря для DatePicker и DateRangePicker.
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
 * Стандартная панель календаря для DatePicker / DateRangePicker.
 */
const CalendarDropdownPanel: React.FC<CalendarDropdownPanelProps> = ({isMobile}) => (
	<Calendar.Root>
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
 * Dropdown-оболочка combobox-поля с календарём (desktop dropdown / mobile sheet).
 */
export const CalendarFieldDropdown: React.FC<CalendarFieldDropdownProps> = ({
	open,
	onOpen,
	onClose,
	isMobile,
	mobileChrome,
	trigger,
	contentPadding,
}) => (
	<Dropdown
		open={open}
		onClose={onClose}
		onOpenChange={(next) => {
			if (next) onOpen();
		}}
		triggerMode='combobox'
		widthMode='content'
		popupRole='dialog'
		panelScroll='content'
		{...mobileChrome}
	>
		<Dropdown.Trigger asChild>
			{trigger}
		</Dropdown.Trigger>
		<Dropdown.Content boxProps={contentPadding ? {padding: contentPadding} : undefined}>
			<CalendarDropdownPanel isMobile={isMobile} />
		</Dropdown.Content>
	</Dropdown>
);
