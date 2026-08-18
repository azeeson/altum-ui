import {test, expect} from '@playwright/test';
import {compareDay, isDateInRange, isSameDay, selectNextRange} from '../../src/components/Calendar/Calendar.utils';

test.describe('calendar.utils', () => {
	test('isSameDay игнорирует время', () => {
		const a = new Date(2026, 7, 16, 9, 0);
		const b = new Date(2026, 7, 16, 23, 59);
		expect(isSameDay(a, b)).toBe(true);
		expect(compareDay(a, b)).toBe(0);
	});

	test('isDateInRange исключает границы', () => {
		const start = new Date(2026, 7, 10);
		const end = new Date(2026, 7, 20);
		expect(isDateInRange(new Date(2026, 7, 15), start, end)).toBe(true);
		expect(isDateInRange(start, start, end)).toBe(false);
	});

	test('selectNextRange сначала задаёт start, затем end', () => {
		const first = selectNextRange({}, new Date(2026, 7, 12));
		expect(first.start && isSameDay(first.start, new Date(2026, 7, 12))).toBe(true);
		expect(first.end).toBeUndefined();
		const second = selectNextRange(first, new Date(2026, 7, 18));
		expect(second.end && isSameDay(second.end, new Date(2026, 7, 18))).toBe(true);
	});
});
