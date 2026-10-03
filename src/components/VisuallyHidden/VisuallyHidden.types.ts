import type React from 'react';
import type {
	ComponentPropsWithoutRef,
	Ref,
} from 'react';

/**
 * Свойства `VisuallyHidden`.
 */
export interface VisuallyHiddenProps extends ComponentPropsWithoutRef<'span'> {
	children: React.ReactNode;
	as?: 'span' | 'div' | 'label';
	/** DOM-узел. */
	rootRef?: Ref<HTMLElement>;
}
