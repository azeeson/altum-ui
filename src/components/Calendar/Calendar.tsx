import {CalendarProvider} from './Calendar.context';
import {
	CalendarRoot,
	CalendarHeader,
	CalendarTitle,
	CalendarNav,
	CalendarBody,
} from './Calendar.slots';

/**
 * Календарь выбора даты с переключением сеток дней, месяцев и лет.
 * Составной API: `Calendar.Provider`, `.Root`, `.Header`, `.Title`, `.Nav`, `.Body`.
 *
 * @component
 * @example
 * <Calendar.Provider value={date} onChange={setDate}>
 *   <Calendar.Root>
 *     <Calendar.Header>
 *       <Calendar.Nav direction="prev" />
 *       <Calendar.Title />
 *       <Calendar.Nav direction="next" />
 *     </Calendar.Header>
 *     <Calendar.Body />
 *   </Calendar.Root>
 * </Calendar.Provider>
 */
export const Calendar = Object.assign(
	{
		Provider: CalendarProvider,
		Root: CalendarRoot,
		Header: CalendarHeader,
		Title: CalendarTitle,
		Nav: CalendarNav,
		Body: CalendarBody,
	},
	{displayName: 'Calendar'},
);
