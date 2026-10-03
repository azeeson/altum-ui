import {test, expect} from '@playwright/test';
import {addToDate, formatHourLabel, formatHourTime, formatLocalDate, getWeekDays, getWeekStart, isSameDay, parseLocalDate} from '../../src/core/utils/date';
import {DAY_SECONDS, getDurationUnitAndValue, HOUR_SECONDS, MINUTE_SECONDS, secondsToUnit, unitToSeconds} from '../../src/core/utils/duration';
import {localeToBcp47} from '../../src/core/utils/locale';
import {plural, pluralEn, pluralRu} from '../../src/core/utils/plural';

test.describe('date', () => {
	test('getWeekStart с понедельника и с воскресенья', () => {
		const friday = new Date(2026, 8, 25, 15, 40);
		const monday = getWeekStart(friday, 1);
		const sunday = getWeekStart(friday, 0);

		expect(monday.getFullYear()).toBe(2026);
		expect(monday.getMonth()).toBe(8);
		expect(monday.getDate()).toBe(21);
		expect(monday.getHours()).toBe(0);
		expect(friday.getHours()).toBe(15);

		expect(sunday.getDate()).toBe(20);
		expect(sunday.getDay()).toBe(0);
	});

	test('getWeekDays возвращает семь полуночей подряд', () => {
		const days = getWeekDays(new Date(2026, 8, 25), 1);
		expect(days).toHaveLength(7);
		expect(days[0].getDate()).toBe(21);
		expect(days[6].getDate()).toBe(27);
		expect(days[6].getDay()).toBe(0);
	});

	test('addToDate сохраняет время и не мутирует исходник', () => {
		const source = new Date(2026, 0, 15, 9, 30);
		const next = addToDate(source, 1, 'month');
		expect(source.getMonth()).toBe(0);
		expect(next.getMonth()).toBe(1);
		expect(next.getDate()).toBe(15);
		expect(next.getHours()).toBe(9);
		expect(next.getMinutes()).toBe(30);
		expect(addToDate(source, -2, 'day').getDate()).toBe(13);
	});

	test('formatHourTime и formatHourLabel нормализуют час', () => {
		expect(formatHourTime(9)).toBe('09:00');
		expect(formatHourTime(25)).toBe('01:00');
		expect(formatHourTime(-1)).toBe('23:00');
		expect(formatHourLabel(15, 'ru')).toMatch(/15/);
		expect(formatHourLabel(15, 'en')).toMatch(/3/);
	});

	test('parseLocalDate не сдвигает календарный день в UTC', () => {
		const date = parseLocalDate('2026-09-25');
		expect(date).not.toBeNull();
		expect(date && isSameDay(date, new Date(2026, 8, 25))).toBe(true);
		expect(date && formatLocalDate(date)).toBe('2026-09-25');
		expect(parseLocalDate('2026-02-31')).toBeNull();
	});
});

test.describe('duration', () => {
	test('переводит секунды и выбирает крупнейшую целую единицу', () => {
		expect(MINUTE_SECONDS).toBe(60);
		expect(HOUR_SECONDS).toBe(3600);
		expect(DAY_SECONDS).toBe(86400);
		expect(unitToSeconds(2, 'hour')).toBe(7200);
		expect(secondsToUnit(90, 'minute')).toBe(1.5);
		expect(getDurationUnitAndValue(172800)).toEqual({
			unit: 'day',
			value: 2,
		});
		expect(getDurationUnitAndValue(7 * 86400)).toEqual({
			unit: 'week',
			value: 1,
		});
		expect(getDurationUnitAndValue(7200)).toEqual({
			unit: 'hour',
			value: 2,
		});
		expect(getDurationUnitAndValue(90)).toEqual({
			unit: 'minute',
			value: 1.5,
		});
		expect(getDurationUnitAndValue(0)).toEqual({
			unit: 'minute',
			value: 0,
		});
		expect(getDurationUnitAndValue(-3600)).toEqual({
			unit: 'hour',
			value: -1,
		});
	});
});

test.describe('localeToBcp47', () => {
	test('переводит код языка в тег Intl', () => {
		expect(localeToBcp47('ru')).toBe('ru-RU');
		expect(localeToBcp47('en')).toBe('en-US');
	});
});

test.describe('plural', () => {
	test('pluralRu различает один, несколько и много', () => {
		expect(pluralRu(1, 'день', 'дня', 'дней')).toBe('день');
		expect(pluralRu(2, 'день', 'дня', 'дней')).toBe('дня');
		expect(pluralRu(5, 'день', 'дня', 'дней')).toBe('дней');
		expect(pluralRu(11, 'день', 'дня', 'дней')).toBe('дней');
		expect(pluralRu(21, 'день', 'дня', 'дней')).toBe('день');
		expect(pluralRu(22, 'день', 'дня', 'дней')).toBe('дня');
	});

	test('pluralEn и plural', () => {
		expect(pluralEn(1, 'day', 'days')).toBe('day');
		expect(pluralEn(0, 'day', 'days')).toBe('days');
		expect(plural('en', 3, {
			one: 'день',
			few: 'дня',
			many: 'дней'
		})).toBe('дней');
		expect(plural('ru', 2, {
			one: 'день',
			few: 'дня',
			many: 'дней'
		})).toBe('дня');
	});
});
