import type {
	TitleProps,
} from './Title.types';
export type {
	TitleProps,
} from './Title.types';

import {Typography} from '../../base/Typography';
import styles from './Title.module.css';
import {cn} from '../../core/utils/cn';

/**
 * Заголовок страницы или секции с семантическим уровнем h1–h4.
 * Цвет — `--altum-color-type`.
 *
 * @component
 * @example
 * <Title level={1} id="page-heading">Настройки аккаунта</Title>
 */
export const Title = ({
	level = 2,
	weight = 'bold',
	className,
	rootRef,
	...rest
}: TitleProps) => (
	<Typography
		as={`h${level}`}
		rootRef={rootRef}
		className={cn(styles.title, className)}
		data-level={level !== 2 ? level : undefined}
		data-weight={weight !== 'bold' ? weight : undefined}
		{...rest}
	/>
);
