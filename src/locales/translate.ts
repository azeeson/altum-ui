import type {DeepPartialMessages, Messages, TranslationParams} from './types';

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

function getByPath(messages: Messages, path: string): unknown {
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
 * Массивы (месяцы и т.п.) берите из `messages`, не через `t`.
 */
export function translate(
	messages: Messages,
	key: string,
	params?: TranslationParams,
): string {
	const value = getByPath(messages, key);

	if (typeof value !== 'string') {
		if (process.env.NODE_ENV !== 'production') {
			console.warn(`[altum] Нет перевода: ${key}`);
		}
		return key;
	}

	return interpolate(value, params);
}

export type TranslateFn = (key: string, params?: TranslationParams) => string;
