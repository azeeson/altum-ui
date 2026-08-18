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
/** Выравнивание панели Dropdown относительно триггера. */
export type DropdownAlign = 'left' | 'center' | 'right' | 'auto';
/** Кто скроллит панель: оболочка Overlay или контент. */
export type DropdownPanelScroll = 'overlay' | 'content';
export type {OverlayPurpose};

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
};

/** Контент Overlay: элемент (`asChild`) или render-prop. */
export type OverlayChildren =
	| React.ReactElement
	| RenderChildrenFn<OverlayContentProps>;

type OverlayChildrenProps = {
	/**
	 * `true` — единственный child-элемент получает slot-пропсы через `cloneElement`.
	 * `false` — `children` — функция `(props, contentRef) => ReactNode`.
	 * @default true
	 */
	asChild?: boolean;
	children: OverlayChildren;
};

/** Общие свойства всех вариантов Overlay. */
export type OverlayBaseProps = OverlayChildrenProps & {
	/**
	 * Видимость слоя. Держите компонент смонтированным —
	 * `{open && <Overlay>}` убивает exit-анимацию.
	 */
	open: boolean;
	onClose: () => void;
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
	/** Вариант Backdrop. @default 'default' */
	backdropVariant?: BackdropVariant;
	/** Размытие Backdrop. @default 'sm' */
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
	 * Показать Backdrop под контентом; клик по scrim закрывает при `closeOnOutsideClick`.
	 * @default false
	 */
	backdrop?: boolean;
	/** Вариант Backdrop. @default 'default' */
	backdropVariant?: BackdropVariant;
	/** Размытие Backdrop. @default 'sm' */
	backdropBlur?: BackdropBlur;
	/**
	 * Закрытие по клику снаружи (по Backdrop или вне панели).
	 * @default true при `backdrop`, иначе false
	 */
	closeOnOutsideClick?: boolean;
	/**
	 * Закрытие по Escape.
	 * @default true
	 */
	closeOnEscape?: boolean;
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
	 * Показать Backdrop под панелью; клик по scrim закрывает при `closeOnOutsideClick`.
	 * @default false
	 */
	backdrop?: boolean;
	/** Вариант Backdrop. @default 'default' */
	backdropVariant?: BackdropVariant;
	/** Размытие Backdrop. @default 'sm' */
	backdropBlur?: BackdropBlur;
	/**
	 * Закрытие по клику снаружи (по Backdrop или вне панели).
	 * @default true при `backdrop`, иначе false
	 */
	closeOnOutsideClick?: boolean;
	/**
	 * Закрытие по Escape.
	 * @default true
	 */
	closeOnEscape?: boolean;
};

type OverlayAnchorBaseProps = OverlayBaseProps & {
	targetRef: React.RefObject<HTMLElement | null>;
	/**
	 * `click` / `hover` — слушатели на `targetRef` (нужен `onOpenChange` для открытия);
	 * `manual` — только `open` / `onClose`.
	 * @default 'manual'
	 */
	triggerMode?: OverlayTriggerMode;
	/** Предпочтительная сторона относительно якоря; при нехватке места — flip. @default 'bottom' */
	side?: AnchorSide;
	/** Выравнивание вдоль стороны; при нехватке места — flip start↔end. @default 'start' */
	align?: AnchorAlign;
	/** Уведомление об открытии/закрытии (click/hover). */
	onOpenChange?: (open: boolean) => void;
	openDelay?: number;
	closeDelay?: number;
	closeOnOutsideClick?: boolean;
	closeOnEscape?: boolean;
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

/** Согласовано с transition в Overlay.module.css (modal / popover / dropdown / sheet). */
export const PRESENCE_MS = 200;
/** Sheet использует ту же длительность `--altum-motion-overlay`, что и другие оверлеи. */
export const SHEET_PRESENCE_MS = 200;
/** Задержка открытия hover-оверлея. */
export const HOVER_OPEN_DELAY = 200;
/** Задержка закрытия hover-оверлея. */
export const HOVER_CLOSE_DELAY = 100;

/** Внутренние пропсы modal-слоя Overlay. */
export type ModalLayerProps = {
	open: boolean;
	onClose: () => void;
	children: OverlayChildren;
	asChild: boolean;
	className?: string;
	presented: boolean;
	layerStyle?: React.CSSProperties;
	backdropVariant?: BackdropVariant;
	backdropBlur?: BackdropBlur;
	'aria-label'?: string;
	'aria-labelledby'?: string;
	'aria-describedby'?: string;
	role?: string;
	contentRef: React.Ref<HTMLElement | null>;
};

/** Внутренние пропсы floating-слоя Overlay. */
export type FloatingLayerProps = {
	open: boolean;
	onClose: () => void;
	children: OverlayChildren;
	asChild: boolean;
	className?: string;
	style?: React.CSSProperties;
	presented: boolean;
	layerStyle?: React.CSSProperties;
	backdrop?: boolean;
	backdropVariant?: BackdropVariant;
	backdropBlur?: BackdropBlur;
	closeOnOutsideClick?: boolean;
	closeOnEscape?: boolean;
	lockScroll?: boolean;
	trapFocus?: boolean;
	'aria-label'?: string;
	'aria-labelledby'?: string;
	'aria-describedby'?: string;
	role?: string;
	contentRef: React.Ref<HTMLElement | null>;
};

/** Внутренние пропсы sheet-слоя Overlay. */
export type SheetLayerProps = {
	side: OverlaySheetSide;
	open: boolean;
	children: OverlayChildren;
	asChild: boolean;
	className?: string;
	presented: boolean;
	onClose: () => void;
	layerStyle?: React.CSSProperties;
	backdrop?: boolean;
	backdropVariant?: BackdropVariant;
	backdropBlur?: BackdropBlur;
	closeOnOutsideClick?: boolean;
	closeOnEscape?: boolean;
	'aria-label'?: string;
	'aria-labelledby'?: string;
	'aria-describedby'?: string;
	role?: string;
	contentRef: React.Ref<HTMLElement | null>;
};

/** Внутренние пропсы якорного слоя Overlay (popover / dropdown). */
export type AnchorLayerProps = {
	variant: 'popover' | 'dropdown';
	purpose?: OverlayPurpose;
	open: boolean;
	targetRef: React.RefObject<HTMLElement | null>;
	contentRef: React.Ref<HTMLElement | null>;
	triggerMode: OverlayTriggerMode;
	side: AnchorSide;
	align: AnchorAlign;
	sideOffset: number;
	widthMode: OverlayWidthMode;
	children: OverlayChildren;
	asChild: boolean;
	className?: string;
	presented: boolean;
	layerStyle?: React.CSSProperties;
	closeDelay: number;
	closeOnOutsideClick?: boolean;
	closeOnEscape?: boolean;
	clearTimers: () => void;
	closeTimerRef: React.MutableRefObject<number | null>;
	pointerRef: React.MutableRefObject<{
		x: number;
		y: number
	} | null>;
	requestOpen: (next: boolean) => void;
	openHover: (next: boolean) => void;
	'aria-label'?: string;
	'aria-labelledby'?: string;
	'aria-describedby'?: string;
	role?: string;
};
