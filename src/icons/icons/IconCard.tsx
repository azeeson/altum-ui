import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
	/** Размер в px (или любой css‑единица) */
	size?: number | string;
	/** Цвет заливки */
	color?: string;
}

export const IconCard: React.FC<IconProps> = ({
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
			id='XMLID_2192_'
			d='M92,23.4c0-4.1-3.3-7.4-7.4-7.4H7.4C3.3,16,0,19.3,0,23.4v45.3C0,72.7,3.3,76,7.4,76h77.3
	c4.1,0,7.4-3.3,7.4-7.4V23.4z M84,24v7H8v-7H84z M8,68V43h76v25H8z M76.5,55c0,2.2-1.8,4-4,4h-19c-2.2,0-4-1.8-4-4s1.8-4,4-4h19
	C74.7,51,76.5,52.8,76.5,55z'
		/>
	</svg>
);
