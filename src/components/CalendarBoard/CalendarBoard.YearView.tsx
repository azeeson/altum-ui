import React, {forwardRef, useMemo} from 'react';
import {
	addDays,
	isToday,
	startOfDay,
} from '../Calendar/Calendar.utils';
import {Tooltip} from '../Tooltip/Tooltip';
import {
	useCalendarBoard,
	type CalendarBoardTask,
	type CalendarBoardYearMonthRenderProps,
} from './CalendarBoard.context';
import {buildMonthWeeks, calendarDateKey} from './CalendarBoard.utils';
import styles from './CalendarBoard.module.css';
import {cn} from '../../utils/cn';
import {useLocale} from '../LocaleProvider/LocaleProvider';
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

	const weekdayLabels = useMemo(() => {
		if (weekStartsOn === 1) return weekdaysShort.map((name) => name[0] ?? '');
		return [weekdaysShort[6]?.[0] ?? '', ...weekdaysShort.slice(0, 6).map((name) => name[0] ?? ''),];
	}, [weekdaysShort, weekStartsOn]);

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
							className={styles.yearMonthLabelBtn}
							onClick={() => {
								setViewDate(monthDate);
								setView('month');
							}}
						>
							{months[monthIndex]}
						</button>
						<div className={styles.yearWeekdayRow}>
							{weekdayLabels.map((label, index) => (
								<span key={`${label}-${index}`} className={styles.yearWeekday}>
									{label}
								</span>
							))}
						</div>
						<div className={styles.yearWeeks}>
							{weeks.map((week) => (
								<div key={week[0]!.toISOString()} className={styles.yearWeek}>
									{week.map((date) => {
										const inMonth = date.getMonth() === monthIndex;
										const dayTasks = tasksByDay.get(calendarDateKey(date)) ?? [];
										const hasTask = dayTasks.length > 0;
										const today = isToday(date);

										const dayNode = (
											<button
												type='button'
												disabled={!inMonth}
												className={cn(
													styles.yearDay,
													!inMonth ? styles.yearDayOutside : '',
													today ? styles.yearDayToday : '',
													hasTask ? styles.yearDayHasTask : '',
												)}
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

										if (!inMonth || !hasTask) {
											return (
												<span key={date.toISOString()} className={styles.yearDayWrap}>
													{dayNode}
												</span>
											);
										}

										return (
											<span key={date.toISOString()} className={styles.yearDayWrap}>
												<Tooltip
													position='top'
													asChild
													content={(
														<ul className={styles.yearTooltipList}>
															{dayTasks.map((task) => (
																<li key={task.id}>
																	{task.title}
																</li>
															))}
														</ul>
													)}
												>
													{dayNode}
												</Tooltip>
											</span>
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
