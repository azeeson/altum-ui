import type {
	BadgeVariant,
	BadgeProps,
	BadgeCounterProps,
} from './Badge.types';
export type {
	BadgeVariant,
	BadgeSize,
	BadgePosition,
	BadgeProps,
	BadgeCounterProps,
} from './Badge.types';

import {forwardRef} from 'react';
import styles from './Badge.module.css';
import {cn} from '../../utils/cn';

const VARIANT_CLASS: Record<BadgeVariant, string> = {
	error: 'danger',
	success: 'success',
	info: 'info',
	warning: 'warning',
	primary: 'primary',
	secondary: 'secondary',
};

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
	const tone = VARIANT_CLASS[variant];
	const position = positionProp ?? (children != null ? 'overlay' : 'standalone');
	const badgeClasses = cn(
		styles.badge,
		styles[tone],
		styles[size],
		dot ? styles.badgeDot : '',
		position === 'standalone' ? styles.standalone : styles.overlay,
		className,
	);

	const displayLabel = formatBadgeLabel(label, max);

	const mark = (label !== undefined || dot) ? (
		<span
			ref={position === 'standalone' ? ref as React.Ref<HTMLSpanElement> : undefined}
			className={badgeClasses}
			{...(position === 'standalone' ? rest : {})}
		>
			{/* Числовой 0 — валидный видимый счётчик (falsy `&&` в React прятал глиф). */}
			{!dot && displayLabel != null ? displayLabel : null}
		</span>
	) : null;

	if (position === 'standalone' || children == null) {
		return mark;
	}

	return (
		<div
			ref={ref as React.Ref<HTMLDivElement>}
			className={styles.badgeContainer}
			{...rest}
		>
			{children}
			{mark}
		</div>
	);
});

Badge.displayName = 'Badge';

/**
 * Показывает `Badge` только при `counter > 0`.
 * Числа по умолчанию капаются через `max` (9 → `9+`).
 */
export const BadgeCounter = forwardRef<HTMLDivElement | HTMLSpanElement, BadgeCounterProps>(
	function BadgeCounter(
		{
			counter,
			variant,
			size,
			position,
			max = 9,
			children,
			className,
			...rest
		},
		ref,
	) {
		if (counter > 0) {
			return (
				<Badge
					ref={ref}
					label={counter}
					variant={variant}
					size={size}
					position={position}
					max={max}
					className={className}
					{...rest}
				>
					{children}
				</Badge>
			);
		}

		if (children == null) {
			return null;
		}

		return (
			<span
				ref={ref as React.Ref<HTMLSpanElement>}
				style={{display: 'contents'}}
			>
				{children}
			</span>
		);
	},
);

BadgeCounter.displayName = 'BadgeCounter';
