import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
	/** Размер в px (или любой css‑единица) */
	size?: number | string;
	/** Цвет заливки */
	color?: string;
}

export const IconAlignRight: React.FC<IconProps> = ({
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
			id='XMLID_83_'
			d='M82,18H10c-2.2,0-4-1.8-4-4s1.8-4,4-4h72c2.2,0,4,1.8,4,4S84.2,18,82,18z M86,35.4c0-2.2-1.8-4-4-4H40.6
	c-2.2,0-4,1.8-4,4s1.8,4,4,4H82C84.2,39.4,86,37.6,86,35.4z M86,56.7c0-2.2-1.8-4-4-4H28.4c-2.2,0-4,1.8-4,4s1.8,4,4,4H82
	C84.2,60.7,86,58.9,86,56.7z M85.7,78c0-2.2-1.8-4-4-4H13.6c-2.2,0-4,1.8-4,4s1.8,4,4,4h68.1C83.9,82,85.7,80.2,85.7,78z'
		/>
	</svg>
);
