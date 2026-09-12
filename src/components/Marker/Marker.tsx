import type {MarkerProps} from './Marker.types';
export type {
	MarkerVariant,
	MarkerProps,
} from './Marker.types';

import {forwardRef} from 'react';
import styles from './Marker.module.css';
import {cn} from '../../utils/cn';

/**
 * Inline-маркер в ленте: статус, системная заметка, bordered-row или labeled separator.
 *
 * @component
 * @example
 * <Marker icon={<IconSearch />}>Просмотрено 4 файла</Marker>
 */
export const Marker = forwardRef<HTMLDivElement, MarkerProps>(function Marker(
	{
		children,
		icon,
		shimmer = false,
		variant = 'default',
		className,
		...rest
	},
	ref,
) {
	return (
		<div
			ref={ref}
			className={cn(styles.marker, styles[variant], className)}
			{...rest}
		>
			{icon != null && (
				<span className={styles.icon} aria-hidden>
					{icon}
				</span>
			)}
			{children != null && (
				<span className={cn(styles.content, shimmer && styles.shimmer)}>
					{children}
				</span>
			)}
		</div>
	);
});

Marker.displayName = 'Marker';
