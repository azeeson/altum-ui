import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
	/** Размер в px (или любой css‑единица) */
	size?: number | string;
	/** Цвет заливки */
	color?: string;
}

export const IconNetwork5: React.FC<IconProps> = ({
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
			id='XMLID_1892_'
			d='M50,70.6V21.5c0,0,0-0.1,0-0.1c3.8-1.6,6.5-5.4,6.5-9.8C56.5,5.8,51.8,1,46,1S35.5,5.8,35.5,11.6
	c0,4.4,2.7,8.2,6.5,9.8c0,0,0,0.1,0,0.1v49.1c-3.8,1.6-6.5,5.4-6.5,9.8C35.5,86.2,40.2,91,46,91s10.5-4.8,10.5-10.6
	C56.5,76,53.8,72.2,50,70.6z M46,7c2.5,0,4.5,2.1,4.5,4.6s-2,4.6-4.5,4.6s-4.5-2.1-4.5-4.6S43.5,7,46,7z M46,85
	c-2.5,0-4.5-2.1-4.5-4.6s2-4.6,4.5-4.6s4.5,2.1,4.5,4.6S48.5,85,46,85z'
		/>
	</svg>
);
