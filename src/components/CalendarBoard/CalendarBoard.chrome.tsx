import React, {forwardRef, useMemo} from 'react';
import {
	addDays,
	formatMonthYear,
	startOfWeek,
	weekdayLabelFor,
} from '../Calendar/Calendar.utils';
import {SegmentedControl} from '../SegmentedControl/SegmentedControl';
import {ChevronButton} from '../../base/ChevronButton';
import {
	useCalendarBoard,
	type CalendarBoardView,
} from './CalendarBoard.context';
import styles from './CalendarBoard.module.css';
import {cn} from '../../utils/cn';
import unstyled from '../../styles/unstyledControl.module.css';
import {useLocale} from '../../locales/localeContext';
import type {
	CalendarBoardViewSwitchProps,
	CalendarBoardRootProps,
	CalendarBoardHeaderProps,
	CalendarBoardTitleProps,
	CalendarBoardNavProps,
} from './CalendarBoard.types';

export type {
	CalendarBoardRootProps,
	CalendarBoardHeaderProps,
	CalendarBoardTitleProps,
	CalendarBoardNavProps,
} from './CalendarBoard.types';

export const CalendarBoardRoot = forwardRef<HTMLDivElement, CalendarBoardRootProps>(function CalendarBoardRoot(
	{
		children,
		className,
		'aria-label': ariaLabel,
		...rest
	},
	ref,
) {
	const {messages} = useLocale();

	return (
		<div
			ref={ref}
			className={cn(styles.root, className)}
			role='region'
			aria-label={ariaLabel ?? messages.calendarBoard.ariaLabel}
			{...rest}
		>
			{children}
		</div>
	);
});

CalendarBoardRoot.displayName = 'CalendarBoard.Root';

export const CalendarBoardHeader = forwardRef<HTMLDivElement, CalendarBoardHeaderProps>(function CalendarBoardHeader(
	{children, className, ...rest},
	ref,
) {
	return (
		<div
			ref={ref}
			className={cn(styles.header, className)}
			{...rest}
		>
			{children}
		</div>
	);
});

CalendarBoardHeader.displayName = 'CalendarBoard.Header';

export const CalendarBoardTitle = forwardRef<HTMLDivElement, CalendarBoardTitleProps>(function CalendarBoardTitle(
	{className, ...rest},
	ref,
) {
	const {view, viewDate, weekStartsOn} = useCalendarBoard('CalendarBoard.Title');
	const {messages} = useLocale();
	const {months, monthsShort, weekdaysShort} = messages.calendar;

	const label = useMemo(() => {
		if (view === 'year') return String(viewDate.getFullYear());
		if (view === 'month') return formatMonthYear(viewDate, months);
		if (view === 'day') {
			const weekday = weekdayLabelFor(viewDate, weekStartsOn, weekdaysShort);
			return `${weekday}, ${viewDate.getDate()} ${formatMonthYear(viewDate, months)}`;
		}
		const start = startOfWeek(viewDate, weekStartsOn);
		const end = addDays(start, 6);
		if (start.getMonth() === end.getMonth()) {
			return `${start.getDate()}–${end.getDate()} ${formatMonthYear(start, months)}`;
		}
		const startMonth = monthsShort[start.getMonth()];
		const endMonth = monthsShort[end.getMonth()];
		return `${start.getDate()} ${startMonth} – ${end.getDate()} ${endMonth} ${end.getFullYear()}`;
	}, [
		months,
		monthsShort,
		view,
		viewDate,
		weekdaysShort,
		weekStartsOn
	]);

	return (
		<div
			ref={ref}
			className={cn(styles.title, className)}
			{...rest}
		>
			{label}
		</div>
	);
});

CalendarBoardTitle.displayName = 'CalendarBoard.Title';

export const CalendarBoardNav = forwardRef<HTMLDivElement, CalendarBoardNavProps>(function CalendarBoardNav(
	{className, ...rest},
	ref,
) {
	const {view, viewDate, setViewDate} = useCalendarBoard('CalendarBoard.Nav');
	const {messages} = useLocale();

	const shift = (direction: -1 | 1) => {
		if (view === 'year') {
			setViewDate(new Date(viewDate.getFullYear() + direction, viewDate.getMonth(), 1));
			return;
		}
		if (view === 'month') {
			setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + direction, 1));
			return;
		}
		if (view === 'week') {
			setViewDate(addDays(viewDate, direction * 7));
			return;
		}
		setViewDate(addDays(viewDate, direction));
	};

	return (
		<div
			ref={ref}
			className={cn(styles.nav, className)}
			{...rest}
		>
			<ChevronButton
				direction='prev'
				className={cn(unstyled.control, styles.navBtn)}
				aria-label={messages.calendarBoard.prevPeriod}
				onClick={() => shift(-1)}
			/>
			<ChevronButton
				direction='next'
				className={cn(unstyled.control, styles.navBtn)}
				aria-label={messages.calendarBoard.nextPeriod}
				onClick={() => shift(1)}
			/>
		</div>
	);
});

CalendarBoardNav.displayName = 'CalendarBoard.Nav';

export const CalendarBoardViewSwitch = forwardRef<
	HTMLDivElement,
	CalendarBoardViewSwitchProps
>(function CalendarBoardViewSwitch(
	{
		className,
		variant = 'tinted',
		size = 'sm',
		...rest
	},
	ref,
) {
	const {view, setView} = useCalendarBoard('CalendarBoard.ViewSwitch');
	const {messages} = useLocale();
	const viewOptions: Array<{
		label: string;
		value: CalendarBoardView
	}> = [
		{
			label: messages.calendarBoard.views.month,
			value: 'month'
		},
		{
			label: messages.calendarBoard.views.week,
			value: 'week'
		},
		{
			label: messages.calendarBoard.views.day,
			value: 'day'
		},
		{
			label: messages.calendarBoard.views.year,
			value: 'year'
		},
	];

	return (
		<div
			ref={ref}
			className={cn(styles.viewSwitch, className)}
			{...rest}
		>
			<SegmentedControl
				aria-label={messages.calendarBoard.viewSwitchAria}
				options={viewOptions}
				value={view}
				onChange={setView}
				variant={variant}
				size={size}
			/>
		</div>
	);
});

CalendarBoardViewSwitch.displayName = 'CalendarBoard.ViewSwitch';
