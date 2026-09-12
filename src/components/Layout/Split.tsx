import {forwardRef} from 'react';
import {Inline} from './Inline';
import type {SplitProps} from './Layout.types';

export type {LayoutAlign, LayoutGap, SplitProps} from './Layout.types';

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
export const Split = forwardRef<HTMLDivElement, SplitProps>(function Split(props, ref) {
	return (
		<Inline
			ref={ref}
			gap='md'
			align='center'
			justify='between'
			{...props}
		/>
	);
});

Split.displayName = 'Split';
