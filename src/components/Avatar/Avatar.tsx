import type {
	AvatarSize,
	AvatarProps,
	AvatarGroupProps,
} from './Avatar.types';
export type {
	AvatarSize,
	AvatarStatus,
	AvatarProps,
	AvatarGroupProps,
} from './Avatar.types';

import {forwardRef, useMemo} from 'react';
import {IconUser} from '../../icons/icons/IconUser';
import styles from './Avatar.module.css';
import {cn} from '../../utils/cn';
import {mergeStyles} from '../../utils/mergeStyles';

const SIZE_MAP: Record<Exclude<AvatarSize, number>, number> = {
	xs: 24,
	sm: 32,
	md: 44,
	lg: 52,
	xl: 64,
};

const getInitials = (userName: string) => {
	const parts = userName.trim().split(/\s+/);
	if (parts.length >= 2) {
		return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
	}
	return userName.slice(0, 2).toUpperCase();
};

/**
 * Аватар: фото / инициалы / fallback-иконка + status ring.
 *
 * @component
 * @example
 * <Avatar name="Алексей Иванов" size="lg" status="online" />
 */
export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(function Avatar(
	{
		src,
		name,
		size = 'md',
		status,
		className,
		icon,
		style,
		...rest
	},
	ref,
) {
	const px = typeof size === 'number' ? size : SIZE_MAP[size];
	const avatarStyle = useMemo(() => ({
		width: `${px}px`,
		height: `${px}px`,
		fontSize: `${px / 2.5}px`,
	}), [px]);

	return (
		<div
			ref={ref}
			className={cn(styles.avatar, status ? styles.hasStatus : '', className)}
			style={mergeStyles(avatarStyle, style)}
			{...rest}
			data-size={typeof size === 'string' ? size : undefined}
			data-status={status}
		>
			{src ? (
				<img
					src={src}
					alt={name || 'Avatar'}
					className={styles.avatarImg}
				/>
			) : icon ? (
				<span className={styles.avatarIcon}>
					{icon}
				</span>
			) : name ? (
				<span className={styles.avatarIcon}>
					{getInitials(name)}
				</span>
			) : (
				<span className={styles.avatarIcon}>
					<IconUser size={Math.round(px * 0.5)} aria-hidden />
				</span>
			)}
			{status && (
				<span
					className={cn(styles.status, styles[`status_${status}`])}
					aria-label={status}
				/>
			)}
		</div>
	);
});

Avatar.displayName = 'Avatar';

export const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(function AvatarGroup(
	{children, className, ...rest},
	ref,
) {
	return (
		<div
			ref={ref}
			className={cn(styles.avatarGroup, className)}
			{...rest}
		>
			{children}
		</div>
	);
});

AvatarGroup.displayName = 'AvatarGroup';
