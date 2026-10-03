import type React from 'react';
import type {
	ComponentPropsWithoutRef,
	Ref,
} from 'react';

/**
 * Свойства `Collapse`.
 */
export interface CollapseProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
	open: boolean;
	children: React.ReactNode;
	/** DOM-узел корня. */
	rootRef?: Ref<HTMLDivElement>;
}
