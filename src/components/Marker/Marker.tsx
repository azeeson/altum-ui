import type {
	MarkerProps,
	MarkerIconProps,
	MarkerContentProps,
} from './Marker.types';
export type {
	MarkerVariant,
	MarkerProps,
	MarkerIconProps,
	MarkerContentProps,
} from './Marker.types';

import {forwardRef} from 'react';
import styles from './Marker.module.css';
import {cn} from '../../utils/cn';

const MarkerRoot = forwardRef<HTMLDivElement, MarkerProps>(function MarkerRoot(
	{
		children,
		variant = 'default',
		className,
		role,
		...rest
	},
	ref,
) {
	return (
		<div
			ref={ref}
			className={cn(styles.marker, styles[variant], className)}
			data-variant={variant}
			{...rest}
			role={role}
		>
			{variant === 'separator' && <span className={styles.line} aria-hidden />}
			<div className={styles.inner}>
				{children}
			</div>
			{variant === 'separator' && <span className={styles.line} aria-hidden />}
		</div>
	);
});

const MarkerIcon = forwardRef<HTMLSpanElement, MarkerIconProps>(function MarkerIcon(
	{children, className, ...rest},
	ref,
) {
	return (
		<span
			ref={ref}
			className={cn(styles.icon, className)}
			{...rest}
			aria-hidden={rest['aria-hidden'] ?? true}
		>
			{children}
		</span>
	);
});

const MarkerContent = forwardRef<HTMLSpanElement, MarkerContentProps>(function MarkerContent(
	{children, className, shimmer = false, ...rest},
	ref,
) {
	return (
		<span
			ref={ref}
			className={cn(styles.content, shimmer ? styles.shimmer : '', className)}
			{...rest}
		>
			{children}
		</span>
	);
});

MarkerRoot.displayName = 'Marker';
MarkerIcon.displayName = 'Marker.Icon';
MarkerContent.displayName = 'Marker.Content';

/**
 * Inline-маркер в ленте: статус, системная заметка, bordered-row или labeled separator.
 *
 * @component
 * @example
 * <Marker>
 *   <Marker.Icon><IconSearch /></Marker.Icon>
 *   <Marker.Content>Просмотрено 4 файла</Marker.Content>
 * </Marker>
 */
export const Marker = Object.assign(MarkerRoot, {
	Icon: MarkerIcon,
	Content: MarkerContent,
});
