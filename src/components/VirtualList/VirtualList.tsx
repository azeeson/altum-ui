import {
	useCallback,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
	useTransition,
	type ReactNode,
	type UIEvent,
} from 'react';
import styles from './VirtualList.module.css';
import utilities from '../../styles/utilities.module.css';
import scroll from '../../styles/scrollable.module.css';
import {cn} from '../../core/utils/cn';
import {uRef} from '../../core/utils/bundle';
import {useLocale} from '../../locales/localeContext';
import type {
	MountRange,
	ScrollTarget,
	VirtualListHandle,
	VirtualListProps,
	VirtualListRange,
	VirtualScrollMetrics,
} from './VirtualList.types';
import {
	DEFAULT_ESTIMATE,
	DEFAULT_OVERSCAN,
	buildOffsets,
	cancelIdleTask,
	computeMountRange,
	getListOffsetInScrollParent,
	getScrollMetrics,
	resolveAlignedScrollTop,
	resolveEstimate,
	resolveItemSize,
	scheduleIdleTask,
	setScrollTop,
	toReportedRange,
	unwrapScrollElement,
} from './VirtualList.utils';
import {ruSlice as ru_virtualList} from '../../locales/slices/virtualList.ru';

const localeFallback = {
	virtualList: ru_virtualList,
};

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

const EMPTY_RANGE: MountRange = {
	visibleStart: 0,
	visibleEnd: -1,
	start: 0,
	end: -1,
};

const END_EPSILON = 4;

function readScrollTarget(
	root: HTMLDivElement | null,
	useWindowScroll: boolean,
	scrollElement: VirtualListProps<unknown>['scrollElement'],
	isExternal: boolean,
): ScrollTarget | null {
	if (useWindowScroll) return window;
	const external = unwrapScrollElement(scrollElement);
	if (external) return external;
	if (isExternal) return null;
	return root;
}

/**
 * Виртуализированный список. Высота строк — `estimateSize`, затем уточнение
 * через ResizeObserver. Сдвиг окна — один `translate3d`. React обновляет
 * индексы только при смене смонтированного окна.
 *
 * @component
 * @example
 * <VirtualList
 *   items={rows}
 *   height={400}
 *   renderItem={({ item }) => <Row data={item} />}
 * />
 */
