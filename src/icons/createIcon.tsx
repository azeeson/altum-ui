import {createElement, type FC, type SVGProps} from 'react';

export interface IconProps extends SVGProps<SVGSVGElement> {
	/** Размер в px или любая CSS-единица. */
	size?: number | string;
	/** Цвет заливки (`currentColor` по умолчанию). */
	color?: string;
}

const DEFAULT_VIEW_BOX = '0 0 92 92';

function minifyPath(d: string): string {
	return d.replace(/\s+/g, ' ').trim();
}

/**
 * SVG-иконка из одного или нескольких path `d`.
 * Публичные `Icon*` — тонкие обёртки над этой фабрикой.
 */
export function createIcon(d: string | readonly string[]): FC<IconProps> {
	const paths = (Array.isArray(d) ? d : [d]).map(minifyPath);

	const Icon: FC<IconProps> = ({
		size = 24,
		color = 'currentColor',
		...props
	}) => createElement(
		'svg',
		{
			width: size,
			height: size,
			fill: color,
			viewBox: DEFAULT_VIEW_BOX,
			...props,
		},
		paths.map((pathD, index) => createElement('path', {
			key: index,
			d: pathD,
		})),
	);

	return Icon;
}
