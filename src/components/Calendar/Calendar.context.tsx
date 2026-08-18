import React, {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState,
} from 'react';
import {
	buildMonthDays,
	type DateRangeValue,
} from './Calendar.utils';
import {
	type CalendarProviderProps,
	type CalendarViewMode,
	type CalendarContextValue,
	YEARS_PER_PAGE,
} from './Calendar.types';

export type {
	CalendarViewMode,
	CalendarSelectionMode,
	CalendarDayCellRenderProps,
	CalendarContextValue,
} from './Calendar.types';

const CalendarContext = createContext<CalendarContextValue | null>(null);

export function useCalendarContext(component: string): CalendarContextValue {
	const context = useContext(CalendarContext);
	if (!context) {
		throw new Error(`${component} должен использоваться внутри Calendar.Provider`);
	}
	return context;
}

function getYearPageStart(year: number): number {
	return Math.floor(year / YEARS_PER_PAGE) * YEARS_PER_PAGE;
}

const EMPTY_RANGE: DateRangeValue = {};

export const CalendarProvider: React.FC<CalendarProviderProps> = ({
	selectionMode = 'single',
	value,
	onChange,
	rangeValue: rangeValueProp,
	onRangeChange,
	viewDate: controlledViewDate,
	onViewDateChange,
	renderDayCell,
	children,
}) => {
	const rangeValue = rangeValueProp ?? EMPTY_RANGE;
	const initialView = controlledViewDate
		?? value
		?? rangeValue.end
		?? rangeValue.start
		?? new Date();
	const [internalViewDate, setInternalViewDate] = useState(initialView);
	const [view, setView] = useState<CalendarViewMode>('days');
	const [yearPageStart, setYearPageStart] = useState(() =>
		getYearPageStart(initialView.getFullYear()),);

	const viewDate = controlledViewDate ?? internalViewDate;
	const year = viewDate.getFullYear();
	const month = viewDate.getMonth();
	const days = useMemo(() => buildMonthDays(year, month), [year, month]);

	const handleChange = useCallback((date: Date) => {
		onChange?.(date);
	}, [onChange]);

	const handleRangeChange = useCallback((range: DateRangeValue) => {
		onRangeChange?.(range);
	}, [onRangeChange]);

	const setViewDate = useCallback((date: Date) => {
		if (controlledViewDate === undefined) {
			setInternalViewDate(date);
		}
		onViewDateChange?.(date);
	}, [controlledViewDate, onViewDateChange]);

	const shiftView = useCallback((delta: number) => {
		if (view === 'days') {
			setViewDate(new Date(year, month + delta, 1));
			return;
		}

		if (view === 'months') {
			const next = new Date(year + delta, month, 1);
			setViewDate(next);
			setYearPageStart(getYearPageStart(next.getFullYear()));
			return;
		}

		setYearPageStart((current) => current + delta * YEARS_PER_PAGE);
	}, [
		month,
		setViewDate,
		view,
		year,
	]);

	const selectMonth = useCallback((monthIndex: number) => {
		setViewDate(new Date(year, monthIndex, 1));
		setView('days');
	}, [setViewDate, year]);

	const selectYear = useCallback((nextYear: number) => {
		setViewDate(new Date(nextYear, month, 1));
		setYearPageStart(getYearPageStart(nextYear));
		setView('months');
	}, [month, setViewDate]);

	const handleSetView = useCallback((mode: CalendarViewMode) => {
		if (mode === 'years') {
			setYearPageStart(getYearPageStart(year));
		}
		setView(mode);
	}, [year]);

	const contextValue = useMemo<CalendarContextValue>(() => ({
		selectionMode,
		value,
		onChange: handleChange,
		rangeValue,
		onRangeChange: handleRangeChange,
		viewDate,
		year,
		month,
		days,
		view,
		setView: handleSetView,
		yearPageStart,
		setViewDate,
		shiftView,
		selectMonth,
		selectYear,
		renderDayCell,
	}), [
		selectionMode,
		value,
		handleChange,
		rangeValue,
		handleRangeChange,
		viewDate,
		year,
		month,
		days,
		view,
		handleSetView,
		yearPageStart,
		setViewDate,
		shiftView,
		selectMonth,
		selectYear,
		renderDayCell,
	]);

	return (
		<CalendarContext.Provider value={contextValue}>
			{children}
		</CalendarContext.Provider>
	);
};

CalendarProvider.displayName = 'Calendar.Provider';
