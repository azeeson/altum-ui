import type {
	MediaProps,
} from './Media.types';
export type {
	MediaProps,
} from './Media.types';

import {forwardRef} from 'react';
import {AspectRatio} from '../AspectRatio/AspectRatio';
import styles from './Media.module.css';
import {cn} from '../../utils/cn';

/**
 * Медиа-превью с `AspectRatio` (img / video).
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
		...rest
	},
	ref,
) {
	const mediaAlt = as === 'video' ? undefined : alt;
	return (
		<AspectRatio
			ref={ref}
			ratio={ratio}
			className={cn(styles.media, rounded ? styles.rounded : '', className)}
			{...rest}
		>
			{as === 'video' ? (
				<video
					src={src}
					poster={poster}
					className={cn(styles.el, styles[fit])}
					controls={false}
					muted
					playsInline
					aria-label={alt || undefined}
				/>
			) : (
				<img
					src={src}
					alt={mediaAlt ?? ''}
					className={cn(styles.el, styles[fit])}
					loading='lazy'
					decoding='async'
				/>
			)}
		</AspectRatio>
	);
});

Media.displayName = 'Media';
