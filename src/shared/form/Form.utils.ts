const UNSAFE_PATH_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

const PATH_SEGMENT = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

/** Путь поля: `'a.b[0].c'` или `['a', 'b', 0, 'c']`. */
export type PropertyPath = string | readonly (string | number)[];

/**
 * Разбирает путь в сегменты, как `lodash/set`.
 *
 * @param path - Строка или массив сегментов.
 * @returns Сегменты пути.
 */
export function toPath(path: PropertyPath): string[] {
	if (typeof path !== 'string') return path.map((segment) => String(segment));

	const segments: string[] = [];
	path.replace(PATH_SEGMENT, (
		match,
		number: string | undefined,
		quote: string | undefined,
		subString: string | undefined,
	) => {
		const segment = quote ? String(subString).replace(/\\(\\)?/g, '$1') : (number || match);
		segments.push(segment);
		return match;
	});
	return segments;
}

function isIndexKey(key: string): boolean {
	return /^(?:0|[1-9]\d*)$/.test(key) && Number(key) <= Number.MAX_SAFE_INTEGER;
}

function isPlainRecord(value: unknown): value is Record<string, unknown> {
	if (value === null || typeof value !== 'object' || Array.isArray(value)) return false;
	const proto = Object.getPrototypeOf(value);
	return proto === Object.prototype || proto === null;
}

function cloneContainer(source: unknown, key: string): unknown[] | Record<string, unknown> {
	if (Array.isArray(source)) return source.slice();
	if (isPlainRecord(source)) return {...source};
	return isIndexKey(key) ? [] : {};
}

function readKey(source: unknown, key: string): unknown {
	if (Array.isArray(source) || isPlainRecord(source)) {
		return (source as Record<string, unknown>)[key];
	}
	return undefined;
}

function writeKey(container: unknown[] | Record<string, unknown>, key: string, value: unknown): void {
	if (Array.isArray(container) && isIndexKey(key)) {
		container[Number(key)] = value;
		return;
	}
	(container as Record<string, unknown>)[key] = value;
}

function assignAt(source: unknown, keys: readonly string[], index: number, value: unknown): unknown {
	const key = keys[index];
	if (key === undefined) return source;

	const container = cloneContainer(source, key);
	const isLeaf = index === keys.length - 1;
	const nextValue = isLeaf ? value : assignAt(readKey(source, key), keys, index + 1, value);
	writeKey(container, key, nextValue);
	return container;
}

/**
 * Иммутабельный аналог `lodash/set`: копия `source` со значением по пути.
 * Исходный объект не меняется. Сегменты `__proto__`, `constructor` и `prototype`
 * отменяют запись целиком — защита от загрязнения прототипа. К форме не привязан.
 *
 * @template T - Тип исходного значения.
 * @param source - Исходное значение (не мутируется). `null` / примитив заменяются контейнером по первому ключу.
 * @param path - Путь поля.
 * @param value - Новое значение листа.
 * @returns Новая структура или тот же `source`, если путь пуст или содержит запрещённый сегмент.
 *
 * @example
 * set({user: {name: 'a'}}, 'user.name', 'b'); // {user: {name: 'b'}}
 * set({}, 'items[0].id', 1); // {items: [{id: 1}]}
 */
export function set<T>(source: T, path: PropertyPath, value: unknown): T {
	const keys = toPath(path);
	if (keys.length === 0 || keys.some((key) => UNSAFE_PATH_KEYS.has(key))) return source;
	return assignAt(source, keys, 0, value) as T;
}
