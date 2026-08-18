import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
	/** Размер в px (или любой css‑единица) */
	size?: number | string;
	/** Цвет заливки */
	color?: string;
}

export const IconBrowser: React.FC<IconProps> = ({
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
			id='XMLID_1315_'
			d='M88,9H4c-2.2,0-4,1.8-4,4v66c0,2.2,1.8,4,4,4h84c2.2,0,4-1.8,4-4V13C92,10.8,90.2,9,88,9z M84,26H56v-9h28
	V26z M24,26v-9h10v9H24z M40,17h10v9H40V17z M18,17v9H8v-9H18z M8,75V33h76v42H8z'
		/>
	</svg>
);
