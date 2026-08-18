import React, {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState,
	useSyncExternalStore,
} from 'react';
import {startOfDay} from '../Calendar/Calendar.utils';
import {
	createCalendarBoardHoverStore,
	type CalendarBoardHoverStore,
} from './calendarBoardHoverStore';
import type {
	CalendarBoardContextValue,
	CalendarBoardProviderProps,
	CalendarBoardView,
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

const CalendarBoardContext = createContext<CalendarBoardContextValue | null>(null);

const CalendarBoardHoverStoreContext = createContext<CalendarBoardHoverStore | null>(null);

export function useCalendarBoard(component: string): CalendarBoardContextValue {
	const context = useContext(CalendarBoardContext);
	if (!context) {
		throw new Error(`${component} должен использоваться внутри CalendarBoard.Provider`);
	}
	return context;
}

function useCalendarBoardHoverStore(component: string): CalendarBoardHoverStore {
	const store = useContext(CalendarBoardHoverStoreContext);
	if (!store) {
		throw new Error(`${component} должен использоваться внутри CalendarBoard.Provider`);
	}
	return store;
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

export const CalendarBoardProvider: React.FC<CalendarBoardProviderProps> = ({
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
}) => {
	const [internalView, setInternalView] = useState<CalendarBoardView>(defaultView);
	const [internalViewDate, setInternalViewDate] = useState(() =>
		startOfDay(defaultViewDate ?? controlledSelectedDate ?? new Date()),);
	const [internalSelected, setInternalSelected] = useState<Date | undefined>(() =>
		controlledSelectedDate ? startOfDay(controlledSelectedDate) : undefined,);
	const [hoverStore] = useState(() => createCalendarBoardHoverStore());

	const view = controlledView ?? internalView;
	const viewDate = controlledViewDate
		? startOfDay(controlledViewDate)
		: internalViewDate;
	const selectedDate = controlledSelectedDate !== undefined
		? (controlledSelectedDate ? startOfDay(controlledSelectedDate) : undefined)
		: internalSelected;

	const setView = useCallback((next: CalendarBoardView) => {
		if (controlledView === undefined) setInternalView(next);
		onViewChange?.(next);
	}, [controlledView, onViewChange]);

	const setViewDate = useCallback((next: Date) => {
		const normalized = startOfDay(next);
		if (controlledViewDate === undefined) setInternalViewDate(normalized);
		onViewDateChange?.(normalized);
	}, [controlledViewDate, onViewDateChange]);

	const setSelectedDate = useCallback((next: Date) => {
		const normalized = startOfDay(next);
		if (controlledSelectedDate === undefined) setInternalSelected(normalized);
		onSelectedDateChange?.(normalized);
	}, [controlledSelectedDate, onSelectedDateChange]);

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

CalendarBoardProvider.displayName = 'CalendarBoard';
