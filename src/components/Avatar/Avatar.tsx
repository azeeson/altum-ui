import type {
	AvatarProps,
	AvatarGroupProps,
} from './Avatar.types';
export type {
	AvatarSize,
	AvatarStatus,
	AvatarProps,
	AvatarGroupProps,
} from './Avatar.types';

import {forwardRef, type CSSProperties} from 'react';
import {IconUser} from '../../icons/icons/IconUser';
import styles from './Avatar.module.css';
import {cn} from '../../utils/cn';

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
	return (
		<div
			ref={ref}
			aria-label={name}
			aria-description={status}
			{...rest}
			className={cn(
				styles.avatar,
				typeof size === 'string' && size !== 'md' ? styles[size] : '',
				className,
			)}
			style={typeof size === 'number'
				? {
					['--altum-avatar-size' as string]: `${size}px`,
					...style,
				} as CSSProperties
				: style}
			data-status={status}
		>
			{src ? (
				<img
					src={src}
					alt={name || 'Avatar'}
					className={styles.img}
				/>
			) : (
				<span className={styles.icon}>
					{icon ?? (name ? getInitials(name) : <IconUser aria-hidden />)}
				</span>
			)}
		</div>
	);
});

Avatar.displayName = 'Avatar';

export const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(function AvatarGroup(
	{className, ...rest},
	ref,
) {
	return (
		<div
			ref={ref}
			className={cn(styles.group, className)}
			{...rest}
		/>
	);
});

AvatarGroup.displayName = 'AvatarGroup';
