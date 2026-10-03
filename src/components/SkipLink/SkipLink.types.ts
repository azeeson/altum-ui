import type React from 'react';
import type {
	ComponentPropsWithoutRef,
	Ref,
} from 'react';

/**
 * Свойства `SkipLink`.
 */
export interface SkipLinkProps extends ComponentPropsWithoutRef<'a'> {
	/** Цель (id основного контента). @default '#main' */
	href?: string;
	children?: React.ReactNode;
	/** DOM-узел ссылки. */
	rootRef?: Ref<HTMLAnchorElement>;
}
