import type {
	AspectRatioProps,
} from './AspectRatio.types';
export type {
	AspectRatioProps,
} from './AspectRatio.types';

import {forwardRef} from 'react';
import styles from './AspectRatio.module.css';
import {cn} from '../../utils/cn';
import {mergeStyles} from '../../utils/mergeStyles';

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
	const ratioValue = typeof ratio === 'number' ? String(ratio) : ratio;

	return (
		<div
			ref={ref}
			className={cn(styles.root, className)}
			style={mergeStyles(
				{['--altum-aspect-ratio' as string]: ratioValue},
				style,
			)}
			{...rest}
		>
			<div className={styles.content}>
				{children}
			</div>
		</div>
	);
});

AspectRatio.displayName = 'AspectRatio';
