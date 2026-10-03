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
	type LocaleContextValue,
} from '../../locales/localeContext';

/**
 * Провайдер локали и переводов встроенных строк библиотеки.
 * Без провайдера компоненты берут русский текст из своего среза словаря.
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
			builtInMessages[locale] ?? builtInMessages.ru,
			messagesOverride,
		);
		return {
			locale,
			messages: merged,
			t: (key, params) => translate(merged, key, params, locale),
		};
	}, [locale, messagesOverride]);

	return (
		<LocaleContext.Provider value={value}>
			{children}
		</LocaleContext.Provider>
	);
};
