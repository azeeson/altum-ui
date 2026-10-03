import {plural} from '../core/utils/plural';
import type {
	DeepPartialMessages,
	LocaleCode,
	Messages,
	MessageTree,
	PluralMessage,
	TranslationParams,
} from './types';

function isPlainObject(value: unknown): value is Record<string, unknown> {
	return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function deepMergeUnknown(base: unknown, override: unknown): unknown {
	if (!isPlainObject(override)) {
		return override;
	}
	if (!isPlainObject(base)) {
		return {...override};
	}

	const result: Record<string, unknown> = {...base};
	for (const key of Object.keys(override)) {
		const patch = override[key];
		if (patch === undefined) {
			continue;
		}
		result[key] = deepMergeUnknown(base[key], patch);
	}
	return result;
}

/** Рекурсивный merge partial поверх base. */
export function deepMergeMessages(
	base: Messages,
	override?: DeepPartialMessages,
): Messages {
	if (!override) {
		return base;
	}
	return deepMergeUnknown(base, override) as Messages;
}

function getByPath(messages: MessageTree, path: string): unknown {
	const parts = path.split('.');
	let current: unknown = messages;

	for (const part of parts) {
		if (current === null || current === undefined || typeof current !== 'object') {
			return undefined;
		}
		current = (current as Record<string, unknown>)[part];
	}

	return current;
}

const PLURAL_KEYS = ['one', 'few', 'many'] as const;

function isPluralMessage(value: unknown): value is PluralMessage {
	if (!isPlainObject(value)) return false;
	const keys = Object.keys(value);
	return keys.length === PLURAL_KEYS.length
		&& PLURAL_KEYS.every((key) => typeof value[key] === 'string');
}

function pluralCount(params?: TranslationParams): number {
	const raw = params?.count;
	if (typeof raw === 'number' && Number.isFinite(raw)) return raw;
	if (typeof raw === 'string' && raw.trim() !== '') {
		const parsed = Number(raw);
		if (Number.isFinite(parsed)) return parsed;
	}
	return 0;
}

/** Подстановка `{name}` в шаблон. */
function interpolate(
	template: string,
	params?: TranslationParams,
): string {
	if (!params) {
		return template;
	}

	return template.replace(/\{(\w+)\}/g, (_, key: string) => {
		const value = params[key];
		return value === undefined || value === null ? `{${key}}` : String(value);
	});
}

/**
 * Перевод по точечному ключу (`common.close`, `pagination.summary`).
 * Строка — шаблон с `{name}`. Объект `{one, few, many}` — склонение по `params.count` и локали.
 * Массивы (месяцы и т.п.) берите из `messages`, не через `t`.
 */
export function translate(
	messages: MessageTree,
	key: string,
	params?: TranslationParams,
	locale: LocaleCode = 'ru',
): string {
	const value = getByPath(messages, key);

	if (isPluralMessage(value)) {
		if ((params?.count === undefined || params.count === null) && process.env.NODE_ENV !== 'production') {
			console.warn(`[altum] Для склонения «${key}» нужен params.count`);
		}
		return interpolate(plural(locale, pluralCount(params), value), params);
	}

	if (typeof value !== 'string') {
		if (process.env.NODE_ENV !== 'production') {
			console.warn(`[altum] Нет перевода: ${key}`);
		}
		return key;
	}

	return interpolate(value, params);
}

export type TranslateFn = (key: string, params?: TranslationParams) => string;
