import type {
	ComponentPropsWithoutRef,
	ElementType,
	Ref,
} from 'react';

export type TextSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type TextWeight = 'normal' | 'medium' | 'semibold' | 'bold';

/**
 * Свойства `Text`.
 * Патчит нативные HTML-атрибуты (`id`, `title`, `role`, …); `color` — токен библиотеки.
 */
export interface TextProps extends Omit<ComponentPropsWithoutRef<'span'>, 'color'> {
	size?: TextSize;
	weight?: TextWeight;
	as?: ElementType;
	color?: 'primary' | 'secondary' | 'tertiary' | 'muted' | 'info' | 'success' | 'warning' | 'error' | 'disabled';
	/** DOM-узел текста. */
	rootRef?: Ref<HTMLElement>;
}
