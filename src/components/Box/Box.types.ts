import type {
	ComponentPropsWithoutRef,
	Ref,
} from 'react';

/**
 * Вариант заливки поверхности (без рамки и тени).
 *
 * - `outlined` — фон `--altum-color-surface`
 * - `elevated` — фон `--altum-color-surface-elevated` (в dark ступенью светлее surface)
 * - `floating` — `--altum-color-dropdown-bg`
 * - `tinted` — тонированная заливка primary
 * - `secondary` — приглушённый secondary
 * - `muted` — `--altum-color-surface-active`
 * - `glass` — полупрозрачный + backdrop blur
 * - `overlay` — полупрозрачная поверхность на scrim (`--altum-overlay-content-*`)
 * - `ghost` / `plain` — прозрачный
 *
 * Красит только себя (заливка, рамка, `color` для нестилизованного текста).
 * Вложенные контролы остаются на глобальных element-токенах.
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

/** Радиус скругления. */
export type BoxRadius = 'none' | 'sm' | 'md' | 'lg';

/** HTML-элемент корня. */
export type BoxAs = 'div' | 'section' | 'article' | 'aside' | 'main' | 'nav' | 'button' | 'a' | 'li' | 'ul' | 'ol' | 'dl' | 'span';

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
	/** @default 'md' */
	radius?: BoxRadius;
	/**
	 * Корень выбранного `as`.
	 * Союз рефов нужен, потому что `Ref<HTMLDivElement>` не присваивается `Ref<HTMLElement>`.
	 */
	rootRef?: Ref<HTMLElement>
		| Ref<HTMLDivElement>
		| Ref<HTMLSpanElement>
		| Ref<HTMLButtonElement>
		| Ref<HTMLAnchorElement>
		| Ref<HTMLUListElement>
		| Ref<HTMLOListElement>
		| Ref<HTMLLIElement>
		| Ref<HTMLDListElement>;
}
