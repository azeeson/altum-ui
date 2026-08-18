import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
	/** Размер в px (или любой css‑единица) */
	size?: number | string;
	/** Цвет заливки */
	color?: string;
}

export const IconDocumentNew: React.FC<IconProps> = ({
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
			id='XMLID_1226_'
			d='M78.8,25.5L56.7,3.2C55.9,2.4,54.9,2,53.8,2H16c-2.2,0-4,1.8-4,4v80c0,2.2,1.8,4,4,4h60c2.2,0,4-1.8,4-4
	V28.3C80,27.2,79.6,26.2,78.8,25.5z M72,30H52V10h0.2L72,30z M20,82V10h24v23.9c0,2.2,1.7,4.1,3.9,4.1H72v44H20z'
		/>
	</svg>
);
