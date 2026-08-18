import type {
	ComponentPropsWithoutRef,
	ElementType,
} from 'react';

type MediaRowAs = 'div' | 'section' | 'article' | 'aside' | 'button' | 'a' | 'li';

/**
 * Корень media-строки. `as` — полиморфный контейнер (например `Box`).
 * Внутренний примитив — не публичный API.
 *
 * Поля поверхности совпадают с `Box` (`variant` / `padding` / …), без импорта каталога.
 */
export type MediaRowBaseRootProps = ComponentPropsWithoutRef<'div'> & {
	as?: ElementType;
	/**
	 * HTML-тег поверхности, если `as` — обёртка (`Box`).
	 * Используется `Item` для `as="button"`.
	 */
	itemAs?: MediaRowAs;
	variant?:
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
	border?: boolean;
	borderStyle?: 'solid' | 'dashed';
	shadow?: 'none' | 'sm' | 'md' | 'lg';
	padding?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
	radius?: 'none' | 'sm' | 'md' | 'lg';
};
