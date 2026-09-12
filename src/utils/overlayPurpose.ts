/**
 * Семантическое назначение Overlay: задаёт z-index и sideOffset из CSS-токенов ThemeProvider.
 */
export type OverlayPurpose =
	| 'tooltip'
	| 'popover'
	| 'dropdown'
	| 'modal'
	| 'sheet'
	| 'lightbox'
	| 'notification';

const PURPOSE_OFFSET_TOKEN: Record<OverlayPurpose, string> = {
	tooltip: '--altum-overlay-offset-tooltip',
	popover: '--altum-overlay-offset-popover',
	dropdown: '--altum-overlay-offset-dropdown',
	modal: '--altum-overlay-offset-modal',
	sheet: '--altum-overlay-offset-sheet',
	lightbox: '--altum-overlay-offset-lightbox',
	notification: '--altum-overlay-offset-notification',
};

/** Fallback sideOffset в px, если CSS-переменная ещё не доступна. */
const PURPOSE_OFFSET_FALLBACK: Record<OverlayPurpose, number> = {
	tooltip: 8,
	popover: 8,
	dropdown: 8,
	modal: 0,
	sheet: 0,
	lightbox: 0,
	notification: 0,
};

/** CSS `var(--…)` для z-index purpose. */
const OVERLAY_PURPOSE_Z_VAR: Record<OverlayPurpose, string> = {
	tooltip: 'var(--altum-g-z-tooltip)',
	popover: 'var(--altum-g-z-dropdown)',
	dropdown: 'var(--altum-g-z-dropdown)',
	modal: 'var(--altum-g-z-modal)',
	sheet: 'var(--altum-g-z-overlay)',
	lightbox: 'var(--altum-g-z-lightbox)',
	notification: 'var(--altum-g-z-notification)',
};

/**
 * Читает `--altum-overlay-offset-*` для purpose (число px для computeAnchorPosition).
 */
export function resolveOverlayPurposeSideOffset(purpose: OverlayPurpose): number {
	if (typeof document === 'undefined') {
		return PURPOSE_OFFSET_FALLBACK[purpose];
	}
	const raw = getComputedStyle(document.documentElement)
		.getPropertyValue(PURPOSE_OFFSET_TOKEN[purpose])
		.trim();
	const parsed = parseFloat(raw);
	return Number.isFinite(parsed) ? parsed : PURPOSE_OFFSET_FALLBACK[purpose];
}

/**
 * z-index CSS-значение для purpose (для style / stacking).
 */
export function resolveOverlayPurposeZIndex(purpose: OverlayPurpose): string {
	return OVERLAY_PURPOSE_Z_VAR[purpose];
}
