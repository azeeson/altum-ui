import {createElement, type FC} from 'react';
import type {IconProps} from '../createIcon';

const DOTS = [
	[2, 3],
	[2, 9],
	[2, 15],
	[10, 3],
	[10, 9],
	[10, 15],
] as const;

/** Иконка drag-handle (6 точек) для SortableList и подобных списков. */
export const IconDragHandle: FC<IconProps> = ({
	size = 12,
	color = 'currentColor',
	...props
}) => createElement(
	'svg',
	{
		width: size,
		height: typeof size === 'number' ? Math.round(size * 1.5) : size,
		viewBox: '0 0 12 18',
		fill: 'none',
		stroke: color,
		strokeWidth: 2,
		'aria-hidden': true,
		...props,
	},
	DOTS.map(([cx, cy]) => createElement('circle', {
		key: `${cx}-${cy}`,
		cx,
		cy,
		r: 1,
		fill: color,
	})),
);

IconDragHandle.displayName = 'IconDragHandle';
