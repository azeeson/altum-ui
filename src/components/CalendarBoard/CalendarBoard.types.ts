import type React from 'react';
import type {CalendarScheduleEvent} from '../Calendar/Calendar.types';

export type {CalendarScheduleEvent};

export type CalendarBoardView = 'month' | 'week' | 'day' | 'year';

export type CalendarBoardTask = CalendarScheduleEvent & {
	completed?: boolean;
};

export type CalendarBoardTaskLayout = 'chip' | 'bar' | 'timed';

export interface CalendarBoardTaskRenderProps {
	task: CalendarBoardTask;
	layout: CalendarBoardTaskLayout;
	highlighted: boolean;
	continuesBefore?: boolean;
	continuesAfter?: boolean;
	timeLabel?: string;
	onClick?: () => void;
	onMouseEnter?: () => void;
	onMouseLeave?: () => void;
	className?: string;
	style?: React.CSSProperties;
}

export interface CalendarBoardDayCellRenderProps {
	date: Date;
	dayOfMonth: number;
	isCurrentMonth: boolean;
	isToday: boolean;
	isSelected: boolean;
	tasks: CalendarBoardTask[];
}

export interface CalendarBoardYearMonthRenderProps {
	date: Date;
	monthIndex: number;
	label: string;
	isCurrentMonth: boolean;
	taskDates: Set<string>;
}

export interface CalendarBoardContextValue {
	view: CalendarBoardView;
	setView: (view: CalendarBoardView) => void;
	viewDate: Date;
	setViewDate: (date: Date) => void;
	selectedDate?: Date;
	setSelectedDate: (date: Date) => void;
	tasks: CalendarBoardTask[];
	weekStartsOn: 0 | 1;
	dayStartHour: number;
	dayEndHour: number;
	hourHeight: number;
	onTaskClick?: (task: CalendarBoardTask) => void;
	renderTask?: (props: CalendarBoardTaskRenderProps) => React.ReactNode;
	renderDayCell?: (props: CalendarBoardDayCellRenderProps) => React.ReactNode;
	renderYearMonth?: (props: CalendarBoardYearMonthRenderProps) => React.ReactNode;
}

export interface CalendarBoardProviderProps {
	children: React.ReactNode;
	view?: CalendarBoardView;
	defaultView?: CalendarBoardView;
	onViewChange?: (view: CalendarBoardView) => void;
	viewDate?: Date;
	defaultViewDate?: Date;
	onViewDateChange?: (date: Date) => void;
	selectedDate?: Date;
	onSelectedDateChange?: (date: Date) => void;
	tasks?: CalendarBoardTask[];
	weekStartsOn?: 0 | 1;
	dayStartHour?: number;
	dayEndHour?: number;
	hourHeight?: number;
	onTaskClick?: (task: CalendarBoardTask) => void;
	renderTask?: (props: CalendarBoardTaskRenderProps) => React.ReactNode;
	renderDayCell?: (props: CalendarBoardDayCellRenderProps) => React.ReactNode;
	renderYearMonth?: (props: CalendarBoardYearMonthRenderProps) => React.ReactNode;
}

export interface CalendarBoardTaskChipProps extends Omit<React.ComponentPropsWithoutRef<'div'>, 'children'> {
	task: CalendarBoardTask;
	layout?: CalendarBoardTaskLayout;
	continuesBefore?: boolean;
	continuesAfter?: boolean;
	timeLabel?: string;
	/** Принудительная подсветка (иначе — из hover-store по task.id). */
	highlighted?: boolean;
}

export interface CalendarBoardEventProps extends Omit<
	React.ComponentPropsWithoutRef<'div'>,
	'children' | 'onClick' | 'title' | 'onMouseEnter' | 'onMouseLeave'
> {
	title: string;
	color?: string;
	layout?: 'bar' | 'timed';
	timeLabel?: string;
	continuesBefore?: boolean;
	continuesAfter?: boolean;
	highlighted?: boolean;
	onClick?: () => void;
	onMouseEnter?: React.MouseEventHandler<HTMLElement>;
	onMouseLeave?: React.MouseEventHandler<HTMLElement>;
}

export type CalendarBoardEventBarProps = CalendarBoardEventProps;
export type CalendarBoardTimedEventProps = CalendarBoardEventProps;

export interface CalendarBoardMonthProps extends React.ComponentPropsWithoutRef<'div'> {
	maxChipsPerDay?: number;
}

export interface CalendarBoardWeekProps extends React.ComponentPropsWithoutRef<'div'> {
	showScheduleHeader?: boolean;
	showScheduleNav?: boolean;
}

export interface CalendarBoardDayProps extends React.ComponentPropsWithoutRef<'div'> {
	showScheduleHeader?: boolean;
	showScheduleNav?: boolean;
}

export type CalendarBoardYearProps = React.ComponentPropsWithoutRef<'div'>;

export interface CalendarBoardBodyProps extends React.ComponentPropsWithoutRef<'div'> {
	monthProps?: CalendarBoardMonthProps;
	weekProps?: CalendarBoardWeekProps;
	dayProps?: CalendarBoardDayProps;
	yearProps?: CalendarBoardYearProps;
}

export interface CalendarBoardViewSwitchProps extends React.ComponentPropsWithoutRef<'div'> {
	variant?: 'primary' | 'tinted' | 'secondary';
	size?: 'sm' | 'md' | 'lg';
}

export type CalendarBoardRootProps = React.ComponentPropsWithoutRef<'div'>;

export type CalendarBoardHeaderProps = React.ComponentPropsWithoutRef<'div'>;

export type CalendarBoardTitleProps = React.ComponentPropsWithoutRef<'div'>;

export type CalendarBoardNavProps = React.ComponentPropsWithoutRef<'div'>;

export interface CalendarScheduleSpanRenderProps {
	event: CalendarScheduleEvent;
	continuesBefore: boolean;
	continuesAfter: boolean;
	lane: number;
}

export interface CalendarScheduleTimedRenderProps {
	event: CalendarScheduleEvent;
	start: Date;
	end: Date;
	topPercent: number;
	heightPercent: number;
	lane: number;
	laneCount: number;
	timeLabel: string;
}

export interface CalendarScheduleProps extends React.ComponentPropsWithoutRef<'div'> {
	/**
	 * Опорная дата окна.
	 * Для недели — любая дата внутри недели; окно строится от `startOfWeek`.
	 * Для дня (`daysCount={1}`) — сам день.
	 */
	viewDate?: Date;
	onViewDateChange?: (date: Date) => void;
	/** Число колонок: 1 (день), 5 (рабочая неделя), 7 (неделя). */
	daysCount?: 1 | 5 | 7;
	weekStartsOn?: 0 | 1;
	events?: CalendarScheduleEvent[];
	/** Начало оси времени (час), по умолчанию 8. */
	dayStartHour?: number;
	/** Конец оси времени (час, exclusive-ish ceiling), по умолчанию 20. */
	dayEndHour?: number;
	/** Высота одного часа в px. */
	hourHeight?: number;
	selectedDate?: Date;
	onSelectDate?: (date: Date) => void;
	onEventClick?: (event: CalendarScheduleEvent) => void;
	showHeader?: boolean;
	showNav?: boolean;
	renderSpanEvent?: (props: CalendarScheduleSpanRenderProps) => React.ReactNode;
	renderTimedEvent?: (props: CalendarScheduleTimedRenderProps) => React.ReactNode;
}
