import {forwardRef, type FC} from 'react';
import {VirtualListInner} from './VirtualListInner';

export type {
	VirtualListAlign,
	VirtualListRenderItemInfo,
	VirtualListRange,
	VirtualScrollMetrics,
	VirtualScrollMetricsStore,
	VirtualListOnRangeChangeOptions,
	VirtualListProps,
	VirtualListHandle,
} from './VirtualList.types';

/**
 * Виртуализированный список с динамической высотой строк и внешним scroll-контейнером.
 *
 * Re-render при скролле только когда меняется набор смонтированных индексов
 * (или измеренные высоты) — не на каждый пиксель `scrollTop`.
 *
 * @component
 * @example
 * <VirtualList
 *   items={rows}
 *   height={400}
 *   renderItem={({ item }) => <Row data={item} />}
 * />
 * @example
 * // Внешний scroll-bus (один listener на workspace)
 * <VirtualList
 *   items={rows}
 *   scrollElement={workspaceRef}
 *   scrollMetricsStore={workspaceScrollStore}
 *   renderItem={({ item }) => <Row data={item} />}
 * />
 */
export const VirtualList = forwardRef(VirtualListInner) as <T>(
	props: import('./VirtualList.types').VirtualListProps<T> & {ref?: React.Ref<import('./VirtualList.types').VirtualListHandle>}
) => React.ReactElement | null;

(VirtualList as FC).displayName = 'VirtualList';
