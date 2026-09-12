import type {
	DayStripCalendarProps,
} from './DayStripCalendar.types';
export type {
	DayStripDayRenderProps,
	DayStripCalendarProps,
} from './DayStripCalendar.types';

import React, {forwardRef, useCallback, useEffect, useId, useMemo} from 'react';
import {
	addDays,
	buildDayStrip,
	formatMonthYear,
	isSameDay,
	isToday,
	startOfDay,
	startOfWeek,
	weekdayLabelFor,
} from '../Calendar/Calendar.utils';
import {PeriodHeader} from '../../base/PeriodHeader';
import {handleArrowPairKeyDown, isKey} from '../../utils/keyboard';
import unstyled from '../../styles/unstyledControl.module.css';
import chrome from '../../styles/calendarChrome.module.css';
import styles from './DayStripCalendar.module.css';
import {cn} from '../../utils/cn';
import {useControlledStateWithCallback} from '../../hooks/useControlledState';
import {useLocale} from '../../locales/localeContext';

/**
 * Горизонтальная полоса дней для быстрого выбора даты в недельном или произвольном окне.
 *
 * @component
 * @example
 * <DayStripCalendar value={date} onChange={setDate} daysCount={7} />
 */
export const DayStripCalendar = forwardRef<HTMLDivElement, DayStripCalendarProps>(function DayStripCalendar(
	{
		value,
		onChange,
		viewDate: controlledViewDate,
		onViewDateChange,
		daysCount = 7,
		weekStartsOn = 1,
		showHeader = true,
		showNav = true,
		className,
		'aria-label': ariaLabel,
		renderDay,
		...rest
	},
	ref,
) {
	const {messages} = useLocale();
	const {months, weekdaysShort} = messages.calendar;
	const labelId = useId();

	const selected = value ? startOfDay(value) : undefined;
	const selectedTime = selected?.getTime();
	const anchor = selected ?? startOfDay(new Date());

	const [viewDate, setViewDateRaw] = useControlledStateWithCallback(
		controlledViewDate !== undefined ? startOfDay(controlledViewDate) : undefined,
		startOfWeek(anchor, weekStartsOn),
		onViewDateChange,
	);

	const setViewDate = useCallback((next: Date) => {
		setViewDateRaw(startOfDay(next));
	}, [setViewDateRaw]);

	useEffect(() => {
		if (selectedTime === undefined) return;
		const currentSelected = new Date(selectedTime);
		const stripEnd = addDays(viewDate, daysCount - 1);
		if (currentSelected < viewDate || currentSelected > stripEnd) {
			setViewDate(
				daysCount === 7
					? startOfWeek(currentSelected, weekStartsOn)
					: currentSelected,
			);
		}
		// Навигация меняет только viewDate — не возвращать окно к value.
		// eslint-disable-next-line react-hooks/exhaustive-deps -- snap только при смене value / daysCount, не при сдвиге полосы
	}, [
		daysCount,
		selectedTime,
		setViewDate,
		weekStartsOn
	]);

	const days = useMemo(
		() => buildDayStrip(viewDate, daysCount),
		[daysCount, viewDate],
	);

	const viewShift = Math.max(1, Math.round(daysCount / 2));

	const selectDate = (date: Date) => {
		onChange(startOfDay(date));
	};

	const stepDay = (direction: -1 | 1) => {
		const current = selected ?? days[0];
		if (!current) return;
		const next = addDays(current, direction);
		selectDate(next);
		const stripEnd = addDays(viewDate, daysCount - 1);
		if (next < viewDate || next > stripEnd) {
			setViewDate(addDays(viewDate, direction * viewShift));
		}
	};

	return (
		<div
			ref={ref}
			className={cn(styles.root, className)}
			role='group'
			aria-label={ariaLabel ?? messages.dayStrip.ariaLabel}
			aria-labelledby={showHeader ? labelId : undefined}
			{...rest}
		>
			<PeriodHeader
				title={formatMonthYear(selected ?? viewDate, months)}
				titleId={labelId}
				showTitle={showHeader}
				showNav={showNav}
				onPrev={() => stepDay(-1)}
				onNext={() => stepDay(1)}
				prevLabel={messages.dayStrip.prev}
				nextLabel={messages.dayStrip.next}
			/>

			<div
				className={styles.strip}
				role='listbox'
				aria-label={messages.dayStrip.days}
				aria-orientation='horizontal'
				tabIndex={0}
				onKeyDown={(event) => {
					if (handleArrowPairKeyDown(event, () => stepDay(-1), () => stepDay(1))) return;
					if (isKey(event, 'Home')) {
						event.preventDefault();
						selectDate(days[0]!);
						return;
					}
					if (isKey(event, 'End')) {
						event.preventDefault();
						selectDate(days[days.length - 1]!);
					}
				}}
			>
				{days.map((date) => {
					const isSelected = selected ? isSameDay(date, selected) : false;
					const today = isToday(date);
					const weekday = weekdayLabelFor(date, weekStartsOn, weekdaysShort);
					const dayOfMonth = date.getDate();
					const optionId = `${labelId}-day-${date.getFullYear()}-${date.getMonth()}-${dayOfMonth}`;

					return (
						<button
							key={optionId}
							id={optionId}
							type='button'
							role='option'
							aria-selected={isSelected}
							aria-current={today ? 'date' : undefined}
							aria-label={`${weekday}, ${dayOfMonth} ${formatMonthYear(date, months)}`}
							className={cn(
								unstyled.control,
								chrome.cell,
								styles.day,
								isSelected ? chrome.selected : '',
								isSelected ? styles.daySelected : '',
								today ? chrome.today : '',
							)}
							onClick={() => selectDate(date)}
						>
							{renderDay
								? renderDay({
									date,
									dayOfMonth,
									weekdayLabel: weekday,
									isSelected,
									isToday: today,
								})
								: (
									<>
										<span className={styles.weekday}>
											{weekday}
										</span>
										<span className={styles.dayNumber}>
											{dayOfMonth}
										</span>
									</>
								)}
						</button>
					);
				})}
			</div>
		</div>
	);
});

DayStripCalendar.displayName = 'DayStripCalendar';
