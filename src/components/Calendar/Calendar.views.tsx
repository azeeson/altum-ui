import type {ComponentPropsWithoutRef, MouseEvent, ReactNode, Ref} from 'react';
import {isDateInRange, isSameDay, selectNextRange} from './Calendar.utils';
import {formatLocalDate, parseLocalDate} from '../../core/utils/date';
import {cn} from '../../core/utils/cn';
import {handleGridFocusKeyDown} from '../../core/utils/keyboard';
import {useCalendarContext} from './Calendar.context';
import {type CalendarDayCellRenderProps, YEARS_PER_PAGE} from './Calendar.types';
import unstyled from '../../styles/unstyledControl.module.css';
import chrome from '../../styles/calendarChrome.module.css';
import styles from './Calendar.module.css';

const DAY_COLUMNS = 7;

type PeriodItem = {
	key: string | number;
	label: string | number;
	ariaLabel: string;
	selected: boolean;
	current: boolean;
	year?: number;
	monthIndex?: number;
};

const PeriodGrid = ({
	className,
	label,
	columnsClass,
	items,
	rootRef,
	onClick,
	...rest
}: {
	className?: string;
	label: string;
	columnsClass: string;
	items: PeriodItem[];
	rootRef?: Ref<HTMLDivElement>;
} & ComponentPropsWithoutRef<'div'>) => (
	<div
		ref={rootRef}
		{...rest}
		className={cn(styles.calendarPeriodGrid, columnsClass, className)}
		role='grid'
		aria-label={label}
		onClick={onClick}
	>
		{items.map((item) => (
			<button
				key={item.key}
				type='button'
				role='gridcell'
				className={cn(unstyled.control, styles.periodCell)}
				data-selected={item.selected ? '' : undefined}
				data-today={item.current ? '' : undefined}
				data-year={item.year}
				data-index={item.monthIndex}
				aria-selected={item.selected}
				aria-label={item.ariaLabel}
			>
				{item.label}
			</button>
		))}
	</div>
);

export const CalendarDaysPanel = ({
	className,
	renderDayCell,
	rootRef,
	...rest
}: {
	className?: string;
	renderDayCell?: (props: CalendarDayCellRenderProps) => ReactNode;
	rootRef?: Ref<HTMLDivElement>;
} & ComponentPropsWithoutRef<'div'>) => {
	const {
		calendar,
		selectionMode,
		value,
		onChange,
		rangeValue,
		onRangeChange,
		year,
		month,
		shiftView,
	} = useCalendarContext('Calendar.Body');
	const isRange = selectionMode === 'range';
	const focusAnchor = isRange ? (rangeValue.end ?? rangeValue.start) : value;
	const lead = (new Date(year, month, 1).getDay() + 6) % 7;
	const count = new Date(year, month + 1, 0).getDate();
	const today = new Date();
	const monthName = calendar.months[month] ?? '';
	const openFirst = !focusAnchor;

	const handleClick = (event: MouseEvent<HTMLDivElement>) => {
		const target = event.target;
		if (!(target instanceof Element)) return;
		const cell = target.closest('[role="gridcell"]');
		if (!cell || !event.currentTarget.contains(cell)) return;
		const dateStr = cell.getAttribute('data-date');
		if (!dateStr) return;
		const date = parseLocalDate(dateStr);
		if (!date) return;
		if (isRange) onRangeChange?.(selectNextRange(rangeValue, date));
		else onChange(date);
	};

	return (
		<div
			ref={rootRef}
			className={className}
			{...rest}
		>
			<div className={cn(chrome.weekGrid, styles.calendarWeekdays)} aria-hidden='true'>
				{calendar.weekdaysShort.map((name) => (
					<div key={name}>
						{name}
					</div>
				))}
			</div>
			<div
				className={chrome.weekGrid}
				role='grid'
				aria-label={`${monthName} ${year}`}
				onClick={handleClick}
				onKeyDown={(event) => {
					if (event.key === 'PageUp' || event.key === 'PageDown') {
						event.preventDefault();
						shiftView(event.key === 'PageUp' ? -1 : 1);
						return;
					}
					handleGridFocusKeyDown(event, DAY_COLUMNS);
				}}
			>
				{Array.from({length: lead}, (_, index) => (
					<div
						key={`empty-${index}`}
						className={styles.dayEmpty}
						role='presentation'
					/>
				))}
				{Array.from({length: count}, (_, index) => {
					const day = index + 1;
					const date = new Date(year, month, day);
					const isRangeStart = !!(isRange && rangeValue.start && isSameDay(rangeValue.start, date));
					const isRangeEnd = !!(isRange && rangeValue.end && isSameDay(rangeValue.end, date));
					const inRange = !!(isRange && isDateInRange(date, rangeValue.start, rangeValue.end));
					const isSelected = isRange
						? (isRangeStart || isRangeEnd)
						: (value ? isSameDay(value, date) : false);
					const todayCell = isSameDay(date, today);

					return (
						<button
							key={`day-${day}`}
							type='button'
							role='gridcell'
							tabIndex={isSelected || (openFirst && day === 1) ? 0 : -1}
							className={cn(unstyled.control, styles.dayCell)}
							data-date={formatLocalDate(date)}
							data-selected={isSelected ? '' : undefined}
							data-today={todayCell ? '' : undefined}
							data-in-range={inRange ? '' : undefined}
							data-range-start={isRangeStart ? '' : undefined}
							data-range-end={isRangeEnd ? '' : undefined}
							aria-selected={isSelected || inRange}
							aria-current={todayCell ? 'date' : undefined}
							aria-label={`${day} ${monthName} ${year}`}
						>
							{renderDayCell
								? renderDayCell({
									date,
									day,
									isSelected,
									isToday: todayCell,
									rangeStart: isRangeStart,
									rangeEnd: isRangeEnd,
									inRange,
								})
								: day}
						</button>
					);
				})}
			</div>
		</div>
	);
};

