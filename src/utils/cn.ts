/**
 * Склеивает CSS-классы, отбрасывая falsy-значения.
 * Дубликаты токенов удаляются (последнее вхождение сохраняется),
 * чтобы внешний `className` мог перекрывать внутренние utility-классы при необходимости.
 *
 * @param parts - Фрагменты className (строки или условные значения).
 * @returns Строка классов через пробел.
 *
 * @example
 * cn('btn', isActive && 'btn--active', className)
 */
export function cn(...parts: Array<string | false | undefined | null>): string {
	const tokens: string[] = [];
	for (const part of parts) {
		if (!part) continue;
		for (const token of part.split(/\s+/)) {
			if (!token) continue;
			const existing = tokens.indexOf(token);
			if (existing !== -1) tokens.splice(existing, 1);
			tokens.push(token);
		}
	}
	return tokens.join(' ');
}
