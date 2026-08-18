import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
	/** Размер в px (или любой css‑единица) */
	size?: number | string;
	/** Цвет заливки */
	color?: string;
}

export const IconArrowThinDown: React.FC<IconProps> = ({
	size = 24,
	color = 'currentColor',
	...props
}) => (
	<svg
		width={size}
		height={size}
		fill={color}
		viewBox='0 0 92 92'
		{...props}
	>
		<path
			id='XMLID_341_'
			d='M73.8,57.9l-25,24.9C48,83.6,47,84,46,84s-2-0.4-2.8-1.2l-25-24.9c-1.6-1.6-1.6-4.1,0-5.7
	c1.6-1.6,4.1-1.6,5.7,0L42,70.4V12c0-2.2,1.8-4,4-4c2.2,0,4,1.8,4,4v58.4l18.2-18.1c1.6-1.6,4.1-1.6,5.7,0
	C75.4,53.8,75.4,56.3,73.8,57.9z'
		/>
	</svg>
);
