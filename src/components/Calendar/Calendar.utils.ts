import {addDays, compareDay, getWeekStart, isSameDay, startOfDay} from '../../core/utils/date';
import type {DateRangeValue} from './Calendar.types';

export {addDays, compareDay, getWeekStart, isSameDay, startOfDay};

export type {CalendarDayCell, DateRangeValue} from './Calendar.types';

/** Дата строго между start и end (не включая концы). */
export function isDateInRange(date: Date, start?: Date, end?: Date): boolean {
	if (!start || !end) return false;
	return compareDay(date, start) > 0 && compareDay(date, end) < 0;
}

/**
 * Следующий диапазон при клике по дню в mode=range:
 * нет start / есть полный диапазон → новый start;
 * есть только start → end (с авто-свапом, если раньше start).
 */
export function selectNextRange(
	current: DateRangeValue,
	clicked: Date,
): DateRangeValue {
	const day = startOfDay(clicked);
	if (!current.start || (current.start && current.end)) {
		return {
			start: day,
			end: undefined
		};
	}
	if (compareDay(day, current.start) < 0) {
		return {
			start: day,
			end: startOfDay(current.start)
		};
	}
	return {
		start: startOfDay(current.start),
		end: day
	};
}

export function isToday(date: Date): boolean {
	return isSameDay(date, new Date());
}

export function buildDayStrip(viewDate: Date, daysCount: number): Date[] {
	const start = startOfDay(viewDate);
	return Array.from({length: Math.max(1, daysCount)}, (_, index) => addDays(start, index));
}

/**
 * Подпись «месяц год» из локализованных названий месяцев
 * (`useLocale().messages.calendar.months`).
 */
export function formatMonthYear(
	date: Date,
	months: readonly string[],
): string {
	return `${months[date.getMonth()] ?? ''} ${date.getFullYear()}`;
}

/**
 * Подписи дней недели в порядке колонок календаря.
 *
 * @param weekdays - Краткие подписи пн–вс (`messages.calendar.weekdaysShort`).
 * @param weekStartsOn - `1` — понедельник первый, `0` — воскресенье.
 */
export function weekdayLabels(
	weekdays: readonly string[],
	weekStartsOn: 0 | 1 = 1,
): string[] {
	return weekStartsOn === 1
		? [...weekdays]
		: [weekdays[6] ?? '', ...weekdays.slice(0, 6)];
}

/**
 * Краткая подпись дня недели с учётом первого дня недели.
 *
 * @param date - Календарная дата.
 * @param weekStartsOn - `1` — понедельник первый, `0` — воскресенье первым.
 * @param weekdays - Краткие подписи от понедельника до воскресенья
 *   (`useLocale().messages.calendar.weekdaysShort`).
 */
export function weekdayLabelFor(
	date: Date,
	weekStartsOn: 0 | 1 = 1,
	weekdays: readonly string[],
): string {
	const labels = weekdayLabels(weekdays, weekStartsOn);
	const index = weekStartsOn === 1
		? (date.getDay() === 0 ? 6 : date.getDay() - 1)
		: date.getDay();
	return labels[index] ?? '';
}
