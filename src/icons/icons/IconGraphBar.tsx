import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
	/** Размер в px (или любой css‑единица) */
	size?: number | string;
	/** Цвет заливки */
	color?: string;
}

export const IconGraphBar: React.FC<IconProps> = ({
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
			id='XMLID_78_'
			d='M73,89c-3.3,0-6-2.7-6-6V9c0-3.3,2.7-6,6-6s6,2.7,6,6v74C79,86.3,76.3,89,73,89z M52,83V33.4
	c0-3.3-2.7-6-6-6s-6,2.7-6,6V83c0,3.3,2.7,6,6,6S52,86.3,52,83z M25,83V57.8c0-3.3-2.7-6-6-6s-6,2.7-6,6V83c0,3.3,2.7,6,6,6
	S25,86.3,25,83z'
		/>
	</svg>
);
