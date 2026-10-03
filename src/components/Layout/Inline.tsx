import type {InlineProps} from './Layout.types';
export type {LayoutAlign, LayoutGap, LayoutJustify, InlineProps} from './Layout.types';

import {Flex} from '../../base/Flex';

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
export const Inline = ({
	rootRef,
	gap = 'sm',
	align = 'center',
	justify = 'start',
	wrap = true,
	...props
}: InlineProps) => (
	<Flex
		rootRef={rootRef}
		gap={gap}
		align={align}
		justify={justify}
		wrap={wrap}
		{...props}
		direction='row'
	/>
);
