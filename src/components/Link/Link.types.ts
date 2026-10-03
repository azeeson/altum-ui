import type React from 'react';
import type {
	ComponentPropsWithoutRef,
	Ref,
} from 'react';

/** Визуальный вариант ссылки. */
export type LinkVariant = 'primary' | 'secondary' | 'muted';

/** Семантический статус ссылки. */
export type LinkStatus = 'default' | 'danger';

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
	status?: LinkStatus;
	/** Если не задан — размер наследуется от родителя (`font-size: inherit`). */
	size?: LinkSize;
	weight?: 'normal' | 'medium' | 'bold';
	/** Текст или единственный элемент (обёртка `span` для роутерного Link / `<a>`). */
	children: React.ReactNode;
	/** DOM-узел `<a>` или обёртки `span`. */
	rootRef?: Ref<HTMLElement>;
}
