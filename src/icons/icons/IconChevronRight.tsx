import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
	/** Размер в px (или любой css‑единица) */
	size?: number | string;
	/** Цвет заливки */
	color?: string;
}

export const IconChevronRight: React.FC<IconProps> = ({
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
			id='XMLID_439_'
			d='M63,46c0,1.1-0.4,2.1-1.2,2.9l-26,25C35,74.6,34,75,33,75c-1.1,0-2.1-0.4-2.9-1.2c-1.5-1.6-1.5-4.1,0.1-5.7
	l23-22.1l-23-22.1c-1.6-1.5-1.6-4.1-0.1-5.7c1.5-1.6,4.1-1.6,5.7-0.1l26,25C62.6,43.9,63,44.9,63,46z'
		/>
	</svg>
);
