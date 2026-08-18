import {forwardRef, type ElementType} from 'react';
import {cn} from '../../utils/cn';
import {flexStyles as styles} from './layoutClasses';
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
		children,
		grow = false,
		shrink = true,
		className,
		style,
		as: Component = 'div',
		...rest
	},
	ref,
) {
	const Element = Component as ElementType;
	return (
		<Element
			ref={ref}
			className={cn(
				styles.item,
				grow && styles.itemGrow,
				!shrink && styles.itemShrink0,
				className,
			)}
			style={style}
			{...rest}
		>
			{children}
		</Element>
	);
});

LayoutItem.displayName = 'LayoutItem';
