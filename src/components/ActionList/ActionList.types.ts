import type {
	ReactNode,
	ComponentPropsWithoutRef,
	Ref,
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
	/**
	 * `danger` — вес `danger_tinted`: опасное действие в меню строки,
	 * не solid-кнопка подтверждения.
	 */
	tone?: 'danger';
	keywords?: string[];
	onSelect?: () => void;
	buttonProps?: ListboxOption['buttonProps'];
	/** Id группы из {@link ActionListGroup}. */
	groupId?: string;
}

/**
 * Линия между пунктами. Не выбирается и не участвует в клавиатуре.
 * С `groups` остаётся в группе по `groupId`; без `groupId` — в хвосте без заголовка.
 */
export interface ActionListSeparator {
	type: 'separator';
	/** Стабильный ключ. Без него ключ — позиция в `items`. */
	id?: string;
	groupId?: string;
}

/** Пункт или разделитель в `items`. */
export type ActionListEntry = ActionListItem | ActionListSeparator;

/** Метаданные группы. Пункты — в плоском `items` через `groupId`. */
export interface ActionListGroup {
	id: string;
	label: ReactNode;
}

/** Свойства `ActionList`. */
export interface ActionListProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children' | 'onSelect'> {
	/** DOM-узел корня. */
	rootRef?: Ref<HTMLDivElement>;
	/** Пункты и `{ type: 'separator' }` между ними — как `options` у `Listbox`. */
	items: ActionListEntry[];
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
