import type React from 'react';
import type {BackdropBlur, BackdropVariant} from '../Backdrop/Backdrop';
import type {AnchorAlign, AnchorSide} from '../../utils/anchorPosition';
import type {OverlayPurpose} from '../../utils/overlayPurpose';
import type {RenderChildrenFn} from '../../utils/renderChildren';

/** Вариант слоя Overlay. */
export type OverlayVariant = 'modal' | 'sheet' | 'popover' | 'dropdown' | 'floating';
/** Сторона выезда sheet-панели. */
export type OverlaySheetSide = 'top' | 'bottom' | 'left' | 'right';
/** Как открывается якорный Overlay (`click` / `hover` / только `open`). */
export type OverlayTriggerMode = 'click' | 'hover' | 'manual';
/** Ширина панели относительно триггера. */
export type OverlayWidthMode = 'trigger' | 'content' | 'trigger-fit';
/** Алиас `OverlayWidthMode` для Dropdown. */
export type DropdownWidthMode = OverlayWidthMode;
/**
 * Выравнивание панели Dropdown относительно триггера.
 * `start` / `center` / `end` — как у Overlay; `auto` — старт с flip.
 * `left` / `right` — deprecated-алиасы `start` / `end`.
 */
export type DropdownAlign = AnchorAlign | 'auto' | 'left' | 'right';
/** Кто скроллит панель: оболочка Overlay или контент. */
export type DropdownPanelScroll = 'overlay' | 'content';
export type {OverlayPurpose};

/** Как Overlay закрывается: клик снаружи, Escape, оба или ни то ни другое. */
export type OverlayDismiss = 'outside' | 'escape' | 'all' | 'none';

export function resolveOverlayDismiss(
	dismiss: OverlayDismiss | undefined,
	defaults: {
		outside: boolean;
		escape: boolean
	},
): {
	outside: boolean;
	escape: boolean
} {
	if (dismiss == null) return defaults;
	return {
		outside: dismiss === 'all' || dismiss === 'outside',
		escape: dismiss === 'all' || dismiss === 'escape',
	};
}

/**
 * Slot-пропсы контентного узла Overlay (className, style, a11y, handlers).
 */
export type OverlayContentProps = Omit<React.HTMLAttributes<HTMLElement>, 'role' | 'color'> & {
	role?: string;
	'aria-modal'?: boolean | 'true' | 'false';
	'aria-label'?: string;
	'aria-labelledby'?: string;
	'aria-describedby'?: string;
	/** Фактическая сторона после flip (для стрелок и т.п.). */
	'data-side'?: AnchorSide;
	'data-kind'?: OverlayVariant;
	'data-presented'?: string;
};

/** Контент Overlay: render-prop или единственный элемент (`mergeSlotProps`). */
export type OverlayChildren = RenderChildrenFn<OverlayContentProps> | React.ReactElement;

/** Общие свойства всех вариантов Overlay. */
export type OverlayBaseProps = {
	children: OverlayChildren;
	/**
	 * Видимость слоя. Держите компонент смонтированным —
	 * `{open && <Overlay>}` убивает exit-анимацию.
	 */
	open: boolean;
	/** Закрытие — `onOpenChange(false)`; открытие с якоря — `onOpenChange(true)`. */
	onOpenChange: (open: boolean) => void;
	className?: string;
	/**
	 * Семантика слоя: z-index и sideOffset из CSS-токенов ThemeProvider
	 * (`--altum-g-z-*`, `--altum-overlay-offset-*`).
	 * Если не задан — выводится из `variant` (`modal`/`floating`→modal, `sheet`→sheet,
	 * `dropdown`→dropdown, `popover`→popover).
	 */
	purpose?: OverlayPurpose;
	/**
	 * Сырой z-index корня; перекрывает z-index из `purpose`
	 * (например `Sheet` `zIndex` / elevated stack).
	 */
	zIndex?: number | string;
	'aria-label'?: string;
	'aria-labelledby'?: string;
	'aria-describedby'?: string;
	/**
	 * `role` контентного узла. @default `'dialog'` (modal / floating / sheet).
	 * Для панелей со своим listbox/menu передайте `'presentation'`.
	 */
	role?: string;
};

