/**
 * Возвращает новый `Set` с добавленным или снятым ключом.
 *
 * @template T - Тип элементов множества.
 * @param set - Исходное множество (не мутируется).
 * @param key - Элемент для переключения.
 * @returns Новый `Set`.
 *
 * @example
 * toggleSet(new Set([1, 2]), 2); // Set { 1 }
 * toggleSet(new Set([1]), 3); // Set { 1, 3 }
 */
export function toggleSet<T>(set: ReadonlySet<T>, key: T): Set<T> {
	const next = new Set(set);
	if (next.has(key)) next.delete(key);
	else next.add(key);
	return next;
}
