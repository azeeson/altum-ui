import type {TypeProps} from '../../base/Type';

/**
 * Свойства `Text`.
 * Патчит нативные HTML-атрибуты (`id`, `title`, `role`, …); `color` — токен библиотеки.
 */
export interface TextProps extends Omit<TypeProps, 'color'> {
	color?: 'primary' | 'secondary' | 'tertiary' | 'muted' | 'info' | 'success' | 'warning' | 'error' | 'disabled';
}
