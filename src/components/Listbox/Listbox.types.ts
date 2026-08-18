import type {ListboxGroup, ListboxOption} from '../../utils/listboxOptions';
import type {ComponentPropsWithoutRef} from 'react';

export type {ListboxOption, ListboxGroup};

export type ListboxNavigation = 'roving' | 'highlight';

export interface ListboxProps extends Omit<
	ComponentPropsWithoutRef<'ul'>,
	'onSelect' | 'onChange' | 'value' | 'defaultValue' | 'children'
> {
	/** Плоский список опций (связь с группами через `groupId`) */
	options: ListboxOption[];
	/** Метаданные групп (`id` + `label`); опции попадают по `option.groupId` */
	groups?: ListboxGroup[];
	/** Выбранные значения (один или несколько) */
	value?: string[];
	multiple?: boolean;
	/** Выбор / переключение опции по value */
	onSelect?: (optionValue: string) => void;
	noOptionsText?: string;
	loading?: boolean;
	/** Галочка слева у выбранных (multiple Select) */
	showCheck?: boolean;
	/**
	 * roving — фокус и tabIndex на option, без `aria-activedescendant` (Select).
	 * highlight — фокус остаётся на combobox, список через `aria-activedescendant` (SuggestField).
	 */
	navigation?: ListboxNavigation;
	highlightedIndex?: number;
	defaultHighlightedIndex?: number;
	onHighlightChange?: (index: number) => void;
	/** preventDefault на mousedown опций (чтобы не снимать фокус с input) */
	preventOptionMouseDown?: boolean;
	disabled?: boolean;
	/** Многострочный label (иконка + описание и т.п.) */
	multiline?: boolean;
	/**
	 * Виртуализация длинного плоского списка через `VirtualList`.
	 * По умолчанию — `true`, когда опций > 100 и нет именованных групп.
	 */
	virtualized?: boolean;
}

export interface ListboxHandle {
	highlightNext: () => void;
	highlightPrev: () => void;
	highlightFirst: () => void;
	highlightLast: () => void;
	selectHighlighted: () => string | undefined;
	getHighlightedIndex: () => number;
	getActiveDescendantId: () => string | undefined;
	focusOption: (index: number) => void;
}
