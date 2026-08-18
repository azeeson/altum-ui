import {forwardRef} from 'react';
import {cn} from '../../utils/cn';
import {LayoutItem} from './LayoutItem';
import {alignClass, flexStyles as styles, gapClass, justifyClass} from './layoutClasses';
import type {ControlRowProps} from './Layout.types';

export type {LayoutAlign, LayoutGap, LayoutJustify, ControlRowProps} from './Layout.types';

type ControlRowComponent = typeof ControlRowInner & {
	Item: typeof LayoutItem;
};

/**
 * Ряд для смешивания контролов: TextField + Chip + Button + Select и т.п.
 *
 * @component
 * @example
 * <ControlRow align="end">
 *   <ControlRow.Item grow>
 *     <TextField label="Поиск" />
 *   </ControlRow.Item>
 *   <Button variant="primary">Найти</Button>
 * </ControlRow>
 */
const ControlRowInner = forwardRef<HTMLDivElement, ControlRowProps>(function ControlRow(
	{
		children,
		gap = 'sm',
		align = 'center',
		justify = 'start',
		wrap = true,
		className,
		role,
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
				styles.controlRow,
				!wrap && styles.controlRowNowrap,
				gapClass(gap),
				alignClass(align),
				justifyClass(justify),
				className,
			)}
			style={style}
			{...rest}
			role={role ?? 'group'}
		>
			{children}
		</div>
	);
});

export const ControlRow = ControlRowInner as ControlRowComponent;

ControlRow.Item = LayoutItem;
ControlRow.displayName = 'ControlRow';
