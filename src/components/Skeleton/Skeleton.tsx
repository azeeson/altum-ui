import type {SkeletonProps} from './Skeleton.types';
export type {
	SkeletonVariant,
	SkeletonProps,
} from './Skeleton.types';

import {forwardRef, type CSSProperties} from 'react';
import styles from './Skeleton.module.css';
import {cn} from '../../utils/cn';
import {toCssSize} from '../../utils/cssSize';

const bar = (width: string | number, height: string | number, extra?: string) => (
	<i
		className={cn(styles.bar, extra)}
		style={{
			width: toCssSize(width),
			height: toCssSize(height),
		}}
	/>
);

/**
 * Плейсхолдер загрузки с пульсирующей анимацией.
 *
 * @component
 * @example
 * <Skeleton width={200} height={16} />
 * <Skeleton variant="text" lines={3} />
 */
export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(function Skeleton(
	{
		variant = 'block',
		width = '100%',
		height = '16px',
		circle = false,
		lines,
		lastWidth = '64%',
		size = 40,
		avatar = true,
		rows = 5,
		columns = 4,
		className,
		style,
		...rest
	},
	ref,
) {
	const n = Math.max(1, lines ?? (variant === 'card' ? 2 : 3));
	const lineBars = variant === 'text' || variant === 'card'
		? Array.from({length: n}, (_, index) => bar(index === n - 1 ? lastWidth : width, 12))
		: null;
	const isBar = variant === 'block' || variant === 'avatar';

	return (
		<div
			ref={ref}
			className={cn(
				styles.root,
				styles[variant],
				(circle || variant === 'avatar') && styles.circle,
				className,
			)}
			style={{
				...(isBar
					? {
						width: toCssSize(variant === 'avatar' ? size : width),
						height: toCssSize(variant === 'avatar' ? size : height),
					}
					: null),
				...(variant === 'table' ? {'--altum-skeleton-cols': columns} as CSSProperties : null),
				...style,
			}}
			{...rest}
			aria-hidden
		>
			{variant === 'text' && lineBars}
			{variant === 'card' && (
				<>
					{avatar ? bar(40, 40, styles.circle) : null}
					<div className={styles.col}>
						{bar('40%', 14)}
						{lineBars}
					</div>
				</>
			)}
			{variant === 'table' && Array.from(
				{length: columns * (rows + 1)},
				(_, index) => bar(index < columns ? '80%' : '70%', 12, index < columns ? styles.head : undefined),
			)}
		</div>
	);
});

Skeleton.displayName = 'Skeleton';
