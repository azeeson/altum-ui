import type {
	BadgeProps,
} from './Badge.types';
export type {
	BadgeVariant,
	BadgeSize,
	BadgePosition,
	BadgeProps,
} from './Badge.types';

import type {ReactNode, Ref} from 'react';
import styles from './Badge.module.css';
import {cn} from '../../core/utils/cn';

/**
 * Числовой `label` режется до `{max}+`. Узел остаётся узлом.
 */
function badgeGlyph(label: ReactNode, dot: boolean, max: number | false | undefined): ReactNode {
	if (dot || label == null) return null;
	if (typeof label !== 'number' || !Number.isFinite(label)) return label;
	const cap = max === false ? null : (max ?? 9);
	return cap != null && label > cap ? `${cap}+` : label;
}

/**
 * Индикатор: overlay на children или standalone; размеры sm/md.
 *
 * @component
 * @example
 * <Badge label={3} size="sm"><ButtonIcon variant='ghost' /></Badge>
 * <Badge label="Бета" position="standalone" variant="info" />
 */
export const Badge = ({
	label,
	dot = false,
	variant = 'error',
	size = 'md',
	position: positionProp,
	max,
	children,
	className,
	rootRef,
	...rest
}: BadgeProps) => {
	const isOverlay = children != null && positionProp !== 'standalone';
	const showMark = label !== undefined || dot;
	const glyph = badgeGlyph(label, dot, max);
	const markProps = {
		'data-variant': variant !== 'error' ? variant : undefined,
		'data-size': size !== 'md' ? size : undefined,
		'data-dot': dot ? '' as const : undefined,
		'data-position': isOverlay ? 'overlay' as const : undefined,
		className: cn(styles.badge, !isOverlay && className),
	};

	if (!isOverlay) {
		if (!showMark) return null;
		return (
			<span
				ref={rootRef as Ref<HTMLSpanElement> | undefined}
				{...markProps}
				{...rest}
			>
				{glyph}
			</span>
		);
	}

	return (
		<div
			ref={rootRef as Ref<HTMLDivElement> | undefined}
			className={cn(styles.wrap, className)}
			{...rest}
		>
			{children}
			{showMark ? (
				<span {...markProps}>
					{glyph}
				</span>
			) : null}
		</div>
	);
};
