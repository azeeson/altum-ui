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

import type {CSSProperties, SyntheticEvent} from 'react';
import {IconUser} from '../../icons/icons/IconUser';
import {Media} from '../Media/Media';
import {uEv} from '../../core/utils/bundle';
import styles from './Avatar.module.css';
import utilities from '../../styles/utilities.module.css';
import {cn} from '../../core/utils/cn';

const markImageBroken = (event: SyntheticEvent<HTMLImageElement>) => {
	event.currentTarget.dataset.broken = 'true';
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
export function Avatar({
	src,
	name,
	size = 'md',
	status,
	className,
	icon,
	style,
	rootRef,
	...rest
}: AvatarProps) {
	const isCustomSize = typeof size === 'number';

	return (
		<div
			ref={rootRef}
			aria-label={name}
			aria-description={status}
			{...rest}
			className={cn(utilities.fCenter, styles.avatar, className)}
			style={{
				...(isCustomSize ? {['--altum-avatar-size' as string]: `${size}px`} : null),
				...style,
			} as CSSProperties}
			data-status={status}
			data-size={!isCustomSize && size !== 'md' ? size : undefined}
		>
			{src ? (
				<Media
					key={src}
					src={src}
					alt={name || 'Avatar'}
					ratio={1}
					fit='cover'
					rounded={false}
					className={styles.photo}
					onError={uEv(markImageBroken)}
				/>
			) : null}
			<span className={cn(utilities.fCenter, styles.icon)}>
				{icon ?? (name ? getInitials(name) : <IconUser aria-hidden />)}
			</span>
		</div>
	);
}

export function AvatarGroup({
	className,
	rootRef,
	...rest
}: AvatarGroupProps) {
	return (
		<div
			ref={rootRef}
			{...rest}
			className={cn(styles.group, className)}
		/>
	);
}
