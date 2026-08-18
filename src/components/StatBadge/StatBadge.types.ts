import type {
	ComponentPropsWithoutRef,
} from 'react';

/**
 * Свойства `StatBadge`.
 */
export interface StatBadgeProps extends ComponentPropsWithoutRef<'div'> {
	label: string;
	value: number | string;
	variant?: 'default' | 'success' | 'warning' | 'error';
	size?: 'sm' | 'md';
}
