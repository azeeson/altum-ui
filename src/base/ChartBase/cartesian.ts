import type {ChartPadding, ChartSeries} from './ChartBase.types';

export const DEFAULT_CHART_PADDING: ChartPadding = {
	left: 40,
	right: 16,
	top: 20,
	bottom: 40,
};

/** Равномерные тики от 0 до `maxVal` включительно. */
export function linearYTicks(maxVal: number, count = 5): number[] {
	if (count <= 1) return [Math.round(maxVal)];
	return Array.from({length: count}, (_, index) => Math.round((maxVal / (count - 1)) * index));
}

export function chartScale(width: number, height: number, datasets: ChartSeries[]) {
	const {left, right, top, bottom} = DEFAULT_CHART_PADDING;
	const plotW = Math.max(0, width - left - right);
	const plotH = Math.max(0, height - top - bottom);
	const maxVal = Math.max(1, ...datasets.flatMap((dataset) => dataset.data), 1);
	return {
		left,
		right,
		top,
		bottom,
		plotW,
		plotH,
		maxVal,
		getY: (value: number) => top + plotH - (value / maxVal) * plotH,
		ticks: linearYTicks(maxVal),
	};
}

export function chartPointX(index: number, count: number, left: number, plotW: number): number {
	return left + (plotW / Math.max(1, count - 1)) * index;
}

export function chartBandX(index: number, count: number, left: number, plotW: number): number {
	return left + (plotW / Math.max(1, count)) * (index + 0.5);
}
