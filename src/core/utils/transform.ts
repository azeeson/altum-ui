/**
 * Извлекает горизонтальное смещение из inline-строки `transform`.
 * Поддерживает `translateX(...)`, `translate3d(...)`, `matrix(...)` и `matrix3d(...)`.
 *
 * @param transform - Значение CSS `transform`; `none` или пустая строка → `0`.
 * @returns Смещение по оси X в пикселях; при ошибке парсинга — `0`.
 */
export function getTranslateXFromTransform(transform: string): number {
	if (!transform || transform === 'none') return 0;

	const match = transform.match(/translate(?:3d|X)\(([-\d.]+)px/);
	if (match) return Number.parseFloat(match[1] ?? '0');

	try {
		const MatrixCtor = typeof DOMMatrix !== 'undefined'
			? DOMMatrix
			: WebKitCSSMatrix;
		return new MatrixCtor(transform).m41;
	} catch {
		return 0;
	}
}
