import type {
	EmptyStateSize,
	EmptyStateProps,
} from './EmptyState.types';
export type {
	EmptyStateSize,
	EmptyStateProps,
} from './EmptyState.types';

import {forwardRef} from 'react';
import styles from './EmptyState.module.css';
import {cn} from '../../utils/cn';

/**
 * Заглушка пустого списка или раздела с иконкой, текстом и действием.
 *
 * @component
 * @example
 * <EmptyState size="sm" title="Нет задач" description="Создайте первую задачу." />
 */
export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(function EmptyState(
	{
		icon,
		title,
		description,
		action,
		size = 'md',
		className,
		style,
		...rest
	},
	ref,
) {
	const resolvedSize: EmptyStateSize = size;

	return (
		<div
			ref={ref}
			className={cn(styles.emptyState, styles[resolvedSize], className)}
			style={style}
			{...rest}
			data-size={resolvedSize}
		>
			{icon && (
				<div className={styles.icon}>
					{icon}
				</div>
			)}
			<h3 className={styles.title}>
				{title}
			</h3>
			{description && (
				<p className={styles.description}>
					{description}
				</p>
			)}
			{action && (
				<div className={styles.action}>
					{action}
				</div>
			)}
		</div>
	);
});

EmptyState.displayName = 'EmptyState';
