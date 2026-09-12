import type React from 'react';
import type {
	ComponentPropsWithoutRef,
} from 'react';

export type VirtualListAlign = 'start' | 'center' | 'end' | 'auto';

export interface VirtualListRenderItemInfo<T> {
	item: T;
	index: number;
	style: React.CSSProperties;
}

/** Видимый диапазон индексов (без overscan) — для a11y «показано N из M». */
export interface VirtualListRange {
	start: number;
	/** `-1`, если список пуст */
	end: number;
	count: number;
}

/**
 * Метрики контейнера прокрутки для контролируемого / внешнего store-режима.
 * `scrollTop` — в координатах scroller; offset списка учитывается внутри VirtualList.
 */
export interface VirtualScrollMetrics {
	scrollTop: number;
	clientHeight: number;
}

/**
 * Внешний store метрик (`useSyncExternalStore`).
 * Если задан — VirtualList не вешает свой scroll listener.
 */
export interface VirtualScrollMetricsStore {
	subscribe: (onStoreChange: () => void) => () => void;
	getSnapshot: () => VirtualScrollMetrics;
}

/**
 * Опции вызова `onRangeChange`.
 * Не используйте колбэк для синхронного UI на каждый тик скролла —
 * summary лучше debounce / `requestIdleCallback`.
 */
export interface VirtualListOnRangeChangeOptions {
	/**
	 * `visible` — только видимые индексы (без overscan).
	 * `withOverscan` — смонтированное окно (visible ± overscan).
	 * @default 'visible'
	 */
	mode?: 'visible' | 'withOverscan';
	/**
	 * Когда вызывать колбэк после смены range.
	 * @default 'sync'
	 */
	flush?: 'sync' | 'layout' | 'idle';
}

export type ScrollTarget = HTMLElement | Window;

export interface VirtualListHandle {
	scrollToIndex: (index: number, options?: {align?: VirtualListAlign}) => void;
	scrollToOffset: (offset: number) => void;
	getScrollElement: () => ScrollTarget | null;
}

export type MountRange = {
	visibleStart: number;
	visibleEnd: number;
	start: number;
	end: number;
};

export interface VirtualListProps<T> extends Omit<
	ComponentPropsWithoutRef<'div'>,
	'children' | 'onScroll' | 'ref'
> {
	items: T[];
	estimateSize?: number | ((index: number) => number);
	overscan?: number;
	/**
	 * Высота собственного вьюпорта.
	 * Не нужна при `useWindowScroll` / `scrollElement`.
	 */
	height?: number | string;
	gap?: number;
	getItemKey?: (item: T, index: number) => string | number;
	renderItem: (info: VirtualListRenderItemInfo<T>) => React.ReactNode;
	onScroll?: (event: Event | React.UIEvent<HTMLDivElement>) => void;
	/**
	 * Range при смене окна (не на каждый пиксель scrollTop).
	 * Не для синхронного UI на каждый тик — см. `onRangeChangeOptions`.
	 */
	onRangeChange?: (range: VirtualListRange) => void;
	onRangeChangeOptions?: VirtualListOnRangeChangeOptions;
	/**
	 * Внешний scroll-контейнер (workspace). Список не создаёт свой overflow.
	 * Можно передать element или ref.
	 */
	scrollElement?: HTMLElement | null | React.RefObject<HTMLElement | null>;
	/** Виртуализация относительно window / document scrolling. */
	useWindowScroll?: boolean;
	/**
	 * Контролируемые метрики. Если заданы — VirtualList НЕ вешает слушатель scroll;
	 * окно считается из этих метрик и кэшированного `listOffset`.
	 */
	scrollMetrics?: VirtualScrollMetrics;
	/**
	 * Внешний store метрик (`useSyncExternalStore`).
	 * Если задано — VirtualList НЕ вешает scroll listener.
	 */
	scrollMetricsStore?: VirtualScrollMetricsStore;
}
