import type {
	MediaProps,
} from './Media.types';
export type {
	MediaProps,
} from './Media.types';

import {forwardRef} from 'react';
import styles from './Media.module.css';
import {cn} from '../../utils/cn';
import {mergeStyles} from '../../utils/mergeStyles';

/**
 * Медиа-превью с фиксированным `aspect-ratio` (img / video).
 *
 * @component
 * @example
 * <Media src="/cover.jpg" alt="Обложка" ratio={1} />
 */
export const Media = forwardRef<HTMLDivElement, MediaProps>(function Media(
	{
		src,
		alt = '',
		as = 'img',
		poster,
		fit = 'cover',
		rounded = true,
		ratio = 16 / 9,
		className,
		style,
		...rest
	},
	ref,
) {
	const isVideo = as === 'video';
	const Tag = isVideo ? 'video' : 'img';

	return (
		<div
			ref={ref}
			className={cn(styles.media, rounded && styles.rounded, className)}
			style={mergeStyles({aspectRatio: ratio}, style)}
			{...rest}
		>
			<Tag
				src={src}
				className={cn(styles.el, styles[fit])}
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
});

Media.displayName = 'Media';
