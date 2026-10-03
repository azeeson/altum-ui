import type {PointerEvent} from 'react';
import {CalendarSchedule} from './CalendarBoard.Schedule';
import {
	hoverTaskFromPointer,
	useCalendarBoard,
	useCalendarBoardHoverStore,
	type CalendarBoardTask,
} from './CalendarBoard.context';
import {CalendarBoardTaskChip} from './CalendarBoard.TaskChip';
import type {
	CalendarBoardDayProps,
	CalendarBoardWeekProps,
} from './CalendarBoard.types';

const ScheduleView = ({
	daysCount,
	className,
	showHeader = false,
	showNav = false,
	rootRef,
	...rest
}: {
	daysCount: 1 | 7;
	showHeader?: boolean;
	showNav?: boolean;
	rootRef?: CalendarBoardWeekProps['rootRef'];
} & Omit<CalendarBoardWeekProps, 'showScheduleHeader' | 'showScheduleNav' | 'rootRef'>) => {
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
	const hoverStore = useCalendarBoardHoverStore(
		daysCount === 1 ? 'CalendarBoard.Day' : 'CalendarBoard.Week',
	);
	const hoverTask = (event: PointerEvent<HTMLDivElement>) => {
		hoverTaskFromPointer(hoverStore, event);
	};

	return (
		<CalendarSchedule
			rootRef={rootRef}
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
			onPointerOver={hoverTask}
			renderSpanEvent={({event, continuesBefore, continuesAfter}) => (
				<CalendarBoardTaskChip
					task={event as CalendarBoardTask}
					layout='bar'
					continuesBefore={continuesBefore}
					continuesAfter={continuesAfter}
				/>
			)}
			renderTimedEvent={({event, timeLabel, heightPercent}) => (
				<CalendarBoardTaskChip
					task={event as CalendarBoardTask}
					layout='timed'
					timeLabel={heightPercent < 8 ? undefined : timeLabel}
				/>
			)}
		/>
	);
};

export const CalendarBoardWeek = ({
	className,
	showScheduleHeader = false,
	showScheduleNav = false,
	rootRef,
	...rest
}: CalendarBoardWeekProps) => (
	<ScheduleView
		rootRef={rootRef}
		daysCount={7}
		className={className}
		showHeader={showScheduleHeader}
		showNav={showScheduleNav}
		{...rest}
	/>
);

export const CalendarBoardDay = ({
	className,
	showScheduleHeader = false,
	showScheduleNav = false,
	rootRef,
	...rest
}: CalendarBoardDayProps) => (
	<ScheduleView
		rootRef={rootRef}
		daysCount={1}
		className={className}
		showHeader={showScheduleHeader}
		showNav={showScheduleNav}
		{...rest}
	/>
);
