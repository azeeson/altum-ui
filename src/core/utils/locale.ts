import type {LocaleCode} from '../../locales/types';

/**
 * Код языка интерфейса в тег BCP 47 для `Intl`.
 *
 * @param locale - `ru` или `en`.
 * @returns `ru-RU` или `en-US`.
 *
 * @example
 * localeToBcp47('en'); // "en-US"
 */
export function localeToBcp47(locale: LocaleCode): string {
	return locale === 'en' ? 'en-US' : 'ru-RU';
}
