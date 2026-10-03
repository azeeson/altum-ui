import type {DayStripCalendarProps} from './DayStripCalendar.types';
export type {
	DayStripDayRenderProps,
	DayStripCalendarProps,
} from './DayStripCalendar.types';

import {useId} from 'react';
import {
	addDays,
	buildDayStrip,
	formatMonthYear,
	isSameDay,
	isToday,
	startOfDay,
	getWeekStart,
	weekdayLabelFor,
} from '../Calendar/Calendar.utils';
import {PeriodHeader} from '../../base/PeriodHeader';
import {handleRovingFocusKeyDown} from '../../core/utils/keyboard';
import unstyled from '../../styles/unstyledControl.module.css';
import utilities from '../../styles/utilities.module.css';
import styles from './DayStripCalendar.module.css';
import {cn} from '../../core/utils/cn';
import {useControlledStateWithCallback} from '../../hooks/useControlledState';
import {useLocale} from '../../locales/localeContext';
import {ruSlice as ru_calendar} from '../../locales/slices/calendar.ru';
import {ruSlice as ru_dayStrip} from '../../locales/slices/dayStrip.ru';

const localeFallback = {
	calendar: ru_calendar,
	dayStrip: ru_dayStrip,
};

/**
 * Горизонтальная полоса дней для быстрого выбора даты в недельном или произвольном окне.
 * Стрелки на ленте переводят фокус, шапка листает видимое окно.
 *
 * @component
 * @example
 * <DayStripCalendar value={date} onChange={setDate} daysCount={7} />
 */
export function DayStripCalendar({
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
	rootRef,
	...rest
}: DayStripCalendarProps) {
	const {messages} = useLocale(localeFallback);
	const {months, weekdaysShort} = messages.calendar;
	const labelId = useId();
	const selected = value ? startOfDay(value) : undefined;
	const anchor = selected ?? startOfDay(new Date());
	const [viewDate, setViewDate] = useControlledStateWithCallback(
		controlledViewDate !== undefined ? startOfDay(controlledViewDate) : undefined,
		getWeekStart(anchor, weekStartsOn),
		onViewDateChange,
	);
	const days = buildDayStrip(viewDate, daysCount);
	const shiftView = (direction: -1 | 1) => {
		setViewDate(startOfDay(addDays(viewDate, direction * daysCount)));
	};

	return (
		<div
			ref={rootRef}
			className={cn(styles.root, className)}
			role='group'
			aria-label={ariaLabel ?? messages.dayStrip.ariaLabel}
			aria-labelledby={showHeader ? labelId : undefined}
			{...rest}
		>
			<PeriodHeader
				title={formatMonthYear(selected ?? viewDate, months)}
				titleId={labelId}
				showTitle={showHeader}
				showNav={showNav}
				onPrev={() => shiftView(-1)}
				onNext={() => shiftView(1)}
				prevLabel={messages.dayStrip.prev}
				nextLabel={messages.dayStrip.next}
			/>

			<div
				className={styles.strip}
				role='listbox'
				aria-label={messages.dayStrip.days}
				aria-orientation='horizontal'
				onClick={(event) => {
					const option = (event.target as Element).closest('[role="option"]');
					if (!(option instanceof HTMLElement) || !event.currentTarget.contains(option)) return;
					const time = Number(option.dataset.time);
					if (!Number.isFinite(time)) return;
					onChange(startOfDay(new Date(time)));
				}}
				onKeyDown={(event) => {
					const list = Array.from(
						event.currentTarget.querySelectorAll<HTMLElement>('[role="option"]'),
					);
					const index = list.indexOf(document.activeElement as HTMLElement);
					handleRovingFocusKeyDown(event, {
						currentIndex: index,
						length: list.length,
						orientation: 'horizontal',
						onMove: (nextIndex) => {
							const current = list[index];
							const next = list[nextIndex];
							if (!current || !next) return;
							current.tabIndex = -1;
							next.tabIndex = 0;
							next.focus();
						},
					});
				}}
			>
				{days.map((date, index) => {
					const isSelected = selected ? isSameDay(date, selected) : false;
					const today = isToday(date);
					const weekday = weekdayLabelFor(date, weekStartsOn, weekdaysShort);
					const dayOfMonth = date.getDate();
					const optionId = `${labelId}-day-${date.getFullYear()}-${date.getMonth()}-${dayOfMonth}`;

					return (
						<button
							key={optionId}
							id={optionId}
							type='button'
							role='option'
							aria-selected={isSelected}
							aria-current={today ? 'date' : undefined}
							aria-label={`${weekday}, ${dayOfMonth} ${formatMonthYear(date, months)}`}
							data-selected={isSelected ? '' : undefined}
							data-today={today ? '' : undefined}
							data-time={date.getTime()}
							tabIndex={isSelected || (!selected && index === 0) ? 0 : -1}
							className={cn(unstyled.control, utilities.fCenter, styles.day)}
						>
							{renderDay
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
								)}
						</button>
					);
				})}
			</div>
		</div>
	);
}
