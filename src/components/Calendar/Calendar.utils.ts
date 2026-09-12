import type {CalendarDayCell, DateRangeValue} from './Calendar.types';

export type {CalendarDayCell, DateRangeValue} from './Calendar.types';

export function buildMonthDays(year: number, month: number): CalendarDayCell[] {
	const daysInMonth = new Date(year, month + 1, 0).getDate();
	let firstDayIndex = new Date(year, month, 1).getDay() - 1;
	if (firstDayIndex < 0) firstDayIndex = 6;

	const days: CalendarDayCell[] = [];

	for (let i = 0; i < firstDayIndex; i++) {
		days.push({
			day: 0,
			isEmpty: true,
			date: null
		});
	}

	for (let i = 1; i <= daysInMonth; i++) {
		days.push({
			day: i,
			isEmpty: false,
			date: new Date(year, month, i)
		});
	}

	return days;
}

export function isSameDay(a: Date, b: Date): boolean {
	return (
		a.getFullYear() === b.getFullYear()
    && a.getMonth() === b.getMonth()
    && a.getDate() === b.getDate()
	);
}

/** Сравнение календарных дней: −1 / 0 / 1. */
export function compareDay(a: Date, b: Date): number {
	const year = a.getFullYear() - b.getFullYear();
	if (year) return year < 0 ? -1 : 1;
	const month = a.getMonth() - b.getMonth();
	if (month) return month < 0 ? -1 : 1;
	const day = a.getDate() - b.getDate();
	return day < 0 ? -1 : day > 0 ? 1 : 0;
}

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

export function startOfDay(date: Date): Date {
	return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function addDays(date: Date, days: number): Date {
	const next = startOfDay(date);
	next.setDate(next.getDate() + days);
	return next;
}

/** `weekStartsOn`: 0 = вс, 1 = пн (по умолчанию для RU-календаря). */
export function startOfWeek(date: Date, weekStartsOn: 0 | 1 = 1): Date {
	const start = startOfDay(date);
	const day = start.getDay(); // 0=вс … 6=сб
	const diff = weekStartsOn === 1
		? (day === 0 ? -6 : 1 - day)
		: -day;
	return addDays(start, diff);
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
