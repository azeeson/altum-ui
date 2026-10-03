import type {CSSProperties} from 'react';
import type {SkeletonProps} from './Skeleton.types';
export type {SkeletonVariant, SkeletonProps} from './Skeleton.types';

import styles from './Skeleton.module.css';
import {cn} from '../../core/utils/cn';
import {toCssSize} from '../../core/utils/cssSize';

function bar(width: string | number, height: string | number, circle?: boolean, head?: boolean) {
	return (
		<span
			className={styles.bar}
			data-circle={circle ? '' : undefined}
			data-head={head ? '' : undefined}
			style={{
				'--local-w': toCssSize(width),
				'--local-h': toCssSize(height),
			} as CSSProperties}
		/>
	);
}

/**
 * Плейсхолдер загрузки с пульсирующей анимацией.
 *
 * @component
 * @example
 * <Skeleton width={200} height={16} />
 * <Skeleton variant="text" lines={3} />
 */
export const Skeleton = ({
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
	rootRef,
	...rest
}: SkeletonProps) => {
	const n = Math.max(1, lines ?? (variant === 'card' ? 2 : 3));
	const lineBars = variant === 'text' || variant === 'card'
		? Array.from({length: n}, (_, index) => bar(index === n - 1 ? lastWidth : width, 12))
		: null;

	return (
		<div
			ref={rootRef}
			{...rest}
			className={cn(styles.root, className)}
			data-variant={variant}
			data-circle={circle || variant === 'avatar' ? '' : undefined}
			style={{
				...(variant === 'block'
					? {
						'--altum-skeleton-width': toCssSize(width),
						'--altum-skeleton-height': toCssSize(height),
					}
					: null),
				...(variant === 'avatar'
					? {'--altum-skeleton-size': toCssSize(size)}
					: null),
				...(variant === 'table'
					? {'--altum-skeleton-cols': String(columns)}
					: null),
				...style,
			} as CSSProperties}
			aria-hidden
		>
			{variant === 'text' && lineBars}
			{variant === 'card' && (
				<>
					{avatar ? bar(40, 40, true) : null}
					<div className={styles.col}>
						{bar('40%', 14)}
						{lineBars}
					</div>
				</>
			)}
			{variant === 'table' && Array.from(
				{length: columns * (rows + 1)},
				(_, index) => bar(index < columns ? '80%' : '70%', 12, false, index < columns),
			)}
		</div>
	);
};
