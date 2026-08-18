import React, {forwardRef} from 'react';
import {CalendarSchedule} from './CalendarBoard.Schedule';
import {
	useCalendarBoard,
	type CalendarBoardTask,
} from './CalendarBoard.context';
import {CalendarBoardTaskChip} from './CalendarBoard.TaskChip';
import type {
	CalendarBoardDayProps,
	CalendarBoardWeekProps,
} from './CalendarBoard.types';

const ScheduleView = forwardRef<HTMLDivElement, {
	daysCount: 1 | 7;
	showHeader?: boolean;
	showNav?: boolean;
} & Omit<React.ComponentPropsWithoutRef<'div'>, 'children'>>(
	function ScheduleView({
		daysCount,
		className,
		showHeader = false,
		showNav = false,
		...rest
	}, ref) {
		const {
			viewDate,
			setViewDate,
			selectedDate,
			setSelectedDate,
			tasks,
			weekStartsOn,
			dayStartHour,
			dayEndHour,
			hourHeight,
			onTaskClick,
		} = useCalendarBoard(daysCount === 1 ? 'CalendarBoard.Day' : 'CalendarBoard.Week');

		return (
			<CalendarSchedule
				ref={ref}
				className={className}
				viewDate={viewDate}
				onViewDateChange={setViewDate}
				daysCount={daysCount}
				weekStartsOn={weekStartsOn}
				events={tasks}
				dayStartHour={dayStartHour}
				dayEndHour={dayEndHour}
				hourHeight={hourHeight}
				selectedDate={selectedDate}
				onSelectDate={setSelectedDate}
				onEventClick={onTaskClick}
				showHeader={showHeader}
				showNav={showNav}
				{...rest}
				renderSpanEvent={({event, continuesBefore, continuesAfter}) => {
					const task = event as CalendarBoardTask;
					return (
						<CalendarBoardTaskChip
							task={task}
							layout='bar'
							continuesBefore={continuesBefore}
							continuesAfter={continuesAfter}
						/>
					);
				}}
				renderTimedEvent={({event, timeLabel, heightPercent}) => {
					const task = event as CalendarBoardTask;
					const compact = heightPercent < 8;
					const label = compact ? undefined : timeLabel;
					return (
						<CalendarBoardTaskChip
							task={task}
							layout='timed'
							timeLabel={label}
						/>
					);
				}}
			/>
		);
	},
);

ScheduleView.displayName = 'CalendarBoard.ScheduleView';

export const CalendarBoardWeek = forwardRef<HTMLDivElement, CalendarBoardWeekProps>(
	function CalendarBoardWeek({
		className,
		showScheduleHeader = false,
		showScheduleNav = false,
		...rest
	}, ref) {
		return (
			<ScheduleView
				ref={ref}
				daysCount={7}
				className={className}
				showHeader={showScheduleHeader}
				showNav={showScheduleNav}
				{...rest}
			/>
		);
	},
);

CalendarBoardWeek.displayName = 'CalendarBoard.Week';

export const CalendarBoardDay = forwardRef<HTMLDivElement, CalendarBoardDayProps>(
	function CalendarBoardDay({
		className,
		showScheduleHeader = false,
		showScheduleNav = false,
		...rest
	}, ref) {
		return (
			<ScheduleView
				ref={ref}
				daysCount={1}
				className={className}
				showHeader={showScheduleHeader}
				showNav={showScheduleNav}
				{...rest}
			/>
		);
	},
);

CalendarBoardDay.displayName = 'CalendarBoard.Day';
