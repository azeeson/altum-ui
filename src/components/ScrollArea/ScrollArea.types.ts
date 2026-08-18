import type React from 'react';
import type {
	ComponentPropsWithoutRef,
} from 'react';

/**
 * Свойства `ScrollArea`.
 */
export interface ScrollAreaProps extends ComponentPropsWithoutRef<'div'> {
	/** Макс. высота (CSS). @default '240px' */
	maxHeight?: string | number;
	/** Макс. ширина (CSS) */
	maxWidth?: string | number;
	/** Оси скролла. @default 'y' */
	orientation?: 'y' | 'x' | 'both';
	children?: React.ReactNode;
}
