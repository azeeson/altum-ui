import {createContext, useContext} from 'react';

/**
 * Эффективный z-index текущего portaled overlay (Sheet и т.п.).
 * Вложенные порталы (Dropdown, Popover) поднимаются через `elevateAboveOverlayStack`.
 */
const OverlayStackContext = createContext<string | number | undefined>(undefined);

export function useOverlayStackZIndex(): string | number | undefined {
	return useContext(OverlayStackContext);
}

export const OverlayStackProvider = OverlayStackContext.Provider;

/** CSS-значение для `z-index` / `calc()`. */
function toOverlayZCssValue(z: string | number): string {
	return typeof z === 'number' ? String(z) : z;
}

/**
 * z-index портала над текущим overlay-стеком, не ниже `--altum-g-z-dropdown`.
 * `max(var(--altum-g-z-dropdown), calc(parent + 1))` — меню внутри elevated Sheet
 * не уходит под панель.
 */
export function elevateAboveOverlayStack(
	parentZ: string | number | undefined,
	floorVar = 'var(--altum-g-z-dropdown)',
): string | undefined {
	if (parentZ == null || parentZ === '') return undefined;
	return `max(${floorVar}, calc(${toOverlayZCssValue(parentZ)} + 1))`;
}