export const CalendarPeriodPanel = ({
	className,
	rootRef,
	onClick,
	...rest
}: {
	rootRef?: Ref<HTMLDivElement>;
} & ComponentPropsWithoutRef<'div'>) => {
	const {
		calendar,
		t,
		value,
		year,
		month,
		yearPageStart,
		view,
		selectMonth,
		selectYear,
	} = useCalendarContext('Calendar.Body');
	const today = new Date();
	const isYears = view === 'years';
	const selectedMonth = value && value.getFullYear() === year ? value.getMonth() : null;

	const handleClick = (event: MouseEvent<HTMLDivElement>) => {
		const target = event.target;
		if (!(target instanceof Element)) return;
		const cell = target.closest('[role="gridcell"]');
		if (!cell || !event.currentTarget.contains(cell)) return;
		const yearAttr = cell.getAttribute('data-year');
		if (yearAttr != null) {
			selectYear(Number(yearAttr));
			return;
		}
		const indexAttr = cell.getAttribute('data-index');
		if (indexAttr != null) selectMonth(Number(indexAttr));
	};

	return (
		<PeriodGrid
			rootRef={rootRef}
			className={className}
			label={isYears
				? t('calendar.yearsRange', {
					start: yearPageStart,
					end: yearPageStart + YEARS_PER_PAGE - 1,
				})
				: t('calendar.monthsOfYear', {year})}
			columnsClass={isYears ? styles.calendarYears : styles.calendarMonths}
			onClick={(event) => {
				onClick?.(event);
				if (!event.defaultPrevented) handleClick(event);
			}}
			items={isYears
				? Array.from({length: YEARS_PER_PAGE}, (_, index) => {
					const itemYear = yearPageStart + index;
					return {
						key: itemYear,
						label: itemYear,
						ariaLabel: `${itemYear}`,
						selected: (value?.getFullYear() ?? year) === itemYear,
						current: today.getFullYear() === itemYear,
						year: itemYear,
					};
				})
				: calendar.monthsShort.map((name, index) => ({
					key: name,
					label: name,
					ariaLabel: `${calendar.months[index] ?? ''} ${year}`,
					selected: selectedMonth === index || (!value && month === index),
					current: today.getFullYear() === year && today.getMonth() === index,
					monthIndex: index,
				}))}
			{...rest}
		/>
	);
};
