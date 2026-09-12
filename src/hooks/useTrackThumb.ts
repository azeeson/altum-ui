import {useLayoutEffect, useState, type CSSProperties, type RefObject} from 'react';

/**
 * Ширина и `translateX` активного child относительно контейнера.
 * ResizeObserver на контейнере и детях; `layoutKey` — когда сменился активный пункт.
 *
 * @param containerRef - Трек, относительно которого меряется thumb.
 * @param activeSelector - CSS-селектор активного child.
 * @param layoutKey - Смена выбора / размера, чтобы перемерить без resize.
 * @returns `style` для thumb и `ready` (включить CSS-transition после первого замера).
 * @example
 * const thumb = useTrackThumb(ref, `.${styles.itemActive}`, selected);
 */
export function useTrackThumb(
	containerRef: RefObject<HTMLElement | null>,
	activeSelector: string,
	layoutKey?: unknown,
): {
	style: CSSProperties;
	ready: boolean;
} {
	const [style, setStyle] = useState<CSSProperties>({});
	const [ready, setReady] = useState(false);

	useLayoutEffect(() => {
		const container = containerRef.current;
		if (!container || !activeSelector) {
			setReady(false);
			return;
		}

		let frame = 0;
		let enableFrame = 0;
		let ignoreResize = true;

		const measure = () => {
			const activeEl = container.querySelector(activeSelector) as HTMLElement | null;
			if (!activeEl) return;

			const containerRect = container.getBoundingClientRect();
			const activeRect = activeEl.getBoundingClientRect();
			setStyle({
				width: `${activeRect.width}px`,
				transform: `translateX(${activeRect.left - containerRect.left - container.clientLeft}px)`,
			});
		};

		measure();
		enableFrame = requestAnimationFrame(() => {
			setReady(true);
			enableFrame = requestAnimationFrame(() => {
				ignoreResize = false;
			});
		});

		const onResize = () => {
			if (ignoreResize) return;
			cancelAnimationFrame(frame);
			frame = requestAnimationFrame(() => {
				setReady(false);
				measure();
				cancelAnimationFrame(enableFrame);
				enableFrame = requestAnimationFrame(() => setReady(true));
			});
		};

		const observer = new ResizeObserver(onResize);
		observer.observe(container);
		for (const child of container.children) {
			if (child instanceof HTMLElement) observer.observe(child);
		}

		return () => {
			cancelAnimationFrame(frame);
			cancelAnimationFrame(enableFrame);
			observer.disconnect();
		};
	}, [activeSelector, containerRef, layoutKey]);

	return {
		style,
		ready,
	};
}
