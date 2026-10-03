import type {LocaleCode} from '../../locales/types';
import {localeToBcp47} from './locale';

/** Первый день недели: `0` — воскресенье, `1` — понедельник. */
export type WeekStartsOn = 0 | 1;

/** Единица, на которую сдвигает `addToDate`. */
export type DateAddUnit = 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year';

/**
 * Полночь первого дня недели, в которую попадает `date`.
 * Время исходной даты не меняется.
 *
 * @param date - Любой момент внутри недели.
 * @param weekStartsOn - `1` — понедельник, `0` — воскресенье.
 * @returns Новый `Date` в локальной полуночи.
 *
 * @example
 * getWeekStart(new Date(2026, 8, 25), 1); // понедельник той же недели
 */
export function getWeekStart(date: Date, weekStartsOn: WeekStartsOn = 1): Date {
	const start = new Date(date);
	const weekday = start.getDay();
	const offset = weekStartsOn === 1
		? (weekday === 0 ? 6 : weekday - 1)
		: weekday;
	start.setDate(start.getDate() - offset);
	start.setHours(0, 0, 0, 0);
	return start;
}

/**
 * Семь календарных дней недели, начиная с `getWeekStart`.
 *
 * @param anchor - Любой день этой недели.
 * @param weekStartsOn - `1` — понедельник, `0` — воскресенье.
 * @returns Новые `Date` в локальной полуночи.
 *
 * @example
 * getWeekDays(new Date(2026, 8, 25));
 */
export function getWeekDays(anchor: Date, weekStartsOn: WeekStartsOn = 1): Date[] {
	const start = getWeekStart(anchor, weekStartsOn);
	return Array.from({length: 7}, (_, index) => {
		const day = new Date(start);
		day.setDate(start.getDate() + index);
		return day;
	});
}

/**
 * Копия `date`, сдвинутая на `amount` единиц. Время сохраняется
 * (в отличие от `addDays`, который обрезает до полуночи).
 *
 * @param date - Исходный момент (не мутируется).
 * @param amount - Сдвиг; отрицательный — назад.
 * @param unit - Единица сдвига.
 * @returns Новый `Date`.
 *
 * @example
 * addToDate(new Date(2026, 0, 15, 9, 30), 1, 'month');
 */
export function addToDate(date: Date, amount: number, unit: DateAddUnit): Date {
	const next = new Date(date.getTime());
	switch (unit) {
		case 'minute':
			next.setMinutes(next.getMinutes() + amount);
			break;
		case 'hour':
			next.setHours(next.getHours() + amount);
			break;
		case 'day':
			next.setDate(next.getDate() + amount);
			break;
		case 'week':
			next.setDate(next.getDate() + amount * 7);
			break;
		case 'month':
			next.setMonth(next.getMonth() + amount);
			break;
		case 'year':
			next.setFullYear(next.getFullYear() + amount);
			break;
		default: {
			const exhaustive: never = unit;
			return exhaustive;
		}
	}
	return next;
}

/**
 * Локальная полночь того же календарного дня. Время отбрасывается.
 *
 * @param date - Исходный момент (не мутируется).
 * @returns Новый `Date`.
 *
 * @example
 * startOfDay(new Date(2026, 8, 25, 15, 40));
 */
