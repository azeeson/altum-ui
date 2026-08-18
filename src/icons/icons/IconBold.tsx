import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
	/** Размер в px (или любой css‑единица) */
	size?: number | string;
	/** Цвет заливки */
	color?: string;
}

export const IconBold: React.FC<IconProps> = ({
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
			id='XMLID_2286_'
			d='M60.1,44.2c3.7-3.6,6-8.7,6-14.2c0-11-9-20-20-20H25c-2.2,0-4,1.8-4,4v32v32c0,2.2,1.8,4,4,4h26
	c11,0,20-9,20-20C71,54.3,66.6,47.6,60.1,44.2z M29,18h17.1c6.6,0,12,5.4,12,12s-5.4,12-12,12H29V18z M51,74H29V50h17.1H51
	c6.6,0,12,5.4,12,12S57.6,74,51,74z'
		/>
	</svg>
);
