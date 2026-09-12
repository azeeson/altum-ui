import type React from 'react';
import type {
	ComponentPropsWithoutRef,
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
}

/**
 * Свойства `KbdGroup`.
 */
export interface KbdGroupProps extends ComponentPropsWithoutRef<'span'> {
	children: React.ReactNode;
}