/** Overlay как модальный диалог. */
export type OverlayModalProps = OverlayBaseProps & {
	variant: 'modal';
	/** Вариант Backdrop. @default `'strong'` при `purpose="lightbox"`, иначе `'default'` */
	backdropVariant?: BackdropVariant;
	/** Размытие Backdrop. @default `'md'` при `purpose="lightbox"`, иначе `'sm'` */
	backdropBlur?: BackdropBlur;
};

/** Overlay со свободным позиционированием (без якоря). */
export type OverlayFloatingProps = OverlayBaseProps & {
	variant: 'floating';
	/**
	 * Свободное позиционирование / размеры контентного узла
	 * (`left` / `top` / `width` и т.п.). Мержится в slot `style`.
	 */
	style?: React.CSSProperties;
	/**
	 * Показать Backdrop под контентом; клик по scrim закрывает при `dismiss` с `outside`.
	 * @default false
	 */
	backdrop?: boolean;
	/** Вариант Backdrop. @default 'default' */
	backdropVariant?: BackdropVariant;
	/** Размытие Backdrop. @default 'sm' */
	backdropBlur?: BackdropBlur;
	/**
	 * Закрытие: снаружи, Escape, оба или выкл.
	 * @default `'all'` при `backdrop`, иначе `'escape'`
	 */
	dismiss?: OverlayDismiss;
	/**
	 * Блокировать scroll body.
	 * @default true при `backdrop`, иначе false
	 */
	lockScroll?: boolean;
	/**
	 * FocusTrap вокруг контента (без центрирования layout).
	 * @default true
	 */
	trapFocus?: boolean;
};

/** Overlay как sheet с края экрана. */
export type OverlaySheetProps = OverlayBaseProps & {
	variant: 'sheet';
	/** Край, с которого выезжает панель. @default 'bottom' */
	side?: OverlaySheetSide;
	/**
	 * Показать Backdrop под панелью; клик по scrim закрывает при `dismiss` с `outside`.
	 * @default false
	 */
	backdrop?: boolean;
	/** Вариант Backdrop. @default 'default' */
	backdropVariant?: BackdropVariant;
	/** Размытие Backdrop. @default 'sm' */
	backdropBlur?: BackdropBlur;
	/**
	 * Закрытие: снаружи, Escape, оба или выкл.
	 * @default `'all'` при `backdrop`, иначе `'escape'`
	 */
	dismiss?: OverlayDismiss;
};

type OverlayAnchorBaseProps = OverlayBaseProps & {
	targetRef: React.RefObject<HTMLElement | null>;
	/**
	 * `click` / `hover` — слушатели на `targetRef` (нужен `onOpenChange` для открытия);
	 * `manual` — только `open` / `onOpenChange`.
	 * @default 'manual'
	 */
	triggerMode?: OverlayTriggerMode;
	/** Предпочтительная сторона относительно якоря; при нехватке места — flip. @default 'bottom' */
	side?: AnchorSide;
	/** Выравнивание вдоль стороны; при нехватке места — flip start↔end. @default 'start' */
	align?: AnchorAlign;
	openDelay?: number;
	closeDelay?: number;
	/**
	 * Закрытие: снаружи, Escape, оба или выкл.
	 * @default `'all'` при `triggerMode="click"`, `'none'` при `hover`
	 */
	dismiss?: OverlayDismiss;
};

/** Overlay, привязанный к якорю (popover). */
export type OverlayPopoverProps = OverlayAnchorBaseProps & {
	variant: 'popover';
};

/** Overlay, привязанный к якорю (dropdown-панель). */
export type OverlayDropdownProps = OverlayAnchorBaseProps & {
	variant: 'dropdown';
	/**
	 * Ширина панели: `trigger` — как якорь; `content` — по контенту;
	 * `trigger-fit` — не уже якоря, расширяется по контенту.
	 * @default 'trigger-fit'
	 */
	widthMode?: OverlayWidthMode;
};

/** Дискриминируемый union свойств Overlay по `variant`. */
export type OverlayProps =
	| OverlayModalProps
	| OverlayFloatingProps
	| OverlaySheetProps
	| OverlayPopoverProps
	| OverlayDropdownProps;

/** Согласовано с transition в Overlay.module.css. */
export const PRESENCE_MS = 200;
/** Задержка открытия hover-оверлея. */
export const HOVER_OPEN_DELAY = 200;
/** Задержка закрытия hover-оверлея. */
export const HOVER_CLOSE_DELAY = 100;
