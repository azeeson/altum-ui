import React from 'react';
import {OverlayRoot} from './Overlay.Root';
import type {OverlayProps} from './Overlay.types';

export type {
	OverlayVariant,
	OverlaySheetSide,
	OverlayTriggerMode,
	OverlayWidthMode,
	DropdownWidthMode,
	DropdownAlign,
	DropdownPanelScroll,
	OverlayPurpose,
	OverlayContentProps,
	OverlayChildren,
	OverlayBaseProps,
	OverlayModalProps,
	OverlayFloatingProps,
	OverlaySheetProps,
	OverlayPopoverProps,
	OverlayDropdownProps,
	OverlayProps,
} from './Overlay.types';

/**
 * Примитив позиционирования без собственного chrome: portal + presence + placement.
 *
 * Варианты: `modal` (Backdrop + FocusTrap), `floating` (свободные x/y, опциональный Backdrop),
 * `sheet` (выезд с края), `popover` / `dropdown` (якорь `targetRef`, flip, triggerMode).
 *
 * `purpose` задаёт z-index и sideOffset из CSS-токенов ThemeProvider
 * (`--altum-g-z-*`, `--altum-overlay-offset-*`); по умолчанию выводится из `variant`.
 *
 * `asChild` (по умолчанию `true`) — slot-пропсы через `cloneElement`;
 * `asChild={false}` — render-prop `(props, contentRef) => …`.
 *
 * Держите `Overlay` смонтированным и управляйте через `open`
 * (`{open && <Overlay>}` убивает exit-анимацию).
 *
 * @component
 * @example
 * <Overlay variant="modal" purpose="lightbox" open={open} onClose={() => setOpen(false)} asChild>
 *   <div>Контент</div>
 * </Overlay>
 * @example
 * <Overlay
 *   variant="floating"
 *   open={open}
 *   onClose={() => setOpen(false)}
 *   style={{ left: 80, top: 120 }}
 *   asChild
 * >
 *   <div>Свободно позиционируемая панель</div>
 * </Overlay>
 * @example
 * <Overlay
 *   variant="popover"
 *   purpose="tooltip"
 *   open={open}
 *   onClose={() => setOpen(false)}
 *   onOpenChange={setOpen}
 *   targetRef={btnRef}
 *   triggerMode="hover"
 *   asChild={false}
 * >
 *   {(props, ref) => <div {...props} ref={ref}>Подсказка</div>}
 * </Overlay>
 */
export const Overlay = React.forwardRef<HTMLElement, OverlayProps>(
	(props, ref) => (
		<OverlayRoot {...props} forwardedRef={ref} />
	),
);

Overlay.displayName = 'Overlay';
