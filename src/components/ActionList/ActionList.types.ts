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
	/** Id группы из {@link ActionListGroup}. */
	groupId?: string;
}

/** Метаданные группы. Пункты — в плоском `items` через `groupId`. */
export interface ActionListGroup {
	id: string;
	label: ReactNode;
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

/** Свойства `ActionList`. */
export interface ActionListProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children' | 'onSelect'> {
	items: ActionListItem[];
	groups?: ActionListGroup[];
	onAction?: (item: ActionListItem) => void;
	onHighlightChange?: (index: number) => void;
	/**
	 * Поле фильтра над списком.
	 * @default false
	 */
	filterable?: boolean;
	filterPlaceholder?: string;
	/** Контролируемый запрос фильтра (в т.ч. без видимого поля — `CommandPalette`). */
	query?: string;
	onQueryChange?: (query: string) => void;
	emptyText?: string;
}
