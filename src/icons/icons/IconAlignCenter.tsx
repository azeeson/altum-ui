import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
	/** Размер в px (или любой css‑единица) */
	size?: number | string;
	/** Цвет заливки */
	color?: string;
}

export const IconAlignCenter: React.FC<IconProps> = ({
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
			id='XMLID_82_'
			d='M82,18H10c-2.2,0-4-1.8-4-4s1.8-4,4-4h72c2.2,0,4,1.8,4,4S84.2,18,82,18z M70.7,35.4c0-2.2-1.8-4-4-4H25.3
	c-2.2,0-4,1.8-4,4s1.8,4,4,4h41.4C68.9,39.4,70.7,37.6,70.7,35.4z M76.8,56.7c0-2.2-1.8-4-4-4H19.2c-2.2,0-4,1.8-4,4s1.8,4,4,4h53.6
	C75,60.7,76.8,58.9,76.8,56.7z M84.1,78c0-2.2-1.8-4-4-4H11.9c-2.2,0-4,1.8-4,4s1.8,4,4,4h68.1C82.3,82,84.1,80.2,84.1,78z'
		/>
	</svg>
);
