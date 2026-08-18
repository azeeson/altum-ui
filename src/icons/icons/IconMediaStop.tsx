import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
	/** Размер в px (или любой css‑единица) */
	size?: number | string;
	/** Цвет заливки */
	color?: string;
}

export const IconMediaStop: React.FC<IconProps> = ({
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
			id='XMLID_688_'
			d='M84,12.5C84,10,82,8,79.5,8h-68C9,8,7,10,7,12.5v68C7,83,9,85,11.5,85h68c2.5,0,4.5-2,4.5-4.5V12.5z M75,76
	H16V17h59V76z'
		/>
	</svg>
);
