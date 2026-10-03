import type {
	AspectRatioProps,
} from './AspectRatio.types';
export type {
	AspectRatioProps,
} from './AspectRatio.types';

import type {CSSProperties} from 'react';
import styles from './AspectRatio.module.css';
import {cn} from '../../core/utils/cn';

/**
 * Обёртка с фиксированным `aspect-ratio` (превью 16:9 / 1:1 без магии в CSS).
 *
 * @component
 * @example
 * <AspectRatio ratio={16 / 9}>
 *   <img src={src} alt="" />
 * </AspectRatio>
 */
export function AspectRatio({
	ratio = 16 / 9,
	children,
	className,
	style,
	rootRef,
	...rest
}: AspectRatioProps) {
	return (
		<div
			{...rest}
			ref={rootRef}
			className={cn(styles.root, className)}
			style={{
				border: 'none',
				boxShadow: 'none',
				color: 'inherit',
				'--altum-aspect-ratio': String(ratio),
				...style,
			} as CSSProperties}
		>
			{children}
		</div>
	);
}
