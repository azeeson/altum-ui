import type React from 'react';

/** Вариант слоя Overlay. */
export type OverlayVariant = 'modal' | 'sheet' | 'floating';

/** Сторона выезда sheet-панели. */
export type OverlaySheetSide = 'top' | 'bottom' | 'left' | 'right';

/** Общие свойства всех вариантов Overlay. */
export type OverlayBaseProps = {
	children: React.ReactNode;
	/**
	 * Видимость слоя. Узел остаётся в DOM:
	 * закрытие снимает `open` у `<dialog>` или прячет popover, а не размонтирует слой.
	 */
	open: boolean;
	/** Закрытие слоя — `onOpenChange(false)`. */
	onOpenChange: (open: boolean) => void;
	className?: string;
	/**
	 * Класс на хост слоя (`<dialog>` / floating root), не на панель.
	 * Визуальный `::backdrop` — через `overlayScrim.host` у потребителей.
	 */
	hostClassName?: string;
	/** Позиция и размер панели. У floating — `left` / `top` / `width`. */
	style?: React.CSSProperties;
	/**
	 * Узел слоя: `<dialog>` у modal и sheet, popover-элемент у floating.
	 */
	rootRef?: React.Ref<HTMLElement>;
	'aria-label'?: string;
	'aria-labelledby'?: string;
	'aria-describedby'?: string;
	/**
	 * `role` корня слоя.
	 * @default `'dialog'`
	 */
	role?: string;
};

/** Overlay как модальный `<dialog>`. */
export type OverlayModalProps = OverlayBaseProps & {
	variant?: 'modal';
	side?: never;
};

/**
 * Overlay без якоря: `popover="auto"` (light dismiss кликом снаружи / Escape).
 * `open` / `onOpenChange` опциональны: без `open` показ ведёт нативный `popovertarget`
 * (или `showPopover`); `onOpenChange` только подписывается на `toggle`, если передан.
 */
export type OverlayFloatingProps = Omit<OverlayBaseProps, 'open' | 'onOpenChange'> & {
	variant: 'floating';
	side?: never;
	/** `id` popover-элемента — для `popovertarget` у инвокера. */
	id?: string;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	/** Сторона якоря у потребителей (Popover CSS Anchor). */
	'data-side'?: string;
	/** Режим ширины панели у потребителей (Popover). */
	'data-width-mode'?: string;
};

/** Overlay как sheet с края экрана. Всегда модальный `<dialog>`. */
export type OverlaySheetProps = OverlayBaseProps & {
	variant: 'sheet';
	/** Край, с которого выезжает панель. @default 'bottom' */
	side?: OverlaySheetSide;
};

/** Дискриминируемый union свойств Overlay по `variant`. */
export type OverlayProps =
	| OverlayModalProps
	| OverlayFloatingProps
	| OverlaySheetProps;
