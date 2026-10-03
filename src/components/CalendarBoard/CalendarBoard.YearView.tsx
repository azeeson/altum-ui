import {useMemo, type MouseEvent} from 'react';
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
import utilities from '../../styles/utilities.module.css';
import {cn} from '../../core/utils/cn';
import {useLocale} from '../../locales/localeContext';
import type {CalendarBoardYearProps} from './CalendarBoard.types';
import {ruSlice as ru_calendar} from '../../locales/slices/calendar.ru';
import {ruSlice as ru_calendarBoard} from '../../locales/slices/calendarBoard.ru';

const localeFallback = {
	calendar: ru_calendar,
	calendarBoard: ru_calendarBoard,
};




export type {CalendarBoardYearProps} from './CalendarBoard.types';

export const CalendarBoardYear = ({
	className,
	rootRef,
	...rest
}: CalendarBoardYearProps) => {
	const {messages, t} = useLocale(localeFallback);
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

	const openTarget = (event: MouseEvent<HTMLDivElement>) => {
		const button = (event.target as HTMLElement).closest('button');
		if (!(button instanceof HTMLButtonElement) || button.disabled) return;
		if (button.dataset.month != null) {
			setViewDate(new Date(year, Number(button.dataset.month), 1));
			setView('month');
			return;
		}
		if (!button.dataset.date) return;
		const date = new Date(button.dataset.date);
		if (Number.isNaN(date.getTime())) return;
		setViewDate(date);
		setView('day');
	};

	return (
		<div
			{...rest}
			ref={rootRef}
			className={cn(styles.year, className)}
			onClick={openTarget}
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
						className={cn(styles.yearMonth, styles.yearMonthCard)}
						data-current={isCurrentMonth ? '' : undefined}
					>
						<button
							type='button'
							className={cn(unstyled.control, styles.yearMonthLabelBtn)}
							data-month={monthIndex}
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
												className={cn(unstyled.control, utilities.fCenter, styles.yearDay)}
												data-date={inMonth ? date.toISOString() : undefined}
												data-outside={!inMonth ? '' : undefined}
												data-today={today ? '' : undefined}
												data-has-task={hasTask ? '' : undefined}
												title={inMonth && hasTask
													? dayTasks.map((task) => task.title).join('\n')
													: undefined}
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
};
