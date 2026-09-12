import {test, expect} from '@playwright/test';
import {compareDay, isDateInRange, isSameDay, selectNextRange, weekdayLabels} from '../../src/components/Calendar/Calendar.utils';
import {getGridIndex} from '../../src/utils/a11y';

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

	test('getGridIndex двигает по сетке 7 колонок и зажимает края', () => {
		expect(getGridIndex(8, 30, 'ArrowLeft', 7)).toBe(7);
		expect(getGridIndex(8, 30, 'ArrowUp', 7)).toBe(1);
		expect(getGridIndex(0, 30, 'ArrowUp', 7)).toBe(0);
		expect(getGridIndex(5, 30, 'End', 7)).toBe(29);
		expect(getGridIndex(5, 30, 'Enter', 7)).toBeNull();
	});

	test('weekdayLabels крутит вс в начало при weekStartsOn=0', () => {
		const days = [
			'пн',
			'вт',
			'ср',
			'чт',
			'пт',
			'сб',
			'вс'
		];
		expect(weekdayLabels(days, 1)).toEqual(days);
		expect(weekdayLabels(days, 0)).toEqual([
			'вс',
			'пн',
			'вт',
			'ср',
			'чт',
			'пт',
			'сб'
		]);
	});
});
