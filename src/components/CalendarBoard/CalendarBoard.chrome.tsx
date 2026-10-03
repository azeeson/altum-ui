import {useMemo, type Ref} from 'react';
import {Text} from '../Text/Text';
import {
	addDays,
	formatMonthYear,
	getWeekStart,
	weekdayLabelFor,
} from '../Calendar/Calendar.utils';
import {ButtonIcon} from '../ButtonIcon/ButtonIcon';
import {IconChevronLeft} from '../../icons/icons/IconChevronLeft';
import {IconChevronRight} from '../../icons/icons/IconChevronRight';
import {SegmentedControl} from '../SegmentedControl/SegmentedControl';
import {
	useCalendarBoard,
	type CalendarBoardView,
} from './CalendarBoard.context';
import styles from './CalendarBoard.module.css';
import {cn} from '../../core/utils/cn';
import {useLocale} from '../../locales/localeContext';
import type {
	CalendarBoardViewSwitchProps,
	CalendarBoardRootProps,
	CalendarBoardHeaderProps,
	CalendarBoardTitleProps,
	CalendarBoardNavProps,
} from './CalendarBoard.types';
import {ruSlice as ru_calendar} from '../../locales/slices/calendar.ru';
import {ruSlice as ru_calendarBoard} from '../../locales/slices/calendarBoard.ru';

const localeFallback = {
	calendar: ru_calendar,
	calendarBoard: ru_calendarBoard,
};

export type {
	CalendarBoardRootProps,
	CalendarBoardHeaderProps,
	CalendarBoardTitleProps,
	CalendarBoardNavProps,
} from './CalendarBoard.types';

export const CalendarBoardRoot = ({
	children,
	className,
	style,
	rootRef,
	'aria-label': ariaLabel,
	...rest
}: CalendarBoardRootProps) => {
	const {messages} = useLocale(localeFallback);

	return (
		<div
			{...rest}
			ref={rootRef}
			className={cn(styles.root, className)}
			style={{
				color: 'var(--altum-color-input-text)',
				...style,
			}}
			role='region'
			aria-label={ariaLabel ?? messages.calendarBoard.ariaLabel}
		>
			{children}
		</div>
	);
};

export const CalendarBoardHeader = ({
	children,
	className,
	rootRef,
	...rest
}: CalendarBoardHeaderProps) => (
	<div
		{...rest}
		ref={rootRef}
		className={cn(styles.header, className)}
	>
		{children}
	</div>
);

export const CalendarBoardTitle = ({
	className,
	rootRef,
	...rest
}: CalendarBoardTitleProps) => {
	const {view, viewDate, weekStartsOn} = useCalendarBoard('CalendarBoard.Title');
	const {messages} = useLocale(localeFallback);
	const {months, monthsShort, weekdaysShort} = messages.calendar;

	const label = useMemo(() => {
		if (view === 'year') return String(viewDate.getFullYear());
		if (view === 'month') return formatMonthYear(viewDate, months);
		if (view === 'day') {
			const weekday = weekdayLabelFor(viewDate, weekStartsOn, weekdaysShort);
			return `${weekday}, ${viewDate.getDate()} ${formatMonthYear(viewDate, months)}`;
		}
		const start = getWeekStart(viewDate, weekStartsOn);
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
		<Text
			{...rest}
			as='div'
			rootRef={rootRef as Ref<HTMLElement>}
			className={cn(styles.title, className)}
		>
			{label}
		</Text>
	);
};

export const CalendarBoardNav = ({
	className,
	rootRef,
	...rest
}: CalendarBoardNavProps) => {
	const {view, viewDate, setViewDate} = useCalendarBoard('CalendarBoard.Nav');
	const {messages} = useLocale(localeFallback);

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

	const goPrev = () => shift(-1);
	const goNext = () => shift(1);

	return (
		<div
			{...rest}
			ref={rootRef}
			className={cn(styles.nav, className)}
		>
			<ButtonIcon
				variant='secondary'
				size='sm'
				icon={<IconChevronLeft size={16} aria-hidden />}
				aria-label={messages.calendarBoard.prevPeriod}
				onClick={goPrev}
			/>
			<ButtonIcon
				variant='secondary'
				size='sm'
				icon={<IconChevronRight size={16} aria-hidden />}
				aria-label={messages.calendarBoard.nextPeriod}
				onClick={goNext}
			/>
		</div>
	);
};

export const CalendarBoardViewSwitch = ({
	className,
	variant = 'tinted',
	size = 'sm',
	rootRef,
	...rest
}: CalendarBoardViewSwitchProps) => {
	const {view, setView} = useCalendarBoard('CalendarBoard.ViewSwitch');
	const {messages} = useLocale(localeFallback);
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
			{...rest}
			ref={rootRef}
			className={cn(styles.viewSwitch, className)}
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
};
