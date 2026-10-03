import type {
	StatBadgeProps,
} from './StatBadge.types';
export type {
	StatBadgeProps,
} from './StatBadge.types';

import styles from './StatBadge.module.css';
import {cn} from '../../core/utils/cn';

/**
 * Компактный блок метрики «подпись + значение» для дашбордов и профилей.
 *
 * @component
 * @example
 * <StatBadge label="Задачи" value={12} variant="success" />
 */
export const StatBadge = ({
	label,
	value,
	variant = 'default',
	size = 'md',
	className,
	rootRef,
	style,
	...rest
}: StatBadgeProps) => {
	return (
		<div
			{...rest}
			ref={rootRef}
			style={{
				border: 'none',
				boxShadow: 'none',
				...style,
			}}
			className={cn(styles.statBadge, className)}
			aria-label={`${value} ${label}`}
			data-value={value}
			data-label={label}
			data-variant={variant !== 'default' ? variant : 'ghost'}
			data-size={size === 'sm' ? 'sm' : undefined}
		/>
	);
};
