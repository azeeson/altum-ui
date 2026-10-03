import {test, expect} from '@playwright/test';
import {
	checkedValue,
	compose,
	fieldRules,
	pattern,
	required,
} from '../../src/shared/form/formRules';

test.describe('form rules', () => {
	test('required считает пустыми только undefined, null и пустую строку', () => {
		const rule = required('Обязательно');

		expect(rule(undefined, {})).toBe('Обязательно');
		expect(rule(null, {})).toBe('Обязательно');
		expect(rule('', {})).toBe('Обязательно');
		expect(rule(0, {})).toBeUndefined();
		expect(rule(false, {})).toBeUndefined();
	});

	test('pattern пропускает пустое и ругает несовпадение', () => {
		const rule = pattern(/^[a-z]+$/, 'Только буквы');

		expect(rule('', {})).toBeUndefined();
		expect(rule(undefined, {})).toBeUndefined();
		expect(rule('ab', {})).toBeUndefined();
		expect(rule('a1', {})).toBe('Только буквы');
	});

	test('compose возвращает первую ошибку', () => {
		const rule = compose(
			required('Обязательно'),
			pattern(/@/, 'Не почта'),
		);

		expect(rule('', {})).toBe('Обязательно');
		expect(rule('user', {})).toBe('Не почта');
		expect(rule('a@b', {})).toBeUndefined();
	});

	test('compose передаёт всю форму во второе правило', () => {
		const rule = compose(
			required('Обязательно'),
			(value, values) => (value === values.password ? undefined : 'Не совпадает'),
		);

		expect(rule('x', {password: 'secret'})).toBe('Не совпадает');
		expect(rule('secret', {password: 'secret'})).toBeUndefined();
	});

	test('fieldRules сохраняет приоритет required → pattern → validate', () => {
		const rule = fieldRules({
			required: 'Обязательно',
			pattern: {
				value: /@/,
				message: 'Не почта',
			},
			validate: (value) => (value === 'a@b.c' ? false : true),
		});

		expect(rule('', {})).toBe('Обязательно');
		expect(rule('user', {})).toBe('Не почта');
		expect(rule('a@b.c', {})).toBe('Обязательно');
	});

	test('fieldRules без required проверяет пустую строку шаблоном', () => {
		const rule = fieldRules({
			pattern: {
				value: /@/,
				message: 'Не почта',
			},
		});

		expect(rule('', {})).toBe('Не почта');
	});

	test('fieldRules на false без required возвращает Invalid', () => {
		const rule = fieldRules({
			validate: () => false,
		});

		expect(rule('x', {})).toBe('Invalid');
	});

	test('checkedValue читает target.checked', () => {
		expect(checkedValue({target: {checked: true}})).toBe(true);
		expect(checkedValue({target: {checked: false}})).toBe(false);
		expect(checkedValue('yes')).toBe(false);
	});
});
