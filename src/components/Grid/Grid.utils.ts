import {resolveSpacingCss} from '../../utils/spacing';
import {toCssSize} from '../../utils/cssSize';
import type {SpacingToken} from '../../types/spacing';

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

const BPS: GridBreakpoint[] = [
	'xs',
	'sm',
	'md',
	'lg',
	'xl'
];

/** Токенный gap как у `Stack` / `Inline`. */
export type GridGapToken = SpacingToken;

export function isAdaptiveValue<T>(value: unknown): value is AdaptiveValue<T> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Заполняет CSS-переменные на всех брейкпоинтах: скаляр — одно значение,
 * AdaptiveValue — каскад вперёд от последнего заданного.
 */
export function setResponsive<T>(
	target: Record<string, string | number | undefined>,
	prefix: string,
	value: T | AdaptiveValue<T>,
	format: (value: T) => string | undefined,
	fallback: string,
): void {
	if (!isAdaptiveValue<T>(value)) {
		const formatted = format(value) ?? fallback;
		for (const bp of BPS) {
			target[`${prefix}-${bp}`] = formatted;
		}
		return;
	}
	let last = fallback;
	for (const bp of BPS) {
		const raw = value[bp];
		if (raw !== undefined) {
			const formatted = format(raw);
			if (formatted !== undefined) last = formatted;
		}
		target[`${prefix}-${bp}`] = last;
	}
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
	const autoFn = mode === 'autoFit' ? 'auto-fit' : 'auto-fill';
	return `repeat(${autoFn}, minmax(${toCssSize(minColumnWidth)}, 1fr))`;
}

export function resolveGapCss(value: number | string): string {
	return resolveSpacingCss(value);
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

export function setGridItemColumnVars(
	target: Record<string, string | number | undefined>,
	span?: number | AdaptiveValue<number>,
	colStart?: number | AdaptiveValue<number>,
	colEnd?: number | AdaptiveValue<number>,
): void {
	if (span === undefined && colStart === undefined && colEnd === undefined) return;
	let last = 'auto';
	for (const bp of BPS) {
		const s = isAdaptiveValue(span) ? span[bp] : span;
		const start = isAdaptiveValue(colStart) ? colStart[bp] : colStart;
		const end = isAdaptiveValue(colEnd) ? colEnd[bp] : colEnd;
		const value = resolveGridColumnValue(s, start, end);
		if (value !== undefined) last = value;
		target[`--altum-grid-item-col-${bp}`] = last;
	}
}
