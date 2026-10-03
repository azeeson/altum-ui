import {useEffect, useState, type RefObject} from 'react';

/**
 * Ширина контейнера графика через ResizeObserver.
 * Observer отключается при размонтировании — без утечек.
 */
export function useChartWidth(
	containerRef: RefObject<HTMLElement | null>,
	defaultWidth = 480,
): number {
	const [width, setWidth] = useState(defaultWidth);

	useEffect(() => {
		const el = containerRef.current;
		if (!el) return;

		let frame = 0;
		const observer = new ResizeObserver((entries) => {
			const entry = entries[0];
			if (!entry) return;
			const next = entry.contentRect.width;
			cancelAnimationFrame(frame);
			frame = requestAnimationFrame(() => setWidth(next));
		});

		observer.observe(el);
		setWidth(el.getBoundingClientRect().width || defaultWidth);

		return () => {
			cancelAnimationFrame(frame);
			observer.disconnect();
		};
	}, [containerRef, defaultWidth]);

	return width;
}
