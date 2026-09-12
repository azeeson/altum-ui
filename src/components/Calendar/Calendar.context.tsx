import React, {createContext, useState} from 'react';
import {useRequiredContext} from '../../hooks/useRequiredContext';
import {buildMonthDays, type DateRangeValue} from './Calendar.utils';
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
	return useRequiredContext(
		CalendarContext,
		`${component} должен использоваться внутри Calendar.Provider`,
	);
}

function getYearPageStart(year: number): number {
	return Math.floor(year / YEARS_PER_PAGE) * YEARS_PER_PAGE;
}

const EMPTY_RANGE: DateRangeValue = {};

function isDateRangeValue(value: Date | DateRangeValue | undefined): value is DateRangeValue {
	return value != null && !(value instanceof Date);
}

export const CalendarProvider: React.FC<CalendarProviderProps> = ({
	selectionMode = 'single',
	value,
	onChange,
	viewDate: controlledViewDate,
	onViewDateChange,
	renderDayCell,
	children,
}) => {
	const rangeValue = selectionMode === 'range' && isDateRangeValue(value) ? value : EMPTY_RANGE;
	const singleValue = selectionMode === 'single' && value instanceof Date ? value : undefined;
	const initialView = controlledViewDate
		?? singleValue
		?? rangeValue.end
		?? rangeValue.start
		?? new Date();
	const [internalViewDate, setInternalViewDate] = useState(initialView);
	const [view, setView] = useState<CalendarViewMode>('days');
	const [yearPageStart, setYearPageStart] = useState(() =>
		getYearPageStart(initialView.getFullYear()));

	const viewDate = controlledViewDate ?? internalViewDate;
	const year = viewDate.getFullYear();
	const month = viewDate.getMonth();

	const setViewDate = (date: Date) => {
		if (controlledViewDate === undefined) setInternalViewDate(date);
		onViewDateChange?.(date);
	};

	const shiftView = (delta: number) => {
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
	};

	return (
		<CalendarContext.Provider
			value={{
				selectionMode,
				value: singleValue,
				onChange: (date) => onChange?.(date),
				rangeValue,
				onRangeChange: (range) => onChange?.(range),
				viewDate,
				year,
				month,
				days: buildMonthDays(year, month),
				view,
				setView: (mode) => {
					if (mode === 'years') setYearPageStart(getYearPageStart(year));
					setView(mode);
				},
				yearPageStart,
				setViewDate,
				shiftView,
				selectMonth: (monthIndex) => {
					setViewDate(new Date(year, monthIndex, 1));
					setView('days');
				},
				selectYear: (nextYear) => {
					setViewDate(new Date(nextYear, month, 1));
					setYearPageStart(getYearPageStart(nextYear));
					setView('months');
				},
				renderDayCell,
			}}
		>
			{children}
		</CalendarContext.Provider>
	);
};

CalendarProvider.displayName = 'Calendar.Provider';
