import type {
	ReactNode,
	ComponentPropsWithoutRef,
} from 'react';
import type {ListboxOption} from '../Listbox/Listbox';

/** Строка списка команд / действий. */
export interface ActionListItem {
	id: string;
	label: ReactNode;
	textValue?: string;
	description?: ReactNode;
	icon?: ReactNode;
	shortcut?: ReactNode;
	disabled?: boolean;
	keywords?: string[];
	onSelect?: () => void;
	buttonProps?: ListboxOption['buttonProps'];
}

/** Группа строк `ActionList`. */
export interface ActionListGroup {
	id: string;
	label: string;
	items: ActionListItem[];
}

/** Императивный API подсветки / выбора в `ActionList`. */
export interface ActionListHandle {
	highlightNext: () => void;
	highlightPrev: () => void;
	highlightFirst: () => void;
	highlightLast: () => void;
	selectHighlighted: () => ActionListItem | undefined;
	getHighlightedIndex: () => number;
	getActiveDescendantId: () => string | undefined;
	getListId: () => string;
}

/** Свойства корня `ActionList`. */
export interface ActionListRootProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children' | 'onSelect'> {
	children: ReactNode;
	onAction?: (item: ActionListItem) => void;
	onHighlightChange?: (index: number) => void;
}

/** Свойства слота `ActionList.Search`. */
export interface ActionListSearchProps extends Omit<
	ComponentPropsWithoutRef<'input'>,
	'value' | 'type' | 'children'
> {
	query?: string;
	onQueryChange?: (query: string) => void;
	/**
	 * Если `false`, состояние фильтра применяется без второго поля поиска.
	 * @default true
	 */
	visible?: boolean;
}

/** Свойства слота `ActionList.Group`. */
export interface ActionListGroupProps {
	id: string;
	children: ReactNode;
}

/** Свойства слота `ActionList.GroupLabel`. */
export interface ActionListGroupLabelProps {
	children: ReactNode;
}

/** Свойства слота `ActionList.Empty`. */
export interface ActionListEmptyProps {
	children?: ReactNode;
}
