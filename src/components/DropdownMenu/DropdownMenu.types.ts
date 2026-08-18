import type {
	ComponentPropsWithoutRef,
	ReactElement,
	ReactNode,
} from 'react';
import type {DropdownProps} from '../Dropdown/Dropdown';
import type {ActionListGroup, ActionListRootProps} from '../ActionList/ActionList.types';

/**
 * Свойства `DropdownMenu`.
 */
export interface DropdownMenuProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
	/** Триггер (кнопка ⋯, Chip и т.п.) — один React-элемент */
	trigger: ReactElement;
	groups: ActionListGroup[];
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	align?: DropdownProps['align'];
	widthMode?: DropdownProps['widthMode'];
	mobileTitle?: ReactNode;
	filterable?: boolean;
	filterPlaceholder?: string;
	emptyText?: string;
	onAction?: ActionListRootProps['onAction'];
}
