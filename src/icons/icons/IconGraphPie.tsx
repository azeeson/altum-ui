import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
	/** Размер в px (или любой css‑единица) */
	size?: number | string;
	/** Цвет заливки */
	color?: string;
}

export const IconGraphPie: React.FC<IconProps> = ({
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
			id='XMLID_77_'
			d='M33.6,37.2H3.5c-1.9,0-3.5-1.6-3.5-3.5C0,15.1,15.1,0,33.6,0c1.9,0,3.5,1.6,3.5,3.5v30.1
	C37.2,35.6,35.6,37.2,33.6,37.2z M7.3,30.1h22.9V7.3C18.3,8.8,8.8,18.3,7.3,30.1z M49.1,92C25.4,92,6.2,73.6,6.2,50.9
	c0-2.2,1.8-4,4-4h36.7V10.2c0-2.2,1.8-4,4-4C73.2,6.2,92,25.8,92,49.1C92,72.7,72.7,92,49.1,92z M14.5,54.9
	C16.6,71.3,31.3,84,49.1,84C68.3,84,84,68.3,84,49.1C84,31.6,71,16.6,54.9,14.5v36.4c0,2.2-1.8,4-4,4H14.5z'
		/>
	</svg>
);
