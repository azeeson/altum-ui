import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
	/** Размер в px (или любой css‑единица) */
	size?: number | string;
	/** Цвет заливки */
	color?: string;
}

export const IconChevronLeft: React.FC<IconProps> = ({
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
			id='XMLID_423_'
			d='M61.8,68.1c1.6,1.5,1.6,4.1,0.1,5.7C61.1,74.6,60,75,59,75c-1,0-2-0.4-2.8-1.1l-26-25
	C29.4,48.1,29,47.1,29,46s0.4-2.1,1.2-2.9l26-25c1.6-1.5,4.1-1.5,5.7,0.1c1.5,1.6,1.5,4.1-0.1,5.7L38.8,46L61.8,68.1z'
		/>
	</svg>
);
