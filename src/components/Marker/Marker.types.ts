import type React from 'react';
import type {
	ComponentPropsWithoutRef,
} from 'react';

/**
 * Вариант маркера (`MarkerVariant`).
 */
export type MarkerVariant = 'default' | 'separator' | 'note' | 'row';

/**
 * Свойства `Marker`.
 */
export interface MarkerProps extends ComponentPropsWithoutRef<'div'> {
	children?: React.ReactNode;
	icon?: React.ReactNode;
	/** Мерцающая анимация текста (loading / searching). @default false */
	shimmer?: boolean;
	/**
	 * Внешний вид:
	 * - `default` — системная заметка с иконкой
	 * - `separator` — подпись на линии-разделителе
	 * - `note` — мягкий info-блок
	 * - `row` — bordered строка
	 * @default 'default'
	 */
	variant?: MarkerVariant;
}
