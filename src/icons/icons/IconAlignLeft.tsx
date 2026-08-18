import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
	/** Размер в px (или любой css‑единица) */
	size?: number | string;
	/** Цвет заливки */
	color?: string;
}

export const IconAlignLeft: React.FC<IconProps> = ({
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
			id='XMLID_81_'
			d='M82,18H10c-2.2,0-4-1.8-4-4s1.8-4,4-4h72c2.2,0,4,1.8,4,4S84.2,18,82,18z M55.4,35.4c0-2.2-1.8-4-4-4H10
	c-2.2,0-4,1.8-4,4s1.8,4,4,4h41.4C53.6,39.4,55.4,37.6,55.4,35.4z M67.6,56.7c0-2.2-1.8-4-4-4H10c-2.2,0-4,1.8-4,4s1.8,4,4,4h53.6
	C65.8,60.7,67.6,58.9,67.6,56.7z M82.4,78c0-2.2-1.8-4-4-4H10.3c-2.2,0-4,1.8-4,4s1.8,4,4,4h68.1C80.6,82,82.4,80.2,82.4,78z'
		/>
	</svg>
);
