import type {
	SkeletonProps,
	SkeletonTextProps,
	SkeletonAvatarProps,
	SkeletonCardProps,
	SkeletonTableProps,
} from './Skeleton.types';
export type {
	SkeletonProps,
	SkeletonTextProps,
	SkeletonAvatarProps,
	SkeletonCardProps,
	SkeletonTableProps,
} from './Skeleton.types';

import {forwardRef, type CSSProperties} from 'react';
import styles from './Skeleton.module.css';
import {cn} from '../../utils/cn';
import {mergeStyles} from '../../utils/mergeStyles';

function toCss(value: string | number | undefined, fallback: string): string {
	if (value === undefined) return fallback;
	return typeof value === 'number' ? `${value}px` : value;
}

/**
 * Плейсхолдер загрузки с пульсирующей анимацией.
 *
 * @component
 * @example
 * <Skeleton width={200} height={16} />
 * <Skeleton.Text lines={3} />
 */
const SkeletonRoot = forwardRef<HTMLDivElement, SkeletonProps>(function SkeletonRoot(
	{
		width = '100%',
		height = '16px',
		circle = false,
		className,
		style,
		...rest
	},
	ref,
) {
	const internalStyle: CSSProperties = {
		width: toCss(width, '100%'),
		height: toCss(height, '16px'),
		borderRadius: circle ? '50%' : undefined,
	};

	return (
		<div
			ref={ref}
			className={cn(styles.skeleton, className)}
			style={mergeStyles(internalStyle, style)}
			{...rest}
			aria-hidden
		/>
	);
});

const SkeletonText = forwardRef<HTMLDivElement, SkeletonTextProps>(function SkeletonText(
	{
		lines = 3,
		width = '100%',
		lastWidth = '64%',
		className,
		...rest
	},
	ref,
) {
	return (
		<div
			ref={ref}
			className={cn(styles.presetStack, className)}
			{...rest}
			aria-hidden
		>
			{Array.from({length: Math.max(1, lines)}, (_, index) => (
				<SkeletonRoot
					key={index}
					width={index === lines - 1 ? lastWidth : width}
					height={12}
					className={styles.textLine}
				/>
			))}
		</div>
	);
});

const SkeletonAvatar = forwardRef<HTMLDivElement, SkeletonAvatarProps>(function SkeletonAvatar(
	{size = 40, className, ...rest},
	ref,
) {
	return (
		<SkeletonRoot
			ref={ref}
			{...rest}
			width={size}
			height={size}
			circle
			className={className}
		/>
	);
});

const SkeletonCard = forwardRef<HTMLDivElement, SkeletonCardProps>(function SkeletonCard(
	{
		avatar = true,
		lines = 2,
		className,
		...rest
	},
	ref,
) {
	return (
		<div
			ref={ref}
			className={cn(styles.card, className)}
			{...rest}
			aria-hidden
		>
			{avatar && <SkeletonAvatar size={40} />}
			<div className={styles.cardBody}>
				<SkeletonRoot width='40%' height={14} />
				<SkeletonText lines={lines} />
			</div>
		</div>
	);
});

const SkeletonTable = forwardRef<HTMLDivElement, SkeletonTableProps>(function SkeletonTable(
	{
		rows = 5,
		columns = 4,
		className,
		...rest
	},
	ref,
) {
	return (
		<div
			ref={ref}
			className={cn(styles.table, className)}
			{...rest}
			aria-hidden
		>
			<div className={styles.tableHeader}>
				{Array.from({length: columns}, (_, index) => (
					<SkeletonRoot
						key={`h-${index}`}
						height={12}
						width='80%'
					/>
				))}
			</div>
			{Array.from({length: rows}, (_, rowIndex) => (
				<div key={`r-${rowIndex}`} className={styles.tableRow}>
					{Array.from({length: columns}, (_, colIndex) => (
						<SkeletonRoot
							key={`c-${colIndex}`}
							height={12}
							width='70%'
						/>
					))}
				</div>
			))}
		</div>
	);
});

SkeletonRoot.displayName = 'Skeleton';
SkeletonText.displayName = 'Skeleton.Text';
SkeletonAvatar.displayName = 'Skeleton.Avatar';
SkeletonCard.displayName = 'Skeleton.Card';
SkeletonTable.displayName = 'Skeleton.Table';

/**
 * Skeleton с пресетами `.Text` / `.Avatar` / `.Card` / `.Table`.
 */
export const Skeleton = Object.assign(SkeletonRoot, {
	Text: SkeletonText,
	Avatar: SkeletonAvatar,
	Card: SkeletonCard,
	Table: SkeletonTable,
});
