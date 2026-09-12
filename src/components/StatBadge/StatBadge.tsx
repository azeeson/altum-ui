import type {
	StatBadgeProps,
} from './StatBadge.types';
export type {
	StatBadgeProps,
} from './StatBadge.types';

import {forwardRef} from 'react';
import styles from './StatBadge.module.css';
import status from '../../styles/status.module.css';
import {cn} from '../../utils/cn';

/**
 * Компактный блок метрики «подпись + значение» для дашбордов и профилей.
 *
 * @component
 * @example
 * <StatBadge label="Задачи" value={12} variant="success" />
 */
export const StatBadge = forwardRef<HTMLDivElement, StatBadgeProps>(function StatBadge(
	{
		label,
		value,
		variant = 'default',
		size = 'md',
		className,
		...rest
	},
	ref,
) {
	return (
		<div
			ref={ref}
			className={cn(
				styles.statBadge,
				variant !== 'default' && status[variant],
				size === 'sm' && styles.sm,
				className,
			)}
			aria-label={`${value} ${label}`}
			{...rest}
		>
			<span className={styles.value}>
				{value}
			</span>
			<span className={styles.label}>
				{label}
			</span>
		</div>
	);
});

StatBadge.displayName = 'StatBadge';
