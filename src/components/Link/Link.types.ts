import type React from 'react';
import type {
	ComponentPropsWithoutRef,
} from 'react';
import type {ButtonStatus} from '../../base/ButtonBase';

/** Визуальный вариант ссылки. */
export type LinkVariant = 'primary' | 'secondary' | 'muted';

export type {ButtonStatus as LinkStatus};

/** Размер текста ссылки; без пропа — `inherit` от родителя. */
export type LinkSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Свойства `Link`.
 * Патчит нативные атрибуты `<a>` (`href`, `target`, `rel`, `aria-*`, …).
 */
export interface LinkProps extends ComponentPropsWithoutRef<'a'> {
	/** `primary` — бренд; `secondary` / `muted` — quieter. */
	variant?: LinkVariant;
	/** Деструктивное действие. @default `'default'` */
	status?: ButtonStatus;
	/** Если не задан — размер наследуется от родителя (`font-size: inherit`). */
	size?: LinkSize;
	weight?: 'normal' | 'medium' | 'bold';
	/** Текст или единственный элемент (slot на роутерный Link / `<a>`). */
	children: React.ReactNode;
}
