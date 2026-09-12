import type React from 'react';

export interface CalendarDayCell {
	day: number;
	isEmpty: boolean;
	date: Date | null;
}

/**
 * Диапазон дат для режима `Calendar` / `DateRangeField`.
 */
export interface DateRangeValue {
	start?: Date;
	end?: Date;
}

/** Событие планировщика: all-day или с временем. `end` — exclusive. */
export interface CalendarScheduleEvent {
	id: string;
	title: string;
	start: Date;
	/** Exclusive конец интервала. */
	end: Date;
	allDay?: boolean;
	color?: string;
}

export type CalendarViewMode = 'days' | 'months' | 'years';

export type CalendarSelectionMode = 'single' | 'range';

export interface CalendarDayCellRenderProps {
	date: Date;
	day: number;
	isSelected: boolean;
	isToday: boolean;
	rangeStart?: boolean;
	rangeEnd?: boolean;
	inRange?: boolean;
}

export interface CalendarProviderProps {
	/** Режим выбора. @default 'single' */
	selectionMode?: CalendarSelectionMode;
	/** Дата или диапазон — в зависимости от `selectionMode`. */
	value?: Date | DateRangeValue;
	onChange?: (value: Date | DateRangeValue) => void;
	viewDate?: Date;
	onViewDateChange?: (date: Date) => void;
	renderDayCell?: (props: CalendarDayCellRenderProps) => React.ReactNode;
	children: React.ReactNode;
}

export type CalendarRootProps = React.ComponentPropsWithoutRef<'div'>;

export type CalendarHeaderProps = React.ComponentPropsWithoutRef<'div'>;

export type CalendarTitleProps = React.ComponentPropsWithoutRef<'span'>;

export interface CalendarNavProps extends Omit<React.ComponentPropsWithoutRef<'button'>, 'direction'> {
	direction: 'prev' | 'next';
}

export interface CalendarBodyProps extends React.ComponentPropsWithoutRef<'div'> {
	renderDayCell?: (props: CalendarDayCellRenderProps) => React.ReactNode;
}

export type CalendarContextValue = {
	selectionMode: CalendarSelectionMode;
	value?: Date;
	onChange: (date: Date) => void;
	rangeValue: DateRangeValue;
	onRangeChange?: (range: DateRangeValue) => void;
	viewDate: Date;
	year: number;
	month: number;
	days: CalendarDayCell[];
	view: CalendarViewMode;
	setView: (mode: CalendarViewMode) => void;
	yearPageStart: number;
	setViewDate: (date: Date) => void;
	shiftView: (delta: number) => void;
	selectMonth: (monthIndex: number) => void;
	selectYear: (year: number) => void;
	renderDayCell?: (props: CalendarDayCellRenderProps) => React.ReactNode;
};

export const YEARS_PER_PAGE = 20;
export const YEARS_COLUMNS = 4;
