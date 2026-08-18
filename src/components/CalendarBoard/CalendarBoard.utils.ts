import {
	addDays,
	buildDayStrip,
	startOfDay,
	startOfWeek,
} from '../Calendar/Calendar.utils';

/**
 * Строит недельные ряды дат, полностью покрывающие календарный месяц viewDate.
 * Включает «хвосты» соседних месяцев для заполнения первой и последней недели.
 *
 * @param viewDate - Любая дата внутри целевого месяца.
 * @param weekStartsOn - Первый день недели: `1` — понедельник, `0` — воскресенье.
 * @returns Массив недель; каждая неделя — 7 дат подряд.
 */
export function buildMonthWeeks(viewDate: Date, weekStartsOn: 0 | 1 = 1): Date[][] {
	const year = viewDate.getFullYear();
	const month = viewDate.getMonth();
	const first = startOfDay(new Date(year, month, 1));
	const last = startOfDay(new Date(year, month + 1, 0));
	let cursor = startOfWeek(first, weekStartsOn);
	const lastWeekStart = startOfWeek(last, weekStartsOn);
	const weeks: Date[][] = [];

	while (cursor.getTime() <= lastWeekStart.getTime()) {
		weeks.push(buildDayStrip(cursor, 7));
		cursor = addDays(cursor, 7);
	}

	return weeks;
}

/** Число календарных дней в полуинтервале [start, end). */
function calendarDaySpan(start: Date, end: Date): number {
	const a = startOfDay(start).getTime();
	const b = startOfDay(end).getTime();
	return Math.max(0, Math.round((b - a) / (24 * 60 * 60 * 1000)));
}

/**
 * Проверяет, занимает ли интервал более одного календарного дня.
 * Границы нормализуются к полуночи; `end` — exclusive (как у all-day событий).
 *
 * @param start - Начало интервала.
 * @param end - Exclusive конец интервала.
 * @returns `true`, если span ≥ 2 календарных дня.
 */
export function isMultiDayTask(start: Date, end: Date): boolean {
	return calendarDaySpan(start, end) > 1;
}

/** Ключ календарного дня для Map/Set: `YYYY-M-D`. */
export function calendarDateKey(date: Date): string {
	return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}