export function startOfDay(date: Date): Date {
	return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/**
 * Сдвигает календарный день и обрезает время до локальной полуночи.
 *
 * @param date - Исходный момент (не мутируется).
 * @param days - Число дней; отрицательное — назад.
 * @returns Новый `Date`.
 *
 * @example
 * addDays(new Date(2026, 0, 15, 9, 30), 1);
 */
export function addDays(date: Date, days: number): Date {
	return addToDate(startOfDay(date), days, 'day');
}

/**
 * Совпадает ли локальный календарный день.
 *
 * @param a - Первая дата.
 * @param b - Вторая дата.
 * @returns `true`, если год, месяц и день совпадают.
 */
export function isSameDay(a: Date, b: Date): boolean {
	return compareDay(a, b) === 0;
}

/**
 * Сравнение локальных календарных дней: −1 / 0 / 1.
 *
 * @param a - Первая дата.
 * @param b - Вторая дата.
 * @returns Знак разности дней без учёта времени.
 */
export function compareDay(a: Date, b: Date): number {
	const year = a.getFullYear() - b.getFullYear();
	if (year) return year < 0 ? -1 : 1;
	const month = a.getMonth() - b.getMonth();
	if (month) return month < 0 ? -1 : 1;
	const day = a.getDate() - b.getDate();
	return day < 0 ? -1 : day > 0 ? 1 : 0;
}

/**
 * `YYYY-MM-DD` как локальная полночь. Строка даты без времени не уходит в UTC.
 *
 * @param value - Дата вида `2026-09-25`.
 * @returns Локальная полночь или `null`, если день не существует.
 *
 * @example
 * parseLocalDate('2026-09-25');
 */
/**
 * Локальный день существует: 31 февраля и похожие даты отсекаются.
 * `monthIndex` — месяц с нуля, как у `Date`.
 */
export function isExistingLocalDate(year: number, monthIndex: number, day: number): boolean {
	const date = new Date(year, monthIndex, day);
	return date.getFullYear() === year && date.getMonth() === monthIndex && date.getDate() === day;
}

/**
 * Цифры маски `DDMMYYYY` для локальной даты. Пустая дата — пустая строка.
 *
 * @param date - Локальная дата или отсутствие значения.
 * @returns Восемь цифр либо `''`.
 *
 * @example
 * formatDateToDigits(new Date(2026, 8, 5)); // "05092026"
 */
export function formatDateToDigits(date: Date | undefined): string {
	if (!date) return '';
	const day = date.getDate();
	const month = date.getMonth() + 1;
	const year = date.getFullYear();
	return `${day < 10 ? `0${day}` : day}${month < 10 ? `0${month}` : month}${year}`;
}

/**
 * Локальная дата из восьми цифр `DDMMYYYY`.
 * Неполная строка, год ≤ 1000 и несуществующий день дают `undefined`.
 *
 * @param digits - Только цифры маски.
 * @returns Полночь локального дня либо `undefined`.
 *
 * @example
 * parseDigitsToDate('05092026');
 */
export function parseDigitsToDate(digits: string): Date | undefined {
	if (digits.length !== 8) return undefined;

	const day = Number.parseInt(digits.slice(0, 2), 10);
	const month = Number.parseInt(digits.slice(2, 4), 10) - 1;
	const year = Number.parseInt(digits.slice(4, 8), 10);
	if (Number.isNaN(day) || Number.isNaN(month) || Number.isNaN(year) || year <= 1000) {
		return undefined;
	}

	return isExistingLocalDate(year, month, day) ? new Date(year, month, day) : undefined;
}

export function parseLocalDate(value: string): Date | null {
	const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
	if (!match) return null;
	const year = Number(match[1]);
	const monthIndex = Number(match[2]) - 1;
	const day = Number(match[3]);
	if (!isExistingLocalDate(year, monthIndex, day)) return null;
	return new Date(year, monthIndex, day);
}

/**
 * Локальный календарный день в виде `YYYY-MM-DD`.
 *
 * @param date - Момент в локальной зоне.
 * @returns Строка даты без времени и без сдвига в UTC.
 *
 * @example
 * formatLocalDate(new Date(2026, 8, 25, 15)); // "2026-09-25"
 */
export function formatLocalDate(date: Date): string {
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return `${date.getFullYear()}-${month}-${day}`;
}

function normalizeHour(hour: number): number {
	const whole = Math.trunc(hour);
	return ((whole % 24) + 24) % 24;
}

/**
 * Подпись часа для оси времени в локали интерфейса (`15:00` / `3:00 PM`).
 * Час читается как номер на циферблате, а не как локальный момент «сегодня»,
 * чтобы переход на летнее время не сдвигал метку.
 *
 * @param hour - Час. Вне 0–23 нормализуется по модулю 24.
 * @param locale - `ru` или `en`.
 * @returns Строка `Intl` с часом и минутами.
 *
 * @example
 * formatHourLabel(9, 'ru');
 */
export function formatHourLabel(hour: number, locale: LocaleCode): string {
	const date = new Date(Date.UTC(2020, 0, 15, normalizeHour(hour), 0, 0));
	return new Intl.DateTimeFormat(localeToBcp47(locale), {
		timeZone: 'UTC',
		hour: 'numeric',
		minute: '2-digit',
	}).format(date);
}

/**
 * Час в фиксированном виде `HH:00`, без локали.
 *
 * @param hour - Час. Вне 0–23 нормализуется по модулю 24.
 * @returns Строка вида `09:00`.
 *
 * @example
 * formatHourTime(9); // "09:00"
 */
export function formatHourTime(hour: number): string {
	return `${String(normalizeHour(hour)).padStart(2, '0')}:00`;
}

/**
 * Часы и минуты в виде `HH:MM`.
 *
 * @param hours - Час 0–23.
 * @param minutes - Минута 0–59.
 * @returns Строка вида `09:30`.
 */
export function formatHHmm(hours: number, minutes: number): string {
	return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}
