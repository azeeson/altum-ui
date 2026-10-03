import {useMemo, type CSSProperties, type MouseEvent, type PointerEvent} from 'react';
import {
	isSameDay,
	isToday,
	startOfDay,
	weekdayLabels,
} from '../Calendar/Calendar.utils';
import {
	packSpanSegments,
	resolveAllDay,
	segmentSpanByWeeks,
} from './calendar.schedule';
import {
	hoverTaskFromPointer,
	useCalendarBoard,
	useCalendarBoardHoverStore,
	type CalendarBoardDayCellRenderProps,
	type CalendarBoardTask,
} from './CalendarBoard.context';
import {CalendarBoardTaskChip} from './CalendarBoard.TaskChip';
import {buildMonthWeeks, calendarDateKey, isMultiDayTask} from './CalendarBoard.utils';
import styles from './CalendarBoard.module.css';
import unstyled from '../../styles/unstyledControl.module.css';
import {cn} from '../../core/utils/cn';
import {useLocale} from '../../locales/localeContext';

import type {CalendarBoardMonthProps} from './CalendarBoard.types';
import {ruSlice as ru_calendar} from '../../locales/slices/calendar.ru';
import {ruSlice as ru_calendarBoard} from '../../locales/slices/calendarBoard.ru';

const localeFallback = {
	calendar: ru_calendar,
	calendarBoard: ru_calendarBoard,
};




export type {CalendarBoardMonthProps} from './CalendarBoard.types';

export const CalendarBoardMonth = ({
	className,
	maxChipsPerDay = 3,
	rootRef,
	...rest
}: CalendarBoardMonthProps) => {
	const {messages, t} = useLocale(localeFallback);
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
		onTaskClick,
	} = useCalendarBoard('CalendarBoard.Month');
	const hoverStore = useCalendarBoardHoverStore('CalendarBoard.Month');

	const weeks = useMemo(
		() => buildMonthWeeks(viewDate, weekStartsOn),
		[viewDate, weekStartsOn],
	);

	const monthIndex = viewDate.getMonth();

	const weekdayRow = weekdayLabels(weekdaysShort, weekStartsOn);

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

	const hoverTask = (event: PointerEvent<HTMLDivElement>) => {
		hoverTaskFromPointer(hoverStore, event);
	};

	const activate = (event: MouseEvent<HTMLDivElement>) => {
		const taskNode = (event.target as HTMLElement).closest('[data-task-id]');
		if (taskNode instanceof HTMLElement && taskNode.dataset.taskId) {
			const task = tasks.find((item) => item.id === taskNode.dataset.taskId);
			if (task) onTaskClick?.(task);
			return;
		}
		const button = (event.target as HTMLElement).closest('button[data-date]');
		if (!(button instanceof HTMLButtonElement) || !button.dataset.date) return;
		const date = new Date(button.dataset.date);
		if (Number.isNaN(date.getTime())) return;
		setSelectedDate(date);
		setViewDate(date);
	};

	const openDay = (event: MouseEvent<HTMLDivElement>) => {
		const button = (event.target as HTMLElement).closest('button[data-date]');
		if (!(button instanceof HTMLButtonElement) || !button.dataset.date) return;
		const date = new Date(button.dataset.date);
		if (Number.isNaN(date.getTime())) return;
		setSelectedDate(date);
		setViewDate(date);
		setView('day');
	};

	return (
		<div
			{...rest}
			ref={rootRef}
			className={cn(styles.month, className)}
			onClick={activate}
			onDoubleClick={openDay}
			onPointerOver={hoverTask}
		>
			<div className={styles.weekdayRow} role='row'>
				{weekdayRow.map((label) => (
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
							style={{'--altum-calendar-board-span-height': `${trackHeight}px`} as CSSProperties}
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
											className={cn(styles.dayCell, styles.dayCellSurface)}
											data-outside={!inMonth ? '' : undefined}
											data-selected={selected ? '' : undefined}
											data-today={today && !selected ? '' : undefined}
											aria-current={today ? 'date' : undefined}
											aria-selected={selected}
										>
											<button
												type='button'
												className={cn(unstyled.control, styles.dayNumberBtn)}
												data-date={date.toISOString()}
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
															'--local-span-column': `${segment.startIndex + 1} / ${
																segment.endIndex + 2
															}`,
														} as CSSProperties}
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
};
