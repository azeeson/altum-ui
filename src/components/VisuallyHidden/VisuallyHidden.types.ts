import type React from 'react';
import type {
	ComponentPropsWithoutRef,
} from 'react';

/**
 * Свойства `VisuallyHidden`.
 */
export interface VisuallyHiddenProps extends ComponentPropsWithoutRef<'span'> {
	children: React.ReactNode;
	as?: 'span' | 'div' | 'label';
}
