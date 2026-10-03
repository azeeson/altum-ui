import {useCalendarBoard} from './CalendarBoard.context';
import {CalendarBoardMonth} from './CalendarBoard.MonthView';
import {CalendarBoardWeek, CalendarBoardDay} from './CalendarBoard.ScheduleView';
import {CalendarBoardYear} from './CalendarBoard.YearView';
import styles from './CalendarBoard.module.css';
import {cn} from '../../core/utils/cn';
import type {CalendarBoardBodyProps} from './CalendarBoard.types';

export type {CalendarBoardMonthProps} from './CalendarBoard.types';
export type {CalendarBoardWeekProps, CalendarBoardDayProps} from './CalendarBoard.types';
export type {CalendarBoardYearProps} from './CalendarBoard.types';
export type {CalendarBoardBodyProps} from './CalendarBoard.types';

export {CalendarBoardMonth} from './CalendarBoard.MonthView';
export {CalendarBoardWeek, CalendarBoardDay} from './CalendarBoard.ScheduleView';
export {CalendarBoardYear} from './CalendarBoard.YearView';

export const CalendarBoardBody = ({
	className,
	monthProps,
	weekProps,
	dayProps,
	yearProps,
	rootRef,
	...rest
}: CalendarBoardBodyProps) => {
	const {view} = useCalendarBoard('CalendarBoard.Body');

	return (
		<div
			{...rest}
			ref={rootRef}
			className={cn(styles.body, className)}
			data-view={view}
		>
			{view === 'month' && <CalendarBoardMonth {...monthProps} />}
			{view === 'week' && <CalendarBoardWeek {...weekProps} />}
			{view === 'day' && <CalendarBoardDay {...dayProps} />}
			{view === 'year' && <CalendarBoardYear {...yearProps} />}
		</div>
	);
};
