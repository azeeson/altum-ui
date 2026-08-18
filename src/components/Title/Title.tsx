import type {
	TitleProps,
} from './Title.types';
export type {
	TitleProps,
} from './Title.types';

import {forwardRef} from 'react';
import styles from './Title.module.css';
import {cn} from '../../utils/cn';

/**
 * Заголовок страницы или секции с семантическим уровнем h1–h4.
 * Цвет — `--altum-color-type` (адаптируется внутри `Box`).
 *
 * @component
 * @example
 * <Title level={1} id="page-heading">Настройки аккаунта</Title>
 */
export const Title = forwardRef<HTMLHeadingElement, TitleProps>(function Title(
	{
		level = 2,
		weight = 'bold',
		children,
		className,
		style,
		...rest
	},
	ref,
) {
	const Component = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4';

	return (
		<Component
			ref={ref}
			className={cn(styles.title, styles[`h${level}`], styles[weight], className)}
			style={style}
			{...rest}
		>
			{children}
		</Component>
	);
});

Title.displayName = 'Title';
