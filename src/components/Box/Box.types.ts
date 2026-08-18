import type {
	ComponentPropsWithoutRef,
} from 'react';

/**
 * Вариант заливки поверхности (без рамки и тени).
 *
 * - `outlined` / `elevated` — фон `--altum-color-surface`
 * - `floating` — `--altum-color-dropdown-bg`
 * - `tinted` — тонированная заливка primary
 * - `secondary` — приглушённый secondary
 * - `muted` — `--altum-color-surface-active`
 * - `glass` — полупрозрачный + backdrop blur
 * - `overlay` — полупрозрачная поверхность на scrim (`--altum-overlay-content-*`)
 * - `ghost` / `plain` — прозрачный
 *
 * Варианты `outlined` / `elevated` / `tinted` / `secondary` / `muted` / `glass` / `overlay`
 * переопределяют element-токены (`--altum-field-*`, `--altum-color-button-secondary-*`, …) для потомков.
 */
export type BoxVariant =
	| 'outlined'
	| 'elevated'
	| 'floating'
	| 'tinted'
	| 'secondary'
	| 'muted'
	| 'glass'
	| 'overlay'
	| 'ghost'
	| 'plain';

/** Уровень тени. */
export type BoxShadow = 'none' | 'sm' | 'md' | 'lg';

/** Стиль рамки при `border`. */
export type BoxBorderStyle = 'solid' | 'dashed';

/** Отступ внутри блока. */
export type BoxPadding = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/** Радиус скругления. */
export type BoxRadius = 'none' | 'sm' | 'md' | 'lg';

/** HTML-элемент корня. */
export type BoxAs = 'div' | 'section' | 'article' | 'aside' | 'button' | 'a' | 'li';

/**
 * Свойства `Box`.
 */
export interface BoxProps extends ComponentPropsWithoutRef<'div'> {
	/**
	 * Заливка поверхности.
	 * @default 'outlined'
	 */
	variant?: BoxVariant;
	/**
	 * Рамка. Если не задано — дефолт по `variant`.
	 */
	border?: boolean;
	/**
	 * Стиль рамки. @default 'solid'
	 */
	borderStyle?: BoxBorderStyle;
	/**
	 * Тень. Если не задано — дефолт по `variant`.
	 */
	shadow?: BoxShadow;
	/** @default 'div' */
	as?: BoxAs;
	/** @default 'none' */
	padding?: BoxPadding;
	/** @default 'md' */
	radius?: BoxRadius;
}
