import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
	/** Размер в px (или любой css‑единица) */
	size?: number | string;
	/** Цвет заливки */
	color?: string;
}

export const IconWarning: React.FC<IconProps> = ({
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
			id='XMLID_85_'
			d='M88,87H4c-1.4,0-2.7-0.8-3.5-2c-0.7-1.2-0.7-2.7,0-4l42-74c0.7-1.3,2-2,3.5-2s2.8,0.8,3.5,2l42,74
	c0.7,1.2,0.7,2.8,0,4C90.7,86.2,89.4,87,88,87z M10.9,79h70.3L46,17.1L10.9,79z M50,55.1V36.5c0-2.2-1.8-4-4-4s-4,1.8-4,4v18.6
	c0,2.2,1.8,4,4,4S50,57.3,50,55.1z M49.5,71.7c0.9-0.9,1.5-2.2,1.5-3.5c0-1.3-0.5-2.6-1.5-3.5c-0.9-0.9-2.2-1.5-3.5-1.5
	c-1.3,0-2.6,0.5-3.5,1.5c-0.9,0.9-1.5,2.2-1.5,3.5c0,1.3,0.5,2.6,1.5,3.5c0.9,0.9,2.2,1.5,3.5,1.5C47.3,73.2,48.6,72.6,49.5,71.7z'
		/>
	</svg>
);
