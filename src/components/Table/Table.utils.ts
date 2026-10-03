import type {CSSProperties} from 'react';
import {unitRatio} from '../../core/utils/math';

/** Суффикс CSS-переменной колонки: только символы, допустимые в custom property. */
function tableColToken(key: string): string {
	return key.replace(/[^a-zA-Z0-9_-]/g, '-');
}

/** Имя переменной ширины колонки на `<table>` / scroll-frame (resize пишет сюда долю 0…1). */
export function tableColWidthVar(key: string): string {
	return `--altum-table-col-w-${tableColToken(key)}`;
}

/** Имя переменной смещения sticky-left колонки (px). */
export function tableColLeftVar(key: string): string {
	return `--altum-table-col-left-${tableColToken(key)}`;
}

/** Ширина для расчёта sticky-offset / fallback ratio, если колонка ещё не ресайзилась. */
export function declaredColWidth(width?: number | string): number {
	return typeof width === 'number' ? width : 120;
}

/**
 * Значение `--altum-table-col-w` на ячейке: живая доля на хосте, иначе fallback 0…1.
 * CSS-модуль: `width: calc(var(--altum-table-col-w) * 100%)`.
 */
export function tableColWidthValue(key: string, width: number | string | undefined, totalPx: number): string {
	const fallback = unitRatio(declaredColWidth(width), 0, Math.max(totalPx, 1));
	return `var(${tableColWidthVar(key)}, ${fallback})`;
}

/** `left` sticky-колонки: живая переменная на хосте, иначе расчётное смещение (px). */
export function tableColLeftValue(key: string, offset: number): string {
	return `var(${tableColLeftVar(key)}, ${offset}px)`;
}

/**
 * Локальные `--altum-table-col-w` (доля) / `--altum-table-col-left` (px) на ячейке.
 * Resize пишет unitless ratio в именованный var на хосте.
 */
export const tableColCellStyle = (
	key: string,
	o: {
		width?: number | string;
		minWidth?: number;
		sticky?: 'left' | 'right';
		stickyLeft?: number;
		/** Сумма declared-ширин колонок (+ control) для fallback ratio. */
		totalPx?: number;
	},
): CSSProperties => ({
	'--altum-table-col-w': tableColWidthValue(key, o.width, o.totalPx ?? declaredColWidth(o.width)),
	...(o.sticky === 'left'
		? {'--altum-table-col-left': tableColLeftValue(key, o.stickyLeft ?? 0)}
		: undefined),
	...(o.minWidth != null ? {minWidth: o.minWidth} : undefined),
} as CSSProperties);

/** Sticky offset для control-колонок (expand/select), если > 0. */
export function tableControlStickyStyle(left: number): CSSProperties | undefined {
	if (left <= 0) return undefined;
	return {'--altum-table-col-left': `${left}px`} as CSSProperties;
}

/** Доля ширины колонки относительно хоста (0…1) для resize → CSS `calc(* 100%)`. */
export function tableColRatio(widthPx: number, hostWidthPx: number): number {
	return unitRatio(widthPx, 0, Math.max(hostWidthPx, 1));
}
