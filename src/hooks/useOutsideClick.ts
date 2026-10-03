import {useEffect, useRef, type RefObject} from 'react';

/**
 * Опции хука `useOutsideClick`.
 */
export interface UseOutsideClickOptions {
	/** Слушать клики только пока `true` (`true` по умолчанию) */
	enabled?: boolean;
}

type OutsideClickTarget = RefObject<HTMLElement | null>;

const isRefList = (
	refs: OutsideClickTarget | readonly OutsideClickTarget[],
): refs is readonly OutsideClickTarget[] => Array.isArray(refs);

const normalizeRefs = (
	refs: OutsideClickTarget | readonly OutsideClickTarget[],
): readonly OutsideClickTarget[] => (isRefList(refs) ? refs : [refs]);

/**
 * Вызывает callback при `mousedown` / `touchstart` вне одного или нескольких ref.
 * Подписка снимается при `enabled: false` и при размонтировании.
 *
 * @param refs - Контейнер(ы), клик внутри которых не считается внешним.
 * @param callback - Обработчик внешнего клика.
 * @param options - `enabled` выключает слушатели без размонтирования.
 *
 * @example
 * const panelRef = useRef<HTMLDivElement>(null);
 * useOutsideClick(panelRef, () => setOpen(false), {enabled: open});
 */
export function useOutsideClick(
	refs: OutsideClickTarget | readonly OutsideClickTarget[],
	callback: (event: MouseEvent | TouchEvent) => void,
	options: UseOutsideClickOptions = {},
): void {
	const {enabled = true} = options;
	const savedCallback = useRef(callback);
	const savedRefs = useRef(normalizeRefs(refs));

	useEffect(() => {
		savedCallback.current = callback;
		savedRefs.current = normalizeRefs(refs);
	});

	useEffect(() => {
		if (!enabled) return;

		const handler = (event: MouseEvent | TouchEvent) => {
			const isClickInsideAny = savedRefs.current.some((ref) => {
				const element = ref.current;
				return element?.contains(event.target as Node);
			});

			if (!isClickInsideAny) {
				savedCallback.current(event);
			}
		};

		document.addEventListener('mousedown', handler);
		document.addEventListener('touchstart', handler);

		return () => {
			document.removeEventListener('mousedown', handler);
			document.removeEventListener('touchstart', handler);
		};
	}, [enabled]);
}
