import type {
	BackdropProps,
} from './Backdrop.types';
export type {
	BackdropVariant,
	BackdropBlur,
	BackdropPosition,
	BackdropProps,
} from './Backdrop.types';

import {forwardRef} from 'react';
import {wrapOverlayDismiss} from '../../utils/overlayDismiss';
import styles from './Backdrop.module.css';
import {cn} from '../../utils/cn';
import {mergeStyles} from '../../utils/mergeStyles';

/**
 * Полупрозрачный оверлей под модалками, lightbox и crop-панелями.
 *
 * @component
 * @example
 * <Backdrop onClick={onClose} variant="strong" blur="md" />
 */
export const Backdrop = forwardRef<HTMLDivElement, BackdropProps>(function Backdrop(
	{
		variant = 'default',
		blur = 'sm',
		position = 'fixed',
		onClick,
		className,
		style,
		zIndex,
		...rest
	},
	ref,
) {
	const blurClass =
		blur === 'md' ? styles.blurMd : blur === 'none' ? styles.blurNone : styles.blurSm;

	const internalStyle = zIndex !== undefined ? {zIndex} : undefined;

	return (
		<div
			ref={ref}
			className={cn(
				styles.backdrop,
				blurClass,
				variant === 'strong' ? styles.variantStrong : '',
				position === 'absolute' ? styles.absolute : '',
				onClick ? styles.dismissible : '',
				className,
			)}
			{...rest}
			style={mergeStyles(internalStyle, style)}
			onClick={onClick ? wrapOverlayDismiss(onClick) : undefined}
			aria-hidden='true'
		/>
	);
});

Backdrop.displayName = 'Backdrop';
