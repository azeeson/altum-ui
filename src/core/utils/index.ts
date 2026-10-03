/** Публичная точка ядра микро-утилит Altum UI. */
export {
	uRef,
	uEv,
	uEvMerge,
	ariaIds,
	getCtx,
	handleRovingFocus,
} from './bundle';
export {
	setPointerCapture,
	releasePointerCapture,
	hasPointerCapture,
	setTranslate3d,
	beginPointerDrag,
	handlePointerMove,
	beginSortableDrag,
	isReorderDragActive,
	cancelReorderDrag,
	anchorNameFor,
	bindFieldChromeRef,
} from './dom';
export type {
	PointerDragMoveContext,
	BeginPointerDragOptions,
	BeginSortableDragOptions,
} from './dom';
export {
	clamp,
	roundToStep,
	lerp,
	pointerDelta,
	unitRatio,
	valueFromTrackClientX,
	lockPointerAxis,
	pullDistance,
	rubberBand,
} from './math';
export {
	getFormControlState,
	formatBytes,
} from './form';
export type {FormControlFlags} from './form';
export {cn} from './cn';
export {pick, omit} from './object';
export {useFallbackId} from './useFallbackId';
export {SPACING_CSS, spacingCss} from './spacing';
export {
	getWeekStart,
	getWeekDays,
	addToDate,
	startOfDay,
	addDays,
	isSameDay,
	compareDay,
	isExistingLocalDate,
	parseLocalDate,
	formatLocalDate,
	formatHourLabel,
	formatHourTime,
	formatHHmm,
	formatDateToDigits,
	parseDigitsToDate,
} from './date';
export type {WeekStartsOn, DateAddUnit} from './date';
