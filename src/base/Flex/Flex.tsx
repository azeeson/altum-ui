import {forwardRef, type CSSProperties, type ComponentPropsWithoutRef, type ElementType} from 'react';
import {As} from '../As';
import {cn} from '../../utils/cn';
import {mergeStyles} from '../../utils/mergeStyles';
import {resolveSpacingCss} from '../../utils/spacing';
import type {SpacingValue} from '../../types/spacing';
import styles from './Flex.module.css';

const ALIGN = {
	start: 'flex-start',
	center: 'center',
	end: 'flex-end',
	baseline: 'baseline',
	stretch: 'stretch',
} as const;

const JUSTIFY = {
	start: 'flex-start',
	center: 'center',
	end: 'flex-end',
	between: 'space-between',
	around: 'space-around',
	evenly: 'space-evenly',
} as const;

export type FlexAlign = keyof typeof ALIGN;
export type FlexJustify = keyof typeof JUSTIFY;
export type FlexDirection = 'row' | 'column';

/**
 * Внутренний flex-хост для `Stack` / `Inline` / `Split` / `ControlRow`.
 * Gap и выравнивание — CSS-переменные и inline-style, не utility-классы.
 *
 * @component
 */
export interface FlexProps extends ComponentPropsWithoutRef<'div'> {
	as?: ElementType;
	direction?: FlexDirection;
	gap?: SpacingValue;
	align?: FlexAlign;
	justify?: FlexJustify;
	wrap?: boolean;
}

export const Flex = forwardRef<HTMLElement, FlexProps>(function Flex(
	{
		as,
		direction,
		gap = 'md',
		align = 'stretch',
		justify = 'start',
		wrap,
		className,
		style,
		...rest
	},
	ref,
) {
	return (
		<As
			ref={ref}
			as={as}
			className={cn(
				styles.flex,
				direction === 'column' ? styles.col : styles.row,
				wrap === false && styles.nowrap,
				className,
			)}
			style={mergeStyles({
				'--altum-flex-gap': resolveSpacingCss(gap),
				alignItems: ALIGN[align],
				justifyContent: JUSTIFY[justify],
			} as CSSProperties, style)}
			{...rest}
		/>
	);
});

Flex.displayName = 'Flex';
