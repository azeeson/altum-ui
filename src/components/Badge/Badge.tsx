import type {
	BadgeProps,
} from './Badge.types';
export type {
	BadgeVariant,
	BadgeSize,
	BadgePosition,
	BadgeProps,
} from './Badge.types';

import {forwardRef} from 'react';
import styles from './Badge.module.css';
import status from '../../styles/status.module.css';
import {cn} from '../../utils/cn';

function formatBadgeLabel(
	label: React.ReactNode,
	max: number | false | undefined,
): React.ReactNode {
	if (typeof label !== 'number' || !Number.isFinite(label)) {
		return label;
	}
	const cap = max === false ? null : (max ?? 9);
	if (cap == null || label <= cap) {
		return label;
	}
	return `${cap}+`;
}

/**
 * Индикатор: overlay на children или standalone; размеры sm/md.
 *
 * На `ButtonIcon` sm в плотных рейках предпочитайте `size="sm"`, `max={9}` (по умолчанию для чисел)
 * или `dot`; держите `gap ≥ --altum-g-space-3` между соседями.
 *
 * @component
 * @example
 * <Badge label={3} size="sm"><ButtonIcon … /></Badge>
 * <Badge label={31} size="sm" max={9}><ButtonIcon … /></Badge>
 * <Badge label="Бета" position="standalone" variant="info" />
 */
export const Badge = forwardRef<HTMLDivElement | HTMLSpanElement, BadgeProps>(function Badge(
	{
		label,
		dot = false,
		variant = 'error',
		size = 'md',
		position: positionProp,
		max,
		children,
		className,
		...rest
	},
	ref,
) {
	const isStatus = variant === 'error' || variant === 'success' || variant === 'info' || variant === 'warning';
	const overlay = children != null && (positionProp ?? 'overlay') !== 'standalone';
	const displayLabel = formatBadgeLabel(label, max);
	const showMark = label !== undefined || dot;
	const markClass = cn(
		styles.badge,
		isStatus ? status[variant] : styles[variant],
		isStatus ? (variant === 'warning' && !dot ? status.surface : status.fill) : '',
		styles[size],
		dot ? styles.dot : '',
		overlay ? styles.overlay : styles.standalone,
		overlay ? '' : className,
	);
	const glyph = !dot && displayLabel != null ? displayLabel : null;

	if (!overlay) {
		if (!showMark) return null;
		return (
			<span
				ref={ref as React.Ref<HTMLSpanElement>}
				className={markClass}
				{...rest}
			>
				{glyph}
			</span>
		);
	}

	return (
		<div
			ref={ref as React.Ref<HTMLDivElement>}
			className={cn(styles.wrap, className)}
			{...rest}
		>
			{children}
			{showMark ? (
				<span className={markClass}>
					{glyph}
				</span>
			) : null}
		</div>
	);
});

Badge.displayName = 'Badge';
