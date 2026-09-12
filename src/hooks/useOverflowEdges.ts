import {useCallback, useEffect, useRef, useState, type RefObject} from 'react';

/**
 * Следит, есть ли у скролл-контейнера скрытый контент на старте и в конце оси X.
 *
 * @param enabled - Когда `false`, края считаются пустыми и слушатели не вешаются.
 * @returns `ref` контейнера и флаги `start` / `end`.
 *
 * @example
 * const {ref, start, end} = useOverflowEdges(layout === 'scrollX');
 */
export function useOverflowEdges<T extends HTMLElement>(
	enabled: boolean,
): {
	ref: RefObject<T>;
	start: boolean;
	end: boolean;
} {
	const ref = useRef<T>(null);
	const [start, setStart] = useState(false);
	const [end, setEnd] = useState(false);

	const update = useCallback(() => {
		const el = ref.current;
		if (!el || !enabled) {
			setStart(false);
			setEnd(false);
			return;
		}
		const {scrollLeft, scrollWidth, clientWidth} = el;
		const maxScroll = scrollWidth - clientWidth;
		setStart(scrollLeft > 2);
		setEnd(maxScroll > 2 && scrollLeft < maxScroll - 2);
	}, [enabled]);

	useEffect(() => {
		update();
		const el = ref.current;
		if (!el || !enabled) return undefined;
		el.addEventListener('scroll', update, {passive: true});
		const ro = typeof ResizeObserver !== 'undefined'
			? new ResizeObserver(update)
			: null;
		ro?.observe(el);
		const mo = typeof MutationObserver !== 'undefined'
			? new MutationObserver(update)
			: null;
		mo?.observe(el, {
			childList: true,
			subtree: true,
		});
		return () => {
			el.removeEventListener('scroll', update);
			ro?.disconnect();
			mo?.disconnect();
		};
	}, [enabled, update]);

	return {
		ref,
		start,
		end
	};
}
