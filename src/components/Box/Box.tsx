import type {
	BoxProps,
} from './Box.types';
export type {
	BoxVariant,
	BoxShadow,
	BoxBorderStyle,
	BoxPadding,
	BoxRadius,
	BoxAs,
	BoxProps,
} from './Box.types';

import {forwardRef, type ButtonHTMLAttributes, type ElementType} from 'react';
import styles from './Box.module.css';
import {cn} from '../../utils/cn';

/**
 * Примитив поверхности: заливка (`variant`) + `border` / `borderStyle` / `shadow`.
 * Не переопределяет element-токены потомков — кнопки, чипы и поля остаются на глобальной палитре.
 *
 * @component
 * @example
 * <Box variant="outlined" border padding="md">С рамкой</Box>
 * <Box variant="muted" padding="sm">Мягкая заливка</Box>
 * <Box variant="ghost" border borderStyle="dashed" padding="xs">Пунктир</Box>
 */
export const Box = forwardRef<HTMLElement, BoxProps>(function Box(
	{
		variant = 'outlined',
		border,
		borderStyle = 'solid',
		shadow,
		as: Component = 'div',
		padding = 'none',
		radius = 'md',
		className,
		children,
		...rest
	},
	ref,
) {
	const buttonProps = Component === 'button'
		? {type: (rest as ButtonHTMLAttributes<HTMLButtonElement>).type ?? 'button'}
		: undefined;

	const Element = Component as ElementType;

	return (
		<Element
			ref={ref as never}
			className={cn(
				styles.root,
				styles[variant],
				border === true && styles.bordered,
				border === false && styles.unbordered,
				border !== false && borderStyle === 'dashed' && styles.dashed,
				shadow === 'none' && styles.noShadow,
				shadow && shadow !== 'none' && styles[`shadow_${shadow}`],
				padding !== 'none' && styles[`pad_${padding}`],
				radius !== 'md' && styles[`radius_${radius}`],
				className,
			)}
			{...rest}
			{...buttonProps}
		>
			{children}
		</Element>
	);
});

Box.displayName = 'Box';
