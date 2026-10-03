import type {MarkerProps} from './Marker.types';
export type {
	MarkerVariant,
	MarkerProps,
} from './Marker.types';

import styles from './Marker.module.css';
import utilities from '../../styles/utilities.module.css';
import {cn} from '../../core/utils/cn';
import {Text} from '../Text/Text';

/**
 * Inline-маркер в ленте: статус, системная заметка, bordered-row или labeled separator.
 *
 * @component
 * @example
 * <Marker icon={<IconSearch />}>Просмотрено 4 файла</Marker>
 */
export const Marker = ({
	children,
	icon,
	shimmer = false,
	variant = 'default',
	className,
	rootRef,
	...rest
}: MarkerProps) => {
	return (
		<div
			ref={rootRef}
			className={cn(utilities.fCenter, styles.marker, className)}
			data-variant={variant}
			{...rest}
		>
			{icon != null && (
				<span className={cn(utilities.fCenter, styles.icon)} aria-hidden>
					{icon}
				</span>
			)}
			{children != null && (
				<Text
					as='span'
					className={styles.content}
					data-shimmer={shimmer ? '' : undefined}
				>
					{children}
				</Text>
			)}
		</div>
	);
};
