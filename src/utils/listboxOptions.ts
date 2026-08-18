import type {ButtonHTMLAttributes, ReactNode} from 'react';

/**
 * Элемент списка выбора (Listbox, Select, SuggestField).
 * Значение `value` — стабильный идентификатор; подпись может быть JSX.
 */
export interface ListboxOption {
	value: string;
	/** Подпись опции: строка или произвольный JSX */
	label: ReactNode;
	/** Текст для фильтрации / aria / отображения в инпуте, если `label` — JSX */
	textValue?: string;
	disabled?: boolean;
	/** Id группы из {@link ListboxGroup}; при совпадении опция попадает в эту группу */
	groupId?: string;
	/** Value родителя для каскада; без `parent` — корень */
	parent?: string;
	/**
	 * Доп. DOM-атрибуты видимой кнопки опции (`data-*`, `aria-*`, `title`, …).
	 * Служебные attrs Listbox (`id`, `role`, `aria-selected`, …) имеют приоритет.
	 */
	buttonProps?: Omit<
		ButtonHTMLAttributes<HTMLButtonElement>,
		| 'children'
		| 'type'
		| 'role'
		| 'id'
		| 'disabled'
		| 'tabIndex'
		| 'aria-selected'
		| 'aria-disabled'
		| 'onClick'
		| 'onMouseDown'
		| 'onMouseEnter'
		| 'onFocus'
	>;
}

/**
 * Метаданные группы опций (заголовок). Сами опции — в плоском `options` через `groupId`.
 */
export interface ListboxGroup {
	id: string;
	label: ReactNode;
}

/**
 * Разрешённая группа с опциями для рендера.
 */
export interface ResolvedListboxGroup {
	id: string;
	label: ReactNode | null;
	options: ListboxOption[];
}

/**
 * Собирает опции по группам: порядок групп из `groups`, внутри — порядок в `options`.
 * Опции без валидного `groupId` — в хвосте без заголовка (`label: null`).
 *
 * @param options - Плоский список опций.
 * @param groups - Метаданные групп (id + label).
 */
export function resolveListboxGroups(
	options: ListboxOption[],
	groups: ListboxGroup[] | undefined,
): ResolvedListboxGroup[] {
	if (!groups || groups.length === 0) {
		return options.length > 0
			? [
				{
					id: '__ungrouped__',
					label: null,
					options
				}
			]
			: [];
	}

	const groupIds = new Set(groups.map((group) => group.id));
	const byGroup = new Map<string, ListboxOption[]>();
	const ungrouped: ListboxOption[] = [];

	for (const option of options) {
		if (option.groupId && groupIds.has(option.groupId)) {
			const bucket = byGroup.get(option.groupId);
			if (bucket) {
				bucket.push(option);
			} else {
				byGroup.set(option.groupId, [option]);
			}
		} else {
			ungrouped.push(option);
		}
	}

	const resolved: ResolvedListboxGroup[] = groups
		.map((group) => ({
			id: group.id,
			label: group.label,
			options: byGroup.get(group.id) ?? [],
		}))
		.filter((group) => group.options.length > 0);

	if (ungrouped.length > 0) {
		resolved.push({
			id: '__ungrouped__',
			label: null,
			options: ungrouped
		});
	}

	return resolved;
}

/**
 * Плоский порядок опций с учётом групп (для highlight-индексов).
 */
export function flattenResolvedListboxGroups(
	resolved: ResolvedListboxGroup[],
): ListboxOption[] {
	return resolved.flatMap((group) => group.options);
}

/**
 * Путь root→leaf по value листа (или промежуточного узла).
 * Если value не найден — пустой массив.
 */
export function getListboxPath(
	options: ListboxOption[],
	leafValue: string | undefined,
): ListboxOption[] {
	if (!leafValue) return [];

	const byValue = new Map(options.map((option) => [option.value, option]));
	const path: ListboxOption[] = [];
	let current = byValue.get(leafValue);

	while (current) {
		path.unshift(current);
		if (!current.parent) break;
		current = byValue.get(current.parent);
	}

	return path;
}

/**
 * Пользовательская функция фильтрации опций по строке запроса.
 *
 * @template T - Тип опции, расширяющий {@link ListboxOption}.
 */
export type ListboxFilterFn<T extends ListboxOption = ListboxOption> = (
	option: T,
	query: string,
) => boolean;

/**
 * Возвращает текстовое представление опции для поиска, aria и поля ввода.
 * Приоритет: `textValue` → строковый/числовой `label` → `value`.
 *
 * @param option - Опция списка.
 * @returns Нормализованная строка для сравнения и отображения.
 */
export function getListboxOptionText(option: ListboxOption): string {
	if (typeof option.textValue === 'string' && option.textValue.length > 0) {
		return option.textValue;
	}
	if (typeof option.label === 'string') {
		return option.label;
	}
	if (typeof option.label === 'number') {
		return String(option.label);
	}
	return option.value;
}

/**
 * Фильтр по умолчанию: подстрока без учёта регистра в textValue/label и value.
 * Пустой или состоящий из пробелов query — все опции проходят фильтр.
 */
