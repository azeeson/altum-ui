import type {CSSProperties} from 'react';

/**
 * Сливает внутренние и внешние inline-стили.
 * Внешний `style` перекрывает одноимённые ключи внутренних (потребитель выигрывает).
 *
 * @param internal - Стили компонента (токены, layout).
 * @param external - `style` из пропсов потребителя.
 */
export function mergeStyles(
	internal?: CSSProperties | null,
	external?: CSSProperties | null,
): CSSProperties | undefined {
	if (!internal && !external) return undefined;
	if (!internal) return external ?? undefined;
	if (!external) return internal;
	return {
		...internal,
		...external,
	};
}
