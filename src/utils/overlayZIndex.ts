/**
 * Именованный stacking-tier для портальных overlay (Sheet и др.).
 * Соответствует CSS-переменным ThemeProvider `--altum-g-z-*`.
 *
 * - `overlay` — дефолт Sheet (между chrome и Modal)
 * - `notification` — панель уровня тостов (над Modal / lightbox)
 */
export type OverlayZIndexTier =
	| 'overlay'
	| 'modal'
	| 'dropdown'
	| 'lightbox'
	| 'notification';

const OVERLAY_Z_INDEX_TIER_VAR: Record<OverlayZIndexTier, string> = {
	overlay: 'var(--altum-g-z-overlay)',
	modal: 'var(--altum-g-z-modal)',
	dropdown: 'var(--altum-g-z-dropdown)',
	lightbox: 'var(--altum-g-z-lightbox)',
	notification: 'var(--altum-g-z-notification)',
};

/**
 * Резолв z-index для overlay-корня.
 * `zIndex` перекрывает `zIndexTier`; если оба не заданы — `undefined` (CSS-дефолт компонента).
 */
export function resolveOverlayZIndex(
	zIndexTier?: OverlayZIndexTier,
	zIndex?: number | string,
): number | string | undefined {
	if (zIndex != null && zIndex !== '') return zIndex;
	if (zIndexTier != null) return OVERLAY_Z_INDEX_TIER_VAR[zIndexTier];
	return undefined;
}

/** CSS-дефолт Sheet / overlay-панели. */
export const OVERLAY_Z_INDEX_DEFAULT = 'var(--altum-g-z-overlay)';

/**
 * Итоговый z-index корня с учётом родительского overlay-стека
 * (вложенный Sheet поверх elevated-панели).
 */
export function resolveStackedOverlayZIndex(
	zIndexTier?: OverlayZIndexTier,
	zIndex?: number | string,
	parentStack?: string | number,
): string | number | undefined {
	const explicit = resolveOverlayZIndex(zIndexTier, zIndex);
	if (parentStack == null || parentStack === '') {
		return explicit;
	}
	const parentCss = typeof parentStack === 'number' ? String(parentStack) : parentStack;
	const base = explicit ?? OVERLAY_Z_INDEX_DEFAULT;
	const baseCss = typeof base === 'number' ? String(base) : base;
	return `max(${baseCss}, calc(${parentCss} + 1))`;
}
