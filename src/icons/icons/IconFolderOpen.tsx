import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
	/** Размер в px (или любой css‑единица) */
	size?: number | string;
	/** Цвет заливки */
	color?: string;
}

export const IconFolderOpen: React.FC<IconProps> = ({
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
			id='XMLID_1373_'
			d='M91.1,38.6c-0.8-1-1.9-1.6-3.1-1.6h-5V26.1c0-1.9-1.4-3.1-3.3-3.1H44.7l-4.5-7.4c-0.6-1-1.8-1.6-3-1.6
	H11.4C9.5,14,8,15.1,8,17v20H4c-1.2,0-2.4,0.6-3.1,1.5s-1.1,2.2-0.8,3.4l7.4,33.9c0.4,1.8,2,3.2,3.9,3.2h68.3c1.8,0,3.4-1.3,3.9-3
	L91.9,42C92.2,40.8,91.9,39.6,91.1,38.6z M15,21h20.2l4.5,7.4c0.6,1,1.8,1.6,3,1.6H76v7H15V21z M76.5,71H14.6L9,45h73.9L76.5,71z'
		/>
	</svg>
);
