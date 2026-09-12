import type {
	ComponentPropsWithoutRef,
	ReactElement,
	ReactNode,
} from 'react';
import type {DropdownAlign, DropdownWidthMode} from '../Dropdown/Dropdown';
import type {ActionListGroup, ActionListItem, ActionListProps} from '../ActionList/ActionList.types';

/** Режим открытия: клик по `trigger` или ПКМ / Shift+F10 по `children`. */
export type MenuTrigger = ReactElement | 'context';

/**
 * Свойства `Menu`.
 * Клик — `trigger={<ButtonIcon … />}`; контекст — `trigger="context"` и область в `children`.
 */
export interface MenuProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
	/**
	 * Элемент-триггер (клик) или `"context"` (ПКМ / клавиша ContextMenu / Shift+F10).
	 */
	trigger: MenuTrigger;
	/** Область контекстного меню. Нужна при `trigger="context"`. */
	children?: ReactNode;
	items: ActionListItem[];
	groups?: ActionListGroup[];
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	align?: DropdownAlign;
	widthMode?: DropdownWidthMode;
	mobileTitle?: ReactNode;
	filterable?: boolean;
	filterPlaceholder?: string;
	emptyText?: string;
	onAction?: ActionListProps['onAction'];
}
