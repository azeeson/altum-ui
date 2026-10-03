import type React from 'react';
import type {
	ComponentPropsWithoutRef,
	Ref,
} from 'react';

export type BubbleVariant = 'default' | 'outgoing' | 'incoming' | 'system';

export type BubbleAlign = 'start' | 'end';

export interface BubbleReaction {
	emoji: string;
	count?: number;
	active?: boolean;
	onClick?: () => void;
}

export interface BubbleProps extends Omit<ComponentPropsWithoutRef<'div'>, 'content'> {
	children: React.ReactNode;
	/** Визуальный вариант пузыря. @default 'default' */
	variant?: BubbleVariant;
	/**
	 * Выравнивание в ленте.
	 * По умолчанию: `end` для `outgoing`, иначе `start`.
	 */
	align?: BubbleAlign;
	/**
	 * Группировка соседних сообщений одного автора.
	 * @default 'single'
	 */
	group?: 'single' | 'first' | 'middle' | 'last';
	/** Подпись над/под пузырём (автор, время) */
	meta?: React.ReactNode;
	reactions?: BubbleReaction[];
	/** Сворачиваемый длинный контент. */
	collapsible?: boolean;
	/** Число видимых строк в свёрнутом виде. @default 4 */
	collapsedLines?: number;
	expandLabel?: string;
	collapseLabel?: string;
	/** Корень пузыря. */
	rootRef?: Ref<HTMLDivElement>;
}
