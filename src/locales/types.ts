import type {ru} from './ru';

type DeepStringify<T> = T extends string
	? string
	: T extends readonly (infer U)[]
		? DeepStringify<U>[]
		: T extends object
			? {[K in keyof T]: DeepStringify<T[K]>}
			: T;

/** Полный словарь переводов библиотеки (форма эталона — русский). */
export type Messages = DeepStringify<typeof ru>;

/** Частичный словарь для кастомных переводов / override. */
export type DeepPartialMessages = {
	[K in keyof Messages]?: Messages[K] extends (infer U)[]
		? U[]
		: Messages[K] extends object
			? {[P in keyof Messages[K]]?: DeepPartialMessagesValue<Messages[K][P]>}
			: Messages[K];
};

type DeepPartialMessagesValue<T> = T extends (infer U)[]
	? U[]
	: T extends object
		? {[P in keyof T]?: DeepPartialMessagesValue<T[P]>}
		: T;

/** Код встроенного языка. */
export type LocaleCode = 'ru' | 'en';

/** Параметры подстановки в шаблоны `{name}`. */
export type TranslationParams = Record<string, string | number>;
