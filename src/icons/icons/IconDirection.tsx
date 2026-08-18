import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
	/** Размер в px (или любой css‑единица) */
	size?: number | string;
	/** Цвет заливки */
	color?: string;
}

export const IconDirection: React.FC<IconProps> = ({
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
			id='XMLID_507_'
			d='M49.9,88c-0.2,0-0.4,0-0.6-0.1c-1.8-0.3-3.2-1.7-3.3-3.5l-3.5-34.8L7.6,46.1c-1.8-0.2-3.3-1.6-3.5-3.3
	c-0.3-1.8,0.7-3.5,2.3-4.3l76-34.1c1.5-0.7,3.3-0.4,4.5,0.8c1.2,1.2,1.5,3,0.8,4.5l-34.1,76C52.9,87.1,51.4,88,49.9,88z M23.3,39.7
	L46.4,42c1.9,0.2,3.4,1.7,3.6,3.6l2.4,23.1L76,16L23.3,39.7z'
		/>
	</svg>
);
