import {useCallback, useEffect, useRef} from 'react';
import {useEscapeKey} from '../../hooks/useEscapeKey';
import {useOutsideClick} from '../../hooks/useOutsideClick';
import {useOverlay} from '../../hooks/useOverlay';
import {
	claimHoverTriggerOpen,
	createHoverTriggerId,
	registerHoverTrigger,
	releaseHoverTrigger,
} from '../../utils/hoverTriggerGroup';
import type {OverlayPurpose} from '../../utils/overlayPurpose';
import type {OverlayTriggerMode} from './Overlay.types';

function pointInRect(rect: DOMRect, x: number, y: number, pad = 0): boolean {
	return (
		x >= rect.left - pad
		&& x <= rect.right + pad
		&& y >= rect.top - pad
		&& y <= rect.bottom + pad
	);
}

/**
 * Слушатели на targetRef должны жить даже когда панель размонтирована
 * (`shouldRender=false`), иначе click/hover никогда не откроют Overlay.
 *
 * Для `purpose === 'tooltip'` открытия по наведению идут через глобальный мьютекс,
 * чтобы одновременно была видна не больше одной подсказки.
 */
export function useAnchorTrigger({
	enabled,
	open,
	targetRef,
	contentRef,
	triggerMode,
	purpose,
	openDelay,
	closeDelay,
	requestOpen,
}: {
	enabled: boolean;
	open: boolean;
	targetRef: React.RefObject<HTMLElement | null>;
	contentRef: React.RefObject<HTMLElement | null>;
	triggerMode: OverlayTriggerMode;
	purpose?: OverlayPurpose;
	openDelay: number;
	closeDelay: number;
	requestOpen: (next: boolean) => void;
}) {
	const pointerRef = useRef<{
		x: number;
		y: number
	} | null>(null);
	const openTimerRef = useRef<number | null>(null);
	const closeTimerRef = useRef<number | null>(null);
	const hoverIdRef = useRef<string | null>(null);
	const requestOpenRef = useRef(requestOpen);
	useEffect(() => {
		requestOpenRef.current = requestOpen;
	}, [requestOpen]);

	const useHoverMutex = purpose === 'tooltip' && triggerMode === 'hover';

	const clearTimers = useCallback(() => {
		if (openTimerRef.current != null) {
			window.clearTimeout(openTimerRef.current);
			openTimerRef.current = null;
		}
		if (closeTimerRef.current != null) {
			window.clearTimeout(closeTimerRef.current);
			closeTimerRef.current = null;
		}
	}, []);

	const openHover = useCallback((next: boolean) => {
		if (useHoverMutex && hoverIdRef.current) {
			if (next) {
				claimHoverTriggerOpen(hoverIdRef.current, 0);
			} else {
				releaseHoverTrigger(hoverIdRef.current);
			}
		}
		requestOpenRef.current(next);
	}, [useHoverMutex]);

	useEffect(() => {
		if (!useHoverMutex) return;
		const id = createHoverTriggerId();
		hoverIdRef.current = id;
		const unregister = registerHoverTrigger(id, () => {
			clearTimers();
			requestOpenRef.current(false);
		});
		return () => {
			unregister();
			hoverIdRef.current = null;
		};
	}, [clearTimers, useHoverMutex]);

	useEffect(() => {
		if (!enabled || triggerMode === 'manual') return;
		const trigger = targetRef.current;
		if (!trigger) return;

		const notePointer = (x: number, y: number) => {
			pointerRef.current = {
				x,
				y
			};
		};

		const scheduleOpen = () => {
			clearTimers();
			if (triggerMode !== 'hover') {
				requestOpen(true);
				return;
			}
			let delay = openDelay;
			if (useHoverMutex && hoverIdRef.current) {
				delay = claimHoverTriggerOpen(hoverIdRef.current, openDelay);
			}
			if (delay <= 0) {
				openHover(true);
				return;
			}
			openTimerRef.current = window.setTimeout(() => openHover(true), delay);
		};

		const scheduleClose = () => {
			clearTimers();
			if (triggerMode !== 'hover') {
				requestOpen(false);
				return;
			}
			closeTimerRef.current = window.setTimeout(() => openHover(false), closeDelay);
		};

		const onClick = () => {
			if (triggerMode !== 'click') return;
			requestOpen(!open);
		};

		const onPointerEnter = (event: PointerEvent) => {
			if (triggerMode !== 'hover') return;
			notePointer(event.clientX, event.clientY);
			scheduleOpen();
		};

		const onPointerLeave = () => {
			if (triggerMode !== 'hover') return;
			scheduleClose();
		};

		const onPointerMove = (event: PointerEvent) => {
			if (triggerMode !== 'hover') return;
			notePointer(event.clientX, event.clientY);
		};

		const onFocus = () => {
			if (triggerMode !== 'hover') return;
			scheduleOpen();
		};

		const onBlur = (event: FocusEvent) => {
			if (triggerMode !== 'hover') return;
			const next = event.relatedTarget as Node | null;
			if (next && (trigger.contains(next) || contentRef.current?.contains(next))) return;
			scheduleClose();
		};

		if (triggerMode === 'click') {
			trigger.addEventListener('click', onClick);
		} else {
			trigger.addEventListener('pointerenter', onPointerEnter);
			trigger.addEventListener('pointerleave', onPointerLeave);
			trigger.addEventListener('pointermove', onPointerMove);
			trigger.addEventListener('focusin', onFocus);
			trigger.addEventListener('focusout', onBlur);
		}

		return () => {
			clearTimers();
			trigger.removeEventListener('click', onClick);
			trigger.removeEventListener('pointerenter', onPointerEnter);
			trigger.removeEventListener('pointerleave', onPointerLeave);
			trigger.removeEventListener('pointermove', onPointerMove);
			trigger.removeEventListener('focusin', onFocus);
			trigger.removeEventListener('focusout', onBlur);
		};
	}, [
		clearTimers,
		closeDelay,
		contentRef,
		enabled,
		open,
		openDelay,
		openHover,
		requestOpen,
		targetRef,
		triggerMode,
		useHoverMutex,
	]);

	// Hover: закрыть, если после scroll/resize курсор больше не над trigger/content.
	useEffect(() => {
		if (!enabled || !open || triggerMode !== 'hover') return;

		const syncHover = () => {
			const trigger = targetRef.current;
			const pointer = pointerRef.current;
			if (!trigger || !pointer) return;
			if (pointInRect(trigger.getBoundingClientRect(), pointer.x, pointer.y, 1)) return;
			const contentEl = contentRef.current;
			if (contentEl && pointInRect(contentEl.getBoundingClientRect(), pointer.x, pointer.y, 1)) {
				return;
			}
			openHover(false);
		};

		window.addEventListener('scroll', syncHover, true);
		window.addEventListener('resize', syncHover);
		return () => {
			window.removeEventListener('scroll', syncHover, true);
			window.removeEventListener('resize', syncHover);
		};
	}, [
		contentRef,
		enabled,
		open,
		openHover,
		targetRef,
		triggerMode,
	]);

	return {
		pointerRef,
		clearTimers,
		closeTimerRef,
		openHover,
		useHoverMutex,
	};
}

