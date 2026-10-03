import type React from 'react';
import type {
	ComponentPropsWithoutRef,
	Ref,
} from 'react';

/**
 * Свойства `Kbd`.
 */
export interface KbdProps extends ComponentPropsWithoutRef<'kbd'> {
	children: React.ReactNode;
	/**
	 * Оптический центр для стрелок / символов (↑↓←→ и т.п.).
	 */
	symbol?: boolean;
	/** DOM-узел `<kbd>`. */
	rootRef?: Ref<HTMLElement>;
}

/**
 * Свойства `KbdGroup`.
 */
export interface KbdGroupProps extends ComponentPropsWithoutRef<'span'> {
	children: React.ReactNode;
	/** DOM-узел группы. */
	rootRef?: Ref<HTMLSpanElement>;
}
