import type {
	ScrollAreaProps,
} from './ScrollArea.types';
export type {
	ScrollAreaProps,
} from './ScrollArea.types';

import {forwardRef} from 'react';
import styles from './ScrollArea.module.css';
import scroll from '../../styles/scroll.module.css';
import {cn} from '../../utils/cn';
import {mergeStyles} from '../../utils/mergeStyles';
import {toCssSize} from '../../utils/cssSize';

/**
 * Область со стилизованным скроллом (панели, меню, списки).
 *
 * @component
 * @example
 * <ScrollArea maxHeight={280}>{items}</ScrollArea>
 */
export const ScrollArea = forwardRef<HTMLDivElement, ScrollAreaProps>(function ScrollArea(
	{
		maxHeight,
		maxWidth,
		orientation = 'y',
		className,
		style,
		...rest
	},
	ref,
) {
	return (
		<div
			ref={ref}
			className={cn(
				scroll.area,
				styles.root,
				orientation !== 'both' && styles[orientation],
				className,
			)}
			style={mergeStyles({
				maxHeight: maxHeight != null ? toCssSize(maxHeight) : undefined,
				maxWidth: maxWidth != null ? toCssSize(maxWidth) : undefined,
			}, style)}
			{...rest}
		/>
	);
});

ScrollArea.displayName = 'ScrollArea';
