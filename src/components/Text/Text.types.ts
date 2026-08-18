import type {
	ComponentPropsWithoutRef,
	ElementType,
} from 'react';

/**
 * Свойства `Text`.
 * Патчит нативные HTML-атрибуты (`id`, `title`, `role`, …); `color` — токен библиотеки.
 */
export interface TextProps extends Omit<ComponentPropsWithoutRef<'span'>, 'color'> {
	size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
	weight?: 'normal' | 'medium' | 'semibold' | 'bold';
	color?: 'primary' | 'secondary' | 'tertiary' | 'muted' | 'info' | 'success' | 'warning' | 'error' | 'disabled';
	as?: ElementType;
}
