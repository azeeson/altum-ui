import type {
	BoxProps,
} from './Box.types';
export type {
	BoxVariant,
	BoxShadow,
	BoxBorderStyle,
	BoxRadius,
	BoxAs,
	BoxProps,
} from './Box.types';

import {type ButtonHTMLAttributes, type CSSProperties, type ElementType} from 'react';
import styles from './Box.module.css';
import {cn} from '../../core/utils/cn';

/**
 * Сброс заливки, рамки и цвета `Box`, когда наследник рисует свою геометрию.
 * Инлайн побеждает класс `.root`, поэтому радиус и фон компонента не подмешиваются.
 */
export const boxInheritStyle: CSSProperties = {
	border: 'none',
	backgroundColor: 'transparent',
	boxShadow: 'none',
	color: 'inherit',
	borderRadius: 0,
};

/**
 * Примитив поверхности: заливка (`variant`) + `border` / `borderStyle` / `shadow`.
 * Не переопределяет element-токены потомков — кнопки, чипы и поля остаются на глобальной палитре.
 * Отступы задаёт потребитель (класс / `style`), не проп `padding`.
 *
 * @component
 * @example
 * <Box variant="outlined" border>С рамкой</Box>
 * <Box variant="muted" className={styles.padded}>Мягкая заливка</Box>
 * <Box variant="ghost" border borderStyle="dashed">Пунктир</Box>
 */
export const Box = ({
	variant = 'outlined',
	border,
	borderStyle = 'solid',
	shadow,
	as: Component = 'div',
	radius = 'md',
	className,
	rootRef,
	...rest
}: BoxProps) => {
	const Element = Component as ElementType;

	return (
		<Element
			ref={rootRef}
			className={cn(styles.root, className)}
			data-variant={variant}
			data-border={border !== undefined ? String(border) : undefined}
			data-border-style={borderStyle !== 'solid' ? borderStyle : undefined}
			data-shadow={shadow || undefined}
			data-radius={radius !== 'md' ? radius : undefined}
			{...rest}
			{...(Component === 'button'
				? {type: (rest as ButtonHTMLAttributes<HTMLButtonElement>).type ?? 'button'}
				: null)}
		/>
	);
};
