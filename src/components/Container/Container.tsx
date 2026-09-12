import type {
	ContainerProps,
	PageProps,
} from './Container.types';
export type {
	ContainerSize,
	ContainerProps,
	PageProps,
} from './Container.types';

import {forwardRef} from 'react';
import {As} from '../../base/As';
import styles from './Container.module.css';
import {cn} from '../../utils/cn';

/**
 * Контентная колонка: max-width + горизонтальные отступы страницы.
 *
 * @component
 * @example
 * <Container size="lg">{content}</Container>
 */
export const Container = forwardRef<HTMLElement, ContainerProps>(function Container(
	{
		size = 'lg',
		padded = true,
		as = 'div',
		className,
		...rest
	},
	ref,
) {
	return (
		<As
			ref={ref}
			as={as}
			className={cn(
				styles.container,
				padded === false && styles.flush,
				className,
			)}
			data-size={size === 'lg' ? undefined : size}
			{...rest}
		/>
	);
});

Container.displayName = 'Container';

/**
 * Корневая оболочка экрана: фон на всю ширину, контент в `Container`.
 *
 * @component
 * @example
 * <Page size="xl">{content}</Page>
 */
export const Page = forwardRef<HTMLDivElement, PageProps>(function Page(
	{
		children,
		size = 'lg',
		padded = true,
		verticalPadding = true,
		className,
		style,
		...rest
	},
	ref,
) {
	return (
		<div
			ref={ref}
			className={cn(styles.page, verticalPadding && styles.pageVertical, className)}
			style={style}
		>
			<Container
				size={size}
				padded={padded}
				{...rest}
			>
				{children}
			</Container>
		</div>
	);
});

Page.displayName = 'Page';
