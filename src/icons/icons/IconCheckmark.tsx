import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
	/** Размер в px (или любой css‑единица) */
	size?: number | string;
	/** Цвет заливки */
	color?: string;
}

export const IconCheckmark: React.FC<IconProps> = ({
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
			id='XMLID_712_'
			d='M34.4,72c-1.2,0-2.3-0.4-3.2-1.3L11.3,50.8c-1.8-1.8-1.8-4.6,0-6.4c1.8-1.8,4.6-1.8,6.4,0l16.8,16.7
	l39.9-39.8c1.8-1.8,4.6-1.8,6.4,0c1.8,1.8,1.8,4.6,0,6.4l-43.1,43C36.7,71.6,35.6,72,34.4,72z'
		/>
	</svg>
);
