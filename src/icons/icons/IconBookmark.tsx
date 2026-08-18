import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
	/** Размер в px (или любой css‑единица) */
	size?: number | string;
	/** Цвет заливки */
	color?: string;
}

export const IconBookmark: React.FC<IconProps> = ({
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
			id='XMLID_1685_'
			d='M64,0H28c-2.2,0-4,1.8-4,4v84c0,1.6,1,3.1,2.5,3.7c0.5,0.2,1,0.3,1.5,0.3c1.1,0,2.1-0.4,2.9-1.3l14.7-15.6
	l15.5,15.6c1.1,1.1,2.9,1.5,4.4,0.9C67,91.1,68,89.6,68,88V4C68,1.8,66.2,0,64,0z M60,78.3L48.4,66.4c-0.8-0.8-1.8-1.4-2.8-1.4
	c0,0,0,0,0,0c-1.1,0-2.1,0.7-2.9,1.5L32,77.9V8h28V78.3z'
		/>
	</svg>
);
