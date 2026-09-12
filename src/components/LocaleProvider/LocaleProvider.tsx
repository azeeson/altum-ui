import type {
	LocaleProviderProps,
} from './LocaleProvider.types';
export type {
	LocaleCode,
	Messages,
	DeepPartialMessages,
	TranslationParams,
	LocaleProviderProps,
} from './LocaleProvider.types';

import React, {useMemo} from 'react';
import {builtInMessages} from '../../locales/messages';
import {
	deepMergeMessages,
	translate,
} from '../../locales/translate';
import {
	LocaleContext,
	defaultLocaleContext,
	type LocaleContextValue,
} from '../../locales/localeContext';

/**
 * Провайдер локали и переводов встроенных строк библиотеки.
 * Без провайдера компоненты используют русский словарь по умолчанию.
 *
 * @component
 * @example
 * <LocaleProvider locale="en">
 *   <App />
 * </LocaleProvider>
 *
 * @example
 * <LocaleProvider
 *   locale="ru"
 *   messages={{ common: { close: 'Закрыть окно' } }}
 * >
 *   <App />
 * </LocaleProvider>
 */
export const LocaleProvider: React.FC<LocaleProviderProps> = ({
	locale = 'ru',
	messages: messagesOverride,
	children,
}) => {
	const value = useMemo<LocaleContextValue>(() => {
		const merged = deepMergeMessages(
			builtInMessages[locale] ?? defaultLocaleContext.messages,
			messagesOverride,
		);
		return {
			locale,
			messages: merged,
			t: (key, params) => translate(merged, key, params),
		};
	}, [locale, messagesOverride]);

	return (
		<LocaleContext.Provider value={value}>
			{children}
		</LocaleContext.Provider>
	);
};

LocaleProvider.displayName = 'LocaleProvider';
