import {en} from './en';
import {ru} from './ru';
import type {LocaleCode, Messages} from './types';

/** Встроенные словари. Импортируйте только из LocaleProvider, не из `useLocale`. */
export const builtInMessages: Record<LocaleCode, Messages> = {
	ru: ru as unknown as Messages,
	en,
};
