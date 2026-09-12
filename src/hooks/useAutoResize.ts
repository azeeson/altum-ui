import {useCallback, useLayoutEffect, type RefObject} from 'react';
import {adjustElementHeight, getTextareaMinHeightPx} from '../utils/autoHeight';

/**
 * Подгоняет высоту элемента под контент (`adjustElementHeight`) и следит за ResizeObserver.
 *
 * @param ref - DOM-узел (textarea).
 * @param options.enabled - Выключить авто-рост.
 * @returns `adjust` — вызвать после clear / программного изменения.
 * @example
 * const adjust = useAutoResize(ref, {enabled: autoResize, minRows, maxHeight, value});
 */
export function useAutoResize(
	ref: RefObject<HTMLElement | null>,
	options: {
		enabled: boolean;
		minRows: number;
		maxHeight?: number | string;
		value: string;
	},
): () => void {
	const {enabled, minRows, maxHeight, value} = options;

	const adjust = useCallback(() => {
		const element = ref.current;
		if (!element || !enabled) return;
		adjustElementHeight(element, {
			minHeightPx: element instanceof HTMLTextAreaElement
				? getTextareaMinHeightPx(element, minRows)
				: 0,
			maxHeight,
		});
	}, [
		enabled,
		maxHeight,
		minRows,
		ref
	]);

	useLayoutEffect(() => {
		adjust();
	}, [adjust, value]);

	useLayoutEffect(() => {
		if (!enabled) return undefined;
		const element = ref.current;
		if (!element || typeof ResizeObserver === 'undefined') return undefined;
		const observer = new ResizeObserver(() => adjust());
		observer.observe(element);
		return () => observer.disconnect();
	}, [adjust, enabled, ref]);

	return adjust;
}
