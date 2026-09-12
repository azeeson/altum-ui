/**
 * Если `as` не задан и есть `onClick` без `role` — корень рендерится как `<button>`.
 */
export function implicitAs<T>(
	as: T | undefined,
	onClick: unknown,
	role: unknown,
): T | 'button' | 'div' {
	return as ?? (onClick != null && role == null ? 'button' : 'div');
}
