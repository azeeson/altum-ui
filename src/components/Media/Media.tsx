import type {
	MediaProps,
} from './Media.types';
export type {
	MediaProps,
} from './Media.types';

import type React from 'react';
import type {CSSProperties} from 'react';
import styles from './Media.module.css';
import {cn} from '../../core/utils/cn';

/**
 * Медиа-превью с фиксированным `aspect-ratio` (img / video).
 *
 * @component
 * @example
 * <Media src="/cover.jpg" alt="Обложка" ratio={1} />
 */
export const Media = ({
	src,
	alt = '',
	as = 'img',
	poster,
	fit = 'cover',
	rounded = true,
	ratio = 16 / 9,
	className,
	style,
	rootRef,
	onError,
	...rest
}: MediaProps) => {
	const isVideo = as === 'video';
	const Tag = isVideo ? 'video' : 'img';

	return (
		<div
			ref={rootRef}
			className={cn(styles.media, className)}
			style={{
				'--altum-media-ratio': String(ratio),
				...style,
			} as CSSProperties}
			data-rounded={rounded ? '' : undefined}
			data-fit={fit !== 'cover' ? fit : undefined}
			{...rest}
		>
			<Tag
				src={src}
				className={styles.el}
				onError={onError as (
					React.ReactEventHandler<HTMLImageElement>
					& React.ReactEventHandler<HTMLVideoElement>
				) | undefined}
				{...(isVideo
					? {
						poster,
						muted: true,
						playsInline: true,
						controls: false,
						'aria-label': alt || undefined,
					}
					: {
						alt,
						loading: 'lazy' as const,
						decoding: 'async' as const,
					})}
			/>
		</div>
	);
};
