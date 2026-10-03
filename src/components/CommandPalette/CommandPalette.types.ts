import type {
	ComponentPropsWithoutRef,
	ReactNode,
	Ref,
} from 'react';
import type {ActionListGroup, ActionListItem} from '../ActionList/ActionList.types';

export type {ActionListGroup as CommandPaletteGroup, ActionListItem as CommandPaletteItem};

/** Свойства `CommandPalette`. */
export interface CommandPaletteProps extends Omit<
	ComponentPropsWithoutRef<'div'>,
	'children' | 'title' | 'onSelect'
> {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	title?: string;
	items: ActionListItem[];
	groups?: ActionListGroup[];
	placeholder?: string;
	emptyText?: string;
	footer?: ReactNode;
	onAction?: (item: ActionListItem) => void;
	className?: string;
	/** DOM-узел поверхности (`Box`). */
	rootRef?: Ref<HTMLElement>;
}
