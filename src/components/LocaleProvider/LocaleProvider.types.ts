import type {
	ReactNode,
} from 'react';
import type {
	DeepPartialMessages,
	LocaleCode,
	Messages,
	TranslationParams,
} from '../../locales';

export type {LocaleCode, Messages, DeepPartialMessages, TranslationParams};

export interface LocaleProviderProps {
	/** Встроенный язык. По умолчанию `ru`. */
	locale?: LocaleCode;
	/**
	 * Кастомный словарь или частичный override поверх встроенного языка.
	 * Полный словарь можно передать вместо/вместе с `locale`.
	 */
	messages?: DeepPartialMessages;
	children: ReactNode;
}
