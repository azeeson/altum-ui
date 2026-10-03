import type {CSSProperties, ComponentPropsWithoutRef, ElementType, Ref} from 'react';
import {cn} from '../../core/utils/cn';
import {spacingCss} from '../../core/utils/spacing';
import type {SpacingValue} from '../../types/spacing';
import styles from './Flex.module.css';

export type FlexAlign = 'start' | 'center' | 'end' | 'baseline' | 'stretch';
export type FlexJustify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
export type FlexDirection = 'row' | 'column';

/**
 * Внутренний flex-хост для `Stack` / `Inline` / `Split` / `ControlRow`.
 * Направление, перенос и выравнивание — `data-*`, промежуток — `--altum-flex-gap`.
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
	rootRef?: Ref<HTMLElement>
		| Ref<HTMLDivElement>
		| Ref<HTMLSpanElement>
		| Ref<HTMLUListElement>
		| Ref<HTMLOListElement>
		| Ref<HTMLLIElement>;
}

export const Flex = ({
	as,
	direction = 'row',
	gap = 'md',
	align = 'stretch',
	justify = 'start',
	wrap,
	className,
	style,
	rootRef,
	...rest
}: FlexProps) => {
	const Component = (as ?? 'div') as ElementType;

	return (
		<Component
			ref={rootRef}
			className={cn(styles.flex, className)}
			data-direction={direction}
			data-align={align}
			data-justify={justify}
			data-wrap={wrap === false ? 'false' : undefined}
			style={{
				'--altum-flex-gap': spacingCss(gap),
				...style,
			} as CSSProperties}
			{...rest}
		/>
	);
};
