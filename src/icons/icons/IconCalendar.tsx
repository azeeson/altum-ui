import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
	/** Размер в px (или любой css‑единица) */
	size?: number | string;
	/** Цвет заливки */
	color?: string;
}

export const IconCalendar: React.FC<IconProps> = ({
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
			id='XMLID_1146_'
			d='M22,21.8V9c0-2.8,2.2-5,5-5s5,2.2,5,5v12.8c0,2.8-2.2,5-5,5S22,24.6,22,21.8z M65,26.8c2.8,0,5-2.2,5-5V9
	c0-2.8-2.2-5-5-5s-5,2.2-5,5v12.8C60,24.6,62.2,26.8,65,26.8z M92,15.4V83c0,2.2-1.8,4-4,4H4c-2.2,0-4-1.8-4-4V15.4
	C0,13.2,1.8,11,4,11h9.3c2.2,0,4,1.8,4,4s-1.8,4-4,4H8v17h76V19h-5.3c-2.2,0-4-1.8-4-4s1.8-4,4-4H88C90.2,11,92,13.2,92,15.4z
	 M84,79V43H8v36H84z M39.7,19h12.6c2.2,0,4-1.8,4-4s-1.8-4-4-4H39.7c-2.2,0-4,1.8-4,4S37.5,19,39.7,19z'
		/>
	</svg>
);
