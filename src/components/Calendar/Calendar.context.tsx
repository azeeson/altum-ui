import React, {createContext, useContext, useMemo, useRef, useState} from 'react';
import {useLocale} from '../../locales/localeContext';
import type {TranslateFn} from '../../locales/translate';
import type {Messages} from '../../locales/types';
import {ruSlice as ru_calendar} from '../../locales/slices/calendar.ru';
import {
	type CalendarProviderProps,
	type CalendarViewMode,
	type CalendarContextValue,
	type DateRangeValue,
	YEARS_PER_PAGE,
} from './Calendar.types';

export type {
	CalendarViewMode,
	CalendarSelectionMode,
	CalendarDayCellRenderProps,
	CalendarContextValue,
} from './Calendar.types';

const localeFallback = {
	calendar: ru_calendar,
};

type CalendarStore = CalendarContextValue & {
	calendar: Messages['calendar'];
	t: TranslateFn;
};

type CalendarSnapshot = {
	year: number;
	month: number;
	view: CalendarViewMode;
	isViewDateControlled: boolean;
	onViewDateChange?: (date: Date) => void;
	onChange?: (value: Date | DateRangeValue) => void;
	setInternalViewDate: (date: Date) => void;
	setViewMode: (mode: CalendarViewMode) => void;
	setYearPageStart: (value: number | ((current: number) => number)) => void;
};

const CalendarContext = createContext<CalendarStore | null>(null);

export function useCalendarContext(component: string): CalendarStore {
	const value = useContext(CalendarContext);
	if (!value) {
		throw new Error(`${component} должен использоваться внутри Calendar.Provider`);
	}
	return value;
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
	const {messages, t} = useLocale(localeFallback);
	const rangeValue = selectionMode === 'range' && isDateRangeValue(value) ? value : EMPTY_RANGE;
	const singleValue = selectionMode === 'single' && value instanceof Date ? value : undefined;
	const initialView = controlledViewDate
		?? singleValue
		?? rangeValue.end
		?? rangeValue.start
		?? new Date();
	const [internalViewDate, setInternalViewDate] = useState(initialView);
	const [view, setViewMode] = useState<CalendarViewMode>('days');
	const [yearPageStart, setYearPageStart] = useState(() =>
		getYearPageStart(initialView.getFullYear()));

	const viewDate = controlledViewDate ?? internalViewDate;
	const year = viewDate.getFullYear();
	const month = viewDate.getMonth();

	const snapshotRef = useRef<CalendarSnapshot>(null!);
	snapshotRef.current = {
		year,
		month,
		view,
		isViewDateControlled: controlledViewDate !== undefined,
		onViewDateChange,
		onChange,
		setInternalViewDate,
		setViewMode,
		setYearPageStart,
	};

	const actions = useMemo(() => {
		const setViewDate = (date: Date) => {
			const snap = snapshotRef.current;
			if (!snap.isViewDateControlled) snap.setInternalViewDate(date);
			snap.onViewDateChange?.(date);
		};

		return {
			onChange: (date: Date) => {
				snapshotRef.current.onChange?.(date);
			},
			onRangeChange: (range: DateRangeValue) => {
				snapshotRef.current.onChange?.(range);
			},
			setViewDate,
			shiftView: (delta: number) => {
				const snap = snapshotRef.current;
				if (snap.view === 'days') {
					setViewDate(new Date(snap.year, snap.month + delta, 1));
					return;
				}
				if (snap.view === 'months') {
					const next = new Date(snap.year + delta, snap.month, 1);
					setViewDate(next);
					snap.setYearPageStart(getYearPageStart(next.getFullYear()));
					return;
				}
				snap.setYearPageStart((current) => current + delta * YEARS_PER_PAGE);
			},
			setView: (mode: CalendarViewMode) => {
				const snap = snapshotRef.current;
				if (mode === 'years') snap.setYearPageStart(getYearPageStart(snap.year));
				snap.setViewMode(mode);
			},
			selectMonth: (monthIndex: number) => {
				const snap = snapshotRef.current;
				setViewDate(new Date(snap.year, monthIndex, 1));
				snap.setViewMode('days');
			},
			selectYear: (nextYear: number) => {
				const snap = snapshotRef.current;
				setViewDate(new Date(nextYear, snap.month, 1));
				snap.setYearPageStart(getYearPageStart(nextYear));
				snap.setViewMode('months');
			},
		};
	}, []);

	const singleTime = singleValue?.getTime() ?? null;
	const viewTime = viewDate.getTime();
	const rangeStartTime = rangeValue.start?.getTime() ?? null;
	const rangeEndTime = rangeValue.end?.getTime() ?? null;

	const store = useMemo<CalendarStore>(() => ({
		selectionMode,
		value: singleValue,
		onChange: actions.onChange,
		rangeValue,
		onRangeChange: actions.onRangeChange,
		viewDate,
		year,
		month,
		view,
		setView: actions.setView,
		yearPageStart,
		setViewDate: actions.setViewDate,
		shiftView: actions.shiftView,
		selectMonth: actions.selectMonth,
		selectYear: actions.selectYear,
		renderDayCell,
		calendar: messages.calendar,
		t,
	// singleTime / viewTime / range*Time заменяют Date: тот же момент не пересобирает store.
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}), [
		selectionMode,
		singleTime,
		viewTime,
		rangeStartTime,
		rangeEndTime,
		year,
		month,
		view,
		yearPageStart,
		renderDayCell,
		messages,
		t,
		actions,
	]);

	return (
		<CalendarContext.Provider value={store}>
			{children}
		</CalendarContext.Provider>
	);
};
