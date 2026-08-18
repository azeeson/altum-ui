import type React from 'react';
import type {
	ComponentPropsWithoutRef,
} from 'react';

/**
 * Публичный тип `SortableItem` — дефолтная форма записи со строковым `content`.
 */
export interface SortableItem {
	id: string;
	content: React.ReactNode;
}

/**
 * Вариант оформления строки.
 * `plain` — без border/bg/padding (для `Item`, `SwipeToAction` и кастомного контента).
 */
export type SortableListVariant = 'default' | 'plain';

/**
 * Свойства `SortableList`.
 * @template T - Элемент списка; достаточно поля `id`.
 */
export interface SortableListProps<T extends {id: string} = SortableItem> extends Omit<
	ComponentPropsWithoutRef<'div'>,
	'children'
> {
	items: T[];
	onOrderChange: (newItems: T[]) => void;
	/**
	 * Рендер произвольного контента строки.
	 * Если не задан — используется `(item as SortableItem).content`.
	 */
	renderItem?: (item: T, index: number) => React.ReactNode;
	/**
	 * `plain` — без chrome строки, чтобы вкладывать `Item` / `SwipeToAction`.
	 * @default 'default'
	 */
	variant?: SortableListVariant;
	/**
	 * Перестановка без указателя: Alt+↑/↓ на handle,
	 * опционально кнопки вверх/вниз.
	 * @default true
	 */
	keyboardReorder?: boolean;
	/** Кнопки вверх/↓ рядом с drag-handle. @default false */
	showMoveButtons?: boolean;
	/**
	 * Показывать drag-handle. `false` + `showMoveButtons` — только степперы.
	 * @default true
	 */
	showDragHandle?: boolean;
	/**
	 * `true` — drag только за handle (отведённое место); контент и action-кнопки кликабельны.
	 * `false` — схватить можно за всю строку (интерактив внутри `content` блокируется на время drag).
	 * @default true
	 */
	handleOnly?: boolean;
}

export interface DragLayout {
	draggingId: string;
	fromIndex: number;
	hoverIndex: number;
	shiftHeight: number;
	phase: 'drag' | 'drop';
}

export interface DragSession {
	id: string;
	fromIndex: number;
	hoverIndex: number;
	items: Array<{id: string}>;
	pointerId: number;
	startX: number;
	startY: number;
	element: HTMLDivElement;
	captureTarget: HTMLElement;
	isDropping: boolean;
	dropCommitted: boolean;
	onPointerMove: (event: PointerEvent) => void;
	onPointerUp: (event: PointerEvent) => void;
	onLostPointerCapture: (event: PointerEvent) => void;
	onTransitionEnd: (event: TransitionEvent) => void;
	dropFallbackTimer: number | null;
}

export const DROP_FALLBACK_MS = 400;
