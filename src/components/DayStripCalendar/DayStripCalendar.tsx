import type {
	DayStripCalendarProps,
} from './DayStripCalendar.types';
export type {
	DayStripDayRenderProps,
	DayStripCalendarProps,
} from './DayStripCalendar.types';

import React, {
	forwardRef,
	useCallback,
	useEffect,
	useId,
	useMemo,
	useRef,
} from 'react';
import {
	addDays,
	buildDayStrip,
	formatMonthYear,
	isSameDay,
	isToday,
	startOfDay,
	startOfWeek,
	weekdayLabelFor,
} from '../Calendar/Calendar.utils';
import {IconChevronLeft} from '../../icons/icons/IconChevronLeft';
import {IconChevronRight} from '../../icons/icons/IconChevronRight';
import {isKey} from '../../utils/keyboard';
import styles from './DayStripCalendar.module.css';
import {cn} from '../../utils/cn';
import {useControlledStateWithCallback} from '../../hooks/useControlledState';
import {useLocale} from '../LocaleProvider/LocaleProvider';

/**
 * Горизонтальная полоса дней для быстрого выбора даты в недельном или произвольном окне.
 *
 * @component
 * @example
 * <DayStripCalendar value={date} onChange={setDate} daysCount={7} />
 */
export const DayStripCalendar = forwardRef<HTMLDivElement, DayStripCalendarProps>(function DayStripCalendar(
	{
		value,
		onChange,
		viewDate: controlledViewDate,
		onViewDateChange,
		daysCount = 7,
		weekStartsOn = 1,
		showHeader = true,
		showNav = true,
		className,
		'aria-label': ariaLabel,
		renderDay,
		...rest
	},
	ref,
) {
	const {messages} = useLocale();
	const {months, weekdaysShort} = messages.calendar;
	const labelId = useId();
	const listRef = useRef<HTMLDivElement>(null);

	const selected = value ? startOfDay(value) : undefined;
	const anchor = selected ?? startOfDay(new Date());

	const [viewDate, setViewDateRaw] = useControlledStateWithCallback(
		controlledViewDate !== undefined ? startOfDay(controlledViewDate) : undefined,
		startOfWeek(anchor, weekStartsOn),
		onViewDateChange,
	);

	const setViewDate = useCallback((next: Date) => {
		setViewDateRaw(startOfDay(next));
	}, [setViewDateRaw]);

	useEffect(() => {
		if (!selected) return;
		const stripEnd = addDays(viewDate, daysCount - 1);
		if (selected < viewDate || selected > stripEnd) {
			setViewDate(
				daysCount === 7
					? startOfWeek(selected, weekStartsOn)
					: selected,
			);
		}
	}, [
		daysCount,
		selected,
		setViewDate,
		viewDate,
		weekStartsOn
	]);

	const days = useMemo(
		() => buildDayStrip(viewDate, daysCount),
		[daysCount, viewDate],
	);

	const shiftStrip = (direction: -1 | 1) => {
		setViewDate(addDays(viewDate, direction * daysCount));
	};

	const selectDate = (date: Date) => {
		onChange(startOfDay(date));
	};

	const handleListKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
		const current = selected ?? days[0];
		if (!current) return;

		if (isKey(event, 'ArrowRight')) {
			event.preventDefault();
			const next = addDays(current, 1);
			selectDate(next);
			const stripEnd = addDays(viewDate, daysCount - 1);
			if (next > stripEnd) setViewDate(addDays(viewDate, daysCount));
			return;
		}
		if (isKey(event, 'ArrowLeft')) {
			event.preventDefault();
			const prev = addDays(current, -1);
			selectDate(prev);
			if (prev < viewDate) setViewDate(addDays(viewDate, -daysCount));
			return;
		}
		if (isKey(event, 'Home')) {
			event.preventDefault();
			selectDate(days[0]!);
			return;
		}
		if (isKey(event, 'End')) {
			event.preventDefault();
			selectDate(days[days.length - 1]!);
		}
	};

	const headerLabel = formatMonthYear(selected ?? viewDate, months);

	return (
		<div
			ref={ref}
			className={cn(styles.root, className)}
			role='group'
			aria-label={ariaLabel ?? messages.dayStrip.ariaLabel}
			aria-labelledby={showHeader ? labelId : undefined}
			{...rest}
		>
			{(showHeader || showNav) && (
				<div className={styles.header}>
					{showNav && (
						<button
							type='button'
							className={styles.navBtn}
							aria-label={messages.dayStrip.prev}
							onClick={() => shiftStrip(-1)}
						>
							<IconChevronLeft size={16} />
						</button>
					)}
					{showHeader ? (
						<div id={labelId} className={styles.title}>
							{headerLabel}
						</div>
					) : (
						<span className={styles.titleSpacer} />
					)}
					{showNav && (
						<button
							type='button'
							className={styles.navBtn}
							aria-label={messages.dayStrip.next}
							onClick={() => shiftStrip(1)}
						>
							<IconChevronRight size={16} />
						</button>
					)}
				</div>
			)}

			<div
				ref={listRef}
				className={styles.strip}
				role='listbox'
				aria-label={messages.dayStrip.days}
				aria-orientation='horizontal'
				tabIndex={0}
				onKeyDown={handleListKeyDown}
			>
				{days.map((date) => {
					const isSelected = selected ? isSameDay(date, selected) : false;
					const today = isToday(date);
					const weekday = weekdayLabelFor(date, weekStartsOn, weekdaysShort);
					const dayOfMonth = date.getDate();
					const optionId = `${labelId}-day-${date.getFullYear()}-${date.getMonth()}-${dayOfMonth}`;

					const content = renderDay
						? renderDay({
							date,
							dayOfMonth,
							weekdayLabel: weekday,
							isSelected,
							isToday: today,
						})
						: (
							<>
								<span className={styles.weekday}>
									{weekday}
								</span>
								<span className={styles.dayNumber}>
									{dayOfMonth}
								</span>
							</>
						);

					return (
						<button
							key={optionId}
							id={optionId}
							type='button'
							role='option'
							aria-selected={isSelected}
							aria-current={today ? 'date' : undefined}
							aria-label={`${weekday}, ${dayOfMonth} ${formatMonthYear(date, months)}`}
							className={cn(
								styles.day,
								isSelected ? styles.daySelected : '',
								today && !isSelected ? styles.dayToday : '',
							)}
							onClick={() => selectDate(date)}
						>
							{content}
						</button>
					);
				})}
			</div>
		</div>
	);
});

DayStripCalendar.displayName = 'DayStripCalendar';
