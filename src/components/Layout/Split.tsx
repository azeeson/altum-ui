import type {SplitProps} from './Layout.types';
export type {LayoutAlign, LayoutGap, SplitProps} from './Layout.types';

import {Inline} from './Inline';

/**
 * Горизонтальный ряд с `justify-content: space-between`: левый и правый блоки
 * у противоположных краёв (page header, toolbar, строка списка).
 *
 * @component
 * @example
 * <Split>
 *   <h2>Задачи</h2>
 *   <Button size="sm">Добавить</Button>
 * </Split>
 */
export const Split = ({
	rootRef,
	gap = 'md',
	align = 'center',
	...props
}: SplitProps) => (
	<Inline
		rootRef={rootRef}
		gap={gap}
		align={align}
		{...props}
		justify='between'
	/>
);