export const defaultListboxFilterFn: ListboxFilterFn = (option, query) => {
	const normalizedQuery = query.trim().toLowerCase();
	if (!normalizedQuery) return true;

	return (
		getListboxOptionText(option).toLowerCase().includes(normalizedQuery)
		|| option.value.toLowerCase().includes(normalizedQuery)
	);
};

interface FilterListboxOptionsParams<T extends ListboxOption> {
	options: T[];
	query: string;
	/** Если false — не фильтровать (показать все). По умолчанию true. */
	enabled?: boolean;
	filterFn?: ListboxFilterFn<T>;
}

/**
 * Фильтрует опции по строке запроса с возможностью отключить фильтрацию.
 *
 * @param params - Опции, query, флаг enabled и кастомная filterFn.
 * @returns Отфильтрованный массив; при `enabled: false` или пустом query — исходный список.
 *
 * @example
 * filterListboxOptions({ options, query: 'моск' });
 */
export function filterListboxOptions<T extends ListboxOption>({
	options,
	query,
	enabled = true,
	filterFn = defaultListboxFilterFn as ListboxFilterFn<T>,
}: FilterListboxOptionsParams<T>): T[] {
	if (!enabled || !query.trim()) {
		return options;
	}

	return options.filter((option) => filterFn(option, query));
}

/**
 * Ищет опцию по значению `value`.
 *
 * @param options - Список опций.
 * @param value - Искомое значение; `undefined` или пустая строка → `undefined`.
 * @returns Найденная опция или `undefined`.
 */
export function findListboxOption<T extends ListboxOption>(
	options: T[],
	value: string | undefined,
): T | undefined {
	if (value === undefined || value === '') {
		return undefined;
	}

	return options.find((option) => option.value === value);
}

/**
 * Текст для поля ввода / триггера: подпись совпавшей опции или сырое значение.
 *
 * @param options - Список опций.
 * @param value - Текущее выбранное значение.
 * @returns Пустая строка, если value не задан; иначе textValue/label опции или само value.
 */
export function getListboxDisplayValue<T extends ListboxOption>(
	options: T[],
	value: string | undefined,
): string {
	if (value === undefined || value === '') {
		return '';
	}

	const matched = findListboxOption(options, value);
	return matched ? getListboxOptionText(matched) : value;
}

/**
 * Находит опцию при точном совпадении query с label/textValue или value (без учёта регистра).
 * Используется для автоподстановки при Enter / blur.
 *
 * @param options - Список опций.
 * @param query - Строка ввода пользователя.
 * @returns Совпавшая опция или `undefined`, если query пустой.
 */
export function matchListboxOption<T extends ListboxOption>(
	options: T[],
	query: string,
): T | undefined {
	const normalized = query.trim().toLowerCase();
	if (!normalized) {
		return undefined;
	}

	return options.find((option) => (
		getListboxOptionText(option).toLowerCase() === normalized
		|| option.value.toLowerCase() === normalized
	));
}

/**
 * Стабильный DOM-id опции для связи listbox ↔ option (aria-activedescendant).
 *
 * @param listboxId - Базовый id контейнера listbox.
 * @param index - Индекс опции в текущем плоском списке.
 * @returns Строка вида `{listboxId}-option-{index}`.
 */
export function getListboxOptionDomId(listboxId: string, index: number): string {
	return `${listboxId}-option-${index}`;
}

/**
 * Смещает индекс подсветки (стрелки вверх/вниз) с пропуском disabled-опций.
 *
 * @param currentIndex - Текущий индекс; вне диапазона трактуется как «до начала» или «после конца».
 * @param length - Число опций в списке.
 * @param direction - `1` — вниз, `-1` — вверх.
 * @param options - Опциональный предикат disabled по индексу.
 * @returns Новый индекс или `-1`, если все опции disabled или список пуст.
 */
export function moveListboxHighlight(
	currentIndex: number,
	length: number,
	direction: 1 | -1,
	options?: {
		isDisabled?: (index: number) => boolean;
	},
): number {
	if (length <= 0) return -1;

	const isDisabled = options?.isDisabled;
	let index = currentIndex;

	if (index < 0 || index >= length) {
		index = direction === 1 ? -1 : length;
	}

	for (let step = 0; step < length; step += 1) {
		index = (index + direction + length) % length;
		if (!isDisabled?.(index)) {
			return index;
		}
	}

	return -1;
}

/**
 * Ищет первый или последний enabled-индекс в списке (Home / End).
 *
 * @param length - Число опций.
 * @param from - `'start'` — с начала, `'end'` — с конца.
 * @param isDisabled - Опциональный предикат disabled по индексу.
 * @returns Индекс или `-1`, если список пуст или все disabled.
 */
export function findEnabledListboxIndex(
	length: number,
	from: 'start' | 'end',
	isDisabled?: (index: number) => boolean,
): number {
	if (length <= 0) return -1;

	if (from === 'start') {
		for (let index = 0; index < length; index += 1) {
			if (!isDisabled?.(index)) return index;
		}
	} else {
		for (let index = length - 1; index >= 0; index -= 1) {
			if (!isDisabled?.(index)) return index;
		}
	}

	return -1;
}
