import React, {forwardRef, useMemo} from 'react';
import {
	isSameDay,
	isToday,
	startOfDay,
} from '../Calendar/Calendar.utils';
import {
	packSpanSegments,
	resolveAllDay,
	segmentSpanByWeeks,
} from '../Calendar/calendar.schedule';
import {
	useCalendarBoard,
	type CalendarBoardDayCellRenderProps,
	type CalendarBoardTask,
} from './CalendarBoard.context';
import {CalendarBoardTaskChip} from './CalendarBoard.TaskChip';
import {buildMonthWeeks, calendarDateKey, isMultiDayTask} from './CalendarBoard.utils';
import styles from './CalendarBoard.module.css';
import {cn} from '../../utils/cn';
import {useLocale} from '../LocaleProvider/LocaleProvider';

import type {CalendarBoardMonthProps} from './CalendarBoard.types';

export type {CalendarBoardMonthProps} from './CalendarBoard.types';

export const CalendarBoardMonth = forwardRef<HTMLDivElement, CalendarBoardMonthProps>(function CalendarBoardMonth(
	{className, maxChipsPerDay = 3, ...rest},
	ref,
) {
	const {messages, t} = useLocale();
	const {months, weekdaysShort} = messages.calendar;
	const {
		viewDate,
		selectedDate,
		setSelectedDate,
		setViewDate,
		setView,
		tasks,
		weekStartsOn,
		renderDayCell,
	} = useCalendarBoard('CalendarBoard.Month');

	const weeks = useMemo(
		() => buildMonthWeeks(viewDate, weekStartsOn),
		[viewDate, weekStartsOn],
	);

	const monthIndex = viewDate.getMonth();

	const weekdayLabels = useMemo(() => {
		if (weekStartsOn === 1) return weekdaysShort;
		return [weekdaysShort[6] ?? '', ...weekdaysShort.slice(0, 6)];
	}, [weekdaysShort, weekStartsOn]);

	const multiDayTasks = useMemo(
		() => tasks.filter((task) => resolveAllDay(task) && isMultiDayTask(task.start, task.end)),
		[tasks],
	);

	const spanLayers = useMemo(() => {
		return weeks.map((week, weekIndex) => {
			const entries = multiDayTasks
				.map((task) => {
					const hits = segmentSpanByWeeks(task.start, task.end, [week]);
					const hit = hits[0];
					if (!hit) return null;
					return {
						item: task,
						segment: hit.segment
					};
				})
				.filter((entry): entry is NonNullable<typeof entry> => entry !== null);

			return {
				weekIndex,
				...packSpanSegments(entries)
			};
		});
	}, [multiDayTasks, weeks]);

	const tasksByDay = useMemo(() => {
		const map = new Map<string, CalendarBoardTask[]>();
		for (const task of tasks) {
			if (resolveAllDay(task) && isMultiDayTask(task.start, task.end)) continue;
			const key = calendarDateKey(startOfDay(task.start));
			const list = map.get(key) ?? [];
			list.push(task);
			map.set(key, list);
		}
		return map;
	}, [tasks]);

	const laneHeight = 22;

	return (
		<div
			ref={ref}
			className={cn(styles.month, className)}
			{...rest}
		>
			<div className={styles.weekdayRow} role='row'>
				{weekdayLabels.map((label) => (
					<div
						key={label}
						className={styles.weekdayLabel}
						role='columnheader'
					>
						{label}
					</div>
				))}
			</div>

			<div className={styles.monthWeeks}>
				{weeks.map((week, weekIndex) => {
					const layer = spanLayers[weekIndex];
					const laneCount = Math.max(layer?.laneCount ?? 0, 0);
					const trackHeight = laneCount > 0 ? laneCount * laneHeight + Math.max(0, laneCount - 1) * 2 : 0;

					return (
						<div
							key={week[0]!.toISOString()}
							className={styles.weekRow}
							style={{'--altum-calendar-board-span-height': `${trackHeight}px`} as React.CSSProperties}
						>
							<div className={styles.weekDays}>
								{week.map((date) => {
									const inMonth = date.getMonth() === monthIndex;
									const selected = selectedDate ? isSameDay(date, selectedDate) : false;
									const today = isToday(date);
									const dayTasks = tasksByDay.get(calendarDateKey(date)) ?? [];
									const visible = dayTasks.slice(0, maxChipsPerDay);
									const overflow = dayTasks.length - visible.length;

									const cellProps: CalendarBoardDayCellRenderProps = {
										date,
										dayOfMonth: date.getDate(),
										isCurrentMonth: inMonth,
										isToday: today,
										isSelected: selected,
										tasks: dayTasks,
									};

									if (renderDayCell) {
										return (
											<div key={date.toISOString()} className={styles.dayCell}>
												{renderDayCell(cellProps)}
											</div>
										);
									}

									return (
										<div
											key={date.toISOString()}
											role='gridcell'
											className={cn(
												styles.dayCell,
												styles.dayCellSurface,
												!inMonth ? styles.dayOutside : '',
												selected ? styles.daySelected : '',
												today && !selected ? styles.dayToday : '',
											)}
											aria-current={today ? 'date' : undefined}
											aria-selected={selected}
										>
											<button
												type='button'
												className={styles.dayNumberBtn}
												onClick={() => {
													setSelectedDate(date);
													setViewDate(date);
												}}
												onDoubleClick={() => {
													setSelectedDate(date);
													setViewDate(date);
													setView('day');
												}}
												aria-label={t('calendarBoard.dayWithoutTasks', {
													day: date.getDate(),
													month: months[date.getMonth()] ?? '',
												})}
												aria-pressed={selected}
											>
												<span className={styles.dayNumber}>
													{date.getDate()}
												</span>
											</button>
											<div className={styles.dayChips}>
												{visible.map((task) => (
													<CalendarBoardTaskChip
														key={task.id}
														task={task}
														layout='chip'
													/>
												))}
												{overflow > 0 && (
													<span className={styles.dayMore}>
														{t('calendarBoard.moreTasks', {count: overflow})}
													</span>
												)}
											</div>
										</div>
									);
								})}
							</div>

							{laneCount > 0 && (
								<div className={styles.spanTrack}>
									{Array.from({length: laneCount}, (_, lane) => (
										<div key={lane} className={styles.spanLane}>
											{layer?.packed
												.filter((entry) => entry.lane === lane)
												.map(({item, segment}) => (
													<div
														key={
															`${item.id}-${weekIndex}-${segment.startIndex}-${lane}`
														}
														className={styles.spanSlot}
														style={{
															gridColumn: `${segment.startIndex + 1} / ${
																segment.endIndex + 2
															}`,
														}}
														data-task-id={item.id}
													>
														<CalendarBoardTaskChip
															task={item}
															layout='bar'
															continuesBefore={segment.continuesBefore}
															continuesAfter={segment.continuesAfter}
														/>
													</div>
												))}
										</div>
									))}
								</div>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
});

CalendarBoardMonth.displayName = 'CalendarBoard.Month';
