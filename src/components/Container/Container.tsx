import type {
	ContainerProps,
	PageProps,
} from './Container.types';
export type {
	ContainerSize,
	ContainerProps,
	PageProps,
} from './Container.types';

import styles from './Container.module.css';
import {cn} from '../../core/utils/cn';

/**
 * Контентная колонка: max-width + горизонтальные отступы страницы.
 *
 * @component
 * @example
 * <Container size="lg">{content}</Container>
 */
export function Container({
	size = 'lg',
	padded = true,
	as: Comp = 'div',
	className,
	style,
	rootRef,
	...rest
}: ContainerProps) {
	return (
		<Comp
			{...rest}
			ref={rootRef as never}
			className={cn(styles.container, className)}
			data-size={size === 'lg' ? undefined : size}
			data-padded={padded ? undefined : 'false'}
			style={style}
		/>
	);
}

/**
 * Корневая оболочка экрана: фон на всю ширину, контент в `Container`.
 *
 * @component
 * @example
 * <Page size="xl">{content}</Page>
 */
export function Page({
	children,
	size = 'lg',
	padded = true,
	verticalPadding = true,
	className,
	style,
	rootRef,
	...rest
}: PageProps) {
	return (
		<div
			ref={rootRef}
			className={cn(styles.page, className)}
			style={style}
			data-vertical-padding={verticalPadding ? '' : undefined}
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
}
