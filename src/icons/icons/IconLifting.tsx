import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
	/** Размер в px (или любой css‑единица) */
	size?: number | string;
	/** Цвет заливки */
	color?: string;
}

export const IconLifting: React.FC<IconProps> = ({
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
			id='XMLID_2246_'
			d='M77,22v48c0,2.2-1.8,4-4,4s-4-1.8-4-4V50H23v20c0,2.2-1.8,4-4,4s-4-1.8-4-4V22c0-2.2,1.8-4,4-4s4,1.8,4,4
	v20h46V22c0-2.2,1.8-4,4-4S77,19.8,77,22z M6,27.9c-2.2,0-4,1.8-4,4v28.3c0,2.2,1.8,4,4,4s4-1.8,4-4V31.9C10,29.7,8.2,27.9,6,27.9z
	 M86,27.9c-2.2,0-4,1.8-4,4v28.3c0,2.2,1.8,4,4,4s4-1.8,4-4V31.9C90,29.7,88.2,27.9,86,27.9z'
		/>
	</svg>
);