export const VirtualList = <T,>({
	items,
	estimateSize = DEFAULT_ESTIMATE,
	overscan = DEFAULT_OVERSCAN,
	height,
	gap = 0,
	getItemKey,
	renderItem,
	itemWrapper = true,
	className,
	style,
	onScroll,
	onRangeChange,
	onRangeChangeOptions,
	'aria-label': ariaLabel,
	scrollElement,
	useWindowScroll = false,
	scrollMetrics,
	scrollMetricsStore,
	controlRef,
	rootRef,
	...rest
}: VirtualListProps<T>) => {
	const {t} = useLocale(localeFallback);
	const localRootRef = useRef<HTMLDivElement>(null);
	const rangeRef = useRef<MountRange>(EMPTY_RANGE);
	const lastReportedRef = useRef<VirtualListRange | null>(null);
	const idleRef = useRef<number | ReturnType<typeof setTimeout> | null>(null);
	const rangeRafRef = useRef(0);
	const measuredRef = useRef<Array<number | undefined>>([]);
	const observersRef = useRef(new Map<number, ResizeObserver>());
	const itemNodesRef = useRef(new Map<number, HTMLElement>());
	const pendingScrollDeltaRef = useRef(0);
	const stickToEndRef = useRef(false);
	const correctingScrollRef = useRef(false);
	const pendingTotalDeltaRef = useRef(0);

	const count = items.length;
	const isExternal = useWindowScroll || scrollElement != null;
	const usesExternalMetrics = scrollMetrics != null || scrollMetricsStore != null;
	const [measureVersion, setMeasureVersion] = useState(0);

	const offsets = useMemo(
		() => buildOffsets(
			count,
			(index) => resolveItemSize(measuredRef.current, estimateSize, index),
			gap,
		),
		// measureVersion форсирует пересчёт после ResizeObserver
		// eslint-disable-next-line react-hooks/exhaustive-deps -- measuredRef
		[
			count,
			estimateSize,
			gap,
			measureVersion
		],
	);

	const [range, setRange] = useState<MountRange>(EMPTY_RANGE);
	const [, startTransition] = useTransition();

	const offsetsRef = useRef(offsets);
	const estimateSizeRef = useRef(estimateSize);
	const overscanRef = useRef(overscan);
	const externalRef = useRef(isExternal);
	const windowScrollRef = useRef(useWindowScroll);
	const scrollElementRef = useRef(scrollElement);
	const metricsModeRef = useRef(usesExternalMetrics);
	const onScrollRef = useRef(onScroll);
	const onRangeChangeRef = useRef(onRangeChange);
	const onRangeChangeOptionsRef = useRef(onRangeChangeOptions);
	const scrollMetricsRef = useRef(scrollMetrics);
	const scrollMetricsStoreRef = useRef(scrollMetricsStore);
	const syncRef = useRef<(metrics: VirtualScrollMetrics, transition: boolean) => void>(() => undefined);

	const readItemSize = (index: number) => (
		resolveItemSize(measuredRef.current, estimateSizeRef.current, index)
	);

	useLayoutEffect(() => {
		if (measuredRef.current.length !== count) {
			const next = new Array<number | undefined>(count);
			for (let index = 0; index < Math.min(count, measuredRef.current.length); index += 1) {
				next[index] = measuredRef.current[index];
			}
			measuredRef.current = next;
		}
	}, [count]);

	useLayoutEffect(() => {
		offsetsRef.current = offsets;
		estimateSizeRef.current = estimateSize;
		overscanRef.current = overscan;
		externalRef.current = isExternal;
		windowScrollRef.current = useWindowScroll;
		scrollElementRef.current = scrollElement;
		metricsModeRef.current = usesExternalMetrics;
		onScrollRef.current = onScroll;
		onRangeChangeRef.current = onRangeChange;
		onRangeChangeOptionsRef.current = onRangeChangeOptions;
		scrollMetricsRef.current = scrollMetrics;
		scrollMetricsStoreRef.current = scrollMetricsStore;

		syncRef.current = (metrics, transition) => {
			const target = readScrollTarget(
				localRootRef.current,
				windowScrollRef.current,
				scrollElementRef.current,
				externalRef.current,
			);
			const list = localRootRef.current;
			const external = externalRef.current;
			const listOffset = external && list && target
				? getListOffsetInScrollParent(list, target)
				: 0;
			const geometry = offsetsRef.current;
			const itemCount = geometry.list.length;
			const next = computeMountRange({
				count: itemCount,
				offsets: geometry.list,
				getSize: readItemSize,
				overscan: overscanRef.current,
				relativeScroll: external
					? Math.max(0, metrics.scrollTop - listOffset)
					: metrics.scrollTop,
				viewportHeight: metrics.clientHeight,
			});

			// Transform только из `range` в render — иначе eager translate3d +
			// startTransition(setRange) дают рассинхрон окна и клиппинг строк.
			const prev = rangeRef.current;
			if (prev.start !== next.start || prev.end !== next.end) {
				rangeRef.current = next;
				if (transition) startTransition(() => setRange(next));
				else setRange(next);
			}

			const callback = onRangeChangeRef.current;
			if (callback) {
				const options = onRangeChangeOptionsRef.current;
				const reported = toReportedRange(next, itemCount, options?.mode ?? 'visible');
				const prevReported = lastReportedRef.current;
				const sameReport = prevReported
				&& prevReported.start === reported.start
				&& prevReported.end === reported.end
				&& prevReported.count === reported.count;
				if (!sameReport) {
					lastReportedRef.current = reported;
					const run = () => callback(reported);
					const flushMode = options?.flush ?? 'sync';
					if (flushMode === 'idle') {
						cancelIdleTask(idleRef.current);
						idleRef.current = scheduleIdleTask(run);
					} else if (flushMode === 'layout') {
						if (rangeRafRef.current) cancelAnimationFrame(rangeRafRef.current);
						rangeRafRef.current = requestAnimationFrame(() => {
							rangeRafRef.current = 0;
							run();
						});
					} else {
						run();
					}
				}
			}
		};
	}, [
		offsets,
		estimateSize,
		overscan,
		isExternal,
		useWindowScroll,
		scrollElement,
		usesExternalMetrics,
		onScroll,
		onRangeChange,
		onRangeChangeOptions,
		scrollMetrics,
		scrollMetricsStore,
	]);

	const readMetrics = (): VirtualScrollMetrics | null => {
		if (scrollMetricsRef.current) return scrollMetricsRef.current;
		const store = scrollMetricsStoreRef.current;
		if (store) return store.getSnapshot();
		const target = readScrollTarget(
			localRootRef.current,
			windowScrollRef.current,
			scrollElementRef.current,
			externalRef.current,
		);
		return target ? getScrollMetrics(target) : null;
	};

	const commitMeasuredSize = useCallback((index: number, rawSize: number) => {
		const next = Math.max(1, Math.round(rawSize));
		const prev = measuredRef.current[index];
		if (prev === next) return;

		const oldSize = prev ?? resolveEstimate(estimateSizeRef.current, index);
		const delta = next - oldSize;
		measuredRef.current[index] = next;

		const target = readScrollTarget(
			localRootRef.current,
			windowScrollRef.current,
			scrollElementRef.current,
			externalRef.current,
		);
		const metrics = target ? getScrollMetrics(target) : null;
		const geometry = offsetsRef.current;
		const list = localRootRef.current;

		if (target && metrics && delta !== 0) {
			const listOffset = externalRef.current && list
				? getListOffsetInScrollParent(list, target)
				: 0;
			const relativeScroll = externalRef.current
				? Math.max(0, metrics.scrollTop - listOffset)
				: metrics.scrollTop;
			const oldMax = Math.max(0, geometry.total - metrics.clientHeight);
			const nearEnd = relativeScroll >= oldMax - END_EPSILON;
			const itemTop = geometry.list[index] ?? 0;

			if (stickToEndRef.current || nearEnd) {
				// У конца: сразу к новому maxScroll (с учётом ещё не закоммиченных delta).
				stickToEndRef.current = true;
				pendingScrollDeltaRef.current = 0;
				pendingTotalDeltaRef.current += delta;
				const newMax = Math.max(
					0,
					geometry.total + pendingTotalDeltaRef.current - metrics.clientHeight,
				);
				const absolute = externalRef.current ? listOffset + newMax : newMax;
				correctingScrollRef.current = true;
				setScrollTop(target, absolute);
				correctingScrollRef.current = false;
			} else if (itemTop < relativeScroll) {
				pendingScrollDeltaRef.current += delta;
			}
		}

		setMeasureVersion((value) => value + 1);
	}, []);

	const assignItemNode = useCallback((index: number, node: HTMLDivElement | null) => {
		const prev = itemNodesRef.current.get(index);
		if (prev === node) return;

		observersRef.current.get(index)?.disconnect();
		observersRef.current.delete(index);
		itemNodesRef.current.delete(index);

		if (!node) return;

		itemNodesRef.current.set(index, node);

		const apply = (size: number) => {
			if (size <= 0) return;
			commitMeasuredSize(index, size);
		};

		if (typeof ResizeObserver === 'undefined') {
			apply(node.offsetHeight);
			return;
		}

		const observer = new ResizeObserver((entries) => {
			const entry = entries[0];
			const borderBox = entry?.borderBoxSize?.[0]?.blockSize;
			const nextSize = borderBox ?? entry?.contentRect.height ?? node.offsetHeight;
			apply(nextSize);
		});
		observer.observe(node);
		observersRef.current.set(index, observer);
		apply(node.offsetHeight);
	}, [commitMeasuredSize]);

	const assignItemNodeRef = useRef(assignItemNode);
	assignItemNodeRef.current = assignItemNode;

	const itemRefCallbacks = useRef(new Map<number, (node: HTMLDivElement | null) => void>());
	const getItemRef = (index: number) => {
		let callback = itemRefCallbacks.current.get(index);
		if (!callback) {
			callback = (node) => assignItemNodeRef.current(index, node);
			itemRefCallbacks.current.set(index, callback);
		}
		return callback;
	};

	useLayoutEffect(() => {
		const metrics = readMetrics();
		if (metrics) syncRef.current(metrics, false);
	}, [
		offsets,
		overscan,
		scrollMetrics?.clientHeight,
		scrollMetrics?.scrollTop,
		scrollMetricsStore,
		isExternal,
		useWindowScroll,
		scrollElement,
	]);

	useLayoutEffect(() => {
		const target = readScrollTarget(
			localRootRef.current,
			windowScrollRef.current,
			scrollElementRef.current,
			externalRef.current,
		);
		if (!target) return;

		const metrics = getScrollMetrics(target);
		const list = localRootRef.current;
		const listOffset = externalRef.current && list
			? getListOffsetInScrollParent(list, target)
			: 0;

		if (stickToEndRef.current) {
			pendingScrollDeltaRef.current = 0;
			pendingTotalDeltaRef.current = 0;
			const maxScroll = Math.max(0, offsets.total - metrics.clientHeight);
			const absolute = externalRef.current ? listOffset + maxScroll : maxScroll;
			if (Math.abs(metrics.scrollTop - absolute) > 0.5) {
				correctingScrollRef.current = true;
				setScrollTop(target, absolute);
				correctingScrollRef.current = false;
			}
			syncRef.current(getScrollMetrics(target), false);
			return;
		}

		pendingTotalDeltaRef.current = 0;
		const delta = pendingScrollDeltaRef.current;
		if (delta === 0) return;
		pendingScrollDeltaRef.current = 0;
		correctingScrollRef.current = true;
		setScrollTop(target, Math.max(0, metrics.scrollTop + delta));
		correctingScrollRef.current = false;
		syncRef.current(getScrollMetrics(target), false);
	}, [measureVersion, offsets.total, isExternal]);

	useEffect(() => {
		let disposed = false;
		let removeListeners = () => undefined;
		let retryRaf = 0;

		const pull = (transition: boolean) => {
			if (metricsModeRef.current) {
				const metrics = scrollMetricsRef.current
					?? scrollMetricsStoreRef.current?.getSnapshot()
					?? null;
				if (metrics) syncRef.current(metrics, transition);
				return;
			}
			const target = readScrollTarget(
				localRootRef.current,
				windowScrollRef.current,
				scrollElementRef.current,
				externalRef.current,
			);
			if (target) syncRef.current(getScrollMetrics(target), transition);
		};

		const attach = () => {
			const list = localRootRef.current;
			const target = readScrollTarget(
				list,
				windowScrollRef.current,
				scrollElementRef.current,
				externalRef.current,
			);
			if (!list) return false;
			if (externalRef.current && !metricsModeRef.current && !target) return false;

			const onResize = () => pull(false);
			window.addEventListener('resize', onResize);

			let scrollNode: EventTarget | null = null;
			const onExternalScroll = (event: Event) => {
				const nextTarget = readScrollTarget(
					localRootRef.current,
					windowScrollRef.current,
					scrollElementRef.current,
					externalRef.current,
				);
				if (!nextTarget) return;
				if (!correctingScrollRef.current) {
					const metrics = getScrollMetrics(nextTarget);
					const list = localRootRef.current;
					const listOffset = externalRef.current && list
						? getListOffsetInScrollParent(list, nextTarget)
						: 0;
					const relative = externalRef.current
						? Math.max(0, metrics.scrollTop - listOffset)
						: metrics.scrollTop;
					const maxScroll = Math.max(0, offsetsRef.current.total - metrics.clientHeight);
					if (!(stickToEndRef.current && relative >= maxScroll - END_EPSILON)) {
						stickToEndRef.current = false;
						pendingScrollDeltaRef.current = 0;
						pendingTotalDeltaRef.current = 0;
					}
				}
				syncRef.current(getScrollMetrics(nextTarget), true);
				onScrollRef.current?.(event);
			};
			if (!metricsModeRef.current && externalRef.current && target) {
				scrollNode = target === window ? window : target;
				scrollNode.addEventListener('scroll', onExternalScroll, {passive: true});
			}

			// Попап открывается без scroll/resize окна: высота scrollport была 0.
			let resizeObserver: ResizeObserver | undefined;
			if (typeof ResizeObserver !== 'undefined' && target && target !== window) {
				resizeObserver = new ResizeObserver(() => pull(false));
				resizeObserver.observe(target);
			}

			const store = scrollMetricsStoreRef.current;
			const unsubscribe = scrollMetricsRef.current == null && store
				? store.subscribe(() => {
					syncRef.current(store.getSnapshot(), true);
				})
				: undefined;

			removeListeners = () => {
				scrollNode?.removeEventListener('scroll', onExternalScroll);
				window.removeEventListener('resize', onResize);
				resizeObserver?.disconnect();
				unsubscribe?.();
			};
			return true;
		};

		if (attach()) pull(false);
		else {
			retryRaf = window.requestAnimationFrame(() => {
				if (disposed) return;
				if (attach()) pull(false);
			});
		}

		const observers = observersRef.current;
		const itemNodes = itemNodesRef.current;

		return () => {
			disposed = true;
			if (retryRaf) window.cancelAnimationFrame(retryRaf);
			if (rangeRafRef.current) {
				cancelAnimationFrame(rangeRafRef.current);
				rangeRafRef.current = 0;
			}
			cancelIdleTask(idleRef.current);
			idleRef.current = null;
			removeListeners();
			observers.forEach((observer) => observer.disconnect());
			observers.clear();
			itemNodes.clear();
		};
	}, [
		isExternal,
		usesExternalMetrics,
		useWindowScroll,
		scrollElement,
		scrollMetricsStore,
	]);

	const control: VirtualListHandle = {
		scrollToOffset: (offset) => {
			const target = readScrollTarget(
				localRootRef.current,
				windowScrollRef.current,
				scrollElementRef.current,
				externalRef.current,
			);
			if (!target) return;
			const list = localRootRef.current;
			const base = externalRef.current && list
				? getListOffsetInScrollParent(list, target)
				: 0;
			setScrollTop(target, Math.max(0, base + offset));
			syncRef.current(getScrollMetrics(target), true);
		},
		scrollToIndex: (index, options) => {
			const target = readScrollTarget(
				localRootRef.current,
				windowScrollRef.current,
				scrollElementRef.current,
				externalRef.current,
			);
			const geometry = offsetsRef.current;
			const itemCount = geometry.list.length;
			if (!target || itemCount === 0) return;

			const clamped = Math.max(0, Math.min(itemCount - 1, index));
			const itemOffset = geometry.list[clamped] ?? 0;
			const itemSize = readItemSize(clamped);
			const metrics = getScrollMetrics(target);
			const list = localRootRef.current;
			const base = externalRef.current && list
				? getListOffsetInScrollParent(list, target)
				: 0;
			const aligned = resolveAlignedScrollTop({
				absoluteTop: base + itemOffset,
				itemSize,
				viewHeight: metrics.clientHeight,
				current: metrics.scrollTop,
				align: options?.align ?? 'auto',
			});
			if (aligned == null) return;
			const maxScroll = Math.max(0, (externalRef.current
				? base + geometry.total
				: geometry.total) - metrics.clientHeight);
			const nextTop = Math.max(0, Math.min(maxScroll, aligned));
			const align = options?.align ?? 'auto';
			if (align === 'end' || nextTop >= maxScroll - END_EPSILON) {
				stickToEndRef.current = true;
				pendingScrollDeltaRef.current = 0;
			} else {
				stickToEndRef.current = false;
			}
			correctingScrollRef.current = true;
			setScrollTop(target, nextTop);
			correctingScrollRef.current = false;
			syncRef.current(getScrollMetrics(target), true);
		},
		getScrollElement: () => readScrollTarget(
			localRootRef.current,
			windowScrollRef.current,
			scrollElementRef.current,
			externalRef.current,
		),
	};
	if (controlRef) controlRef.current = control;

	const handleSelfScroll = (event: UIEvent<HTMLDivElement>) => {
		if (externalRef.current || metricsModeRef.current) return;
		const node = event.currentTarget;
		if (correctingScrollRef.current) {
			syncRef.current(getScrollMetrics(node), true);
			onScrollRef.current?.(event);
			return;
		}
		const maxScroll = Math.max(0, node.scrollHeight - node.clientHeight);
		// Не сбрасывать stick на отложенном scroll после programmatic setScrollTop,
		// пока позиция всё ещё у нижнего края.
		if (!(stickToEndRef.current && node.scrollTop >= maxScroll - END_EPSILON)) {
			stickToEndRef.current = false;
			pendingScrollDeltaRef.current = 0;
			pendingTotalDeltaRef.current = 0;
		}
		syncRef.current(getScrollMetrics(node), true);
		onScrollRef.current?.(event);
	};

	const cells: ReactNode[] = [];
	if (range.end >= range.start) {
		for (let index = range.start; index <= range.end; index += 1) {
			const item = items[index];
			if (item === undefined) continue;
			const key = getItemKey?.(item, index) ?? index;
			const body = renderItem({
				item,
				index,
			});
			if (itemWrapper) {
				cells.push(
					<div
						key={key}
						ref={getItemRef(index)}
						role='listitem'
						aria-posinset={index + 1}
						aria-setsize={count}
						className={styles.item}
					>
						{body}
					</div>,
				);
			} else {
				cells.push(
					<span
						key={key}
						style={{display: 'contents'}}
					>
						{body}
					</span>,
				);
			}
		}
	}

	const contentOffset = offsets.list[range.start] ?? 0;

	return (
		<div
			{...rest}
			ref={uRef(localRootRef, rootRef)}
			className={cn(!isExternal && scroll.area, styles.root, className)}
			style={{
				...(isExternal ? undefined : {height}),
				...style,
			}}
			onScroll={isExternal || usesExternalMetrics ? undefined : handleSelfScroll}
			role='list'
			aria-label={ariaLabel ?? t('virtualList.ariaLabel')}
			data-external={isExternal ? '' : undefined}
		>
			<div
				className={styles.spacer}
				style={{height: offsets.total}}
			>
				<div
					className={cn(utilities.fColumn, styles.content)}
					style={{
						gap,
						transform: `translate3d(0, ${contentOffset}px, 0)`,
					}}
				>
					{cells}
				</div>
			</div>
		</div>
	);
};
