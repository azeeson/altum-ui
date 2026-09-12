import React, {forwardRef, useRef} from 'react';
import {
	isDateInRange,
	isSameDay,
	isToday,
	selectNextRange,
} from './Calendar.utils';
import {focusElement, getGridIndex} from '../../utils/a11y';
import {cn} from '../../utils/cn';
import {useLocale} from '../../locales/localeContext';
import {useCalendarContext} from './Calendar.context';
import {
	type CalendarDayCellRenderProps,
	YEARS_PER_PAGE,
} from './Calendar.types';
import unstyled from '../../styles/unstyledControl.module.css';
import chrome from '../../styles/calendarChrome.module.css';
import styles from './Calendar.module.css';

type PeriodItem = {
	key: string | number;
	label: React.ReactNode;
	ariaLabel: string;
	selected: boolean;
	current: boolean;
	onSelect: () => void;
};

const PeriodGrid = forwardRef<HTMLDivElement, {
	className?: string;
	label: string;
	columnsClass: string;
	items: PeriodItem[];
} & React.ComponentPropsWithoutRef<'div'>>(function PeriodGrid(
	{className, label, columnsClass, items, ...rest},
	ref,
) {
	return (
		<div
			ref={ref}
			className={cn(styles.calendarPeriodGrid, columnsClass, className)}
			role='grid'
			aria-label={label}
			{...rest}
		>
			{items.map((item) => (
				<button
					key={item.key}
					type='button'
					role='gridcell'
					className={cn(
						unstyled.control,
						chrome.cell,
						styles.periodCell,
						item.selected ? chrome.selected : '',
						item.current && !item.selected ? chrome.today : '',
					)}
					aria-selected={item.selected}
					aria-label={item.ariaLabel}
					onClick={item.onSelect}
				>
					{item.label}
				</button>
			))}
		</div>
	);
});

export const CalendarDaysPanel = forwardRef<HTMLDivElement, {
	className?: string;
	renderDayCell?: (props: CalendarDayCellRenderProps) => React.ReactNode;
} & React.ComponentPropsWithoutRef<'div'>>(function CalendarDaysPanel(
	{className, renderDayCell, ...rest},
	ref,
) {
	const {messages} = useLocale();
	const months = messages.calendar.months;
	const weekdays = messages.calendar.weekdaysShort;
	const {
		selectionMode,
		value,
		onChange,
		rangeValue,
		onRangeChange,
		year,
		month,
		days,
		shiftView,
	} = useCalendarContext('Calendar.Body');
	const gridRef = useRef<HTMLDivElement>(null);
	const isRange = selectionMode === 'range';
	const focusAnchor = isRange ? (rangeValue.end ?? rangeValue.start) : value;

	return (
		<div
			ref={ref}
			className={cn(styles.calendarBody, className)}
			{...rest}
		>
			<div className={cn(chrome.weekGrid, styles.calendarWeekdays)} aria-hidden='true'>
				{weekdays.map((name) => (
					<div key={name}>
						{name}
					</div>
				))}
			</div>
			<div
				ref={gridRef}
				className={chrome.weekGrid}
				role='grid'
				aria-label={`${months[month] ?? ''} ${year}`}
				onKeyDown={(event) => {
					if (event.key === 'PageUp' || event.key === 'PageDown') {
						event.preventDefault();
						shiftView(event.key === 'PageUp' ? -1 : 1);
						return;
					}
					const buttons = Array.from(
						gridRef.current?.querySelectorAll<HTMLButtonElement>('button') ?? [],
					);
					const next = getGridIndex(
						buttons.indexOf(document.activeElement as HTMLButtonElement),
						buttons.length,
						event.key,
						7,
					);
					if (next === null) return;
					event.preventDefault();
					focusElement(buttons[next]);
				}}
			>
				{days.map((dayItem, index) => {
					if (dayItem.isEmpty || !dayItem.date) {
						return (
							<div
								key={`empty-${index}`}
								className={styles.dayEmpty}
								role='presentation'
							/>
						);
					}

					const isRangeStart = !!(isRange && rangeValue.start && isSameDay(rangeValue.start, dayItem.date));
					const isRangeEnd = !!(isRange && rangeValue.end && isSameDay(rangeValue.end, dayItem.date));
					const inRange = !!(isRange && isDateInRange(dayItem.date, rangeValue.start, rangeValue.end));
					const isSelected = isRange
						? (isRangeStart || isRangeEnd)
						: (value ? isSameDay(value, dayItem.date) : false);
					const today = isToday(dayItem.date);
					const isFocusedDay = isSelected || (!focusAnchor && days.findIndex((item) => !item.isEmpty && item.date) === index);

					return (
						<button
							key={`day-${dayItem.day}-${dayItem.date.getTime()}`}
							type='button'
							role='gridcell'
							tabIndex={isFocusedDay ? 0 : -1}
							className={cn(
								unstyled.control,
								chrome.cell,
								styles.dayCell,
								isSelected ? chrome.selected : '',
								inRange ? styles.dayInRange : '',
								isRangeStart ? styles.dayRangeStart : '',
								isRangeEnd ? styles.dayRangeEnd : '',
								today ? chrome.today : '',
							)}
							aria-selected={isSelected || inRange}
							aria-current={today ? 'date' : undefined}
							aria-label={`${dayItem.day} ${months[month] ?? ''} ${year}`}
							onClick={() => {
								if (isRange) {
									onRangeChange?.(selectNextRange(rangeValue, dayItem.date!));
								} else {
									onChange(dayItem.date!);
								}
							}}
						>
							{renderDayCell
								? renderDayCell({
									date: dayItem.date,
									day: dayItem.day,
									isSelected,
									isToday: today,
									rangeStart: isRangeStart,
									rangeEnd: isRangeEnd,
									inRange,
								})
								: dayItem.day}
						</button>
					);
				})}
			</div>
		</div>
	);
});