/** Escape + outside-click для anchor-слоёв (popover / dropdown). */
export function useAnchorDismiss({
	open,
	targetRef,
	contentRef,
	triggerMode,
	closeOnOutsideClick,
	closeOnEscape,
	requestOpen,
}: {
	open: boolean;
	targetRef: React.RefObject<HTMLElement | null>;
	contentRef: React.RefObject<HTMLElement | null>;
	triggerMode: OverlayTriggerMode;
	closeOnOutsideClick?: boolean;
	closeOnEscape?: boolean;
	requestOpen: (next: boolean) => void;
}) {
	const resolvedCloseOnOutside = closeOnOutsideClick ?? (triggerMode === 'click');
	const resolvedCloseOnEscape = closeOnEscape ?? triggerMode !== 'hover';

	useOutsideClick(
		[targetRef, contentRef],
		() => requestOpen(false),
		{enabled: open && resolvedCloseOnOutside},
	);
	useEscapeKey(() => requestOpen(false), {enabled: open && resolvedCloseOnEscape});
}

/** Escape + outside-click + scroll-lock для floating / sheet с backdrop. */
export function useScrimLayerDismiss({
	open,
	onClose,
	contentRef,
	rootRef,
	backdrop,
	closeOnOutsideClick,
	closeOnEscape,
	lockScroll,
}: {
	open: boolean;
	onClose: () => void;
	contentRef: React.RefObject<HTMLElement | null>;
	rootRef: React.RefObject<HTMLDivElement | null>;
	backdrop: boolean;
	closeOnOutsideClick?: boolean;
	closeOnEscape?: boolean;
	lockScroll?: boolean;
}) {
	const resolvedCloseOnOutside = closeOnOutsideClick ?? backdrop;
	const resolvedLockScroll = lockScroll ?? backdrop;

	useEscapeKey(onClose, {enabled: closeOnEscape !== false && open});
	useOutsideClick(
		[contentRef],
		onClose,
		{enabled: resolvedCloseOnOutside && !backdrop && open},
	);
	useOverlay(onClose, {
		open: open && (backdrop || resolvedLockScroll),
		closeOnEscape: false,
		lockScroll: resolvedLockScroll && open,
		rootRef: backdrop ? rootRef : undefined,
	});

	return {resolvedCloseOnOutside};
}

/** Inert / scroll-lock для modal (без Escape — закрытие через Backdrop). */
export function useModalDismiss({
	open,
	onClose,
	rootRef,
}: {
	open: boolean;
	onClose: () => void;
	rootRef: React.RefObject<HTMLDivElement | null>;
}) {
	// Inert / блокировка скролла / Escape следуют за `open`, а не за окном размонтирования на выходе.
	useOverlay(onClose, {
		open,
		rootRef,
		lockScroll: open,
	});
}
