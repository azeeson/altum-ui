import {useEffect, type RefObject} from 'react';

/**
 * При фокусе потомка скроллит его в видимую область контейнера (`inline` + `block`: nearest).
 *
 * @param ref - Скролл-контейнер.
 * @param enabled - Когда `false`, слушатель не вешается.
 *
 * @example
 * useScrollFocusedChildIntoView(scrollerRef, layout === 'scrollX');
 */
export function useScrollFocusedChildIntoView(
	ref: RefObject<HTMLElement | null>,
	enabled: boolean,
): void {
	useEffect(() => {
		if (!enabled) return undefined;
		const el = ref.current;
		if (!el) return undefined;
		const onFocusIn = (event: FocusEvent) => {
			const target = event.target;
			if (!(target instanceof HTMLElement) || !el.contains(target)) return;
			target.scrollIntoView({
				inline: 'nearest',
				block: 'nearest',
			});
		};
		el.addEventListener('focusin', onFocusIn);
		return () => el.removeEventListener('focusin', onFocusIn);
	}, [enabled, ref]);
}
