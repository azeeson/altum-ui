import {test, expect} from '@playwright/test';
import {set} from '../../src/shared/form/Form.utils';

test.describe('set', () => {
	test('пишет по вложенному пути и не мутирует исходник', () => {
		const source = {
			user: {
				name: 'a',
				city: 'b'
			}
		};
		const next = set(source, 'user.name', 'c');

		expect(source.user.name).toBe('a');
		expect(next.user.name).toBe('c');
		expect(next.user.city).toBe('b');
		expect(next.user).not.toBe(source.user);
	});

	test('создаёт массив по числовому сегменту', () => {
		const next = set({}, 'items[0].id', 1) as {items: Array<{id: number}>};
		expect(next.items[0].id).toBe(1);
		expect(Array.isArray(next.items)).toBe(true);
	});

	test('принимает путь массивом', () => {
		const next = set({a: {b: 1}}, ['a', 'c'], 2) as {
			a: {
				b: number;
				c: number
			}
		};
		expect(next.a).toEqual({
			b: 1,
			c: 2
		});
	});

	test('не пишет в __proto__, constructor и prototype', () => {
		const source = {a: 1};
		expect(set(source, '__proto__.polluted', true)).toBe(source);
		expect(set(source, 'constructor.prototype.polluted', true)).toBe(source);
		expect(set(source, ['a', 'prototype', 'x'], 1)).toBe(source);
		expect(({} as {polluted?: boolean}).polluted).toBeUndefined();
	});

	test('пустой путь возвращает тот же объект', () => {
		const source = {a: 1};
		expect(set(source, '', 2)).toBe(source);
	});
});
