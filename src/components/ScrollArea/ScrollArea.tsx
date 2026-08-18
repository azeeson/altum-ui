import type {
	ScrollAreaProps,
} from './ScrollArea.types';
export type {
	ScrollAreaProps,
} from './ScrollArea.types';

import {forwardRef, type CSSProperties} from 'react';
import styles from './ScrollArea.module.css';
import {cn} from '../../utils/cn';
import {mergeStyles} from '../../utils/mergeStyles';

function toCss(value: string | number | undefined) {
	if (value == null) return undefined;
	return typeof value === 'number' ? `${value}px` : value;
}

/**
 * Область со стилизованным скроллом (панели, меню, списки).
 *
 * @component
 * @example
 * <ScrollArea maxHeight={280}>{items}</ScrollArea>
 */
export const ScrollArea = forwardRef<HTMLDivElement, ScrollAreaProps>(function ScrollArea(
	{
		maxHeight = '240px',
		maxWidth,
		orientation = 'y',
		children,
		className,
		style,
		...rest
	},
	ref,
) {
	const mergedStyle = mergeStyles(
		{
			maxHeight: toCss(maxHeight),
			maxWidth: toCss(maxWidth),
		} as CSSProperties,
		style,
	);

	return (
		<div
			ref={ref}
			className={cn(styles.root, styles[orientation], className)}
			style={mergedStyle}
			{...rest}
			data-orientation={orientation}
		>
			{children}
		</div>
	);
});

ScrollArea.displayName = 'ScrollArea';
