import type {SpacingToken, SpacingValue} from '../types/spacing';

export const SPACING_TOKEN_CSS: Record<SpacingToken, string> = {
	none: '0',
	xs: 'var(--altum-g-space-1)',
	sm: 'var(--altum-g-space-2)',
	md: 'var(--altum-g-space-3)',
	lg: 'var(--altum-g-space-4)',
	xl: 'var(--altum-g-space-6)',
};

/**
 * Разрешает spacing-токен, число (px) или CSS-строку в значение для inline-style.
 */
export function resolveSpacingCss(value: SpacingValue): string {
	if (typeof value === 'number') return `${value}px`;
	if (value in SPACING_TOKEN_CSS) return SPACING_TOKEN_CSS[value as SpacingToken];
	return value;
}
