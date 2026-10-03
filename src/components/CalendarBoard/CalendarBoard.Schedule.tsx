import {
	useCallback,
	useId,
	useMemo,
	useState,
	type CSSProperties,
	type MouseEvent,
} from 'react';
import {
	addDays,
	buildDayStrip,
	formatMonthYear,
	isSameDay,
	isToday,
	startOfDay,
	weekdayLabelFor,
} from '../Calendar/Calendar.utils';
import {
	buildHourMarks,
	clipEventToDay,
	packSpanSegments,
	packTimedEventsInDay,
	resolveAllDay,
	segmentSpanInColumns,
} from './calendar.schedule';
import {formatHourTime} from '../../core/utils/date';
import {CalendarBoardEvent} from './CalendarBoard.Event';
import {PeriodHeader} from '../../base/PeriodHeader';
import unstyled from '../../styles/unstyledControl.module.css';
import chrome from '../../styles/calendarChrome.module.css';
import utilities from '../../styles/utilities.module.css';
import styles from './CalendarBoard.Schedule.module.css';
import {cn} from '../../core/utils/cn';
import {useLocale} from '../../locales/localeContext';
import {
	type CalendarScheduleProps,
	SCHEDULE_LANE_HEIGHT,
} from './CalendarBoard.Schedule.types';
import {formatTimeRange, resolveWindowStart} from './CalendarBoard.Schedule.utils';
import {ruSlice as ru_calendar} from '../../locales/slices/calendar.ru';
import {ruSlice as ru_calendarBoard} from '../../locales/slices/calendarBoard.ru';

const localeFallback = {
	calendar: ru_calendar,
	calendarBoard: ru_calendarBoard,
};




export type {
	CalendarScheduleEvent,
	CalendarScheduleSpanRenderProps,
	CalendarScheduleTimedRenderProps,
	CalendarScheduleProps,
} from './CalendarBoard.Schedule.types';

/**
 * Расписание на день или неделю: all-day полоски, почасовая сетка и timed-события.
 *
 * @component
 * @example
 * <CalendarSchedule
 *   viewDate={new Date()}
 *   events={events}
 *   daysCount={7}
 *   onEventClick={openEvent}
 * />
 */
