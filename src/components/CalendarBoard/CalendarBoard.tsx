import {CalendarBoardProvider} from './CalendarBoard.context';
import {
	CalendarBoardRoot,
	CalendarBoardHeader,
	CalendarBoardTitle,
	CalendarBoardNav,
	CalendarBoardViewSwitch,
} from './CalendarBoard.chrome';
import {
	CalendarBoardBody,
	CalendarBoardMonth,
	CalendarBoardWeek,
	CalendarBoardDay,
	CalendarBoardYear,
} from './CalendarBoard.views';
import {CalendarBoardTaskChip} from './CalendarBoard.TaskChip';

/**
 * Составная календарная доска: Month / Week / Day / Year + TaskChip с общим hover по сегментам
 * (внешний hover-store, без перерисовки ячеек).
 *
 * @component
 * @example
 * ```tsx
 * <CalendarBoard.Provider tasks={tasks} defaultView="month">
 *   <CalendarBoard.Root>
 *     <CalendarBoard.Header>
 *       <CalendarBoard.Nav />
 *       <CalendarBoard.Title />
 *       <CalendarBoard.ViewSwitch />
 *     </CalendarBoard.Header>
 *     <CalendarBoard.Body />
 *   </CalendarBoard.Root>
 * </CalendarBoard.Provider>
 * ```
 */
export const CalendarBoard = Object.assign(CalendarBoardProvider, {
	Provider: CalendarBoardProvider,
	Root: CalendarBoardRoot,
	Header: CalendarBoardHeader,
	Title: CalendarBoardTitle,
	Nav: CalendarBoardNav,
	ViewSwitch: CalendarBoardViewSwitch,
	Body: CalendarBoardBody,
	Month: CalendarBoardMonth,
	Week: CalendarBoardWeek,
	Day: CalendarBoardDay,
	Year: CalendarBoardYear,
	TaskChip: CalendarBoardTaskChip,
});
