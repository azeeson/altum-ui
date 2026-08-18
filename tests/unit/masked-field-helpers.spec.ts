import {test, expect} from '@playwright/test';
import {
	getFormattedValue,
	getRemainingGuides,
	getStaticDigitsPrefix,
} from '../../src/components/MaskedField/MaskedField.utils';

const PHONE_MASK = '+7 (999) 999-99-99';
const DATE_MASK = '99.99.9999';
const TIME_MASK = '99:99';

test.describe('getStaticDigitsPrefix', () => {
	test('извлекает ведущие литеральные цифры до первого слота', () => {
		expect(getStaticDigitsPrefix(PHONE_MASK)).toBe('7');
		expect(getStaticDigitsPrefix('+1 999')).toBe('1');
		expect(getStaticDigitsPrefix('+44 9999')).toBe('44');
	});

	test('возвращает пустую строку, если маска начинается со слотов цифр', () => {
		expect(getStaticDigitsPrefix(DATE_MASK)).toBe('');
		expect(getStaticDigitsPrefix(TIME_MASK)).toBe('');
		expect(getStaticDigitsPrefix('(999) 999')).toBe('');
	});

	test('игнорирует нецифровые литералы до первого слота', () => {
		expect(getStaticDigitsPrefix('+ (999)')).toBe('');
		expect(getStaticDigitsPrefix('***999')).toBe('');
	});
});

test.describe('getFormattedValue', () => {
	test('выдаёт ведущие литералы до первого незаполненного слота (пустые цифры)', () => {
		// Компонент отдельно решает, показывать ли пустое значение (`cleanDigits ? formatted : ''`).
		expect(getFormattedValue('', PHONE_MASK)).toBe('+7 (');
		expect(getFormattedValue('', DATE_MASK)).toBe('');
		expect(getFormattedValue('', TIME_MASK)).toBe('');
	});

	test('форматирует частичные цифры телефона и хвостовые литералы до следующего слота', () => {
		expect(getFormattedValue('9', PHONE_MASK)).toBe('+7 (9');
		expect(getFormattedValue('91', PHONE_MASK)).toBe('+7 (91');
		expect(getFormattedValue('912', PHONE_MASK)).toBe('+7 (912) ');
		expect(getFormattedValue('9123', PHONE_MASK)).toBe('+7 (912) 3');
		expect(getFormattedValue('9123456789', PHONE_MASK)).toBe('+7 (912) 345-67-89');
	});

	test('форматирует маски даты и времени', () => {
		expect(getFormattedValue('1507', DATE_MASK)).toBe('15.07.');
		expect(getFormattedValue('15072024', DATE_MASK)).toBe('15.07.2024');
		expect(getFormattedValue('0930', TIME_MASK)).toBe('09:30');
		expect(getFormattedValue('09', TIME_MASK)).toBe('09:');
	});

	test('игнорирует цифры сверх числа слотов маски', () => {
		expect(getFormattedValue('912345678901234', PHONE_MASK)).toBe('+7 (912) 345-67-89');
		expect(getFormattedValue('1507202499', DATE_MASK)).toBe('15.07.2024');
	});

	test('убирает нецифры из входного значения', () => {
		expect(getFormattedValue('+7 (912)', PHONE_MASK)).toBe('+7 (791) 2');
		expect(getFormattedValue('15.07.2024', DATE_MASK)).toBe('15.07.2024');
		expect(getFormattedValue('ab9cd1', TIME_MASK)).toBe('91:');
	});

	test('вставляет литералы между заполненными слотами и после полной группы', () => {
		expect(getFormattedValue('1', DATE_MASK)).toBe('1');
		expect(getFormattedValue('15', DATE_MASK)).toBe('15.');
		expect(getFormattedValue('150', DATE_MASK)).toBe('15.0');
	});
});

test.describe('getRemainingGuides', () => {
	test('возвращает полную маску-гид для пустого отображения', () => {
		expect(getRemainingGuides('', PHONE_MASK)).toBe('+7 (___) ___-__-__');
		expect(getRemainingGuides('', DATE_MASK)).toBe('__.__.____');
		expect(getRemainingGuides('', TIME_MASK)).toBe('__:__');
	});

	test('возвращает хвостовые гиды после частично отформатированного значения', () => {
		expect(getRemainingGuides('+7 (912) ', PHONE_MASK)).toBe('___-__-__');
		expect(getRemainingGuides('15.07.', DATE_MASK)).toBe('____');
		expect(getRemainingGuides('09:', TIME_MASK)).toBe('__');
	});

	test('возвращает пустую строку, когда значение заполняет маску', () => {
		expect(getRemainingGuides('+7 (912) 345-67-89', PHONE_MASK)).toBe('');
		expect(getRemainingGuides('15.07.2024', DATE_MASK)).toBe('');
		expect(getRemainingGuides('09:30', TIME_MASK)).toBe('');
	});
});
