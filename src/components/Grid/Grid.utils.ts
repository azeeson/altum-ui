import type {LayoutGap} from '../Layout/Layout.types';

export interface AdaptiveValue<T> {
	xs?: T;
	sm?: T;
	md?: T;
	lg?: T;
	xl?: T;
}

/** Breakpoints Grid (px), синхронны с `Grid.module.css`. */
export const GRID_BREAKPOINTS = {
	xs: 0,
	sm: 600,
	md: 768,
	lg: 1024,
	xl: 1280,
} as const;

type GridBreakpoint = keyof typeof GRID_BREAKPOINTS;

const BREAKPOINT_KEYS: GridBreakpoint[] = [
	'xs',
	'sm',
	'md',
	'lg',
	'xl'
];

/** Токенный gap как у `Stack` / `Inline`. */
export type GridGapToken = LayoutGap;

const GAP_TOKENS: Record<GridGapToken, string> = {
	none: '0',
	xs: 'var(--altum-g-space-1)',
	sm: 'var(--altum-g-space-2)',
	md: 'var(--altum-g-space-3)',
	lg: 'var(--altum-g-space-4)',
	xl: 'var(--altum-g-space-6)',
};

export function resolveGapCss(value: number | string): string {
	if (typeof value === 'number') return `${value}px`;
	if (value in GAP_TOKENS) return GAP_TOKENS[value as GridGapToken];
	return value;
}

function resolveMinColumnWidth(value: number | string): string {
	if (typeof value === 'number') return `${value}px`;
	return value;
}

export function resolveColumnsTemplate(value: number | string): string {
	if (typeof value === 'number') {
		return `repeat(${value}, minmax(0, 1fr))`;
	}
	return value;
}

export function resolveAutoColumnsTemplate(
	mode: 'autoFit' | 'autoFill',
	minColumnWidth: number | string,
): string {
	const min = resolveMinColumnWidth(minColumnWidth);
	const autoFn = mode === 'autoFit' ? 'auto-fit' : 'auto-fill';
	return `repeat(${autoFn}, minmax(${min}, 1fr))`;
}

export function applyAdaptiveVars<T>(
	target: Record<string, string | number | undefined>,
	obj: AdaptiveValue<T>,
	prefix: string,
	formatter: (value: T) => string | undefined,
): void {
	for (const key of BREAKPOINT_KEYS) {
		const value = obj[key];
		if (value !== undefined) {
			const formatted = formatter(value);
			if (formatted !== undefined) {
				target[`${prefix}-${key}`] = formatted;
			}
		}
	}
}

export function resolveGridColumnValue(
	span?: number,
	colStart?: number,
	colEnd?: number,
): string | undefined {
	if (colStart !== undefined && colEnd !== undefined) {
		return `${colStart} / ${colEnd}`;
	}
	if (colStart !== undefined && span !== undefined) {
		return `${colStart} / span ${span}`;
	}
	if (span !== undefined) {
		return `span ${span}`;
	}
	if (colStart !== undefined) {
		return String(colStart);
	}
	return undefined;
}

export function resolveGridRowValue(rowSpan?: number): string | undefined {
	if (rowSpan === undefined) return undefined;
	return `span ${rowSpan}`;
}

export function isAdaptiveValue<T>(value: unknown): value is AdaptiveValue<T> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}
