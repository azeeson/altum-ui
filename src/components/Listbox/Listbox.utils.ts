import type {ReactNode} from 'react';
import type {ListboxGroup, ListboxOption} from '../../core/utils/listboxOptions';
import type {ListboxEntry, ListboxSeparator} from './Listbox.types';

/** Индекс пункта в плоском списке. Клавиатура и клик читают его с DOM. */
export const LISTBOX_INDEX_ATTR = 'data-index';

/** Подсветка клавиатуры и указателя. Внешний вид — в CSS, не классом из JS. */
export const LISTBOX_HIGHLIGHTED_ATTR = 'data-highlighted';

/**
 * Разделитель, а не пункт. У пункта нет поля `type`.
 */
export function isListboxSeparator<T extends ListboxOption>(
	entry: ListboxEntry<T>,
): entry is ListboxSeparator {
	return 'type' in entry && entry.type === 'separator';
}

/** Слот отрисовки: пункт с индексом подсветки или разделитель. */
export type ListboxSlot<T extends ListboxOption = ListboxOption> =
	| {
		type: 'option';
		option: T;
		index: number;
	}
	| {
		type: 'separator';
		key: string;
	};

export interface ListboxViewGroup<T extends ListboxOption = ListboxOption> {
	id: string;
	label: ReactNode | null;
	slots: ListboxSlot<T>[];
}

export interface ListboxView<T extends ListboxOption = ListboxOption> {
	options: T[];
	slots: ListboxSlot<T>[];
	/** Позиция пункта в `slots` — для прокрутки виртуального списка. */
	slotIndexByOption: number[];
	groups: ListboxViewGroup<T>[] | null;
}

type ListboxRow<T extends ListboxOption = ListboxOption> = {
	entry: ListboxEntry<T>;
	source: number;
};

/**
 * Слоты для рендера. Индексы подсветки есть только у пунктов.
 * Без групп порядок как в `entries`. С группами разделитель с `groupId` остаётся в группе,
 * без `groupId` — в хвосте. Пустые группы отбрасываются.
 *
 * @param entries - Пункты и разделители.
 * @param groups - Метаданные групп. Пустой список — плоский список.
 */
export function buildListboxView<T extends ListboxOption>(
	entries: readonly ListboxEntry<T>[],
	groups?: readonly ListboxGroup[],
): ListboxView<T> {
	const options: T[] = [];
	const slotIndexByOption: number[] = [];
	let cursor = 0;
	const stamp = (rows: readonly ListboxRow<T>[]): ListboxSlot<T>[] => rows.map(({entry, source}) => {
		const slotIndex = cursor;
		cursor += 1;
		if (isListboxSeparator(entry)) {
			return {
				type: 'separator' as const,
				key: entry.id ?? `separator-${source}`,
			};
		}
		const index = options.length;
		options.push(entry);
		slotIndexByOption[index] = slotIndex;
		return {
			type: 'option' as const,
			option: entry,
			index,
		};
	});

	const rows = entries.map((entry, source): ListboxRow<T> => ({
		entry,
		source,
	}));
	if (!groups?.length) {
		return {
			options,
			slots: stamp(rows),
			slotIndexByOption,
			groups: null,
		};
	}

	const known = new Set(groups.map((group) => group.id));
	const byGroup = new Map<string, ListboxRow<T>[]>();
	const loose: ListboxRow<T>[] = [];
	for (const row of rows) {
		const groupId = row.entry.groupId;
		if (!groupId || !known.has(groupId)) {
			loose.push(row);
			continue;
		}
		const bucket = byGroup.get(groupId);
		if (bucket) bucket.push(row);
		else byGroup.set(groupId, [row]);
	}

	const viewGroups: ListboxViewGroup<T>[] = [];
	for (const group of groups) {
		const slots = stamp(byGroup.get(group.id) ?? []);
		if (slots.length === 0) continue;
		viewGroups.push({
			id: group.id,
			label: group.label,
			slots,
		});
	}
	if (loose.length > 0) {
		viewGroups.push({
			id: '__ungrouped__',
			label: null,
			slots: stamp(loose),
		});
	}

	return {
		options,
		slots: viewGroups.flatMap((group) => group.slots),
		slotIndexByOption,
		groups: viewGroups.length > 0 ? viewGroups : null,
	};
}
