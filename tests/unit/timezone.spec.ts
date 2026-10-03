import {test, expect} from '@playwright/test';
import {formatInTimeZone, formatTimezoneLabel, getBrowserTimezone, getSupportedTimezones, getTimezoneOffsetMinutes, getZonedParts, isSameZonedDay, isValidTimeZone} from '../../src/core/utils/timezone';

test.describe('timezone', () => {
	test('getBrowserTimezone возвращает непустую строку', () => {
		expect(getBrowserTimezone().length).toBeGreaterThan(0);
	});

	test('getSupportedTimezones отдаёт непустой список IANA-имён', () => {
		const zones = getSupportedTimezones();
		expect(zones.length).toBeGreaterThan(0);
		expect(zones).toContain('UTC');
		expect(zones).toContain(getBrowserTimezone());
	});

	test('formatTimezoneLabel добавляет сдвиг известному поясу', () => {
		expect(formatTimezoneLabel('UTC')).toMatch(/^UTC \(/);
	});

	test('formatTimezoneLabel оставляет неизвестное имя как есть', () => {
		expect(formatTimezoneLabel('Not/AZone')).toBe('Not/AZone');
		expect(isValidTimeZone('UTC')).toBe(true);
		expect(isValidTimeZone('Not/AZone')).toBe(false);
	});

	test('считает поля и сдвиг в поясе', () => {
		const instant = new Date(Date.UTC(2026, 0, 15, 22, 30, 0));
		const moscow = getZonedParts(instant, 'Europe/Moscow');
		expect(moscow).toEqual({
			year: 2026,
			month: 1,
			day: 16,
			hour: 1,
			minute: 30,
			second: 0,
		});
		expect(getTimezoneOffsetMinutes('Europe/Moscow', instant)).toBe(180);
		expect(getTimezoneOffsetMinutes('UTC', instant)).toBe(0);
		expect(isSameZonedDay(instant, new Date(Date.UTC(2026, 0, 16, 1, 0, 0)), 'Europe/Moscow')).toBe(true);
		expect(formatInTimeZone(instant, 'Not/AZone', 'ru')).toBe('');
	});
});
