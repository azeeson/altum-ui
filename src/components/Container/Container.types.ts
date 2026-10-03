import type React from 'react';
import type {
	ComponentPropsWithoutRef,
	Ref,
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
	/** DOM-узел колонки. */
	rootRef?: Ref<HTMLElement>;
}

/**
 * Свойства `Page` — полноэкранная оболочка страницы + Container внутри.
 */
export interface PageProps extends Omit<ContainerProps, 'as' | 'rootRef'> {
	/** Вертикальный padding страницы. @default true */
	verticalPadding?: boolean;
	/** DOM-узел оболочки. */
	rootRef?: Ref<HTMLDivElement>;
}
