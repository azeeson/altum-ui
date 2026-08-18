import type React from 'react';
import type {
	ComponentPropsWithoutRef,
} from 'react';

/**
 * Вариант оформления контейнера.
 */
export type AccordionVariant = 'bordered' | 'flush';

/**
 * Свойства `Accordion` (Root).
 */
export interface AccordionProps extends ComponentPropsWithoutRef<'div'> {
	children: React.ReactNode;
	/** Разрешить одновременное раскрытие нескольких секций. @default false */
	multiple?: boolean;
	/** @default 'bordered' */
	variant?: AccordionVariant;
	defaultOpenIds?: string[];
	openIds?: string[];
	onOpenChange?: (ids: string[]) => void;
}

/**
 * Свойства `Accordion.Item`.
 */
export interface AccordionItemProps extends ComponentPropsWithoutRef<'div'> {
	/** Уникальный id секции (для `openIds` / `defaultOpenIds`). */
	value: string;
	disabled?: boolean;
	children: React.ReactNode;
}

/**
 * Свойства `Accordion.Trigger`.
 */
export interface AccordionTriggerProps extends ComponentPropsWithoutRef<'button'> {
	children: React.ReactNode;
	/** Уровень заголовка. @default `'h3'` */
	headingLevel?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

/**
 * Свойства `Accordion.Content`.
 */
export interface AccordionContentProps extends ComponentPropsWithoutRef<'div'> {
	children: React.ReactNode;
}
