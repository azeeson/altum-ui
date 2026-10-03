import type React from 'react';
import type {
	ComponentPropsWithoutRef,
	Ref,
} from 'react';

/**
 * Размер EmptyState (`EmptyStateSize`).
 */
export type EmptyStateSize = 'sm' | 'md' | 'lg';

/**
 * Свойства `EmptyState`.
 */
export interface EmptyStateProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children' | 'title'> {
	icon?: React.ReactNode;
	title: string;
	description?: string;
	action?: React.ReactNode;
	/**
	 * `sm` — для вложенных панелей и сайдбаров.
	 * @default 'md'
	 */
	size?: EmptyStateSize;
	/** Корень. */
	rootRef?: Ref<HTMLDivElement>;
}
