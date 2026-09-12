import React, {
	forwardRef,
	useCallback,
	useId,
	useMemo,
	useState,
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
	formatHourLabel,
	packSpanSegments,
	packTimedEventsInDay,
	resolveAllDay,
	segmentSpanInColumns,
} from './calendar.schedule';
import {CalendarBoardEvent} from './CalendarBoard.Event';
import {PeriodHeader} from '../../base/PeriodHeader';
import unstyled from '../../styles/unstyledControl.module.css';
import chrome from '../../styles/calendarChrome.module.css';
import styles from './CalendarBoard.Schedule.module.css';
import {cn} from '../../utils/cn';
import {mergeStyles} from '../../utils/mergeStyles';
import {useLocale} from '../../locales/localeContext';
import {
	type CalendarScheduleProps,
	SCHEDULE_LANE_HEIGHT,
} from './CalendarBoard.Schedule.types';
import {formatTimeRange, resolveWindowStart} from './CalendarBoard.Schedule.utils';

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
export const CalendarSchedule = forwardRef<HTMLDivElement, CalendarScheduleProps>(function CalendarSchedule(
	{
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
		...rest
	},
	ref,
) {
	const {messages} = useLocale();
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

	const rootStyle = mergeStyles({
		'--altum-schedule-columns': String(daysCount),
		'--altum-schedule-hour-height': `${hourHeight}px`,
		'--altum-schedule-all-day-height': `${allDayHeight}px`,
	} as React.CSSProperties, style);

	return (
		<div
			ref={ref}
			className={cn(styles.root, className)}
			role='region'
			aria-label={ariaLabel ?? messages.calendarBoard.scheduleAria}
			aria-labelledby={showHeader ? labelId : undefined}
			style={rootStyle}
			{...rest}
		>
			<PeriodHeader
				title={headerLabel}
				titleId={labelId}
				showTitle={showHeader}
				showNav={showNav}
				onPrev={() => shift(-1)}
				onNext={() => shift(1)}
				prevLabel={messages.calendarBoard.prevPeriod}
				nextLabel={messages.calendarBoard.nextPeriod}
			/>

			<div className={styles.gutterRow}>
				<div className={styles.gutterCorner} aria-hidden='true' />
				<div
					className={styles.cols}
					style={{gridTemplateColumns: `repeat(${daysCount}, minmax(0, 1fr))`}}
				>
					{columns.map((date) => {
						const isSelected = selected ? isSameDay(date, selected) : false;
						const today = isToday(date);
						const label = weekdayLabelFor(date, weekStartsOn, weekdaysShort);

						return (
							<button
								key={date.toISOString()}
								type='button'
								className={cn(
									unstyled.control,
									chrome.cell,
									styles.dayHeader,
									isSelected ? chrome.selected : '',
									isSelected ? styles.dayHeaderSelected : '',
									today ? chrome.today : '',
								)}
								onClick={() => onSelectDate?.(startOfDay(date))}
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
				<div
					className={cn(styles.cols, styles.allDayTrack)}
					style={{
						gridTemplateColumns: `repeat(${daysCount}, minmax(0, 1fr))`,
						minHeight: allDayHeight,
					}}
				>
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
									onClick={onEventClick ? () => onEventClick(item) : undefined}
								/>
							);

						return (
							<div
								key={`span-${item.id}-${segment.startIndex}`}
								className={styles.spanSlot}
								style={{
									left: `calc(${leftPercent}% + 2px)`,
									width: `calc(${widthPercent}% - 4px)`,
									top: 4 + lane * SCHEDULE_LANE_HEIGHT,
									height: SCHEDULE_LANE_HEIGHT - 2,
								}}
							>
								{node}
							</div>
						);
					})}
				</div>
			</div>

			<div className={cn(styles.gutterRow, styles.timeGrid)} style={{height: gridHeight}}>
				<div className={styles.gutter}>
					{hours.map((hour) => (
						<div
							key={hour}
							className={styles.hourMark}
							style={{height: hourHeight}}
						>
							<span className={styles.hourLabel}>
								{formatHourLabel(hour)}
							</span>
						</div>
					))}
				</div>

				<div
					className={cn(styles.cols, styles.columns)}
					style={{gridTemplateColumns: `repeat(${daysCount}, minmax(0, 1fr))`}}
					role='grid'
					aria-colcount={daysCount}
				>
					{columns.map((date, columnIndex) => {
						const today = isToday(date);
						const packed = timedByDay[columnIndex] ?? [];

						return (
							<div
								key={date.toISOString()}
								className={cn(styles.column, today ? styles.columnToday : '')}
								role='gridcell'
								aria-label={`${weekdayLabelFor(date, weekStartsOn, weekdaysShort)} ${date.getDate()}`}
							>
								{hours.map((hour) => (
									<div
										key={`${date.toISOString()}-${hour}`}
										className={styles.hourLine}
										style={{height: hourHeight}}
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
													onClick={onEventClick ? () => onEventClick(item) : undefined}
												/>
											);

										return (
											<div
												key={`timed-${item.id}-${layout.start.getTime()}`}
												className={styles.timedSlot}
												style={{
													top: `${layout.topPercent}%`,
													height: `${layout.heightPercent}%`,
													left: `calc(${left}% + 2px)`,
													width: `calc(${width}% - 4px)`,
												}}
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
});

CalendarSchedule.displayName = 'CalendarBoard.Schedule';
