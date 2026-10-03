import {test, expect} from '@playwright/test';
import {formValuesEqual} from '../../src/shared/form/formValues';

test.describe('formValuesEqual', () => {
	test('считает одинаковыми примитивы и NaN', () => {
		expect(formValuesEqual(1, 1)).toBe(true);
		expect(formValuesEqual('a', 'b')).toBe(false);
		expect(formValuesEqual(Number.NaN, Number.NaN)).toBe(true);
	});

	test('сравнивает Date по времени, а не по ссылке', () => {
		const time = Date.parse('2026-09-25T08:00:00.000Z');
		expect(formValuesEqual(new Date(time), new Date(time))).toBe(true);
		expect(formValuesEqual(new Date(time), new Date(time + 1))).toBe(false);
	});

	test('сравнивает вложенные объекты и массивы по составу', () => {
		const left = {
			user: {
				name: 'a'
			},
			tags: ['x']
		};
		const right = {
			user: {
				name: 'a'
			},
			tags: ['x']
		};

		expect(formValuesEqual(left, right)).toBe(true);
		expect(formValuesEqual(left, {
			...right,
			tags: ['y']
		})).toBe(false);
	});

	test('не считает равными разные ключи и чужие объекты', () => {
		expect(formValuesEqual({a: 1}, {
			a: 1,
			b: 2
		})).toBe(false);
		expect(formValuesEqual(new URL('https://altum.dev'), new URL('https://altum.dev'))).toBe(false);
	});
});
