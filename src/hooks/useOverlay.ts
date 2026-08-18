import {type RefObject, useRef} from 'react';
import {useBodyScrollLock} from './useBodyScrollLock';
import {useEscapeKey} from './useEscapeKey';
import {useOverlayPanel} from './useOverlayPanel';

/**
 * Опции хука `useOverlay`.
 */
export interface UseOverlayOptions {
	/** Overlay открыт. */
	open: boolean;
	/** Закрытие по Escape. @default true */
	closeOnEscape?: boolean;
	/** Блокировать scroll body. @default true */
	lockScroll?: boolean;
	/** Корень портала для inert фона. */
	rootRef?: RefObject<HTMLElement | null>;
	/** Возврат фокуса при закрытии. @default true */
	restoreFocus?: boolean;
}

/**
 * Композиция overlay-паттерна: scroll lock + Escape + inert + restore focus.
 * Используется в Modal, Sheet, CommandPalette, ImageLightbox, ImageCrop.
 */
export function useOverlay(
	onClose: () => void,
	{
		open,
		closeOnEscape = true,
		lockScroll = true,
		rootRef: rootRefProp,
		restoreFocus = true,
	}: UseOverlayOptions,
): void {
	const fallbackRef = useRef<HTMLElement | null>(null);
	const rootRef = rootRefProp ?? fallbackRef;

	useBodyScrollLock(lockScroll && open);
	useEscapeKey(onClose, {enabled: closeOnEscape && open});
	useOverlayPanel({
		active: open && rootRefProp != null,
		rootRef,
		restoreFocus: rootRefProp != null && restoreFocus,
	});
}
