import type {EmptyStateProps} from './EmptyState.types';
export type {EmptyStateSize, EmptyStateProps} from './EmptyState.types';

import {Text} from '../Text/Text';
import {Title} from '../Title/Title';
import styles from './EmptyState.module.css';
import utilities from '../../styles/utilities.module.css';
import {cn} from '../../core/utils/cn';

/**
 * Заглушка пустого списка или раздела с иконкой, текстом и действием.
 *
 * @component
 * @example
 * <EmptyState size="sm" title="Нет задач" description="Создайте первую задачу." />
 */
export function EmptyState({
	icon,
	title,
	description,
	action,
	size = 'md',
	className,
	rootRef,
	...rest
}: EmptyStateProps) {
	return (
		<div
			ref={rootRef}
			{...rest}
			className={cn(utilities.fColumn, utilities.fCenter, styles.emptyState, className)}
			data-size={size !== 'md' ? size : undefined}
		>
			{icon ? (
				<div className={cn(utilities.fCenter, styles.icon)}>
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
}
