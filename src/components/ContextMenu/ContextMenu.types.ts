import type {
	ComponentPropsWithoutRef,
	ReactNode,
} from 'react';
import type {ActionListGroup, ActionListRootProps} from '../ActionList/ActionList.types';

/**
 * Свойства `ContextMenu`.
 */
export interface ContextMenuProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
	/** Область, по которой открывается меню ПКМ */
	children: ReactNode;
	groups: ActionListGroup[];
	onAction?: ActionListRootProps['onAction'];
	filterable?: boolean;
	emptyText?: string;
}
