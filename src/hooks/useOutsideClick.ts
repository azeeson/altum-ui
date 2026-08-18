import {useEffect, useRef, type RefObject} from 'react';
import {shouldIgnoreOverlayDismiss} from '../utils/overlayDismiss';

/**
 * Опции хука `useOutsideClick`.
 */
export interface UseOutsideClickOptions {
	/** Подписываться только пока `true` (`true` по умолчанию) */
	enabled?: boolean;
}

type OutsideClickTarget = RefObject<HTMLElement | null>;

const normalizeRefs = (
	refs: OutsideClickTarget | OutsideClickTarget[],
): OutsideClickTarget[] => (Array.isArray(refs) ? refs : [refs]);

/**
 * Вызывает callback при mousedown/touchstart вне одного или нескольких ref.
 * Игнорирует клики, пока активен «suppress overlay dismiss» (см. `overlayDismiss`).
 * Подписка снимается при `enabled: false` и при размонтировании.
 *
 * @param refs - Контейнер(ы), клик внутри которых не считается «снаружи».
 * @param callback - Обработчик внешнего клика.
 * @param options.enabled - Выключить слушатели без размонтирования.
 *
 * @returns Ничего — подписка на mousedown/touchstart вне ref.
 *
 * @example
 * const panelRef = useRef<HTMLDivElement>(null);
 * useOutsideClick(panelRef, () => setOpen(false), {enabled: open});
 */
export function useOutsideClick(
	refs: OutsideClickTarget | OutsideClickTarget[],
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
			if (shouldIgnoreOverlayDismiss()) {
				return;
			}

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
