import type {
	ComponentPropsWithoutRef,
	Ref,
} from 'react';

/**
 * Свойства `StatBadge`.
 */
export interface StatBadgeProps extends ComponentPropsWithoutRef<'div'> {
	label: string;
	value: number | string;
	variant?: 'default' | 'success' | 'warning' | 'error';
	size?: 'sm' | 'md';
	/** DOM-узел корня. */
	rootRef?: Ref<HTMLDivElement>;
}
