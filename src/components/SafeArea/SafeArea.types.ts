import type React from 'react';
import type {
	ComponentPropsWithoutRef,
	Ref,
} from 'react';

/**
 * Какие края подставлять из `env(safe-area-inset-*)`.
 */
export type SafeAreaEdges = 'top' | 'right' | 'bottom' | 'left' | 'all' | 'x' | 'y';

/**
 * Свойства `SafeArea`.
 */
export interface SafeAreaProps extends ComponentPropsWithoutRef<'div'> {
	/**
	 * Края, к которым добавляется inset.
	 * @default 'all'
	 */
	edges?: SafeAreaEdges | SafeAreaEdges[];
	/** Доп. внутренний отступ поверх safe-area. */
	padding?: string | number;
	/** Растянуть блок в flex-колонке родителя. */
	fill?: boolean;
	/** Корневой HTML-тег. @default 'div' */
	as?: 'div' | 'main' | 'section' | 'header' | 'footer';
	children?: React.ReactNode;
	/** DOM-узел. */
	rootRef?: Ref<HTMLElement>;
}
