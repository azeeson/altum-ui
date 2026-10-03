import type React from 'react';
import type {
	ComponentPropsWithoutRef,
	Ref,
} from 'react';

/**
 * Вариант точки таймлайна.
 */
export type TimelineItemStatus = 'default' | 'success' | 'warning' | 'error' | 'info';

/**
 * Элемент таймлайна.
 */
export interface TimelineItem {
	id: string;
	title: React.ReactNode;
	description?: React.ReactNode;
	/** Детали — collapsible */
	details?: React.ReactNode;
	time?: React.ReactNode;
	icon?: React.ReactNode;
	status?: TimelineItemStatus;
}

/**
 * Свойства `Timeline`.
 */
export interface TimelineProps extends Omit<ComponentPropsWithoutRef<'ol'>, 'children'> {
	items: TimelineItem[];
	/** @default 'vertical' */
	orientation?: 'vertical' | 'horizontal';
	/** Акцент на текущем шаге */
	currentId?: string;
	/** Раскрытые details по умолчанию */
	defaultExpandedIds?: string[];
	/** Узел `<ol>`. */
	rootRef?: Ref<HTMLOListElement>;
}
