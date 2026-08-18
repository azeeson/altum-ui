import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
	/** Размер в px (или любой css‑единица) */
	size?: number | string;
	/** Цвет заливки */
	color?: string;
}

export const IconMonitor: React.FC<IconProps> = ({
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
			id='XMLID_1719_'
			d='M92,13c0-2.2-1.8-4-4-4H4c-2.2,0-4,1.8-4,4v52c0,2.2,1.8,4,4,4h84c2.2,0,4-1.8,4-4V13z M84,61H8V17h76V61z
	 M69.5,79c0,2.2-1.8,4-4,4H26.5c-2.2,0-4-1.8-4-4s1.8-4,4-4h38.9C67.7,75,69.5,76.8,69.5,79z'
		/>
	</svg>
);
