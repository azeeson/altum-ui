import type React from 'react';
import type {
	ComponentPropsWithoutRef,
} from 'react';

/**
 * Максимальная ширина (`ContainerSize`).
 */
export type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

/**
 * Свойства `Container`.
 */
export interface ContainerProps extends ComponentPropsWithoutRef<'div'> {
	children: React.ReactNode;
	/**
	 * Max-width контентной колонки.
	 * @default 'lg'
	 */
	size?: ContainerSize;
	/** Горизонтальные отступы. @default true */
	padded?: boolean;
	as?: 'div' | 'section' | 'main' | 'article';
}

/**
 * Свойства `Page` — полноэкранная оболочка страницы + Container внутри.
 */
export interface PageProps extends Omit<ContainerProps, 'as'> {
	/** Вертикальный padding страницы. @default true */
	verticalPadding?: boolean;
}
