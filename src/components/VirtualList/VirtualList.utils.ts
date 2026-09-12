import type {MountRange, ScrollTarget, VirtualScrollMetrics} from './VirtualList.types';

export const DEFAULT_ESTIMATE = 48;
export const DEFAULT_OVERSCAN = 4;
const EMPTY_METRICS: VirtualScrollMetrics = {
	scrollTop: 0,
	clientHeight: 0,
};

export function noopSubscribe(): () => void {
	return () => undefined;
}

export function noopGetSnapshot(): VirtualScrollMetrics {
	return EMPTY_METRICS;
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

export function rangesEqual(a: MountRange, b: MountRange): boolean {
	return a.start === b.start
		&& a.end === b.end
		&& a.visibleStart === b.visibleStart
		&& a.visibleEnd === b.visibleEnd;
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
