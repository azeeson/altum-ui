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
