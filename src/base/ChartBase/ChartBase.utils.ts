import {useEffect, useState, RefObject} from 'react';

const DEFAULT_COLORS = [
	'var(--altum-color-brand)',
	'var(--altum-color-status-info)',
	'var(--altum-color-status-success)',
	'var(--altum-color-status-warning)',
	'var(--altum-color-status-error)',
	'var(--altum-color-chart-4)',
	'var(--altum-color-chart-5)',
];

export function chartSeriesColor(index: number, explicitColor?: string): string {
	return explicitColor ?? DEFAULT_COLORS[index % DEFAULT_COLORS.length];
}

export function useChartContainerWidth(containerRef: RefObject<HTMLElement | null>, defaultWidth = 480): number {
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

export function useChartContainerSize(containerRef: RefObject<HTMLElement | null>, height: number, defaultWidth = 500) {
	const [dimensions, setDimensions] = useState({
		width: defaultWidth,
		height,
	});

	useEffect(() => {
		const el = containerRef.current;
		if (!el) return;

		const observer = new ResizeObserver((entries) => {
			const entry = entries[0];
			if (entry) {
				setDimensions({
					width: entry.contentRect.width,
					height,
				});
			}
		});

		observer.observe(el);
		return () => observer.disconnect();
	}, [containerRef, height]);

	return dimensions;
}
