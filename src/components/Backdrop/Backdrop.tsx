import type {
	BackdropProps,
} from './Backdrop.types';
export type {
	BackdropVariant,
	BackdropBlur,
	BackdropPosition,
	BackdropProps,
} from './Backdrop.types';

import {forwardRef, type CSSProperties} from 'react';
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
	return (
		<div
			ref={ref}
			className={cn(
				styles.backdrop,
				variant === 'strong' && styles.strong,
				position === 'absolute' && styles.absolute,
				blur === 'none' && styles.noBlur,
				onClick && styles.dismissible,
				className,
			)}
			{...rest}
			style={mergeStyles({
				...(zIndex !== undefined ? {zIndex} : null),
				...(blur === 'md' ? {'--altum-backdrop-blur': '8px'} : null),
			} as CSSProperties, style)}
			onClick={onClick ? wrapOverlayDismiss(onClick) : undefined}
			aria-hidden='true'
		/>
	);
});

Backdrop.displayName = 'Backdrop';
