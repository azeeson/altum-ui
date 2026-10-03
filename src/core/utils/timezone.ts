import type {LocaleCode} from '../../locales/types';
import {localeToBcp47} from './locale';

/** Календарные поля момента в заданном поясе. `month` — от 1 до 12. */
export interface ZonedDateParts {
	year: number;
	month: number;
	day: number;
	hour: number;
	minute: number;
	second: number;
}

/**
 * Запасной список, если `Intl.supportedValuesOf` недоступен.
 * В целевых браузерах библиотеки список берётся из ICU.
 */
const FALLBACK_TIMEZONES = [
	'UTC',
	'Africa/Cairo',
	'Africa/Johannesburg',
	'America/Anchorage',
	'America/Argentina/Buenos_Aires',
	'America/Chicago',
	'America/Denver',
	'America/Los_Angeles',
	'America/Mexico_City',
	'America/New_York',
	'America/Sao_Paulo',
	'Asia/Dubai',
	'Asia/Hong_Kong',
	'Asia/Kolkata',
	'Asia/Shanghai',
	'Asia/Singapore',
	'Asia/Tokyo',
	'Australia/Sydney',
	'Europe/Berlin',
	'Europe/London',
	'Europe/Moscow',
	'Europe/Paris',
	'Pacific/Auckland',
	'Pacific/Honolulu',
];

/**
 * Часовой пояс браузера. При ошибке или пустом значении — `UTC`.
 *
 * @returns IANA-имя, например `Europe/Moscow`.
 *
 * @example
 * getBrowserTimezone();
 */
export function getBrowserTimezone(): string {
	try {
		return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
	} catch {
		return 'UTC';
	}
}

/**
 * Часовые пояса, которые умеет `Intl` в этом окружении.
 *
 * @returns Копия списка IANA-имён.
 *
 * @example
 * getSupportedTimezones().includes('UTC');
 */
export function getSupportedTimezones(): string[] {
	const intlWithSupportedValues = Intl as typeof Intl & {
		supportedValuesOf?: (key: 'timeZone') => string[];
	};

	const zones = typeof intlWithSupportedValues.supportedValuesOf === 'function'
		? [...intlWithSupportedValues.supportedValuesOf('timeZone')]
		: [...FALLBACK_TIMEZONES];
	if (!zones.includes('UTC')) zones.unshift('UTC');
	return zones;
}

/**
 * Проверяет, что имя пояса принимает `Intl`.
 *
 * @param timeZone - IANA-имя.
 * @returns `false` для пустой или неизвестной зоны.
 */
export function isValidTimeZone(timeZone: string): boolean {
	if (!timeZone) return false;
	try {
		Intl.DateTimeFormat('en-US', {timeZone});
		return true;
	} catch {
		return false;
	}
}

/**
 * Год, месяц, день и время `date` на циферблате пояса.
 *
 * @param date - Момент UTC.
 * @param timeZone - IANA-имя.
 * @returns Поля или `null`, если пояс неизвестен.
 */
export function getZonedParts(date: Date, timeZone: string): ZonedDateParts | null {
	try {
		const parts = new Intl.DateTimeFormat('en-US', {
			timeZone,
			hourCycle: 'h23',
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
		}).formatToParts(date);
		const bag: Record<string, string> = {};
		for (const part of parts) {
			if (part.type !== 'literal') bag[part.type] = part.value;
		}
		const hour = Number(bag.hour);
		return {
			year: Number(bag.year),
			month: Number(bag.month),
			day: Number(bag.day),
			hour: hour === 24 ? 0 : hour,
			minute: Number(bag.minute),
			second: Number(bag.second),
		};
	} catch {
		return null;
	}
}

/**
 * Сдвиг пояса относительно UTC в минутах на момент `date`.
 * Москва зимой и летом — `180`.
 *
 * @param timeZone - IANA-имя.
 * @param date - Момент, для которого нужен сдвиг. По умолчанию — сейчас.
 * @returns Минуты или `null`, если пояс неизвестен.
 */
export function getTimezoneOffsetMinutes(timeZone: string, date = new Date()): number | null {
	const parts = getZonedParts(date, timeZone);
	if (!parts) return null;
	const asUtc = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second);
	return Math.round((asUtc - date.getTime()) / 60000);
}

/**
 * Один ли календарный день у двух моментов в заданном поясе.
 *
 * @param a - Первый момент.
 * @param b - Второй момент.
 * @param timeZone - IANA-имя.
 * @returns `false`, если пояс неизвестен или дни различаются.
 */
export function isSameZonedDay(a: Date, b: Date, timeZone: string): boolean {
	const left = getZonedParts(a, timeZone);
	const right = getZonedParts(b, timeZone);
	if (!left || !right) return false;
	return left.year === right.year && left.month === right.month && left.day === right.day;
}

/**
 * Форматирует момент в поясе. Невалидный пояс даёт пустую строку.
 *
 * @param date - Момент UTC.
 * @param timeZone - IANA-имя.
 * @param locale - `ru` или `en`.
 * @param options - Опции `Intl`, кроме `timeZone`: его задаёт аргумент.
 * @returns Строка формата или `''`.
 */
export function formatInTimeZone(
	date: Date,
	timeZone: string,
	locale: LocaleCode,
	options: Intl.DateTimeFormatOptions = {},
): string {
	try {
		return new Intl.DateTimeFormat(localeToBcp47(locale), {
			...options,
			timeZone,
		}).format(date);
	} catch {
		return '';
	}
}

/**
 * Короткий сдвиг пояса (`GMT+3`). Пустая строка, если пояс неизвестен.
 *
 * @param timeZone - IANA-имя.
 * @param date - Момент, для которого нужен сдвиг.
 * @returns Подпись сдвига или `''`.
 */
export function formatTimezoneOffset(timeZone: string, date = new Date()): string {
	try {
		const parts = new Intl.DateTimeFormat('en-US', {
			timeZone,
			timeZoneName: 'shortOffset',
		}).formatToParts(date);
		return parts.find((part) => part.type === 'timeZoneName')?.value ?? '';
	} catch {
		return '';
	}
}

/**
 * Подпись пояса: имя IANA и короткий сдвиг, если `Intl` его знает.
 *
 * @param timeZone - IANA-имя.
 * @returns `Europe/Moscow (GMT+3)` или исходное имя, если сдвиг недоступен.
 *
 * @example
 * formatTimezoneLabel('UTC');
 */
export function formatTimezoneLabel(timeZone: string): string {
	const offset = formatTimezoneOffset(timeZone);
	return offset ? `${timeZone} (${offset})` : timeZone;
}
