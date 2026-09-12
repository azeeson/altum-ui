import type {
	HTMLAttributes,
	ButtonHTMLAttributes,
	ReactNode,
} from 'react';
import type {DialogFooterAlign} from '../../base/DialogBase';
import type {OverlayZIndexTier} from '../../utils/overlayZIndex';
import type {OverlayDismiss} from '../Overlay/Overlay.types';

export type {OverlayZIndexTier};

/**
 * Режим панели: sheet (низ/верх), sidebar (бок), auto (по breakpoint).
 */
export type SheetMode = 'auto' | 'sidebar' | 'sheet';

/**
 * Направление: для sidebar — слева/справа, для sheet — сверху/снизу.
 * `start` = слева | сверху, `end` = справа | снизу.
 */
export type SheetDirection = 'start' | 'end';

/**
 * Выравнивание действий в `Sheet.Footer`.
 */
export type SheetFooterAlign = DialogFooterAlign;

/**
 * Свойства корня `Sheet`.
 *
 * Составной: `Sheet.Header` / `Title` / `Close` / `Body` / `Footer`.
 */
export interface SheetProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	children?: ReactNode;
	/** Ручка захвата в стиле iOS (логична для `mode="sheet"`). */
	showHandle?: boolean;
	/**
	 * `sheet` — низ/верх; `sidebar` — бок; `auto` — sheet на mobile, sidebar на desktop.
	 * @default 'auto'
	 */
	mode?: SheetMode;
	/**
	 * `start` / `end`: сайдбар → слева/справа; sheet → сверху/снизу.
	 * @default 'end'
	 */
	direction?: SheetDirection;
	/** Показывать Backdrop; при `false` — немодальный. @default true */
	backdrop?: boolean;
	/** Ширина для `mode="sidebar"`. @default 280 */
	width?: number | string;
	/** Высота для `mode="sheet"`. */
	height?: number | string;
	backdropVariant?: 'default' | 'strong';
	backdropBlur?: 'none' | 'sm' | 'md';
	/**
	 * Именованный слой ThemeProvider (`--altum-g-z-*`), мапится в Overlay `purpose`.
	 * @default CSS `--altum-g-z-overlay` (`purpose="sheet"`)
	 */
	zIndexTier?: OverlayZIndexTier;
	/** Сырой z-index корня; перекрывает `zIndexTier` / `purpose`. */
	zIndex?: number | string;
	/**
	 * Закрытие: снаружи, Escape, оба или выкл.
	 * @default `'all'` при `backdrop`, иначе `'escape'`
	 */
	dismiss?: OverlayDismiss;
}

/**
 * Свойства `Sheet.Header`.
 */
export interface SheetHeaderProps extends HTMLAttributes<HTMLElement> {
	children?: ReactNode;
	className?: string;
	/**
	 * `chrome` — трёхколоночная шапка (title по центру, side slots);
		 * `plain` — произвольный chrome (бейдж, вторичные действия).
	 * @default 'chrome'
	 */
	variant?: 'chrome' | 'plain';
	leftControls?: ReactNode;
	rightControls?: ReactNode;
	/** Встроенный `Sheet.Close` справа. По умолчанию `true`, если нет `rightControls`. */
	showClose?: boolean;
}

/**
 * Свойства `Sheet.Title`.
 */
export interface SheetTitleProps extends Omit<HTMLAttributes<HTMLHeadingElement>, 'children' | 'className'> {
	children: ReactNode;
	className?: string;
	as?: 'h2' | 'h3' | 'h4';
}

/**
 * Свойства `Sheet.Close`.
 */
export interface SheetCloseProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'className' | 'onClick' | 'type'> {
	className?: string;
	'aria-label'?: string;
}

/**
 * Свойства `Sheet.Body`.
 */
export interface SheetBodyProps extends HTMLAttributes<HTMLElement> {
	children?: ReactNode;
	className?: string;
	/**
	 * Внутренние отступы. `false` — edge-to-edge контент.
	 * @default true
	 */
	padding?: boolean;
}

/**
 * Свойства `Sheet.Footer`.
 */
export interface SheetFooterProps extends Omit<HTMLAttributes<HTMLElement>, 'align'> {
	children?: ReactNode;
	className?: string;
	align?: SheetFooterAlign;
}
