import type {
	ComponentPropsWithoutRef,
} from 'react';

/**
 * Вариант оформления (`BackdropVariant`).
 */
export type BackdropVariant = 'default' | 'strong';

/**
 * Сила размытия (`BackdropBlur`).
 */
export type BackdropBlur = 'none' | 'sm' | 'md';

/**
 * Позиция / сторона (`BackdropPosition`).
 */
export type BackdropPosition = 'fixed' | 'absolute';

/**
 * Свойства `Backdrop`.
 */
export interface BackdropProps extends Omit<ComponentPropsWithoutRef<'div'>, 'onClick'> {
	variant?: BackdropVariant;
	blur?: BackdropBlur;
	position?: BackdropPosition;
	onClick?: () => void;
	zIndex?: number;
}
