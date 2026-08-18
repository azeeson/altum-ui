import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
	/** Размер в px (или любой css‑единица) */
	size?: number | string;
	/** Цвет заливки */
	color?: string;
}

export const IconTag: React.FC<IconProps> = ({
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
			id='XMLID_1160_'
			d='M88,20H29c-1,0-1.9,0.4-2.6,1l-25,22C0.5,43.8,0,44.9,0,46c0,1.2,0.5,2.2,1.4,3l25,22c0.7,0.6,1.7,1,2.6,1
	h59c2.2,0,4-1.8,4-4V24C92,21.8,90.2,20,88,20z M84,64H30.5L10.1,46l20.5-18H84V64z M27.2,41.4c1.2-1.2,2.9-1.9,4.6-1.9
	c1.7,0,3.4,0.7,4.6,1.9c1.2,1.2,1.9,2.9,1.9,4.6s-0.7,3.4-1.9,4.6c-1.2,1.2-2.9,1.9-4.6,1.9c-1.7,0-3.4-0.7-4.6-1.9
	c-1.2-1.2-1.9-2.9-1.9-4.6S26,42.6,27.2,41.4z'
		/>
	</svg>
);
