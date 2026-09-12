import type {
	TitleProps,
} from './Title.types';
export type {
	TitleProps,
} from './Title.types';

import {forwardRef} from 'react';
import {Type} from '../../base/Type';
import styles from './Title.module.css';
import {cn} from '../../utils/cn';

const AS = {
	1: 'h1',
	2: 'h2',
	3: 'h3',
	4: 'h4',
} as const;

/**
 * Заголовок страницы или секции с семантическим уровнем h1–h4.
 * Цвет — `--altum-color-type`.
 *
 * @component
 * @example
 * <Title level={1} id="page-heading">Настройки аккаунта</Title>
 */
export const Title = forwardRef<HTMLHeadingElement, TitleProps>(function Title(
	{
		level = 2,
		weight = 'bold',
		className,
		...rest
	},
	ref,
) {
	return (
		<Type
			ref={ref}
			as={AS[level]}
			weight={weight}
			className={cn(styles[`h${level}`], className)}
			{...rest}
		/>
	);
});

Title.displayName = 'Title';
