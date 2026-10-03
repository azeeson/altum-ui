/** Секунд в минуте. */
export const MINUTE_SECONDS = 60;

/** Секунд в часе. */
export const HOUR_SECONDS = 60 * MINUTE_SECONDS;

/** Секунд в сутках. */
export const DAY_SECONDS = 24 * HOUR_SECONDS;

/** Секунд в неделе из семи суток. */
export const WEEK_SECONDS = 7 * DAY_SECONDS;

/** Единица фиксированной длительности. Месяц и год не входят: в секундах они не постоянны. */
export type DurationUnit = 'minute' | 'hour' | 'day' | 'week';

/** Длительность, разобранная на число и единицу. */
export interface DurationUnitValue {
	unit: DurationUnit;
	value: number;
}

const SECONDS_IN_UNIT: Record<DurationUnit, number> = {
	minute: MINUTE_SECONDS,
	hour: HOUR_SECONDS,
	day: DAY_SECONDS,
	week: WEEK_SECONDS,
};

/**
 * Переводит секунды в выбранную единицу. Деление может дать дробь.
 *
 * @param seconds - Длительность в секундах.
 * @param unit - Целевая единица.
 * @returns Число единиц.
 *
 * @example
 * secondsToUnit(90, 'minute'); // 1.5
 */
export function secondsToUnit(seconds: number, unit: DurationUnit): number {
	return seconds / SECONDS_IN_UNIT[unit];
}

/**
 * Переводит значение единицы в секунды.
 *
 * @param value - Количество единиц.
 * @param unit - Единица.
 * @returns Секунды.
 *
 * @example
 * unitToSeconds(2, 'hour'); // 7200
 */
export function unitToSeconds(value: number, unit: DurationUnit): number {
	return value * SECONDS_IN_UNIT[unit];
}

/**
 * Самая крупная единица, на которую секунды делятся без остатка.
 * Ноль и любой остаток короче часа остаются в минутах.
 *
 * @param seconds - Длительность в секундах. Знак сохраняется.
 * @returns Единица и число.
 *
 * @example
 * getDurationUnitAndValue(172800); // {unit: 'day', value: 2}
 * getDurationUnitAndValue(90); // {unit: 'minute', value: 1.5}
 */
export function getDurationUnitAndValue(seconds: number): DurationUnitValue {
	if (seconds !== 0 && seconds % WEEK_SECONDS === 0) {
		return {
			unit: 'week',
			value: seconds / WEEK_SECONDS,
		};
	}
	if (seconds !== 0 && seconds % DAY_SECONDS === 0) {
		return {
			unit: 'day',
			value: seconds / DAY_SECONDS,
		};
	}
	if (seconds !== 0 && seconds % HOUR_SECONDS === 0) {
		return {
			unit: 'hour',
			value: seconds / HOUR_SECONDS,
		};
	}
	return {
		unit: 'minute',
		value: seconds / MINUTE_SECONDS,
	};
}
