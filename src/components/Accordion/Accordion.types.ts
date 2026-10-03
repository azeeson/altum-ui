import type React from 'react';
import type {
	ComponentPropsWithoutRef,
	Ref,
} from 'react';

/**
 * Вариант оформления контейнера.
 */
export type AccordionVariant = 'bordered' | 'flush';

/** Плоский элемент `Accordion` → `Accordion.Item`. */
export interface AccordionItemData {
	value: string;
	title: React.ReactNode;
	children?: React.ReactNode;
	disabled?: boolean;
	/** Уровень заголовка триггера. @default `'h3'` */
	headingLevel?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

/**
 * Свойства `Accordion` (Root).
 * Открытие секций держит браузер (`<details>`). `openIds` нет:
 * начальное состояние — `defaultOpenIds`, сигнал — `onOpenChange`.
 * Плоский `items` и compound `Accordion.Item` можно смешивать.
 */
export interface AccordionProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
	/** Compound-секции (`Accordion.Item`); можно смешивать с `items`. */
	children?: React.ReactNode;
	/** Плоский список секций → `Accordion.Item`. */
	items?: AccordionItemData[];
	/** Разрешить одновременное раскрытие нескольких секций. @default false */
	multiple?: boolean;
	/** @default 'flush' */
	variant?: AccordionVariant;
	/** Секции, открытые при первом показе. Дальше их состояние живёт в DOM. */
	defaultOpenIds?: string[];
	/** Вызывается после нативного `toggle`. Аргумент — id открытых секций. */
	onOpenChange?: (ids: string[]) => void;
	/** DOM-узел корня. */
	rootRef?: Ref<HTMLDivElement>;
}

/**
 * Свойства `Accordion.Item`.
 */
export interface AccordionItemProps extends Omit<ComponentPropsWithoutRef<'details'>, 'title' | 'open' | 'name'> {
	/** Уникальный id секции (для `defaultOpenIds` / `onOpenChange`). */
	value: string;
	/** Заголовок секции. Рендерит триггер; `children` — содержимое панели. */
	title: React.ReactNode;
	disabled?: boolean;
	children?: React.ReactNode;
	/** Уровень заголовка триггера. @default `'h3'` */
	headingLevel?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
	/** DOM-узел `<details>`. */
	rootRef?: Ref<HTMLDetailsElement>;
}
