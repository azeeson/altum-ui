import React, {useCallback, useMemo, useRef} from 'react';
import {
	isDateInRange,
	isSameDay,
	isToday,
	selectNextRange,
} from './Calendar.utils';
import {focusElement} from '../../utils/a11y';
import {cn} from '../../utils/cn';
import {useLocale} from '../LocaleProvider/LocaleProvider';
import {useCalendarContext} from './Calendar.context';
import {
	type CalendarDayCellRenderProps,
	YEARS_COLUMNS,
	YEARS_PER_PAGE,
} from './Calendar.types';
import styles from './Calendar.module.css';

export function CalendarDaysPanel({
	className,
	renderDayCell,
}: {
	className?: string;
	renderDayCell?: (props: CalendarDayCellRenderProps) => React.ReactNode;
}) {
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
	const gridLabel = `${months[month] ?? ''} ${year}`;
	const isRange = selectionMode === 'range';

	const getDayButtons = useCallback(() => {
		return Array.from(
			gridRef.current?.querySelectorAll<HTMLButtonElement>(`button.${styles.dayCell}`) ?? []
		);
	}, []);

	const handleGridKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
		const dayButtons = getDayButtons();
		if (dayButtons.length === 0) return;

		const currentIndex = dayButtons.indexOf(document.activeElement as HTMLButtonElement);

		if (event.key === 'PageUp') {
			event.preventDefault();
			shiftView(-1);
			return;
		}

		if (event.key === 'PageDown') {
			event.preventDefault();
			shiftView(1);
			return;
		}

		let nextIndex: number | null = null;

		if (event.key === 'ArrowLeft') nextIndex = currentIndex - 1;
		if (event.key === 'ArrowRight') nextIndex = currentIndex + 1;
		if (event.key === 'ArrowUp') nextIndex = currentIndex - 7;
		if (event.key === 'ArrowDown') nextIndex = currentIndex + 7;
		if (event.key === 'Home') nextIndex = 0;
		if (event.key === 'End') nextIndex = dayButtons.length - 1;

		if (nextIndex !== null) {
			event.preventDefault();
			const clampedIndex = Math.max(0, Math.min(dayButtons.length - 1, nextIndex));
			dayButtons.forEach((button, index) => {
				button.tabIndex = index === clampedIndex ? 0 : -1;
			});
			focusElement(dayButtons[clampedIndex]);
		}
	};

	return (
		<div className={cn(styles.calendarBody, className)}>
			<div className={styles.calendarWeekdays} aria-hidden='true'>
				{weekdays.map((name) => (
					<div key={name}>
						{name}
					</div>
				))}
			</div>
			<div
				ref={gridRef}
				className={styles.calendarDays}
				role='grid'
				aria-label={gridLabel}
				onKeyDown={handleGridKeyDown}
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
					const dayIndexAmongButtons = days
						.slice(0, index + 1)
						.filter((item) => !item.isEmpty && item.date).length - 1;
					const focusAnchor = isRange
						? (rangeValue.end ?? rangeValue.start)
						: value;
					const isFocusedDay = isSelected || (!focusAnchor && dayIndexAmongButtons === 0);

					const dayClasses = cn(
						styles.dayCell,
						isSelected ? styles.daySelected : '',
						inRange ? styles.dayInRange : '',
						isRangeStart ? styles.dayRangeStart : '',
						isRangeEnd ? styles.dayRangeEnd : '',
						today ? styles.dayToday : '',
					);

					return (
						<button
							key={`day-${dayItem.day}-${dayItem.date.getTime()}`}
							type='button'
							role='gridcell'
							tabIndex={isFocusedDay ? 0 : -1}
							className={dayClasses}
							aria-selected={isSelected || inRange}
							aria-current={today ? 'date' : undefined}
							aria-label={`${dayItem.day} ${months[month] ?? ''} ${year}`}
							onClick={(event) => {
								event.stopPropagation();
								const dayButtons = getDayButtons();
								dayButtons.forEach((button) => {
									button.tabIndex = -1;
								});
								(event.currentTarget as HTMLButtonElement).tabIndex = 0;
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
}

export function CalendarMonthsPanel({className}: {className?: string}) {
	const {messages, t} = useLocale();
	const months = messages.calendar.months;
	const monthsShort = messages.calendar.monthsShort;
	const {value, year, month, selectMonth} = useCalendarContext('Calendar.Body');
	const selectedMonth = value && value.getFullYear() === year
		? value.getMonth()
		: null;
	const today = new Date();
	const isCurrentYear = today.getFullYear() === year;

	return (
		<div
			className={cn(styles.calendarPeriodGrid, styles.calendarMonths, className)}
			role='grid'
			aria-label={t('calendar.monthsOfYear', {year})}
		>
			{monthsShort.map((name, index) => {
				const isSelected = selectedMonth === index || (!value && month === index);
				const isCurrent = isCurrentYear && today.getMonth() === index;
				const cellClasses = cn(
					styles.periodCell,
					isSelected ? styles.daySelected : '',
					isCurrent && !isSelected ? styles.dayToday : '',
				);

				return (
					<button
						key={name}
						type='button'
						role='gridcell'
						className={cellClasses}
						aria-selected={selectedMonth === index}
						aria-label={`${months[index] ?? ''} ${year}`}
						onClick={(event) => {
							event.stopPropagation();
							selectMonth(index);
						}}
					>
						{name}
					</button>
				);
			})}
		</div>
	);
}

export function CalendarYearsPanel({className}: {className?: string}) {
	const {t} = useLocale();
	const {value, year, yearPageStart, selectYear} = useCalendarContext('Calendar.Body');
	const todayYear = new Date().getFullYear();
	const years = useMemo(
		() => Array.from({length: YEARS_PER_PAGE}, (_, index) => yearPageStart + index),
		[yearPageStart],
	);

	return (
		<div
			className={cn(styles.calendarPeriodGrid, styles.calendarYears, className)}
			role='grid'
			aria-label={t('calendar.yearsRange', {
				start: yearPageStart,
				end: yearPageStart + YEARS_PER_PAGE - 1,
			})}
			style={{gridTemplateColumns: `repeat(${YEARS_COLUMNS}, 1fr)`}}
		>
			{years.map((itemYear) => {
				const isSelected = (value?.getFullYear() ?? year) === itemYear;
				const isCurrent = todayYear === itemYear;
				const cellClasses = cn(
					styles.periodCell,
					isSelected ? styles.daySelected : '',
					isCurrent && !isSelected ? styles.dayToday : '',
				);

				return (
					<button
						key={itemYear}
						type='button'
						role='gridcell'
						className={cellClasses}
						aria-selected={isSelected}
						aria-label={`${itemYear}`}
						onClick={(event) => {
							event.stopPropagation();
							selectYear(itemYear);
						}}
					>
						{itemYear}
					</button>
				);
			})}
		</div>
	);
}
