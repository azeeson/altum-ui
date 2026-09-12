import React, {forwardRef} from 'react';
import {ChevronButton} from '../../base/ChevronButton';
import {cn} from '../../utils/cn';
import {composeEventHandlers} from '../../utils/composeEvents';
import {useLocale} from '../../locales/localeContext';
import {useCalendarContext} from './Calendar.context';
import {
	CalendarDaysPanel,
	CalendarMonthsPanel,
	CalendarYearsPanel,
} from './Calendar.views';
import {
	type CalendarBodyProps,
	type CalendarHeaderProps,
	type CalendarNavProps,
	type CalendarRootProps,
	type CalendarTitleProps,
	YEARS_PER_PAGE,
} from './Calendar.types';
import unstyled from '../../styles/unstyledControl.module.css';
import chrome from '../../styles/calendarChrome.module.css';
import styles from './Calendar.module.css';

export const CalendarRoot = forwardRef<HTMLDivElement, CalendarRootProps>(function CalendarRoot(
	{className, children, onClick, ...rest},
	ref,
) {
	return (
		<div
			ref={ref}
			className={cn(styles.calendar, className)}
			onClick={composeEventHandlers(onClick, (event) => {
				event.stopPropagation();
			})}
			{...rest}
		>
			{children}
		</div>
	);
});

CalendarRoot.displayName = 'Calendar.Root';

export const CalendarHeader = forwardRef<HTMLDivElement, CalendarHeaderProps>(function CalendarHeader(
	{className, children, ...rest},
	ref,
) {
	return (
		<div
			ref={ref}
			className={cn(chrome.header, styles.calendarHeader, className)}
			{...rest}
		>
			{children}
		</div>
	);
});

CalendarHeader.displayName = 'Calendar.Header';

export const CalendarTitle = forwardRef<HTMLSpanElement, CalendarTitleProps>(function CalendarTitle(
	{className, ...rest},
	ref,
) {
	const {messages, t} = useLocale();
	const months = messages.calendar.months;
	const {year, month, view, yearPageStart, setView} = useCalendarContext('Calendar.Title');
	const monthName = months[month] ?? '';
	const titleBtnClass = cn(unstyled.control, chrome.cell, styles.calendarTitleButton);

	return (
		<span
			ref={ref}
			className={cn(
				styles.calendarTitle,
				view === 'days' ? styles.calendarTitleSplit : '',
				className,
			)}
			{...rest}
		>
			{view === 'years' && `${yearPageStart} – ${yearPageStart + YEARS_PER_PAGE - 1}`}
			{view === 'months' && (
				<button
					type='button'
					className={titleBtnClass}
					onClick={() => setView('years')}
					aria-label={t('calendar.selectYear', {year})}
				>
					{year}
				</button>
			)}
			{view === 'days' && (
				<>
					<button
						type='button'
						className={titleBtnClass}
						onClick={() => setView('months')}
						aria-label={t('calendar.selectMonth', {month: monthName})}
					>
						{monthName}
					</button>
					<button
						type='button'
						className={titleBtnClass}
						onClick={() => setView('years')}
						aria-label={t('calendar.selectYear', {year})}
					>
						{year}
					</button>
				</>
			)}
		</span>
	);
});

CalendarTitle.displayName = 'Calendar.Title';

export const CalendarNav = forwardRef<HTMLButtonElement, CalendarNavProps>(function CalendarNav(
	{
		direction,
		className,
		'aria-label': ariaLabel,
		onClick,
		...rest
	},
	ref,
) {
	const {messages} = useLocale();
	const {view, shiftView} = useCalendarContext('Calendar.Nav');
	const isPrev = direction === 'prev';
	const defaultLabel = view === 'days'
		? (isPrev ? messages.calendar.prevMonth : messages.calendar.nextMonth)
		: view === 'months'
			? (isPrev ? messages.calendar.prevYear : messages.calendar.nextYear)
			: (isPrev ? messages.calendar.prevYears : messages.calendar.nextYears);

	return (
		<ChevronButton
			ref={ref}
			direction={direction}
			className={cn(unstyled.control, chrome.navBtn, className)}
			onClick={composeEventHandlers(onClick, () => shiftView(isPrev ? -1 : 1))}
			aria-label={ariaLabel ?? defaultLabel}
			{...rest}
		/>
	);
});

CalendarNav.displayName = 'Calendar.Nav';

export const CalendarBody = forwardRef<HTMLDivElement, CalendarBodyProps>(function CalendarBody(
	{className, renderDayCell: renderDayCellProp, ...rest},
	ref,
) {
	const {view, renderDayCell: renderDayCellFromContext} = useCalendarContext('Calendar.Body');
	const renderDayCell = renderDayCellProp ?? renderDayCellFromContext;

	if (view === 'months') {
		return (
			<CalendarMonthsPanel
				ref={ref}
				className={className}
				{...rest}
			/>
		);
	}
	if (view === 'years') {
		return (
			<CalendarYearsPanel
				ref={ref}
				className={className}
				{...rest}
			/>
		);
	}
	return (
		<CalendarDaysPanel
			ref={ref}
			className={className}
			renderDayCell={renderDayCell}
			{...rest}
		/>
	);
});

CalendarBody.displayName = 'Calendar.Body';
