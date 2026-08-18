import {type RefObject, useEffect, useRef} from 'react';
import {useDocumentKeyDown} from './useDocumentKeyDown';
import {useEscapeKey} from './useEscapeKey';
import {
	FOCUSABLE_SELECTOR,
	handleTabCycle,
	queryFocusableElements,
} from '../utils/focus';
import {focusElement} from '../utils/a11y';
import {isKey} from '../utils/keyboard';

/**
 * Опции хука `useFocusTrap`.
 */
export interface UseFocusTrapOptions {
	active: boolean;
	/** Контейнер, внутри которого крутится Tab */
	containerRef: RefObject<HTMLElement | null>;
	/** Элемент для начального фокуса (иначе — первый focusable) */
	initialFocusRef?: RefObject<HTMLElement | null>;
	/** Куда вернуть фокус при деактивации (иначе — элемент до активации) */
	returnFocusRef?: RefObject<HTMLElement | null>;
	/**
	 * Возвращать фокус при деактивации.
	 * Выключайте, если restore делает `useOverlayPanel` / `useFocusRestore`.
	 * @default true
	 */
	restoreFocus?: boolean;
	/** Escape внутри ловушки */
	onEscape?: () => void;
}

/**
 * Ловушка фокуса без обёртки-компонента: Tab циклится внутри `containerRef`.
 * Подходит для уже существующего DOM (CommandPalette, кастомные панели).
 * Escape опционально через `onEscape`.
 *
 * @param options - `active`, `containerRef`, focus refs, `restoreFocus`, `onEscape`.
 *
 * @returns Ничего — ловушка Tab и опциональный Escape.
 *
 * @example
 * useFocusTrap({
 *   active: open,
 *   containerRef,
 *   initialFocusRef: inputRef,
 *   onEscape: () => setOpen(false),
 * });
 */
export function useFocusTrap({
	active,
	containerRef,
	initialFocusRef,
	returnFocusRef,
	restoreFocus = true,
	onEscape,
}: UseFocusTrapOptions): void {
	const previousFocusRef = useRef<HTMLElement | null>(null);
	const wasActiveRef = useRef(false);

	useEffect(() => {
		if (active) {
			if (!wasActiveRef.current) {
				previousFocusRef.current = document.activeElement as HTMLElement | null;
			}
			wasActiveRef.current = true;

			const container = containerRef.current;
			if (!container) return;

			const initial = initialFocusRef?.current;
			if (initial && container.contains(initial)) {
				focusElement(initial);
				return;
			}

			const focusable = queryFocusableElements(container, FOCUSABLE_SELECTOR);
			focusElement(focusable[0] ?? container);
			return;
		}

		if (wasActiveRef.current) {
			wasActiveRef.current = false;
			if (restoreFocus) {
				const restoreTarget = returnFocusRef?.current ?? previousFocusRef.current;
				focusElement(restoreTarget);
			}
			previousFocusRef.current = null;
		}
	}, [
		active,
		containerRef,
		initialFocusRef,
		returnFocusRef,
		restoreFocus,
	]);

	useDocumentKeyDown((event) => {
		if (!isKey(event, 'Tab')) return;

		const container = containerRef.current;
		if (!container) return;

		const focusable = queryFocusableElements(container, FOCUSABLE_SELECTOR);
		if (focusable.length === 0) {
			event.preventDefault();
			return;
		}
		handleTabCycle(event, focusable, {wrap: true});
	}, {enabled: active});

	useEscapeKey(() => {
		onEscape?.();
	}, {enabled: active && !!onEscape});
}
