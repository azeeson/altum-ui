/**
 * Копия объекта только с перечисленными собственными ключами.
 * Ключ, которого нет у `source`, в результат не попадает.
 *
 * @template T - Исходный объект.
 * @template K - Ключи, которые нужно оставить.
 * @param source - Исходный объект. Не мутируется.
 * @param keys - Какие поля скопировать.
 * @returns Новый объект с выбранными полями.
 *
 * @example
 * pick({id: 1, name: 'a', extra: true}, ['id', 'name']);
 */
export function pick<T extends object, const K extends keyof T>(
	source: T,
	keys: readonly K[],
): Pick<T, K> {
	const result = {} as Pick<T, K>;
	for (const key of keys) {
		if (Object.prototype.hasOwnProperty.call(source, key)) {
			result[key] = source[key];
		}
	}
	return result;
}

/**
 * Копия объекта без перечисленных собственных ключей.
 * Исходный объект не меняется.
 *
 * @template T - Исходный объект.
 * @template K - Ключи, которые нужно убрать.
 * @param source - Исходный объект. Не мутируется.
 * @param keys - Какие поля отбросить.
 * @returns Новый объект без этих полей.
 *
 * @example
 * omit({id: 1, password: 'x'}, ['password']);
 */
export function omit<T extends object, const K extends keyof T>(
	source: T,
	keys: readonly K[],
): Omit<T, K> {
	const blocked = new Set<PropertyKey>(keys);
	const result = {} as Omit<T, K>;
	for (const key of Object.keys(source) as Array<keyof T>) {
		if (blocked.has(key)) continue;
		(result as T)[key] = source[key];
	}
	return result;
}
