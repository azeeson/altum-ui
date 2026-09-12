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
	/** @default 'flush' */
	variant?: AccordionVariant;
	defaultOpenIds?: string[];
	openIds?: string[];
	onOpenChange?: (ids: string[]) => void;
}

/**
 * Свойства `Accordion.Item`.
 */
export interface AccordionItemProps extends Omit<ComponentPropsWithoutRef<'div'>, 'title'> {
	/** Уникальный id секции (для `openIds` / `defaultOpenIds`). */
	value: string;
	/** Заголовок секции. Рендерит триггер; `children` — содержимое панели. */
	title: React.ReactNode;
	disabled?: boolean;
	children?: React.ReactNode;
	/** Уровень заголовка триггера. @default `'h3'` */
	headingLevel?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}
