import type {
	AspectRatioProps,
} from './AspectRatio.types';
export type {
	AspectRatioProps,
} from './AspectRatio.types';

import {forwardRef} from 'react';
import styles from './AspectRatio.module.css';
import {cn} from '../../utils/cn';

/**
 * Обёртка с фиксированным `aspect-ratio` (превью 16:9 / 1:1 без магии в CSS).
 *
 * @component
 * @example
 * <AspectRatio ratio={16 / 9}>
 *   <img src={src} alt="" />
 * </AspectRatio>
 */
export const AspectRatio = forwardRef<HTMLDivElement, AspectRatioProps>(function AspectRatio(
	{
		ratio = 16 / 9,
		children,
		className,
		style,
		...rest
	},
	ref,
) {
	return (
		<div
			ref={ref}
			className={cn(styles.root, className)}
			style={{
				aspectRatio: ratio,
				...style
			}}
			{...rest}
		>
			{children}
		</div>
	);
});

AspectRatio.displayName = 'AspectRatio';
