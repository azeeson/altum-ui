import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
	/** Размер в px (или любой css‑единица) */
	size?: number | string;
	/** Цвет заливки */
	color?: string;
}

export const IconSuitcase: React.FC<IconProps> = ({
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
			id='XMLID_2090_'
			d='M89.8,23.9c-1.4-1.4-3.3-1.9-5.2-1.9H63V10c0-2.2-2.3-4-4.5-4h-25C31.3,6,29,7.8,29,10v12H7.4
	C3.3,22,0,24.9,0,28.9v49.6C0,82.7,3.3,86,7.4,86h77.1c4.1,0,7.4-3.3,7.4-7.4l0-49.5C92,27.1,91.2,25.3,89.8,23.9z M66,30v48H26V30
	H66z M37,14h18v8H37V14z M8,30h12v48H8V30z M84,78H72V30h12L84,78z'
		/>
	</svg>
);
