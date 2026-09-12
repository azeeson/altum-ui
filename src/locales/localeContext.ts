import {createContext, useContext} from 'react';
import type {LocaleCode, Messages} from './types';
import {ru} from './ru';
import {translate, type TranslateFn} from './translate';

export interface LocaleContextValue {
	locale: LocaleCode;
	messages: Messages;
	t: TranslateFn;
}

const defaultMessages = ru as unknown as Messages;

export const defaultLocaleContext: LocaleContextValue = {
	locale: 'ru',
	messages: defaultMessages,
	t: (key, params) => translate(defaultMessages, key, params),
};

export const LocaleContext = createContext<LocaleContextValue | null>(null);

/**
 * Доступ к локали, словарю и функции `t`.
 * Вне провайдера локали возвращает русский словарь по умолчанию.
 *
 * @example
 * const { t, locale, messages } = useLocale();
 * const label = t('common.close');
 */
export function useLocale(): LocaleContextValue {
	return useContext(LocaleContext) ?? defaultLocaleContext;
}

/**
 * Короткий доступ только к функции перевода.
 *
 * @example
 * const t = useT();
 * return <span>{t('pagination.summary', { start: 1, end: 10, total: 100 })}</span>;
 */
export function useT(): TranslateFn {
	return useLocale().t;
}
