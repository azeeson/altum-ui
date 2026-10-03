import type {LayoutItemProps} from './Layout.types';
export type {LayoutItemProps} from './Layout.types';

import type {ElementType} from 'react';
import {cn} from '../../core/utils/cn';
import styles from './LayoutItem.module.css';

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
export const LayoutItem = ({
	grow = false,
	shrink = true,
	className,
	as = 'div',
	rootRef,
	...rest
}: LayoutItemProps) => {
	const Component = as as ElementType;
	return (
		<Component
			ref={rootRef}
			className={cn(styles.item, className)}
			data-grow={grow ? '' : undefined}
			data-shrink={shrink === false ? 'false' : undefined}
			{...rest}
		/>
	);
};
