import {test, expect} from '@playwright/test';
import {omit, pick} from '../../src/core/utils/object';

test.describe('pick / omit', () => {
	test('pick копирует только перечисленные собственные ключи и не мутирует исходник', () => {
		const source = {
			id: 1,
			name: 'a',
			extra: true,
		};
		const next = pick(source, ['id', 'name']);

		expect(next).toEqual({
			id: 1,
			name: 'a',
		});
		expect(source).toEqual({
			id: 1,
			name: 'a',
			extra: true,
		});
		expect(next).not.toBe(source);
	});

	test('pick пропускает ключ, которого нет у объекта', () => {
		const source: {
			id: number
			name?: string
		} = {id: 1};
		const next = pick(source, ['id', 'name']);

		expect(next).toEqual({id: 1});
		expect('name' in next).toBe(false);
	});

	test('omit убирает перечисленные ключи и не мутирует исходник', () => {
		const source = {
			id: 1,
			password: 'x',
			name: 'a',
		};
		const next = omit(source, ['password']);

		expect(next).toEqual({
			id: 1,
			name: 'a',
		});
		expect(source.password).toBe('x');
		expect(next).not.toBe(source);
	});
});
