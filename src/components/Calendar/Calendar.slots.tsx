import React, {forwardRef} from 'react';
import {IconChevronLeft} from '../../icons/icons/IconChevronLeft';
import {IconChevronRight} from '../../icons/icons/IconChevronRight';
import {cn} from '../../utils/cn';
import {composeEventHandlers} from '../../utils/composeEvents';
import {useLocale} from '../LocaleProvider/LocaleProvider';
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
			className={cn(styles.calendarHeader, className)}
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
	const {
		year,
		month,
		view,
		yearPageStart,
		setView,
	} = useCalendarContext('Calendar.Title');

	if (view === 'years') {
		const endYear = yearPageStart + YEARS_PER_PAGE - 1;
		return (
			<span
				ref={ref}
				className={cn(styles.calendarTitle, className)}
				{...rest}
			>
				{yearPageStart}
				{' '}
				–
				{endYear}
			</span>
		);
	}

	if (view === 'months') {
		return (
			<span
				ref={ref}
				className={cn(styles.calendarTitle, className)}
				{...rest}
			>
				<button
					type='button'
					className={styles.calendarTitleButton}
					onClick={(event) => {
						event.stopPropagation();
						setView('years');
					}}
					aria-label={t('calendar.selectYear', {year})}
				>
					{year}
				</button>
			</span>
		);
	}

	return (
		<span
			ref={ref}
			className={cn(styles.calendarTitle, styles.calendarTitleSplit, className)}
			{...rest}
		>
			<button
				type='button'
				className={styles.calendarTitleButton}
				onClick={(event) => {
					event.stopPropagation();
					setView('months');
				}}
				aria-label={t('calendar.selectMonth', {month: months[month] ?? ''})}
			>
				{months[month]}
			</button>
			<button
				type='button'
				className={styles.calendarTitleButton}
				onClick={(event) => {
					event.stopPropagation();
					setView('years');
				}}
				aria-label={t('calendar.selectYear', {year})}
			>
				{year}
			</button>
		</span>
	);
});

CalendarTitle.displayName = 'Calendar.Title';

export const CalendarNav = forwardRef<HTMLButtonElement, CalendarNavProps>(function CalendarNav(
	{
		direction,
		className,
		'aria-label': ariaLabel,
		children,
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
		<button
			ref={ref}
			className={cn(styles.calBtn, className)}
			onClick={composeEventHandlers(onClick, (event) => {
				event.stopPropagation();
				shiftView(isPrev ? -1 : 1);
			})}
			{...rest}
			type='button'
			aria-label={ariaLabel ?? defaultLabel}
		>
			{children ?? (isPrev
				? <IconChevronLeft size={16} aria-hidden />
				: <IconChevronRight size={16} aria-hidden />)}
		</button>
	);
});

CalendarNav.displayName = 'Calendar.Nav';

export const CalendarBody = forwardRef<HTMLDivElement, CalendarBodyProps>(function CalendarBody(
	{className, renderDayCell: renderDayCellProp, ...rest},
	ref,
) {
	const {
		view,
		renderDayCell: renderDayCellFromContext,
	} = useCalendarContext('Calendar.Body');
	const renderDayCell = renderDayCellProp ?? renderDayCellFromContext;

	if (view === 'months') {
		return (
			<div ref={ref} {...rest}>
				<CalendarMonthsPanel className={className} />
			</div>
		);
	}

	if (view === 'years') {
		return (
			<div ref={ref} {...rest}>
				<CalendarYearsPanel className={className} />
			</div>
		);
	}

	return (
		<div ref={ref} {...rest}>
			<CalendarDaysPanel className={className} renderDayCell={renderDayCell} />
		</div>
	);
});

CalendarBody.displayName = 'Calendar.Body';
