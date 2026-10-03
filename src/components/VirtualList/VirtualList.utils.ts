import type {
	MountRange,
	ScrollTarget,
	VirtualListAlign,
	VirtualListRange,
	VirtualScrollMetrics,
} from './VirtualList.types';

export const DEFAULT_ESTIMATE = 48;
export const DEFAULT_OVERSCAN = 4;

export function cancelIdleTask(id: number | ReturnType<typeof setTimeout> | null): void {
	if (id == null) return;
	if (typeof cancelIdleCallback === 'function') cancelIdleCallback(id as number);
	else clearTimeout(id);
}

export function scheduleIdleTask(run: () => void): number | ReturnType<typeof setTimeout> {
	if (typeof requestIdleCallback === 'function') return requestIdleCallback(run);
	return setTimeout(run, 0);
}

export function resolveEstimate(
	estimateSize: number | ((index: number) => number) | undefined,
	index: number,
): number {
	if (typeof estimateSize === 'function') {
		return Math.max(1, estimateSize(index));
	}
	return Math.max(1, estimateSize ?? DEFAULT_ESTIMATE);
}

function findStartIndex(offsets: number[], scrollTop: number): number {
	let low = 0;
	let high = offsets.length - 1;
	let result = 0;

	while (low <= high) {
		const mid = (low + high) >>> 1;
		if (offsets[mid]! <= scrollTop) {
			result = mid;
			low = mid + 1;
		} else {
			high = mid - 1;
		}
	}

	return result;
}

export function unwrapScrollElement(
	scrollElement: HTMLElement | null | React.RefObject<HTMLElement | null> | undefined,
): HTMLElement | null {
	if (!scrollElement) return null;
	if (typeof scrollElement === 'object' && 'current' in scrollElement) {
		return scrollElement.current;
	}
	return scrollElement;
}

export function getScrollMetrics(target: ScrollTarget): VirtualScrollMetrics {
	if (target === window) {
		return {
			scrollTop: window.scrollY || document.documentElement.scrollTop,
			clientHeight: window.innerHeight,
		};
	}
	const element = target as HTMLElement;
	return {
		scrollTop: element.scrollTop,
		clientHeight: element.clientHeight,
	};
}

export function setScrollTop(target: ScrollTarget, value: number) {
	if (target === window) {
		window.scrollTo({top: value});
		return;
	}
	(target as HTMLElement).scrollTop = value;
}

/** Offset списка внутри scroll-content (scrollMargin). */
export function getListOffsetInScrollParent(
	list: HTMLElement,
	scrollParent: ScrollTarget,
): number {
	if (scrollParent === window) {
		return list.getBoundingClientRect().top
			+ (window.scrollY || document.documentElement.scrollTop);
	}

	const parent = scrollParent as HTMLElement;
	const parentRect = parent.getBoundingClientRect();
	const listRect = list.getBoundingClientRect();
	return listRect.top - parentRect.top + parent.scrollTop;
}

export function buildOffsets(
	count: number,
	getSize: (index: number) => number,
	gap: number,
): {
	list: number[];
	total: number;
} {
	const list = new Array<number>(count);
	let offset = 0;
	for (let index = 0; index < count; index += 1) {
		list[index] = offset;
		offset += Math.max(1, getSize(index)) + (index < count - 1 ? gap : 0);
	}
	return {
		list,
		total: count === 0 ? 0 : offset,
	};
}

/** Оценка или уже измеренная высота строки. */
export function resolveItemSize(
	measured: Array<number | undefined>,
	estimateSize: number | ((index: number) => number) | undefined,
	index: number,
): number {
	const size = measured[index];
	if (size != null && size > 0) return size;
	return resolveEstimate(estimateSize, index);
}

export function toReportedRange(
	mount: MountRange,
	count: number,
	mode: 'visible' | 'withOverscan',
): VirtualListRange {
	if (mode === 'withOverscan') {
		return {
			start: count === 0 ? 0 : mount.start,
			end: count === 0 ? -1 : mount.end,
			count,
		};
	}
	return {
		start: count === 0 ? 0 : mount.visibleStart,
		end: count === 0 ? -1 : mount.visibleEnd,
		count,
	};
}

/**
 * Куда поставить `scrollTop`, чтобы строка встала по `align`.
 * `null` — для `auto`, если строка уже целиком во вьюпорте.
 */
export function resolveAlignedScrollTop(options: {
	absoluteTop: number;
	itemSize: number;
	viewHeight: number;
	current: number;
	align: VirtualListAlign;
}): number | null {
	const {absoluteTop, itemSize, viewHeight, current, align} = options;
	const absoluteEnd = absoluteTop + itemSize;
	if (align === 'center') return absoluteTop - (viewHeight - itemSize) / 2;
	if (align === 'end') return absoluteEnd - viewHeight;
	if (align === 'start') return absoluteTop;
	if (absoluteTop < current) return absoluteTop;
	if (absoluteEnd > current + viewHeight) return absoluteEnd - viewHeight;
	return null;
}

export function computeMountRange(options: {
	count: number;
	offsets: number[];
	getSize: (index: number) => number;
	overscan: number;
	relativeScroll: number;
	viewportHeight: number;
}): MountRange {
	const {
		count,
		offsets,
		getSize,
		overscan,
		relativeScroll,
		viewportHeight,
	} = options;

	if (count === 0) {
		return {
			visibleStart: 0,
			visibleEnd: -1,
			start: 0,
			end: -1,
		};
	}

	const viewH = viewportHeight > 0 ? viewportHeight : 1;
	const visibleStart = findStartIndex(offsets, Math.max(0, relativeScroll));
	let visibleEnd = visibleStart;
	const bottom = relativeScroll + viewH;

	while (visibleEnd < count - 1 && offsets[visibleEnd]! + getSize(visibleEnd) < bottom) {
		visibleEnd += 1;
	}

	return {
		visibleStart,
		visibleEnd,
		start: Math.max(0, visibleStart - overscan),
		end: Math.min(count - 1, visibleEnd + overscan),
	};
}
