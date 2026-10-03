/** Общий словарь spacing-токенов → CSS (без рантайм-резолвера). */
export const SPACING_CSS: Record<string, string> = {
	none: '0',
	xs: 'var(--altum-g-space-1)',
	sm: 'var(--altum-g-space-2)',
	md: 'var(--altum-g-space-3)',
	lg: 'var(--altum-g-space-4)',
	xl: 'var(--altum-g-space-6)',
};

/** Токен, число (px) или произвольная CSS-строка → значение для inline custom property. */
export function spacingCss(value: string | number): string {
	if (typeof value === 'number') return `${value}px`;
	return SPACING_CSS[value] ?? value;
}
