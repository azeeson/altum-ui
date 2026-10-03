import {type FC, type ReactNode, type SVGProps} from 'react';

export interface IconProps extends SVGProps<SVGSVGElement> {
	/** Размер в px или любая CSS-единица. */
	size?: number | string;
	/** Цвет заливки (`currentColor` по умолчанию). */
	color?: string;
}

export interface IconBaseProps extends Omit<IconProps, 'd'> {
	/** SVG path `d` — один или несколько. */
	d?: string | readonly string[];
	children?: ReactNode;
}

const DEFAULT_VIEW_BOX = '0 0 92 92';

function minifyPath(d: string): string {
	return d.replace(/\s+/g, ' ').trim();
}

/**
 * Единый SVG-шаблон иконок. Path-данные — из `ICON_PATHS` / `d`.
 * @component
 * @example
 * <IconBase d={ICON_PATHS.cross} size={20} />
 */
export const IconBase: FC<IconBaseProps> = ({
	d,
	size = 24,
	color = 'currentColor',
	viewBox = DEFAULT_VIEW_BOX,
	children,
	...props
}) => {
	const paths = d == null
		? null
		: (Array.isArray(d) ? d : [d]).map(minifyPath);

	return (
		<svg
			width={size}
			height={size}
			fill={color}
			viewBox={viewBox}
			{...props}
		>
			{paths?.map((pathD, index) => (
				<path key={index} d={pathD} />
			))}
			{children}
		</svg>
	);
};
