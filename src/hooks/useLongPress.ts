import {
	useCallback,
	useEffect,
	useRef,
	type MouseEvent as ReactMouseEvent,
	type PointerEvent as ReactPointerEvent,
} from 'react';

export interface UseLongPressOptions {
	/** Задержка до срабатывания, мс. @default 500 */
	delay?: number;
	/** Не запускать long-press. */
	disabled?: boolean;
	/**
	 * Смещение (px), после которого жест отменяется.
	 * Слушается на `window`, чтобы срабатывать даже при nested touch/swipe.
	 * @default 10
	 */
	moveThreshold?: number;
}

export interface UseLongPressHandlers {
	onPointerDown: (event: ReactPointerEvent) => void;
	onPointerUp: (event: ReactPointerEvent) => void;
	onPointerCancel: (event: ReactPointerEvent) => void;
	onContextMenu: (event: ReactMouseEvent) => void;
	onClick: (event: ReactMouseEvent) => void;
	/** Сбросить таймер (например, при начале горизонтального свайпа). */
	cancel: () => void;
}

const CLICK_SUPPRESS_MS = 400;

/**
 * Long-press (удержание): вызывает `onLongPress` после `delay` мс.
 * Движение отслеживается на `window` (pointer + touch), чтобы nested
 * `touchmove` / `preventDefault` у свайпа не оставляли таймер живым.
 * После срабатывания подавляет следующий `click` (capture + `onClick`).
 */
export function useLongPress(
	onLongPress: () => void,
	options: UseLongPressOptions = {},
): UseLongPressHandlers {
	const {
		delay = 500,
		disabled = false,
		moveThreshold = 10,
	} = options;

	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const startRef = useRef<{
		x: number;
		y: number
	} | null>(null);
	const firedRef = useRef(false);
	const suppressClickRef = useRef(false);
	const onLongPressRef = useRef(onLongPress);
	useEffect(() => {
		onLongPressRef.current = onLongPress;
	});
	const cleanupWindowRef = useRef<(() => void) | null>(null);
	const suppressCleanupRef = useRef<(() => void) | null>(null);

	const detachWindow = useCallback(() => {
		cleanupWindowRef.current?.();
		cleanupWindowRef.current = null;
	}, []);

	const clearClickSuppress = useCallback(() => {
		suppressCleanupRef.current?.();
		suppressCleanupRef.current = null;
	}, []);

	const armClickSuppress = useCallback(() => {
		clearClickSuppress();
		suppressClickRef.current = true;

		const suppress = (event: MouseEvent) => {
			event.preventDefault();
			event.stopPropagation();
			event.stopImmediatePropagation();
			suppressClickRef.current = false;
			clearClickSuppress();
		};

		window.addEventListener('click', suppress, true);
		const timer = window.setTimeout(() => {
			suppressClickRef.current = false;
			clearClickSuppress();
		}, CLICK_SUPPRESS_MS);

		suppressCleanupRef.current = () => {
			window.removeEventListener('click', suppress, true);
			window.clearTimeout(timer);
		};
	}, [clearClickSuppress]);

	const clear = useCallback(() => {
		if (timerRef.current != null) {
			clearTimeout(timerRef.current);
			timerRef.current = null;
		}
		startRef.current = null;
		detachWindow();
	}, [detachWindow]);

	useEffect(() => () => {
		clear();
		clearClickSuppress();
	}, [clear, clearClickSuppress]);

	const cancel = useCallback(() => {
		clear();
	}, [clear]);

	const onPointerDown = useCallback((event: ReactPointerEvent) => {
		if (disabled || event.button > 0) return;

		firedRef.current = false;
		const start = {
			x: event.clientX,
			y: event.clientY
		};
		startRef.current = start;
		detachWindow();

		if (timerRef.current != null) {
			clearTimeout(timerRef.current);
			timerRef.current = null;
		}

		timerRef.current = setTimeout(() => {
			firedRef.current = true;
			timerRef.current = null;
			detachWindow();
			armClickSuppress();
			onLongPressRef.current();
		}, delay);

		const movedPastThreshold = (clientX: number, clientY: number) => {
			if (!startRef.current || timerRef.current == null) return;
			const dx = clientX - start.x;
			const dy = clientY - start.y;
			if (Math.hypot(dx, dy) > moveThreshold) {
				clear();
			}
		};

		const onWinPointerMove = (ev: PointerEvent) => {
			movedPastThreshold(ev.clientX, ev.clientY);
		};

		const onWinTouchMove = (ev: TouchEvent) => {
			const touch = ev.touches[0];
			if (!touch) return;
			movedPastThreshold(touch.clientX, touch.clientY);
		};

		const onWinEnd = () => {
			clear();
		};

		window.addEventListener('pointermove', onWinPointerMove);
		window.addEventListener('pointerup', onWinEnd);
		window.addEventListener('pointercancel', onWinEnd);
		window.addEventListener('touchmove', onWinTouchMove, {passive: true});
		window.addEventListener('touchend', onWinEnd);
		window.addEventListener('touchcancel', onWinEnd);

		cleanupWindowRef.current = () => {
			window.removeEventListener('pointermove', onWinPointerMove);
			window.removeEventListener('pointerup', onWinEnd);
			window.removeEventListener('pointercancel', onWinEnd);
			window.removeEventListener('touchmove', onWinTouchMove);
			window.removeEventListener('touchend', onWinEnd);
			window.removeEventListener('touchcancel', onWinEnd);
		};
	}, [
		armClickSuppress,
		clear,
		delay,
		detachWindow,
		disabled,
		moveThreshold
	]);

	const onPointerUp = useCallback(() => {
		clear();
	}, [clear]);

	const onPointerCancel = useCallback(() => {
		clear();
	}, [clear]);

	const onContextMenu = useCallback((event: ReactMouseEvent) => {
		if (firedRef.current || disabled) {
			event.preventDefault();
		}
	}, [disabled]);

	const onClick = useCallback((event: ReactMouseEvent) => {
		if (!suppressClickRef.current && !firedRef.current) return;
		event.preventDefault();
		event.stopPropagation();
		suppressClickRef.current = false;
		firedRef.current = false;
		clearClickSuppress();
	}, [clearClickSuppress]);

	return {
		onPointerDown,
		onPointerUp,
		onPointerCancel,
		onContextMenu,
		onClick,
		cancel,
	};
}
