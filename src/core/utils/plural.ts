import type {LocaleCode} from '../../locales/types';

/** Формы слова: 1 день, 2 дня, 5 дней. Для `en` используется `one` и `many`. */
export interface PluralForms {
	one: string;
	few: string;
	many: string;
}

/**
 * Русское склонение по числу: один / несколько / много.
 *
 * @param count - Количество (знак и дробная часть отбрасываются).
 * @param one - Форма для 1, 21, 31…
 * @param few - Форма для 2–4, 22–24…
 * @param many - Форма для 0, 5–20, 11–14…
 * @returns Подходящая форма, без самого числа.
 *
 * @example
 * pluralRu(5, 'день', 'дня', 'дней'); // "дней"
 */
export function pluralRu(count: number, one: string, few: string, many: string): string {
	const n = Math.abs(Math.trunc(count));
	const mod10 = n % 10;
	const mod100 = n % 100;
	if (mod10 === 1 && mod100 !== 11) return one;
	if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
	return many;
}

/**
 * Английское число: единственное только для 1.
 *
 * @param count - Количество (знак и дробная часть отбрасываются).
 * @param one - Форма для 1.
 * @param other - Форма для остальных значений, включая 0.
 * @returns Подходящая форма, без самого числа.
 *
 * @example
 * pluralEn(1, 'day', 'days'); // "day"
 */
export function pluralEn(count: number, one: string, other: string): string {
	return Math.abs(Math.trunc(count)) === 1 ? one : other;
}

/**
 * Выбирает форму слова по языку интерфейса.
 * Для `en` берёт `one` и `many` (`few` не используется).
 *
 * @param locale - `ru` или `en`.
 * @param count - Количество.
 * @param forms - Три русские формы.
 * @returns Подходящая форма, без самого числа.
 *
 * @example
 * plural('ru', 2, {one: 'день', few: 'дня', many: 'дней'}); // "дня"
 */
export function plural(locale: LocaleCode, count: number, forms: PluralForms): string {
	if (locale === 'en') return pluralEn(count, forms.one, forms.many);
	return pluralRu(count, forms.one, forms.few, forms.many);
}
