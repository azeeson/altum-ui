/**
 * Ограничивает число диапазоном `[min, max]`.
 *
 * @param value - Исходное значение.
 * @param min - Нижняя граница (включительно).
 * @param max - Верхняя граница (включительно).
 * @returns `value`, если он внутри диапазона, иначе ближайшая граница.
 *
 * @example
 * clamp(120, 0, 100) // 100
 */
export function clamp(value: number, min: number, max: number): number {
	return Math.min(max, Math.max(min, value));
}
