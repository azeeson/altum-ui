import type {ListboxGroup, ListboxOption} from '../../core/utils/listboxOptions';
import type {ComponentPropsWithoutRef, MutableRefObject, ReactNode, Ref} from 'react';

export type {ListboxOption, ListboxGroup};

/**
 * Визуальный разделитель между пунктами.
 * Не выбирается и не участвует в клавиатурной навигации.
 */
export interface ListboxSeparator {
	type: 'separator';
	/** Стабильный ключ. Без него ключ — позиция в `options`. */
	id?: string;
	/**
	 * С `groups` линия остаётся в этой группе, в том же порядке, что и её пункты.
	 * Без `groupId` — в хвосте без заголовка.
	 */
	groupId?: string;
}

/** Пункт (`T` расширяет `ListboxOption`) или разделитель в `options`. */
export type ListboxEntry<T extends ListboxOption = ListboxOption> = T | ListboxSeparator;

export type ListboxNavigation = 'roving' | 'highlight';

export interface ListboxProps<T extends ListboxOption = ListboxOption> extends Omit<
	ComponentPropsWithoutRef<'div'>,
	'onSelect' | 'onChange' | 'value' | 'defaultValue' | 'children'
> {
	/**
	 * Пункты и разделители. Пункт — `ListboxOption` или его наследник; связь с группой через `groupId`.
	 * `{ type: 'separator' }` встаёт в любую позицию; с `groups` остаётся в группе по своему `groupId`, иначе в хвосте без заголовка.
	 */
	options: readonly ListboxEntry<T>[];
	/** Содержимое пункта вместо `option.label`. Кнопка, выбор и клавиатура остаются у Listbox. */
	customRenderOption?: (option: T) => ReactNode;
	/** Метаданные групп (`id` + `label`); опции попадают по `option.groupId` */
	groups?: ListboxGroup[];
	/** Выбранные значения (один или несколько) */
	value?: string[];
	multiple?: boolean;
	/** Выбор / переключение. Второй аргумент — сам пункт (`T`). */
	onSelect?: (optionValue: string, option: T) => void;
	noOptionsText?: string;
	loading?: boolean;
	/** Галочка слева у выбранных (multiple Select) */
	showCheck?: boolean;
	/**
	 * roving — корень списка `tabIndex={0}`, у пунктов всегда `-1`. Стрелки переносят фокус.
	 * highlight — `tabIndex={-1}`: фокус остаётся на combobox, подсветку двигает `controlRef.scrollToId`.
	 */
	navigation?: ListboxNavigation;
	/**
	 * Id пункта для `aria-activedescendant` в режиме комбобокса.
	 * Список прокручивает этот узел через `scrollIntoView`.
	 */
	activeDescendantId?: string;
	/** Корень списка. */
	rootRef?: Ref<HTMLDivElement>;
	/** Imperative API: фокус первой опции, выбор сфокусированной, прокрутка к id. */
	controlRef?: MutableRefObject<ListboxHandle | null>;
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
	/** Фокус на первую доступную опцию (roving). */
	focusFirst: () => void;
	/** Клик по опции, которая сейчас в фокусе. */
	selectHighlighted: () => void;
	/**
	 * Подсветка `data-highlighted` и прокрутка к опции.
	 * Для виртуального списка сначала доскролливает слот, затем `scrollIntoView`.
	 */
	scrollToId: (id: string) => void;
}
