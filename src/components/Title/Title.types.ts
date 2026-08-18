import type {
	ComponentPropsWithoutRef,
} from 'react';

/**
 * Свойства `Title`.
 * Патчит нативные HTML-атрибуты заголовка (`id`, `title`, `aria-*`, …).
 */
export interface TitleProps extends ComponentPropsWithoutRef<'h2'> {
	level?: 1 | 2 | 3 | 4;
	weight?: 'normal' | 'medium' | 'bold';
}
