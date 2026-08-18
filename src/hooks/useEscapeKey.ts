import {useCallback, useEffect, useRef} from 'react';
import {isKey} from '../utils/keyboard';
import {
	isTopOverlayEscapeHandler,
	popOverlayEscapeHandler,
	pushOverlayEscapeHandler,
	updateOverlayEscapeHandler,
} from '../utils/overlayEscapeStack';
import {type DocumentKeyDownTarget, useDocumentKeyDown} from './useDocumentKeyDown';

/**
 * Опции хука `useEscapeKey`.
 */
export interface UseEscapeKeyOptions {
	enabled?: boolean;
	target?: DocumentKeyDownTarget;
	/**
	 * Участвовать в стеке overlay: Escape закрывает только верхний слой.
	 * @default true
	 */
	layered?: boolean;
}

/**
 * Вызывает `onEscape` на клавишу Escape (с `preventDefault`).
 * При `layered` (дефолт) закрывается только верхний overlay в стеке.
 *
 * @param onEscape - Действие закрытия.
 * @param options.enabled - Пока `false`, слушатель не активен.
 *
 * @example
 * useEscapeKey(() => setOpen(false), {enabled: open});
 */
export function useEscapeKey(
	onEscape: () => void,
	options: UseEscapeKeyOptions = {},
): void {
	const {enabled = true, target = 'document', layered = true} = options;
	const stackIdRef = useRef<number | null>(null);
	const onEscapeRef = useRef(onEscape);

	useEffect(() => {
		onEscapeRef.current = onEscape;
	}, [onEscape]);

	useEffect(() => {
		if (!enabled || !layered) {
			return undefined;
		}

		const id = pushOverlayEscapeHandler(() => {
			onEscapeRef.current();
		});
		stackIdRef.current = id;
		return () => {
			popOverlayEscapeHandler(id);
			if (stackIdRef.current === id) {
				stackIdRef.current = null;
			}
		};
	}, [enabled, layered]);

	useEffect(() => {
		const id = stackIdRef.current;
		if (id == null || !layered || !enabled) return;
		updateOverlayEscapeHandler(id, () => {
			onEscapeRef.current();
		});
	}, [onEscape, layered, enabled]);

	const handleKeyDown = useCallback((event: KeyboardEvent) => {
		if (!isKey(event, 'Escape')) {
			return;
		}

		if (layered) {
			const id = stackIdRef.current;
			if (id == null || !isTopOverlayEscapeHandler(id)) {
				return;
			}
		}

		event.preventDefault();
		onEscapeRef.current();
	}, [layered]);

	useDocumentKeyDown(handleKeyDown, {
		enabled,
		target,
	});
}
