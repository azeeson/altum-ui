import type {CSSProperties} from 'react';
import type {ScrollAreaProps} from './ScrollArea.types';
export type {ScrollAreaProps} from './ScrollArea.types';

import styles from './ScrollArea.module.css';
import scroll from '../../styles/scrollable.module.css';
import {cn} from '../../core/utils/cn';
import {toCssSize} from '../../core/utils/cssSize';

/**
 * Область со стилизованным скроллом (панели, меню, списки).
 *
 * @component
 * @example
 * <ScrollArea maxHeight={280}>{items}</ScrollArea>
 */
export const ScrollArea = ({
	maxHeight,
	maxWidth,
	orientation = 'y',
	className,
	style,
	rootRef,
	...rest
}: ScrollAreaProps) => (
	<div
		ref={rootRef}
		{...rest}
		className={cn(scroll.area, styles.root, className)}
		data-orientation={orientation}
		style={{
			'--altum-scroll-area-max-height': maxHeight != null ? toCssSize(maxHeight) : undefined,
			'--altum-scroll-area-max-width': maxWidth != null ? toCssSize(maxWidth) : undefined,
			...style,
		} as CSSProperties}
	/>
);
