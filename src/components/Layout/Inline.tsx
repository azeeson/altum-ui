import {forwardRef, type ElementType} from 'react';
import {cn} from '../../utils/cn';
import {alignClass, flexStyles as styles, gapClass, justifyClass} from './layoutClasses';
import type {InlineProps} from './Layout.types';

export type {LayoutAlign, LayoutGap, LayoutJustify, InlineProps} from './Layout.types';

/**
 * Горизонтальный кластер с переносом: чипы, теги, кнопки, бейджи, метаданные.
 * Всегда `width: 100%` родителя — ограничение ширины через родителя.
 *
 * @component
 * @example
 * <Inline gap="sm" align="center">
 *   <Badge>Новый</Badge>
 *   <span>Заказ #1024</span>
 * </Inline>
 */
export const Inline = forwardRef<HTMLElement, InlineProps>(function Inline(
	{
		children,
		gap = 'sm',
		align = 'center',
		justify = 'start',
		wrap = true,
		className,
		as: Component = 'div',
		style,
		...rest
	},
	ref,
) {
	const Element = Component as ElementType;

	return (
		<Element
			ref={ref as never}
			className={cn(
				styles.base,
				styles.inline,
				!wrap && styles.inlineNowrap,
				gapClass(gap),
				alignClass(align),
				justifyClass(justify),
				className,
			)}
			style={style}
			{...rest}
		>
			{children}
		</Element>
	);
});

Inline.displayName = 'Inline';
