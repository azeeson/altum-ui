import {test, expect} from '@playwright/test';

/**
 * Повторяет children метки Badge:
 * `{!dot && label != null ? label : null}`
 */
function badgeMarkChildren(label: unknown, dot: boolean): unknown {
	return !dot && label != null ? label : null;
}

test.describe('Метка Badge', () => {
	test('label={0} даёт видимый ноль (не скрывается как falsy)', () => {
		expect(badgeMarkChildren(0, false)).toBe(0);
		/* Регрессия: React считал числовой 0 falsy-потомком и пропускал рендер. */
		expect(0).toBeFalsy();
		expect(badgeMarkChildren(0, false) != null).toBe(true);
	});

	test('content={5} по-прежнему даёт цифру', () => {
		expect(badgeMarkChildren(5, false)).toBe(5);
	});

	test('режим dot не показывает числовой контент', () => {
		expect(badgeMarkChildren(0, true)).toBeNull();
		expect(badgeMarkChildren(5, true)).toBeNull();
	});

	test('null/undefined контент не показывает глиф', () => {
		expect(badgeMarkChildren(null, false)).toBeNull();
		expect(badgeMarkChildren(undefined, false)).toBeNull();
	});
});
