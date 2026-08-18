import {
	useEffect,
	useLayoutEffect,
	useRef,
} from 'react';
import {focusElement} from '../utils/a11y';

/**
 * Сохраняет фокус при активации (в `useLayoutEffect` — до ловушек в `useEffect`)
 * и возвращает его только при переходе `true` → `false`.
 * Используйте для overlay, где FocusTrap сам restore не делает.
 *
 * @param active - Панель открыта.
 *
 * @returns Ничего — сохранение и возврат фокуса.
 *
 * @example
 * useFocusRestore(isOpen);
 */
export function useFocusRestore(active: boolean): void {
	const previousFocusRef = useRef<HTMLElement | null>(null);
	const wasActiveRef = useRef(false);

	useLayoutEffect(() => {
		if (active && !wasActiveRef.current) {
			previousFocusRef.current = document.activeElement as HTMLElement | null;
			wasActiveRef.current = true;
		}
	}, [active]);

	useEffect(() => {
		if (active || !wasActiveRef.current) return;

		wasActiveRef.current = false;
		focusElement(previousFocusRef.current);
		previousFocusRef.current = null;
	}, [active]);
}
