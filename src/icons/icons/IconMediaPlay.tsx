import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
	/** Размер в px (или любой css‑единица) */
	size?: number | string;
	/** Цвет заливки */
	color?: string;
}

export const IconMediaPlay: React.FC<IconProps> = ({
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
			id='XMLID_675_'
			d='M69.5,42.9l-42-33c-1.2-0.9-2.8-1.1-4.2-0.5C21.9,10.1,21,11.5,21,13v66c0,1.5,0.9,2.9,2.3,3.6
	c0.6,0.3,1.2,0.4,1.7,0.4c0.9,0,1.8-0.3,2.5-0.9l42-33c1-0.8,1.5-1.9,1.5-3.1S70.4,43.6,69.5,42.9z M29,70.8V21.2L60.5,46L29,70.8z'
		/>
	</svg>
);
