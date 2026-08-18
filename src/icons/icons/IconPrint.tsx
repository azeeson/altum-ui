import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
	/** Размер в px (или любой css‑единица) */
	size?: number | string;
	/** Цвет заливки */
	color?: string;
}

export const IconPrint: React.FC<IconProps> = ({
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
			id='XMLID_1414_'
			d='M88,17H68V5c0-1.7-0.9-3-2.5-3H26.5C24.9,2,24,3.3,24,5v12H4c-2.2,0-4,1.7-4,3.9v45.9C0,69,1.8,71,4,71
	h14.7l-2.4,15.6c-0.2,1,0.1,2.2,0.8,3c0.7,0.8,1.6,1.4,2.7,1.4h52.5c1,0,2-0.7,2.7-1.5c0.7-0.8,1-1.8,0.8-2.8L73.3,71H88
	c2.2,0,4-2,4-4.2V20.9C92,18.7,90.2,17,88,17z M30,8h32v9H30V8z M23.8,84l3.8-25h36.8l3.8,25H23.8z M84,63H72.1l-1.3-8.2
	c-0.3-1.7-1.7-2.8-3.5-2.8H24.6c-1.7,0-3.2,1.1-3.5,2.8L19.9,63H8V25h76V63z M18.3,35c0-1.7,1.3-3,3-3h9.4c1.7,0,3,1.3,3,3
	s-1.3,3-3,3h-9.4C19.7,38,18.3,36.7,18.3,35z'
		/>
	</svg>
);
