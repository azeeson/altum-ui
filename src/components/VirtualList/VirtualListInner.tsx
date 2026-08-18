import React, {
	useCallback,
	useEffect,
	useImperativeHandle,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
	useSyncExternalStore,
} from 'react';
import styles from './VirtualList.module.css';
import {cn} from '../../utils/cn';
import {mergeStyles} from '../../utils/mergeStyles';
import {useLocale} from '../LocaleProvider/LocaleProvider';
import {VirtualListItemCell} from './VirtualListItemCell';
import type {MountRange, VirtualListHandle, VirtualListProps, VirtualListRange} from './VirtualList.types';
import {
	DEFAULT_ESTIMATE,
	DEFAULT_OVERSCAN,
	computeMountRange,
	getItemOffset,
	getListOffsetInScrollParent,
	getScrollMetrics,
	noopGetSnapshot,
	noopSubscribe,
	rangesEqual,
	resolveEstimate,
	setScrollTop,
	unwrapScrollElement,
} from './VirtualList.utils';

export function VirtualListInner<T>(
	{
		items,
		estimateSize = DEFAULT_ESTIMATE,
		overscan = DEFAULT_OVERSCAN,
		height,
		gap = 0,
		getItemKey,
		renderItem,
		className,
		style,
		onScroll,
		onRangeChange,
		onRangeChangeOptions,
		'aria-label': ariaLabel,
		scrollElement,
		useWindowScroll = false,
		scrollMetrics: controlledMetrics,
		scrollMetricsStore,
		...rest
	}: VirtualListProps<T>,
	ref: React.ForwardedRef<VirtualListHandle>,
) {
	const {t} = useLocale();
	const rootRef = useRef<HTMLDivElement>(null);
	const itemNodesRef = useRef(new Map<number, HTMLElement>());
	const observersRef = useRef(new Map<number, ResizeObserver>());
	const measuredRef = useRef<number[]>([]);
	const scrollCorrectionRef = useRef(0);
	const listOffsetRef = useRef(0);
	const scrollTopRef = useRef(0);
	const viewportHeightRef = useRef(0);
	const pendingCorrectionRef = useRef(0);
	const scrollRafRef = useRef(0);
	const rangeRef = useRef<MountRange>({
		visibleStart: 0,
		visibleEnd: -1,
		start: 0,
		end: -1,
	});
	const offsetsRef = useRef<number[]>([]);
	const getSizeRef = useRef<(index: number) => number>(() => DEFAULT_ESTIMATE);
	const onScrollRef = useRef(onScroll);
	const onRangeChangeRef = useRef(onRangeChange);
	const onRangeChangeOptionsRef = useRef(onRangeChangeOptions);
	const renderItemRef = useRef(renderItem);
	const lastReportedRangeRef = useRef<VirtualListRange | null>(null);
	const rangeNotifyRafRef = useRef(0);
	const rangeNotifyIdleRef = useRef<number | ReturnType<typeof setTimeout> | null>(null);

	const isExternal = useWindowScroll || scrollElement != null;
	const usesExternalMetrics = controlledMetrics != null || scrollMetricsStore != null;

	const storeMetrics = useSyncExternalStore(
		scrollMetricsStore?.subscribe ?? noopSubscribe,
		scrollMetricsStore?.getSnapshot ?? noopGetSnapshot,
		scrollMetricsStore?.getSnapshot ?? noopGetSnapshot,
	);

	const [range, setRange] = useState<MountRange>({
		visibleStart: 0,
		visibleEnd: -1,
		start: 0,
		end: -1,
	});
	const [pendingCorrection, setPendingCorrection] = useState(0);
	const [version, setVersion] = useState(0);
	const [scrollBindTick, setScrollBindTick] = useState(0);

	const count = items.length;

	useEffect(() => {
		onScrollRef.current = onScroll;
		onRangeChangeRef.current = onRangeChange;
		onRangeChangeOptionsRef.current = onRangeChangeOptions;
		renderItemRef.current = renderItem;
	});

	const invokeRenderItem = useCallback(
		(info: Parameters<typeof renderItem>[0]) => renderItemRef.current(info),
		[],
	);

	const getItemKeyRef = useRef(getItemKey);
	useEffect(() => {
		getItemKeyRef.current = getItemKey;
	});

	/* eslint-disable react-hooks/refs -- getItemKeyRef стабилизирует signature без сброса measurements */
	const itemsSignature = useMemo(
		() => items.map((item, index) => String(
			getItemKeyRef.current?.(item, index) ?? index,
		)).join('\0'),
		[items],
	);
	/* eslint-enable react-hooks/refs */

	const getSize = useCallback((index: number) => {
		const measured = measuredRef.current[index];
		if (measured != null && measured > 0) return measured;
		return resolveEstimate(estimateSize, index);
	}, [estimateSize]);

	/* eslint-disable react-hooks/refs -- getSize читает measuredRef для виртуализации */
	const {offsets, totalSize} = useMemo(() => {
		const nextOffsets = new Array<number>(count);
		let offset = 0;
		for (let i = 0; i < count; i += 1) {
			nextOffsets[i] = offset;
			offset += getSize(i) + (i < count - 1 ? gap : 0);
		}
		return {
			offsets: nextOffsets,
			totalSize: count === 0 ? 0 : offset,
		};
	// version намеренно форсирует пересчёт оффсетов при изменении размеров элементов
	// eslint-disable-next-line react-hooks/exhaustive-deps -- см. version выше
	}, [
		count,
		gap,
		getSize,
		version
	]);
	/* eslint-enable react-hooks/refs */

	/* Актуальные значения в ref для колбэков scroll/measure без повторной подписки. */
	/* eslint-disable react-hooks/refs -- см. комментарий выше */
	offsetsRef.current = offsets;
	getSizeRef.current = getSize;
	pendingCorrectionRef.current = pendingCorrection;
	/* eslint-enable react-hooks/refs */

	const resolveScrollTarget = useCallback(() => {
		if (useWindowScroll) return window;
		const external = unwrapScrollElement(scrollElement);
		if (external) return external;
		if (isExternal) return null;
		return rootRef.current;
	}, [isExternal, scrollElement, useWindowScroll]);

	const refreshListOffset = useCallback(() => {
		const target = resolveScrollTarget();
		const list = rootRef.current;
		if (!target || !list) return;
		if (isExternal) {
			listOffsetRef.current = getListOffsetInScrollParent(list, target);
		} else {
			listOffsetRef.current = 0;
		}
	}, [isExternal, resolveScrollTarget]);

	const notifyRangeChange = useCallback((nextMount: MountRange, itemCount: number) => {
		const options = onRangeChangeOptionsRef.current;
		const mode = options?.mode ?? 'visible';
		const flush = options?.flush ?? 'sync';
		const callback = onRangeChangeRef.current;
		if (!callback) return;

		const next: VirtualListRange = mode === 'withOverscan'
			? {
				start: itemCount === 0 ? 0 : nextMount.start,
				end: itemCount === 0 ? -1 : nextMount.end,
				count: itemCount,
			}
			: {
				start: itemCount === 0 ? 0 : nextMount.visibleStart,
				end: itemCount === 0 ? -1 : nextMount.visibleEnd,
				count: itemCount,
			};

		const prev = lastReportedRangeRef.current;
		if (
			prev
			&& prev.start === next.start
			&& prev.end === next.end
			&& prev.count === next.count
		) {
			return;
		}
		lastReportedRangeRef.current = next;

		const run = () => callback(next);

		if (flush === 'idle') {
			if (rangeNotifyIdleRef.current != null) {
				if (typeof cancelIdleCallback === 'function') {
					cancelIdleCallback(rangeNotifyIdleRef.current as number);
				} else {
					clearTimeout(rangeNotifyIdleRef.current as ReturnType<typeof setTimeout>);
				}
			}
			if (typeof requestIdleCallback === 'function') {
				rangeNotifyIdleRef.current = requestIdleCallback(run);
			} else {
				rangeNotifyIdleRef.current = setTimeout(run, 0);
			}
			return;
		}

		if (flush === 'layout') {
			if (rangeNotifyRafRef.current) {
				cancelAnimationFrame(rangeNotifyRafRef.current);
			}
			rangeNotifyRafRef.current = requestAnimationFrame(run);
			return;
		}

		run();
	}, []);

	const commitRange = useCallback((next: MountRange, itemCount: number) => {
		const prev = rangeRef.current;
		if (rangesEqual(prev, next)) return;
		rangeRef.current = next;
		setRange(next);
		notifyRangeChange(next, itemCount);
	}, [notifyRangeChange]);

	const flushScrollMetrics = useCallback((metrics?: ReturnType<typeof getScrollMetrics>) => {
		const target = resolveScrollTarget();
		const nextMetrics = metrics ?? (target ? getScrollMetrics(target) : null);
		if (!nextMetrics) return;

		scrollTopRef.current = nextMetrics.scrollTop;
		viewportHeightRef.current = nextMetrics.clientHeight;

		const effectiveScrollTop = nextMetrics.scrollTop + pendingCorrectionRef.current;
		const relativeScroll = isExternal
			? Math.max(0, effectiveScrollTop - listOffsetRef.current)
			: effectiveScrollTop;

		const next = computeMountRange({
			count,
			offsets: offsetsRef.current,
			getSize: getSizeRef.current,
			overscan,
			relativeScroll,
			viewportHeight: nextMetrics.clientHeight,
		});
		commitRange(next, count);
	}, [
		commitRange,
		count,
		isExternal,
		overscan,
		resolveScrollTarget
	]);

	const scheduleScrollFlush = useCallback(() => {
		cancelAnimationFrame(scrollRafRef.current);
		scrollRafRef.current = requestAnimationFrame(() => {
			scrollRafRef.current = 0;
			flushScrollMetrics();
		});
	}, [flushScrollMetrics]);

	const setMeasuredSize = useCallback((index: number, size: number) => {
		const next = Math.max(1, Math.round(size));
		const prev = measuredRef.current[index];
		if (prev === next) return;

		const oldSize = prev ?? resolveEstimate(estimateSize, index);
		const delta = next - oldSize;
		measuredRef.current[index] = next;

		const target = resolveScrollTarget();
		if (target && delta !== 0) {
			const itemOffset = getItemOffset(
				index,
				(i) => measuredRef.current[i] ?? resolveEstimate(estimateSize, i),
				gap,
			);

			const metrics = getScrollMetrics(target);
			const absoluteItemTop = isExternal
				? listOffsetRef.current + itemOffset
				: itemOffset;

			if (absoluteItemTop < metrics.scrollTop) {
				scrollCorrectionRef.current += delta;
				pendingCorrectionRef.current = scrollCorrectionRef.current;
				setPendingCorrection(scrollCorrectionRef.current);
			}
		}

		setVersion((value) => value + 1);
	}, [
		estimateSize,
		gap,
		isExternal,
		resolveScrollTarget
	]);

	useLayoutEffect(() => {
		const correction = scrollCorrectionRef.current;
		const target = resolveScrollTarget();
		if (correction === 0 || !target) return;
		scrollCorrectionRef.current = 0;
		pendingCorrectionRef.current = 0;
		setPendingCorrection(0);
		const metrics = getScrollMetrics(target);
		const nextScrollTop = metrics.scrollTop + correction;
		setScrollTop(target, nextScrollTop);
		scrollTopRef.current = nextScrollTop;
		flushScrollMetrics({
			scrollTop: nextScrollTop,
			clientHeight: metrics.clientHeight,
		});
	}, [flushScrollMetrics, resolveScrollTarget, version]);

	useLayoutEffect(() => {
		if (usesExternalMetrics) return;

		let disposed = false;
		let removeListeners: (() => void) | undefined;
		let retryRaf = 0;

		const attach = (): boolean => {
			const target = resolveScrollTarget();
			const list = rootRef.current;
			if (!target || !list) return false;

			const remasureOffsetAndFlush = () => {
				if (disposed) return;
				refreshListOffset();
				flushScrollMetrics();
			};

			refreshListOffset();
			flushScrollMetrics();

			const scrollNode: EventTarget | null = isExternal
				? (target === window ? window : target)
				: null;

			const handleScroll = (event: Event) => {
				scheduleScrollFlush();
				onScrollRef.current?.(event);
			};

			if (scrollNode) {
				scrollNode.addEventListener('scroll', handleScroll, {passive: true});
			}

			const resizeObserver = typeof ResizeObserver !== 'undefined'
				? new ResizeObserver(() => {
					if (disposed) return;
					remasureOffsetAndFlush();
				})
				: null;

			if (target !== window) {
				resizeObserver?.observe(target as HTMLElement);
			}
			resizeObserver?.observe(list);

			window.addEventListener('resize', remasureOffsetAndFlush);

			removeListeners = () => {
				if (scrollNode) {
					scrollNode.removeEventListener('scroll', handleScroll);
				}
				window.removeEventListener('resize', remasureOffsetAndFlush);
				resizeObserver?.disconnect();
			};

			return true;
		};

		if (!attach()) {
			retryRaf = window.requestAnimationFrame(() => {
				if (disposed) return;
				if (!attach() && scrollBindTick < 12) {
					setScrollBindTick((tick) => tick + 1);
				}
			});
		}

		return () => {
			disposed = true;
			if (retryRaf) window.cancelAnimationFrame(retryRaf);
			if (scrollRafRef.current) {
				cancelAnimationFrame(scrollRafRef.current);
				scrollRafRef.current = 0;
			}
			removeListeners?.();
		};
	}, [
		flushScrollMetrics,
		isExternal,
		refreshListOffset,
		resolveScrollTarget,
		scheduleScrollFlush,
		scrollBindTick,
		scrollElement,
		useWindowScroll,
		usesExternalMetrics,
	]);

	useLayoutEffect(() => {
		if (!usesExternalMetrics) return;

		refreshListOffset();

		const metrics = controlledMetrics ?? storeMetrics;
		flushScrollMetrics(metrics);

		const list = rootRef.current;
		const target = resolveScrollTarget();
		const resizeObserver = typeof ResizeObserver !== 'undefined'
			? new ResizeObserver(() => {
				refreshListOffset();
				flushScrollMetrics(controlledMetrics ?? storeMetrics);
			})
			: null;

		if (list) resizeObserver?.observe(list);
		if (target && target !== window) {
			resizeObserver?.observe(target as HTMLElement);
		}

		const onResize = () => {
			refreshListOffset();
			flushScrollMetrics(controlledMetrics ?? storeMetrics);
		};
		window.addEventListener('resize', onResize);

		return () => {
			window.removeEventListener('resize', onResize);
			resizeObserver?.disconnect();
		};
	// eslint-disable-next-line react-hooks/exhaustive-deps -- controlledMetrics / storeMetrics — только примитивные поля
	}, [
		controlledMetrics?.clientHeight,
		controlledMetrics?.scrollTop,
		flushScrollMetrics,
		refreshListOffset,
		resolveScrollTarget,
		storeMetrics.clientHeight,
		storeMetrics.scrollTop,
		usesExternalMetrics,
	]);

	useLayoutEffect(() => {
		flushScrollMetrics(
			usesExternalMetrics
				? (controlledMetrics ?? storeMetrics)
				: undefined,
		);
	// eslint-disable-next-line react-hooks/exhaustive-deps -- controlledMetrics / storeMetrics — только примитивные поля
	}, [
		controlledMetrics?.clientHeight,
		controlledMetrics?.scrollTop,
		count,
		flushScrollMetrics,
		overscan,
		pendingCorrection,
		storeMetrics.clientHeight,
		storeMetrics.scrollTop,
		usesExternalMetrics,
		version,
	]);

	useLayoutEffect(() => {
		measuredRef.current = [];
		scrollCorrectionRef.current = 0;
		pendingCorrectionRef.current = 0;
		// eslint-disable-next-line react-hooks/set-state-in-effect -- сброс measurements при смене items
		setPendingCorrection(0);
		setVersion((value) => value + 1);
	}, [itemsSignature]);

	useLayoutEffect(() => {
		measuredRef.current.length = count;
	}, [count]);

	const assignItemNode = useCallback((index: number, node: HTMLElement | null) => {
		const prev = itemNodesRef.current.get(index);
		if (prev === node) return;

		const existingObserver = observersRef.current.get(index);
		existingObserver?.disconnect();
		observersRef.current.delete(index);
		itemNodesRef.current.delete(index);

		if (!node) return;

		itemNodesRef.current.set(index, node);

		if (typeof ResizeObserver === 'undefined') {
			setMeasuredSize(index, node.offsetHeight);
			return;
		}

		const observer = new ResizeObserver((entries) => {
			const entry = entries[0];
			const borderBox = entry?.borderBoxSize?.[0]?.blockSize;
			const nextSize = borderBox ?? entry?.contentRect.height ?? node.offsetHeight;
			if (nextSize <= 0) return;
			setMeasuredSize(index, nextSize);
		});
		observer.observe(node);
		observersRef.current.set(index, observer);
		setMeasuredSize(index, node.offsetHeight);
	}, [setMeasuredSize]);

	useLayoutEffect(() => () => {
		observersRef.current.forEach((observer) => observer.disconnect());
		observersRef.current.clear();
		itemNodesRef.current.clear();
		if (scrollRafRef.current) cancelAnimationFrame(scrollRafRef.current);
		if (rangeNotifyRafRef.current) cancelAnimationFrame(rangeNotifyRafRef.current);
		if (rangeNotifyIdleRef.current != null) {
			if (typeof cancelIdleCallback === 'function') {
				cancelIdleCallback(rangeNotifyIdleRef.current as number);
			} else {
				clearTimeout(rangeNotifyIdleRef.current as ReturnType<typeof setTimeout>);
			}
		}
	}, []);

	const handleSelfScroll = (event: React.UIEvent<HTMLDivElement>) => {
		if (usesExternalMetrics) return;
		if (scrollCorrectionRef.current !== 0) {
			scrollCorrectionRef.current = 0;
			pendingCorrectionRef.current = 0;
			setPendingCorrection(0);
		}
		scheduleScrollFlush();
		onScrollRef.current?.(event);
	};

	useImperativeHandle(ref, () => ({
		scrollToOffset: (offset: number) => {
			const target = resolveScrollTarget();
			if (!target) return;
			const absolute = isExternal ? listOffsetRef.current + offset : offset;
			setScrollTop(target, Math.max(0, absolute));
			const metrics = getScrollMetrics(target);
			scrollTopRef.current = metrics.scrollTop;
			flushScrollMetrics(metrics);
		},
		scrollToIndex: (index: number, options) => {
			const target = resolveScrollTarget();
			if (!target || count === 0) return;

			const clamped = Math.max(0, Math.min(count - 1, index));
			const itemOffset = offsets[clamped] ?? 0;
			const itemSize = getSize(clamped);
			const align = options?.align ?? 'auto';
			const metrics = getScrollMetrics(target);
			const viewHeight = metrics.clientHeight;
			const baseOffset = isExternal ? listOffsetRef.current : 0;
			const absoluteTop = baseOffset + itemOffset;
			const absoluteEnd = absoluteTop + itemSize;
			const current = scrollTopRef.current || metrics.scrollTop;

			let next = absoluteTop;
			if (align === 'center') {
				next = absoluteTop - (viewHeight - itemSize) / 2;
			} else if (align === 'end') {
				next = absoluteEnd - viewHeight;
			} else if (align === 'auto') {
				if (absoluteTop < current) {
					next = absoluteTop;
				} else if (absoluteEnd > current + viewHeight) {
					next = absoluteEnd - viewHeight;
				} else {
					return;
				}
			}

			setScrollTop(target, Math.max(0, next));
			const after = getScrollMetrics(target);
			scrollTopRef.current = after.scrollTop;
			flushScrollMetrics(after);
		},
		getScrollElement: () => resolveScrollTarget(),
	}), [
		count,
		flushScrollMetrics,
		getSize,
		isExternal,
		offsets,
		resolveScrollTarget
	]);

	const rootClasses = cn(isExternal ? styles.external : styles.viewport, className);

	return (
		<div
			ref={rootRef}
			className={rootClasses}
			style={mergeStyles(isExternal ? undefined : {height}, style)}
			onScroll={isExternal || usesExternalMetrics ? undefined : handleSelfScroll}
			role='list'
			aria-label={ariaLabel ?? t('virtualList.ariaLabel')}
			{...rest}
		>
			<div className={styles.spacer} style={{height: totalSize}}>
				{range.end >= range.start && items.slice(range.start, range.end + 1).map((item, offset) => {
					const index = range.start + offset;
					const top = offsets[index] ?? 0;
					const key = getItemKey?.(item, index) ?? index;

					return (
						<VirtualListItemCell
							key={key}
							item={item}
							index={index}
							top={top}
							count={count}
							itemKey={key}
							invokeRenderItem={invokeRenderItem}
							assignNode={assignItemNode}
						/>
					);
				})}
			</div>
		</div>
	);
}

VirtualListInner.displayName = 'VirtualList';
