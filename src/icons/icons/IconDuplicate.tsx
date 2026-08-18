import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
	/** Размер в px (или любой css‑единица) */
	size?: number | string;
	/** Цвет заливки */
	color?: string;
}

export const IconDuplicate: React.FC<IconProps> = ({
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
			id='XMLID_129_'
			d='M88,68.4H27.6c-2.2,0-4-1.8-4-4V4c0-2.2,1.8-4,4-4H88c2.2,0,4,1.8,4,4v60.3C92,66.6,90.2,68.4,88,68.4z
	 M31.6,60.3h52.3V8.1H31.6V60.3z M66.4,87.2V76.6c0-1.7-1.4-3-3-3s-3,1.4-3,3v9.4H6.1V31.7h9.3c1.7,0,3-1.4,3-3s-1.4-3-3-3H4.8
	c-2.6,0-4.8,2.1-4.8,4.8v56.9C0,89.9,2.1,92,4.8,92h56.9C64.3,92,66.4,89.9,66.4,87.2z'
		/>
	</svg>
);
