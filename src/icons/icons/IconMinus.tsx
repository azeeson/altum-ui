import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
	/** Размер в px (или любой css‑единица) */
	size?: number | string;
	/** Цвет заливки */
	color?: string;
}

export const IconMinus: React.FC<IconProps> = ({
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
		<path id='XMLID_38_' d='M68,50.5H24c-2.5,0-4.5-2-4.5-4.5s2-4.5,4.5-4.5h44c2.5,0,4.5,2,4.5,4.5S70.5,50.5,68,50.5z'/>
	</svg>
);
