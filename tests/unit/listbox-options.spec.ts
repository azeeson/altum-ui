import {test, expect} from '@playwright/test';
import {
	buildListboxView,
	isListboxSeparator,
} from '../../src/components/Listbox/Listbox.utils';
import type {ListboxEntry} from '../../src/components/Listbox/Listbox.types';
import {
	filterListboxOptions,
	findListboxOption,
	flattenResolvedListboxGroups,
	getListboxOptionText,
	resolveListboxGroups,
	type ListboxOption,
} from '../../src/core/utils/listboxOptions';

const OPTIONS: ListboxOption[] = [
	{
		value: 'msk',
		label: 'Москва',
		groupId: 'ru'
	},
	{
		value: 'spb',
		label: 'Санкт-Петербург',
		groupId: 'ru'
	},
	{
		value: 'ber',
		label: 'Berlin',
		groupId: 'eu'
	},
];

test.describe('listboxOptions', () => {
	test('findListboxOption находит по value', () => {
		expect(findListboxOption(OPTIONS, 'spb')?.label).toBe('Санкт-Петербург');
		expect(findListboxOption(OPTIONS, '')).toBeUndefined();
	});

	test('filterListboxOptions не зависит от регистра', () => {
		const filtered = filterListboxOptions({
			options: OPTIONS,
			query: 'моск'
		});
		expect(filtered.map((option) => option.value)).toEqual(['msk']);
	});

	test('resolveListboxGroups сохраняет порядок групп', () => {
		const groups = resolveListboxGroups(OPTIONS, [
			{
				id: 'eu',
				label: 'EU'
			},
			{
				id: 'ru',
				label: 'RU'
			},
		]);
		expect(groups.map((group) => group.id)).toEqual(['eu', 'ru']);
		expect(groups[1]?.options).toHaveLength(2);
	});

	test('buildListboxView не даёт разделителям индекс пункта', () => {
		const view = buildListboxView([
			{
				type: 'separator',
				id: 'start'
			},
			{
				value: 'a',
				label: 'A'
			},
			{type: 'separator'},
			{
				type: 'separator',
				id: 'mid'
			},
			{
				value: 'b',
				label: 'B'
			},
			{
				value: 'c',
				label: 'C'
			},
			{
				type: 'separator',
				id: 'end'
			},
		]);
		expect(view.groups).toBeNull();
		expect(view.options.map((option) => option.value)).toEqual(['a', 'b', 'c']);
		expect(view.slots.map((slot) => (
			slot.type === 'option' ? slot.index : slot.key
		))).toEqual([
			'start',
			0,
			'separator-2',
			'mid',
			1,
			2,
			'end'
		]);
		expect(view.slotIndexByOption).toEqual([1, 4, 5]);
	});

	test('buildListboxView оставляет разделитель в своей группе', () => {
		const entries: ListboxEntry[] = [
			{
				value: 'msk',
				label: 'Москва',
				groupId: 'ru'
			},
			{
				type: 'separator',
				groupId: 'ru'
			},
			{
				value: 'spb',
				label: 'Санкт-Петербург',
				groupId: 'ru'
			},
			{
				type: 'separator',
				id: 'tail'
			},
			{
				value: 'ber',
				label: 'Berlin',
				groupId: 'eu'
			},
		];
		const groups = [
			{
				id: 'eu',
				label: 'EU'
			},
			{
				id: 'ru',
				label: 'RU'
			},
		];
		const view = buildListboxView(entries, groups);
		const optionsOnly = entries.flatMap((entry) => (
			isListboxSeparator(entry) ? [] : [entry]
		));
		expect(view.options.map((option) => option.value)).toEqual(
			flattenResolvedListboxGroups(resolveListboxGroups(optionsOnly, groups))
				.map((option) => option.value),
		);
		expect(view.groups?.map((group) => group.id)).toEqual(['eu', 'ru', '__ungrouped__']);
		expect(view.groups?.[0]?.slots.map((slot) => (
			slot.type === 'option' ? slot.index : slot.key
		))).toEqual([0]);
		expect(view.groups?.[1]?.slots.map((slot) => (
			slot.type === 'option' ? slot.index : slot.key
		))).toEqual([1, 'separator-1', 2]);
		expect(view.groups?.[2]?.slots).toEqual([
			{
				type: 'separator',
				key: 'tail'
			}
		]);
		expect(view.slotIndexByOption).toEqual([0, 1, 3]);
	});

	test('buildListboxView пуст без пунктов и разделителей', () => {
		expect(buildListboxView([])).toEqual({
			options: [],
			slots: [],
			slotIndexByOption: [],
			groups: null,
		});
	});

	test('getListboxOptionText предпочитает textValue', () => {
		expect(getListboxOptionText({
			value: 'x',
			label: 'A',
			textValue: 'Alpha'
		})).toBe('Alpha');
	});

});
