import React, {forwardRef, useMemo} from 'react';
import {
	addDays,
	isToday,
	startOfDay,
	weekdayLabels,
} from '../Calendar/Calendar.utils';
import {
	useCalendarBoard,
	type CalendarBoardTask,
	type CalendarBoardYearMonthRenderProps,
} from './CalendarBoard.context';
import {buildMonthWeeks, calendarDateKey} from './CalendarBoard.utils';
import styles from './CalendarBoard.module.css';
import unstyled from '../../styles/unstyledControl.module.css';
import {cn} from '../../utils/cn';
import {useLocale} from '../../locales/localeContext';
import type {CalendarBoardYearProps} from './CalendarBoard.types';

export type {CalendarBoardYearProps} from './CalendarBoard.types';

export const CalendarBoardYear = forwardRef<HTMLDivElement, CalendarBoardYearProps>(function CalendarBoardYear(
	{className, ...rest},
	ref,
) {
	const {messages, t} = useLocale();
	const {months, weekdaysShort} = messages.calendar;
	const {
		viewDate,
		setViewDate,
		setView,
		tasks,
		weekStartsOn,
		renderYearMonth,
	} = useCalendarBoard('CalendarBoard.Year');

	const year = viewDate.getFullYear();

	const tasksByDay = useMemo(() => {
		const map = new Map<string, CalendarBoardTask[]>();
		for (const task of tasks) {
			let cursor = startOfDay(task.start);
			const end = startOfDay(task.end);
			while (cursor < end) {
				if (cursor.getFullYear() === year) {
					const key = calendarDateKey(cursor);
					const list = map.get(key) ?? [];
					list.push(task);
					map.set(key, list);
				}
				cursor = addDays(cursor, 1);
			}
		}
		return map;
	}, [tasks, year]);

	const labels = weekdayLabels(weekdaysShort, weekStartsOn).map((name) => name[0] ?? '');

	return (
		<div
			ref={ref}
			className={cn(styles.year, className)}
			{...rest}
		>
			{Array.from({length: 12}, (_, monthIndex) => {
				const monthDate = new Date(year, monthIndex, 1);
				const weeks = buildMonthWeeks(monthDate, weekStartsOn);
				const isCurrentMonth = new Date().getFullYear() === year
					&& new Date().getMonth() === monthIndex;

				const props: CalendarBoardYearMonthRenderProps = {
					date: monthDate,
					monthIndex,
					label: months[monthIndex] ?? '',
					isCurrentMonth,
					taskDates: new Set(tasksByDay.keys()),
				};

				if (renderYearMonth) {
					return (
						<div key={monthIndex} className={styles.yearMonth}>
							{renderYearMonth(props)}
						</div>
					);
				}

				return (
					<div
						key={monthIndex}
						className={cn(styles.yearMonth, styles.yearMonthCard, isCurrentMonth ? styles.yearMonthCurrent : '')}
					>
						<button
							type='button'
							className={cn(unstyled.control, styles.yearMonthLabelBtn)}
							onClick={() => {
								setViewDate(monthDate);
								setView('month');
							}}
						>
							{months[monthIndex]}
						</button>
						<div className={styles.yearCols}>
							{labels.map((label, index) => (
								<span key={`${label}-${index}`} className={styles.yearWeekday}>
									{label}
								</span>
							))}
						</div>
						<div className={styles.yearWeeks}>
							{weeks.map((week) => (
								<div key={week[0]!.toISOString()} className={styles.yearCols}>
									{week.map((date) => {
										const inMonth = date.getMonth() === monthIndex;
										const dayTasks = tasksByDay.get(calendarDateKey(date)) ?? [];
										const hasTask = dayTasks.length > 0;
										const today = isToday(date);

										return (
											<button
												key={date.toISOString()}
												type='button'
												disabled={!inMonth}
												className={cn(
													unstyled.control,
													styles.yearDay,
													!inMonth ? styles.yearDayOutside : '',
													today ? styles.yearDayToday : '',
													hasTask ? styles.yearDayHasTask : '',
												)}
												title={inMonth && hasTask
													? dayTasks.map((task) => task.title).join('\n')
													: undefined}
												onClick={() => {
													if (!inMonth) return;
													setViewDate(date);
													setView('day');
												}}
												aria-label={inMonth
													? hasTask
														? t('calendarBoard.dayWithTasks', {
															day: date.getDate(),
															month: months[monthIndex] ?? '',
															count: dayTasks.length,
														})
														: t('calendarBoard.dayWithoutTasks', {
															day: date.getDate(),
															month: months[monthIndex] ?? '',
														})
													: undefined}
											>
												{inMonth ? date.getDate() : ''}
											</button>
										);
									})}
								</div>
							))}
						</div>
					</div>
				);
			})}
		</div>
	);
});

CalendarBoardYear.displayName = 'CalendarBoard.Year';
