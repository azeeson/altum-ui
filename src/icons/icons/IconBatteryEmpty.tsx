import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
	/** Размер в px (или любой css‑единица) */
	size?: number | string;
	/** Цвет заливки */
	color?: string;
}

export const IconBatteryEmpty: React.FC<IconProps> = ({
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
			id='XMLID_1711_'
			d='M88,35h-3V24c0-2.2-1.7-4-4-4H4c-2.2,0-4,1.8-4,4v44c0,2.2,1.8,4,4,4h77c2.2,0,4-1.8,4-4V57h3
	c2.2,0,4-1.4,4-3.6V38.6C92,36.4,90.2,35,88,35z M77,64H8V28h69v10.6v14.8V64z'
		/>
	</svg>
);
