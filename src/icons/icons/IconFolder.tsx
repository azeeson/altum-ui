import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
	/** Размер в px (или любой css‑единица) */
	size?: number | string;
	/** Цвет заливки */
	color?: string;
}

export const IconFolder: React.FC<IconProps> = ({
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
			id='XMLID_1360_'
			d='M80,23H45.5l-4.4-7.1c-0.7-1.2-2-1.9-3.4-1.9H12c-2.2,0-4,1.8-4,4v56c0,2.2,1.8,4,4,4h68c2.2,0,4-1.8,4-4
	V27.1C84,24.9,82.2,23,80,23z M76,70H16V22h19.4l4.4,7.1c0.7,1.2,2,1.9,3.4,1.9H76V70z'
		/>
	</svg>
);
