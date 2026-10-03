import type React from 'react';
import type {ComponentPropsWithoutRef, Ref} from 'react';

/**
 * Свойства `ScrollArea`.
 */
export interface ScrollAreaProps extends ComponentPropsWithoutRef<'div'> {
	/** DOM-узел области. */
	rootRef?: Ref<HTMLDivElement>;
	/** Макс. высота (CSS). Без значения — по контенту / родителю. */
	maxHeight?: string | number;
	/** Макс. ширина (CSS) */
	maxWidth?: string | number;
	/** Оси скролла. @default 'y' */
	orientation?: 'y' | 'x' | 'both';
	children?: React.ReactNode;
}
