import type {MouseEvent, Ref} from 'react';
import {ButtonIcon} from '../ButtonIcon/ButtonIcon';
import {IconChevronLeft} from '../../icons/icons/IconChevronLeft';
import {IconChevronRight} from '../../icons/icons/IconChevronRight';
import {cn} from '../../core/utils/cn';
import {useCalendarContext} from './Calendar.context';
import {CalendarDaysPanel, CalendarPeriodPanel} from './Calendar.views';
import {
	type CalendarBodyProps,
	type CalendarHeaderProps,
	type CalendarNavProps,
	type CalendarRootProps,
	type CalendarTitleProps,
	type CalendarViewMode,
	YEARS_PER_PAGE,
} from './Calendar.types';
import unstyled from '../../styles/unstyledControl.module.css';
import chrome from '../../styles/calendarChrome.module.css';
import styles from './Calendar.module.css';

const stopCalendarBubble = (event: MouseEvent<HTMLElement>) => {
	event.stopPropagation();
};

export const CalendarRoot = ({
	className,
	children,
	onClick,
	rootRef,
	...rest
}: CalendarRootProps) => {
	const {view, year, month} = useCalendarContext('Calendar.Root');

	return (
		<div
			{...rest}
			ref={rootRef}
			className={cn(styles.calendar, className)}
			data-view={view}
			data-month={month}
			data-year={year}
			style={{
				color: 'var(--altum-color-input-text)',
			}}
			onClick={(event) => {
				onClick?.(event);
				if (!event.defaultPrevented) stopCalendarBubble(event);
			}}
		>
			{children}
		</div>
	);
};

export const CalendarHeader = ({
	className,
	children,
	rootRef,
	...rest
}: CalendarHeaderProps) => (
	<div
		ref={rootRef}
		className={cn(chrome.header, styles.calendarHeader, className)}
		{...rest}
	>
		{children}
	</div>
);

export const CalendarTitle = ({
	className,
	rootRef,
	...rest
}: CalendarTitleProps) => {
	const {calendar, t, year, month, view, yearPageStart, setView} = useCalendarContext('Calendar.Title');
	const monthName = calendar.months[month] ?? '';
	const titleBtnClass = cn(unstyled.control, styles.calendarTitleButton);
	const titleButton = (label: string | number, mode: CalendarViewMode, aria: string) => (
		<button
			type='button'
			className={titleBtnClass}
			onClick={() => setView(mode)}
			aria-label={aria}
		>
			{label}
		</button>
	);

	return (
		<span
			ref={rootRef}
			className={cn(styles.calendarTitle, className)}
			data-view={view}
			{...rest}
		>
			{view === 'years' && `${yearPageStart} – ${yearPageStart + YEARS_PER_PAGE - 1}`}
			{view === 'months' && titleButton(year, 'years', t('calendar.selectYear', {year}))}
			{view === 'days' && (
				<>
					{titleButton(monthName, 'months', t('calendar.selectMonth', {month: monthName}))}
					{titleButton(year, 'years', t('calendar.selectYear', {year}))}
				</>
			)}
		</span>
	);
};

export const CalendarNav = ({
	direction,
	className,
	'aria-label': ariaLabel,
	onClick,
	rootRef,
	...rest
}: CalendarNavProps) => {
	const {calendar, view, shiftView} = useCalendarContext('Calendar.Nav');
	const isPrev = direction === 'prev';
	const defaultLabel = view === 'days'
		? (isPrev ? calendar.prevMonth : calendar.nextMonth)
		: view === 'months'
			? (isPrev ? calendar.prevYear : calendar.nextYear)
			: (isPrev ? calendar.prevYears : calendar.nextYears);

	return (
		<ButtonIcon
			rootRef={rootRef as Ref<HTMLButtonElement | HTMLAnchorElement>}
			variant='ghost'
			size='sm'
			className={className}
			onClick={(event) => {
				onClick?.(event);
				if (!event.defaultPrevented) shiftView(isPrev ? -1 : 1);
			}}
			aria-label={ariaLabel ?? defaultLabel}
			{...rest}
			icon={isPrev
				? <IconChevronLeft size={16} aria-hidden />
				: <IconChevronRight size={16} aria-hidden />}
		/>
	);
};

export const CalendarBody = ({
	className,
	renderDayCell: renderDayCellProp,
	rootRef,
	...rest
}: CalendarBodyProps) => {
	const {view, renderDayCell: renderDayCellFromContext} = useCalendarContext('Calendar.Body');
	const renderDayCell = renderDayCellProp ?? renderDayCellFromContext;

	if (view === 'days') {
		return (
			<CalendarDaysPanel
				rootRef={rootRef}
				className={className}
				renderDayCell={renderDayCell}
				{...rest}
			/>
		);
	}
	return (
		<CalendarPeriodPanel
			rootRef={rootRef}
			className={className}
			{...rest}
		/>
	);
};
