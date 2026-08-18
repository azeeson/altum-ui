import {forwardRef} from 'react';
import {cn} from '../../utils/cn';
import {alignClass, flexStyles as styles, gapClass} from './layoutClasses';
import type {SplitProps} from './Layout.types';

export type {LayoutAlign, LayoutGap, SplitProps} from './Layout.types';

/**
 * Горизонтальный ряд с `justify-content: space-between`: левый и правый блоки
 * у противоположных краёв (page header, toolbar, строка списка).
 *
 * @component
 * @example
 * <Split>
 *   <h2>Задачи</h2>
 *   <Button size="sm">Добавить</Button>
 * </Split>
 */
export const Split = forwardRef<HTMLDivElement, SplitProps>(function Split(
	{
		children,
		gap = 'md',
		align = 'center',
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
				styles.base,
				styles.split,
				gapClass(gap),
				alignClass(align),
				className,
			)}
			style={style}
			{...rest}
		>
			{children}
		</div>
	);
});

Split.displayName = 'Split';
