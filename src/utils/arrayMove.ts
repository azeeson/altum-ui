/**
 * Переставляет элемент массива с одной позиции на другую (immutable).
 *
 * @template T - Тип элементов массива.
 * @param items - Исходный массив (не мутируется).
 * @param fromIndex - Индекс перемещаемого элемента.
 * @param toIndex - Целевой индекс после перемещения.
 * @returns Новый массив с переставленным элементом или `null`, если индексы
 *   совпадают, выходят за границы или массив пуст.
 *
 * @example
 * moveArrayItem(['a', 'b', 'c'], 0, 2); // ['b', 'c', 'a']
 */
export function moveArrayItem<T>(
	items: readonly T[],
	fromIndex: number,
	toIndex: number,
): T[] | null {
	if (
		fromIndex === toIndex
		|| fromIndex < 0
		|| toIndex < 0
		|| fromIndex >= items.length
		|| toIndex >= items.length
	) {
		return null;
	}

	const next = [...items];
	const [moved] = next.splice(fromIndex, 1);
	next.splice(toIndex, 0, moved!);
	return next;
}
