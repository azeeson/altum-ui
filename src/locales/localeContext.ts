import {createContext, useContext, useMemo} from 'react';
import type {LocaleCode, MessageTree, Messages, TranslationParams} from './types';
import {translate, type TranslateFn} from './translate';

export interface LocaleContextValue {
	locale: LocaleCode;
	messages: Messages;
	t: TranslateFn;
}

const emptyMessages = {} as Messages;

/** Контекст без провайдера: локаль `ru`, пустой словарь. Строки лежат в срезах компонентов. */
export const defaultLocaleContext: LocaleContextValue = {
	locale: 'ru',
	messages: emptyMessages,
	t: (key, params) => translate(emptyMessages, key, params, 'ru'),
};

export const LocaleContext = createContext<LocaleContextValue | null>(null);

/**
 * Доступ к локали, словарю и функции `t`.
 * Внутри {@link LocaleProvider} берёт его словарь.
 * Снаружи — `fallback` (русский срез этого компонента), иначе пустой словарь.
 *
 * @example
 * const { t } = useLocale(fieldFallback);
 * const label = t('common.close');
 */
export function useLocale(fallback?: MessageTree): LocaleContextValue {
	const ctx = useContext(LocaleContext);
	return useMemo(() => {
		if (ctx) return ctx;
		if (!fallback) return defaultLocaleContext;
		const messages = fallback as Messages;
		return {
			locale: 'ru' as const,
			messages,
			t: (key: string, params?: TranslationParams) => translate(messages, key, params, 'ru'),
		};
	}, [ctx, fallback]);
}

/**
 * Короткий доступ только к функции перевода.
 * Вне провайдера без среза вернёт ключ. Компоненты библиотеки используют {@link useLocale}.
 *
 * @example
 * const t = useT();
 */
export function useT(): TranslateFn {
	return useLocale().t;
}
