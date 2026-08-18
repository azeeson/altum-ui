import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
	/** Размер в px (или любой css‑единица) */
	size?: number | string;
	/** Цвет заливки */
	color?: string;
}

export const IconAlignJustify: React.FC<IconProps> = ({
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
			id='XMLID_84_'
			d='M82,18H10c-2.2,0-4-1.8-4-4s1.8-4,4-4h72c2.2,0,4,1.8,4,4S84.2,18,82,18z M86,35.4c0-2.2-1.8-4-4-4H10
	c-2.2,0-4,1.8-4,4s1.8,4,4,4h72C84.2,39.4,86,37.6,86,35.4z M86,56.7c0-2.2-1.8-4-4-4H10c-2.2,0-4,1.8-4,4s1.8,4,4,4h72
	C84.2,60.7,86,58.9,86,56.7z M50,78c0-2.2-1.8-4-4-4H10.3c-2.2,0-4,1.8-4,4s1.8,4,4,4H46C48.2,82,50,80.2,50,78z'
		/>
	</svg>
);
