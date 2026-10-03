import {
	createContext,
	useCallback,
	useMemo,
	useState,
	useSyncExternalStore,
} from 'react';
import {getCtx} from '../../core/utils/bundle';
import {useControlledStateWithCallback} from '../../hooks/useControlledState';
import {startOfDay} from '../Calendar/Calendar.utils';
import {
	createCalendarBoardHoverStore,
	type CalendarBoardHoverStore,
} from './calendarBoardHoverStore';
import type {
	CalendarBoardContextValue,
	CalendarBoardProviderProps,
} from './CalendarBoard.types';

export type {
	CalendarBoardView,
	CalendarBoardTask,
	CalendarBoardTaskLayout,
	CalendarBoardTaskRenderProps,
	CalendarBoardDayCellRenderProps,
	CalendarBoardYearMonthRenderProps,
	CalendarBoardContextValue,
	CalendarBoardProviderProps,
} from './CalendarBoard.types';

const CalendarBoardContext = createContext<CalendarBoardContextValue | undefined>(undefined);

const CalendarBoardHoverStoreContext = createContext<CalendarBoardHoverStore | undefined>(undefined);

export function useCalendarBoard(component: string): CalendarBoardContextValue {
	return getCtx(
		CalendarBoardContext,
		`${component} должен использоваться внутри CalendarBoard.Provider`,
	);
}

export function useCalendarBoardHoverStore(component: string): CalendarBoardHoverStore {
	return getCtx(
		CalendarBoardHoverStoreContext,
		`${component} должен использоваться внутри CalendarBoard.Provider`,
	);
}

/**
 * Подсветка задачи по `taskId` через внешний hover-store (`useSyncExternalStore`).
 * Меняется только boolean для затронутых id — ячейки доски не перерисовываются.
 *
 * @param taskId - id задачи / сегмента
 * @returns `highlighted` и обработчики pointer enter/leave
 *
 * @example
 * const {highlighted, onMouseEnter, onMouseLeave} = useCalendarBoardTaskHover(task.id);
 */
export function useCalendarBoardTaskHover(taskId: string): {
	highlighted: boolean;
	onMouseEnter: () => void;
	onMouseLeave: () => void;
} {
	const store = useCalendarBoardHoverStore('useCalendarBoardTaskHover');
	const highlighted = useSyncExternalStore(
		store.subscribe,
		() => store.getSnapshot() === taskId,
		() => false,
	);

	return {
		highlighted,
		onMouseEnter: () => store.setHovered(taskId),
		onMouseLeave: () => store.setHovered(null),
	};
}

/**
 * Контекст `CalendarBoard.Provider` для кастомных ячеек / задач вне составных частей.
 * Бросает ошибку вне Provider.
 *
 * @returns Состояние доски (view, tasks, callbacks). Hover — через {@link useCalendarBoardTaskHover}.
 *
 * @example
 * const {tasks, setView} = useCalendarBoardContext();
 */
export function useCalendarBoardContext(): CalendarBoardContextValue {
	return useCalendarBoard('useCalendarBoardContext');
}

export const CalendarBoardProvider = ({
	children,
	view: controlledView,
	defaultView = 'month',
	onViewChange,
	viewDate: controlledViewDate,
	defaultViewDate,
	onViewDateChange,
	selectedDate: controlledSelectedDate,
	onSelectedDateChange,
	tasks = [],
	weekStartsOn = 1,
	dayStartHour = 0,
	dayEndHour = 24,
	hourHeight = 48,
	onTaskClick,
	renderTask,
	renderDayCell,
	renderYearMonth,
}: CalendarBoardProviderProps) => {
	const [hoverStore] = useState(createCalendarBoardHoverStore);
	const [view, setView] = useControlledStateWithCallback(
		controlledView,
		defaultView,
		onViewChange,
	);
	const [viewDate, setViewDateRaw] = useControlledStateWithCallback(
		controlledViewDate !== undefined ? startOfDay(controlledViewDate) : undefined,
		startOfDay(defaultViewDate ?? controlledSelectedDate ?? new Date()),
		onViewDateChange,
	);
	const [selectedDate, setSelectedDateRaw] = useControlledStateWithCallback<Date | undefined>(
		controlledSelectedDate !== undefined
			? (controlledSelectedDate ? startOfDay(controlledSelectedDate) : undefined)
			: undefined,
		controlledSelectedDate ? startOfDay(controlledSelectedDate) : undefined,
		onSelectedDateChange
			? (next) => {
				if (next) onSelectedDateChange(next);
			}
			: undefined,
	);

	const setViewDate = useCallback((next: Date) => setViewDateRaw(startOfDay(next)), [setViewDateRaw]);
	const setSelectedDate = useCallback((next: Date) => setSelectedDateRaw(startOfDay(next)), [setSelectedDateRaw]);

	const value = useMemo<CalendarBoardContextValue>(() => ({
		view,
		setView,
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
		renderTask,
		renderDayCell,
		renderYearMonth,
	}), [
		dayEndHour,
		dayStartHour,
		hourHeight,
		onTaskClick,
		renderDayCell,
		renderTask,
		renderYearMonth,
		selectedDate,
		setSelectedDate,
		setView,
		setViewDate,
		tasks,
		view,
		viewDate,
		weekStartsOn,
	]);

	return (
		<CalendarBoardHoverStoreContext.Provider value={hoverStore}>
			<CalendarBoardContext.Provider value={value}>
				{children}
			</CalendarBoardContext.Provider>
		</CalendarBoardHoverStoreContext.Provider>
	);
};

export function hoverTaskFromPointer(
	store: CalendarBoardHoverStore,
	event: {target: EventTarget | null},
) {
	const node = event.target instanceof Element
		? event.target.closest('[data-task-id]')
		: null;
	store.setHovered(node instanceof HTMLElement ? (node.dataset.taskId ?? null) : null);
}
