/** Точка входа сабпути: словари и перевод своих строк (`altum/locales`). */
export {ru, en, builtInMessages} from '../locales';
export {deepMergeMessages, translate} from '../locales';
export type {TranslateFn} from '../locales';
export type {
	Messages,
	DeepPartialMessages,
	LocaleCode,
	TranslationParams,
	MessageTree,
	PluralMessage,
} from '../locales';
export {useLocale, useT} from '../locales';
export type {LocaleContextValue} from '../locales';
