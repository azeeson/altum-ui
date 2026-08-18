import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
	size?: number | string;
	color?: string;
}

/** Иконка drag-handle (6 точек) для SortableList и подобных списков. */
export const IconDragHandle: React.FC<IconProps> = ({
	size = 12,
	color = 'currentColor',
	...props
}) => (
	<svg
		width={size}
		height={typeof size === 'number' ? Math.round(Number(size) * 1.5) : size}
		viewBox='0 0 12 18'
		fill='none'
		stroke={color}
		strokeWidth='2'
		aria-hidden='true'
		{...props}
	>
		<circle
			cx='2'
			cy='3'
			r='1'
			fill={color}
		/>
		<circle
			cx='2'
			cy='9'
			r='1'
			fill={color}
		/>
		<circle
			cx='2'
			cy='15'
			r='1'
			fill={color}
		/>
		<circle
			cx='10'
			cy='3'
			r='1'
			fill={color}
		/>
		<circle
			cx='10'
			cy='9'
			r='1'
			fill={color}
		/>
		<circle
			cx='10'
			cy='15'
			r='1'
			fill={color}
		/>
	</svg>
);
