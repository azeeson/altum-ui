import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
	/** Размер в px (или любой css‑единица) */
	size?: number | string;
	/** Цвет заливки */
	color?: string;
}

export const IconChevronUp: React.FC<IconProps> = ({
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
			id='XMLID_453_'
			d='M71,63c-1.1,0-2.1-0.4-2.9-1.2L46,38.8l-22.1,23c-1.5,1.6-4.1,1.6-5.7,0.1c-1.6-1.5-1.6-4.1-0.1-5.7l25-26
	c0.8-0.8,1.8-1.2,2.9-1.2s2.1,0.4,2.9,1.2l25,26c1.5,1.6,1.5,4.1-0.1,5.7C73,62.6,72,63,71,63z'
		/>
	</svg>
);
