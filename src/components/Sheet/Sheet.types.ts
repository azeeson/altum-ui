import type {
	HTMLAttributes,
	ReactNode,
	Ref,
} from 'react';

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
export type SheetFooterAlign = 'start' | 'center' | 'end' | 'space-between';

/**
 * Свойства корня `Sheet`.
 *
 * Составной: `Sheet.Header` / `Body` / `Footer`. Заголовок — `Title`.
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
	/** Ширина для `mode="sidebar"`. @default 280 */
	width?: number | string;
	/** Высота для `mode="sheet"`. */
	height?: number | string;
	/** Поверхность панели. */
	rootRef?: Ref<HTMLDivElement>;
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
	/** Крестик в правой ячейке. По умолчанию `true`, если нет `rightControls`. */
	showClose?: boolean;
	/** Узел шапки. */
	rootRef?: Ref<HTMLElement>;
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
	/** Узел тела. */
	rootRef?: Ref<HTMLElement>;
}

/**
 * Свойства `Sheet.Footer`.
 */
export interface SheetFooterProps extends Omit<HTMLAttributes<HTMLElement>, 'align'> {
	children?: ReactNode;
	className?: string;
	align?: SheetFooterAlign;
	/** Узел подвала. */
	rootRef?: Ref<HTMLElement>;
}
