import {test, expect} from '@playwright/test';
import {parseKeyboardShortcut} from '../../src/utils/keyboardShortcut';

test.describe('parseKeyboardShortcut', () => {
	test('разбирает аккорды с модификаторами', () => {
		const parts = parseKeyboardShortcut('mod+shift+k');
		expect(parts?.key).toBe('k');
		expect(parts?.mod).toBe(true);
		expect(parts?.shift).toBe(true);
	});

	test('нормализует алиасы', () => {
		expect(parseKeyboardShortcut('esc')?.key).toBe('escape');
		expect(parseKeyboardShortcut('ctrl+enter')?.ctrl).toBe(true);
	});

	test('отклоняет пустые строки и только модификаторы', () => {
		expect(parseKeyboardShortcut('')).toBeNull();
		expect(parseKeyboardShortcut('ctrl')).toBeNull();
	});
});
