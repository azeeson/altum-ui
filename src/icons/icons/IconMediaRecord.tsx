import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
	/** Размер в px (или любой css‑единица) */
	size?: number | string;
	/** Цвет заливки */
	color?: string;
}

export const IconMediaRecord: React.FC<IconProps> = ({
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
			id='XMLID_610_'
			d='M46,84.5C24.8,84.5,7.5,67.2,7.5,46C7.5,24.8,24.8,7.5,46,7.5c21.2,0,38.5,17.3,38.5,38.5
	C84.5,67.2,67.2,84.5,46,84.5z M46,16.5c-16.3,0-29.5,13.2-29.5,29.5c0,16.3,13.2,29.5,29.5,29.5c16.3,0,29.5-13.2,29.5-29.5
	C75.5,29.7,62.3,16.5,46,16.5z'
		/>
	</svg>
);