export const CalendarMonthsPanel = forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<'div'>>(
	function CalendarMonthsPanel({className, ...rest}, ref) {
		const {messages, t} = useLocale();
		const months = messages.calendar.months;
		const monthsShort = messages.calendar.monthsShort;
		const {value, year, month, selectMonth} = useCalendarContext('Calendar.Body');
		const selectedMonth = value && value.getFullYear() === year ? value.getMonth() : null;
		const today = new Date();
		const isCurrentYear = today.getFullYear() === year;

		return (
			<PeriodGrid
				ref={ref}
				className={className}
				label={t('calendar.monthsOfYear', {year})}
				columnsClass={styles.calendarMonths}
				items={monthsShort.map((name, index) => {
					const selected = selectedMonth === index || (!value && month === index);
					return {
						key: name,
						label: name,
						ariaLabel: `${months[index] ?? ''} ${year}`,
						selected,
						current: isCurrentYear && today.getMonth() === index,
						onSelect: () => selectMonth(index),
					};
				})}
				{...rest}
			/>
		);
	},
);

export const CalendarYearsPanel = forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<'div'>>(
	function CalendarYearsPanel({className, ...rest}, ref) {
		const {t} = useLocale();
		const {value, year, yearPageStart, selectYear} = useCalendarContext('Calendar.Body');
		const todayYear = new Date().getFullYear();

		return (
			<PeriodGrid
				ref={ref}
				className={className}
				label={t('calendar.yearsRange', {
					start: yearPageStart,
					end: yearPageStart + YEARS_PER_PAGE - 1,
				})}
				columnsClass={styles.calendarYears}
				items={Array.from({length: YEARS_PER_PAGE}, (_, index) => {
					const itemYear = yearPageStart + index;
					const selected = (value?.getFullYear() ?? year) === itemYear;
					return {
						key: itemYear,
						label: itemYear,
						ariaLabel: `${itemYear}`,
						selected,
						current: todayYear === itemYear,
						onSelect: () => selectYear(itemYear),
					};
				})}
				{...rest}
			/>
		);
	},
);