export const CalendarSchedule = ({
	viewDate: controlledViewDate,
	onViewDateChange,
	daysCount = 7,
	weekStartsOn = 1,
	events = [],
	dayStartHour = 8,
	dayEndHour = 20,
	hourHeight = 48,
	selectedDate,
	onSelectDate,
	onEventClick,
	showHeader = true,
	showNav = true,
	className,
	'aria-label': ariaLabel,
	renderSpanEvent,
	renderTimedEvent,
	style,
	rootRef,
	...rest
}: CalendarScheduleProps) => {
	const {messages} = useLocale(localeFallback);
	const {months, weekdaysShort} = messages.calendar;
	const labelId = useId();
	const [internalViewDate, setInternalViewDate] = useState(() => (
		startOfDay(controlledViewDate ?? selectedDate ?? new Date())
	));

	const anchorDate = controlledViewDate
		? startOfDay(controlledViewDate)
		: internalViewDate;

	const setViewDate = useCallback((next: Date) => {
		const normalized = startOfDay(next);
		if (controlledViewDate === undefined) {
			setInternalViewDate(normalized);
		}
		onViewDateChange?.(normalized);
	}, [controlledViewDate, onViewDateChange]);

	const windowStart = useMemo(
		() => resolveWindowStart(anchorDate, daysCount, weekStartsOn),
		[anchorDate, daysCount, weekStartsOn],
	);

	const columns = useMemo(
		() => buildDayStrip(windowStart, daysCount),
		[daysCount, windowStart],
	);

	const hours = useMemo(
		() => buildHourMarks(dayStartHour, dayEndHour),
		[dayEndHour, dayStartHour],
	);

	const gridHeight = Math.max(0, dayEndHour - dayStartHour) * hourHeight;

	const selected = selectedDate ? startOfDay(selectedDate) : undefined;

	const shift = (direction: -1 | 1) => {
		if (daysCount === 1) {
			setViewDate(addDays(anchorDate, direction));
			return;
		}
		setViewDate(addDays(windowStart, direction * (daysCount === 5 ? 7 : daysCount)));
	};
	const goPrev = () => shift(-1);
	const goNext = () => shift(1);

	const allDayPacked = useMemo(() => {
		const entries = events
			.filter(resolveAllDay)
			.map((event) => {
				const segment = segmentSpanInColumns(event.start, event.end, columns);
				if (!segment) return null;
				return {
					item: event,
					segment
				};
			})
			.filter((entry): entry is NonNullable<typeof entry> => entry !== null);

		return packSpanSegments(entries);
	}, [columns, events]);

	const timedByDay = useMemo(() => {
		return columns.map((day) => {
			const dayEvents = events
				.filter((event) => !resolveAllDay(event))
				.map((event) => {
					const clipped = clipEventToDay(event.start, event.end, day);
					if (!clipped) return null;
					return {
						item: event,
						start: clipped.start,
						end: clipped.end
					};
				})
				.filter((entry): entry is NonNullable<typeof entry> => entry !== null);

			return packTimedEventsInDay(dayEvents, dayStartHour, dayEndHour);
		});
	}, [
		columns,
		dayEndHour,
		dayStartHour,
		events
	]);

	const headerLabel = (() => {
		if (daysCount !== 1) {
			return formatMonthYear(selected ?? columns[0] ?? anchorDate, months);
		}
		const day = columns[0]!;
		const weekday = weekdayLabelFor(day, weekStartsOn, weekdaysShort);
		return `${weekday}, ${day.getDate()} ${formatMonthYear(day, months)}`;
	})();

	const allDayHeight = Math.max(allDayPacked.laneCount, 1) * SCHEDULE_LANE_HEIGHT + 8;

	const rootStyle = {
		'--local-columns': String(daysCount),
		'--local-hour-height': `${hourHeight}px`,
		'--local-all-day-height': `${allDayHeight}px`,
		'--local-grid-height': `${gridHeight}px`,
		...style,
	} as CSSProperties;

	const activate = (event: MouseEvent<HTMLDivElement>) => {
		const eventNode = (event.target as HTMLElement).closest('[data-event-id],[data-task-id]');
		if (eventNode instanceof HTMLElement) {
			const id = eventNode.dataset.eventId ?? eventNode.dataset.taskId;
			const item = events.find((entry) => entry.id === id);
			if (item) onEventClick?.(item);
			return;
		}
		const button = (event.target as HTMLElement).closest('button[data-date]');
		if (!(button instanceof HTMLButtonElement) || !button.dataset.date) return;
		const date = new Date(button.dataset.date);
		if (!Number.isNaN(date.getTime())) onSelectDate?.(startOfDay(date));
	};

	return (
		<div
			{...rest}
			ref={rootRef}
			className={cn(styles.root, className)}
			role='region'
			aria-label={ariaLabel ?? messages.calendarBoard.scheduleAria}
			aria-labelledby={showHeader ? labelId : undefined}
			style={rootStyle}
			onClick={activate}
		>
			<PeriodHeader
				title={headerLabel}
				titleId={labelId}
				showTitle={showHeader}
				showNav={showNav}
				onPrev={goPrev}
				onNext={goNext}
				prevLabel={messages.calendarBoard.prevPeriod}
				nextLabel={messages.calendarBoard.nextPeriod}
			/>

			<div className={styles.gutterRow}>
				<div className={styles.gutterCorner} aria-hidden='true' />
				<div className={styles.cols}>
					{columns.map((date) => {
						const isSelected = selected ? isSameDay(date, selected) : false;
						const today = isToday(date);
						const label = weekdayLabelFor(date, weekStartsOn, weekdaysShort);

						return (
							<button
								key={date.toISOString()}
								type='button'
								className={cn(unstyled.control, utilities.fCenter, chrome.cell, styles.dayHeader)}
								data-date={date.toISOString()}
								data-selected={isSelected ? '' : undefined}
								data-today={today ? '' : undefined}
								aria-pressed={onSelectDate ? isSelected : undefined}
								aria-current={today ? 'date' : undefined}
							>
								<span className={styles.dayWeekday}>
									{label}
								</span>
								<span className={styles.dayNumber}>
									{date.getDate()}
								</span>
							</button>
						);
					})}
				</div>
			</div>

			<div className={styles.gutterRow} aria-label={messages.calendarBoard.allDay}>
				<div className={styles.gutterLabel}>
					{messages.calendarBoard.allDayShort}
				</div>
				<div className={cn(styles.cols, styles.allDayTrack)}>
					{columns.map((date) => (
						<div
							key={`allday-cell-${date.toISOString()}`}
							className={styles.allDayCell}
						/>
					))}
					{allDayPacked.packed.map(({item, segment, lane}) => {
						const span = segment.endIndex - segment.startIndex + 1;
						const leftPercent = (segment.startIndex / daysCount) * 100;
						const widthPercent = (span / daysCount) * 100;
						const node = renderSpanEvent
							? renderSpanEvent({
								event: item,
								continuesBefore: segment.continuesBefore,
								continuesAfter: segment.continuesAfter,
								lane,
							})
							: (
								<CalendarBoardEvent
									title={item.title}
									color={item.color}
									continuesBefore={segment.continuesBefore}
									continuesAfter={segment.continuesAfter}
									data-event-id={onEventClick ? item.id : undefined}
								/>
							);

						return (
							<div
								key={`span-${item.id}-${segment.startIndex}`}
								className={styles.spanSlot}
								style={{
									'--local-span-left': `calc(${leftPercent}% + 2px)`,
									'--local-span-width': `calc(${widthPercent}% - 4px)`,
									'--local-span-top': `${4 + lane * SCHEDULE_LANE_HEIGHT}px`,
									'--local-span-height': `${SCHEDULE_LANE_HEIGHT - 2}px`,
								} as CSSProperties}
							>
								{node}
							</div>
						);
					})}
				</div>
			</div>

			<div className={cn(styles.gutterRow, styles.timeGrid)}>
				<div className={styles.gutter}>
					{hours.map((hour) => (
						<div
							key={hour}
							className={styles.hourMark}
						>
							<span className={styles.hourLabel}>
								{formatHourTime(hour)}
							</span>
						</div>
					))}
				</div>

				<div
					className={cn(styles.cols, styles.columns)}
					role='grid'
					aria-colcount={daysCount}
				>
					{columns.map((date, columnIndex) => {
						const today = isToday(date);
						const packed = timedByDay[columnIndex] ?? [];

						return (
							<div
								key={date.toISOString()}
								className={styles.column}
								data-today={today ? '' : undefined}
								role='gridcell'
								aria-label={`${weekdayLabelFor(date, weekStartsOn, weekdaysShort)} ${date.getDate()}`}
							>
								{hours.map((hour) => (
									<div
										key={`${date.toISOString()}-${hour}`}
										className={styles.hourLine}
									/>
								))}

								<div className={styles.eventsLayer}>
									{packed.map(({item, layout, lane, laneCount}) => {
										const width = 100 / laneCount;
										const left = lane * width;
										const timeLabel = formatTimeRange(layout.start, layout.end);
										const node = renderTimedEvent
											? renderTimedEvent({
												event: item,
												start: layout.start,
												end: layout.end,
												topPercent: layout.topPercent,
												heightPercent: layout.heightPercent,
												lane,
												laneCount,
												timeLabel,
											})
											: (
												<CalendarBoardEvent
													layout='timed'
													title={item.title}
													timeLabel={timeLabel}
													color={item.color}
													data-event-id={onEventClick ? item.id : undefined}
												/>
											);

										return (
											<div
												key={`timed-${item.id}-${layout.start.getTime()}`}
												className={styles.timedSlot}
												style={{
													'--local-event-top': `${layout.topPercent}%`,
													'--local-event-height': `${layout.heightPercent}%`,
													'--local-event-left': `calc(${left}% + 2px)`,
													'--local-event-width': `calc(${width}% - 4px)`,
												} as CSSProperties}
											>
												{node}
											</div>
										);
									})}
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
};
