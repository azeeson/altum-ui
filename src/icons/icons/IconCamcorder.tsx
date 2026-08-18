import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
	/** Размер в px (или любой css‑единица) */
	size?: number | string;
	/** Цвет заливки */
	color?: string;
}

export const IconCamcorder: React.FC<IconProps> = ({
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
			id='XMLID_1936_'
			d='M89.8,21.4c-1.4-0.7-3.2-0.5-4.4,0.4L69,33.9V25c0-2.2-1.4-4-3.6-4H4c-2.2,0-4,1.8-4,4v42c0,2.2,1.8,4,4,4
	h61.4c2.2,0,3.6-1.8,3.6-4v-8.9l16.4,12.1c0.7,0.5,1.7,0.8,2.5,0.8c0.6,0,1.3-0.1,1.8-0.4c1.4-0.7,2.3-2.1,2.3-3.6V25
	C92,23.5,91.1,22.1,89.8,21.4z M61,63H8V29h53V63z M84,59L70,48.4v-4.8L84,33V59z'
		/>
	</svg>
);
