/**
 * Нормализует размер для CSS-свойств width/height/gap.
 *
 * @param value - Число интерпретируется как px; строка передаётся как есть (`100%`, `1rem`, `auto`).
 * @returns CSS-значение для inline-стиля или CSS Modules.
 *
 * @example
 * toCssSize(24);    // "24px"
 * toCssSize('100%'); // "100%"
 */
export function toCssSize(value: number | string): string {
	return typeof value === 'number' ? `${value}px` : value;
}
