import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
	/** Размер в px (или любой css‑единица) */
	size?: number | string;
	/** Цвет заливки */
	color?: string;
}

export const IconMediaPause: React.FC<IconProps> = ({
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
			id='XMLID_698_'
			d='M33,13v66c0,2.8-2.2,5-5,5s-5-2.2-5-5V13c0-2.8,2.2-5,5-5S33,10.2,33,13z M64,8c-2.8,0-5,2.2-5,5v66
	c0,2.8,2.2,5,5,5s5-2.2,5-5V13C69,10.2,66.8,8,64,8z'
		/>
	</svg>
);
