export type ArrowOrientation = 'horizontal' | 'vertical' | 'both';

export function getNextIndex(
	currentIndex: number,
	length: number,
	key: string,
	orientation: ArrowOrientation = 'horizontal'
): number | null {
	if (length === 0) return null;

	const prevKey = orientation === 'vertical' ? 'ArrowUp' : 'ArrowLeft';
	const nextKey = orientation === 'vertical' ? 'ArrowDown' : 'ArrowRight';

	if (key === prevKey || (orientation === 'both' && key === 'ArrowUp')) {
		return (currentIndex - 1 + length) % length;
	}
	if (key === nextKey || (orientation === 'both' && key === 'ArrowDown')) {
		return (currentIndex + 1) % length;
	}
	if (key === 'Home') return 0;
	if (key === 'End') return length - 1;

	return null;
}

export function focusElement(element: HTMLElement | null | undefined) {
	element?.focus({preventScroll: true});
}

/**
 * Индекс в двумерной сетке: стрелки ±1 / ±columns, Home/End — края списка.
 * Индекс зажимается в `[0, length)`.
 *
 * @param currentIndex - Текущая позиция.
 * @param length - Число ячеек.
 * @param key - Клавиша (`Arrow*` / `Home` / `End`).
 * @param columns - Ширина ряда.
 * @returns Новый индекс или `null`, если клавиша не навигационная.
 */
export function getGridIndex(
	currentIndex: number,
	length: number,
	key: string,
	columns: number,
): number | null {
	if (length === 0) return null;

	let next: number | null = null;
	if (key === 'ArrowLeft') next = currentIndex - 1;
	else if (key === 'ArrowRight') next = currentIndex + 1;
	else if (key === 'ArrowUp') next = currentIndex - columns;
	else if (key === 'ArrowDown') next = currentIndex + columns;
	else if (key === 'Home') next = 0;
	else if (key === 'End') next = length - 1;
	if (next === null) return null;
	return Math.max(0, Math.min(length - 1, next));
}
