import {test, expect} from '@playwright/test';
import {
	filterListboxOptions,
	findListboxOption,
	getListboxOptionText,
	resolveListboxGroups,
	type ListboxOption,
} from '../../src/utils/listboxOptions';

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

	test('getListboxOptionText предпочитает textValue', () => {
		expect(getListboxOptionText({
			value: 'x',
			label: 'A',
			textValue: 'Alpha'
		})).toBe('Alpha');
	});
});
