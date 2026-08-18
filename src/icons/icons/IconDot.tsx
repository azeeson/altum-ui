import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
	/** Размер в px (или любой css‑единица) */
	size?: number | string;
	/** Цвет заливки */
	color?: string;
}

export const IconDot: React.FC<IconProps> = ({
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
			id='XMLID_32_'
			d='M46,53c-1.8,0-3.7-0.8-5-2.1c-1.3-1.3-2-3.1-2-4.9c0-1.8,0.8-3.6,2-5c1.3-1.3,3.1-2,5-2c1.8,0,3.6,0.8,4.9,2
	c1.3,1.3,2.1,3.1,2.1,5c0,1.8-0.8,3.6-2.1,4.9C49.6,52.2,47.8,53,46,53z'
		/>
	</svg>
);
