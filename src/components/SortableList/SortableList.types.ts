import type React from 'react';
import type {
	ComponentPropsWithoutRef,
	Ref,
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
	/**
	 * Оценка высоты строки для `VirtualList` (длинные списки).
	 * @default 56
	 */
	estimateSize?: number;
	/**
	 * Порог длины: при `items.length > virtualThreshold` включается VirtualList.
	 * На время drag виртуализация отключается.
	 * @default 40
	 */
	virtualThreshold?: number;
	/**
	 * Высота scroll-хоста при виртуализации.
	 * @default 360
	 */
	height?: number | string;
	/** DOM-узел списка. */
	rootRef?: Ref<HTMLDivElement>;
}
