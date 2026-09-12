import {forwardRef} from 'react';
import {Flex} from '../../base/Flex';
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
export const Inline = forwardRef<HTMLElement, InlineProps>(function Inline(props, ref) {
	return (
		<Flex
			ref={ref}
			gap='sm'
			align='center'
			justify='start'
			wrap
			{...props}
			direction='row'
		/>
	);
});

Inline.displayName = 'Inline';
