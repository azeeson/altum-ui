import type {
	BoxVariant,
	BoxShadow,
	BoxPadding,
	BoxRadius,
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

/** Исторические дефолты рамки/тени по варианту (перекрываются пропами). */
const VARIANT_CHROME: Record<BoxVariant, {
	border: boolean;
	shadow: BoxShadow
}> = {
	outlined: {
		border: true,
		shadow: 'none'
	},
	elevated: {
		border: false,
		shadow: 'sm'
	},
	floating: {
		border: true,
		shadow: 'md'
	},
	tinted: {
		border: true,
		shadow: 'none'
	},
	secondary: {
		border: true,
		shadow: 'none'
	},
	muted: {
		border: false,
		shadow: 'none'
	},
	glass: {
		border: true,
		shadow: 'sm'
	},
	overlay: {
		border: true,
		shadow: 'none'
	},
	ghost: {
		border: false,
		shadow: 'none'
	},
	plain: {
		border: false,
		shadow: 'none'
	},
};

const PADDING_CLASS: Record<BoxPadding, string> = {
	none: styles.paddingNone,
	xs: styles.paddingXs,
	sm: styles.paddingSm,
	md: styles.paddingMd,
	lg: styles.paddingLg,
	xl: styles.paddingXl,
};

const RADIUS_CLASS: Record<BoxRadius, string> = {
	none: styles.radiusNone,
	sm: styles.radiusSm,
	md: styles.radiusMd,
	lg: styles.radiusLg,
};

const SHADOW_CLASS: Record<BoxShadow, string> = {
	none: styles.shadowNone,
	sm: styles.shadowSm,
	md: styles.shadowMd,
	lg: styles.shadowLg,
};

/**
 * Примитив поверхности: заливка (`variant`) + `border` / `borderStyle` / `shadow`.
 * Адаптивные варианты переопределяют element CSS-переменные (`--altum-field-*`, `--altum-color-button-*`, …),
 * чтобы вложенные контролы подхватывали цвета через каскад.
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
		border: borderProp,
		borderStyle = 'solid',
		shadow: shadowProp,
		as: Component = 'div',
		padding = 'none',
		radius = 'md',
		className,
		children,
		...rest
	},
	ref,
) {
	const chrome = VARIANT_CHROME[variant];
	const border = borderProp ?? chrome.border;
	const shadow = shadowProp ?? chrome.shadow;

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
				border ? styles.bordered : styles.borderNone,
				border ? (borderStyle === 'dashed' ? styles.borderDashed : styles.borderSolid) : '',
				SHADOW_CLASS[shadow],
				PADDING_CLASS[padding],
				RADIUS_CLASS[radius],
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
