import type {
	EmptyStateProps,
} from './EmptyState.types';
export type {
	EmptyStateSize,
	EmptyStateProps,
} from './EmptyState.types';

import {forwardRef} from 'react';
import {Text} from '../Text/Text';
import {Title} from '../Title/Title';
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
		...rest
	},
	ref,
) {
	return (
		<div
			ref={ref}
			className={cn(styles.emptyState, size !== 'md' && styles[size], className)}
			{...rest}
		>
			{icon ? (
				<div className={styles.icon}>
					{icon}
				</div>
			) : null}
			<Title level={3} className={styles.title}>
				{title}
			</Title>
			{description ? (
				<Text
					as='p'
					color='secondary'
					className={styles.description}
				>
					{description}
				</Text>
			) : null}
			{action ? (
				<div className={styles.action}>
					{action}
				</div>
			) : null}
		</div>
	);
});

EmptyState.displayName = 'EmptyState';
