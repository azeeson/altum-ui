import {useEffect, useState, type RefObject} from 'react';

export function useChartWidth(
	containerRef: RefObject<HTMLElement | null>,
	defaultWidth = 480,
): number {
	const [width, setWidth] = useState(defaultWidth);

	useEffect(() => {
		const el = containerRef.current;
		if (!el) return;

		const observer = new ResizeObserver((entries) => {
			const entry = entries[0];
			if (entry) setWidth(entry.contentRect.width);
		});

		observer.observe(el);
		return () => observer.disconnect();
	}, [containerRef]);

	return width;
}
