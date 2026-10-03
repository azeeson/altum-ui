/**
 * Ограничивает число диапазоном `[min, max]`.
 */
export function clamp(value: number, min: number, max: number): number {
	return Math.min(max, Math.max(min, value));
}

/**
 * Округляет число до шага шкалы относительно `min`.
 */
export function roundToStep(value: number, step: number, min = 0): number {
	if (step <= 0) return value;
	return min + Math.round((value - min) / step) * step;
}

/**
 * Линейная интерполяция между `start` и `end` по коэффициенту `t` ∈ [0, 1].
 */
export function lerp(start: number, end: number, t: number): number {
	return start + (end - start) * t;
}

/**
 * Разница координат указателя относительно старта жеста.
 */
export function pointerDelta(current: number, start: number): number {
	return current - start;
}

/**
 * Нормализованная доля значения в диапазоне (0…1).
 */
export function unitRatio(value: number, min: number, max: number): number {
	const span = max - min;
	if (span === 0) return 0;
	return clamp((value - min) / span, 0, 1);
}

/**
 * Значение шкалы по `clientX` на треке (Slider и аналоги).
 */
export function valueFromTrackClientX(
	clientX: number,
	track: DOMRect | HTMLElement,
	min: number,
	max: number,
	step: number,
): number {
	const rect = track instanceof HTMLElement ? track.getBoundingClientRect() : track;
	const span = max - min || 1;
	const ratio = clamp((clientX - rect.left) / (rect.width || 1), 0, 1);
	return clamp(roundToStep(min + ratio * span, step, min), min, max);
}

/**
 * Блокировка оси жеста после порога: горизонталь / вертикаль / ещё рано.
 */
export function lockPointerAxis(
	dx: number,
	dy: number,
	threshold: number,
): 'horizontal' | 'vertical' | null {
	const absX = Math.abs(dx);
	const absY = Math.abs(dy);
	if (absX <= threshold && absY <= threshold) return null;
	return absX > absY ? 'horizontal' : 'vertical';
}

/**
 * Сопротивление pull-to-refresh: damp × delta, capped по threshold.
 */
export function pullDistance(
	deltaY: number,
	threshold: number,
	damp = 0.45,
	maxFactor = 1.4,
): number {
	if (deltaY <= 0) return 0;
	return Math.min(deltaY * damp, threshold * maxFactor);
}

/**
 * Rubber-band за пределом: `limit + overflow * resistance`.
 */
export function rubberBand(
	value: number,
	limit: number,
	resistance = 0.28,
): number {
	if (limit === 0) return value * resistance;
	if (value > limit) return limit + (value - limit) * resistance;
	if (value < -limit) return -limit + (value + limit) * resistance;
	return value;
}
