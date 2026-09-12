import {forwardRef} from 'react';
import {As} from '../../base/As';
import {cn} from '../../utils/cn';
import flexChild from '../../styles/flexChild.module.css';
import type {LayoutItemProps} from './Layout.types';

export type {LayoutItemProps} from './Layout.types';

/**
 * Flex-ячейка для дочерних элементов в `Stack`, `Inline`, `Split` или `ControlRow`.
 *
 * @component
 * @example
 * <ControlRow>
 *   <LayoutItem grow><TextField label="Поиск" width="full" /></LayoutItem>
 *   <LayoutItem shrink={false}><Button>Найти</Button></LayoutItem>
 * </ControlRow>
 */
export const LayoutItem = forwardRef<HTMLElement, LayoutItemProps>(function LayoutItem(
	{
		grow = false,
		shrink = true,
		className,
		as = 'div',
		...rest
	},
	ref,
) {
	return (
		<As
			ref={ref}
			as={as}
			className={cn(
				flexChild.child,
				grow && flexChild.grow,
				shrink === false && flexChild.noShrink,
				className,
			)}
			{...rest}
		/>
	);
});

LayoutItem.displayName = 'LayoutItem';
