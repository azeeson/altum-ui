import {type RefObject} from 'react';
import {useFocusRestore} from './useFocusRestore';
import {useInertSiblings} from './useInertSiblings';

/**
 * Опции хука `useOverlayPanel`.
 */
export interface UseOverlayPanelOptions {
	active: boolean;
	/** Корень портала панели (sibling'и родителя получат `inert`) */
	rootRef: RefObject<HTMLElement | null>;
	/**
	 * Возврат фокуса при закрытии.
	 * Выключайте, если restore уже делает FocusTrap / useFocusTrap.
	 * @default true
	 */
	restoreFocus?: boolean;
}

/**
 * Единый паттерн для overlay-панелей: inert фона + опционально restore focus.
 * Комбинирует `useInertSiblings` и `useFocusRestore`.
 *
 * @param options.active - Панель открыта.
 * @param options.rootRef - Корень портала.
 * @param options.restoreFocus - Возврат фокуса при закрытии (`true` по умолчанию).
 *
 * @returns Ничего — inert фона и опциональный restore focus.
 *
 * @example
 * useOverlayPanel({active: isOpen, rootRef, restoreFocus: true});
 */
export function useOverlayPanel({
	active,
	rootRef,
	restoreFocus = true,
}: UseOverlayPanelOptions): void {
	useFocusRestore(restoreFocus && active);
	useInertSiblings(active, rootRef);
}
