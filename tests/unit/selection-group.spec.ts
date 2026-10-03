import {test, expect} from '@playwright/test';
import {
	isSelectionSelected,
	nextSelectionValue,
	selectionItemTabIndex,
} from '../../src/base/SelectionGroup';
import {tabPanelDomId, tabTriggerDomId} from '../../src/components/Tabs/Tabs.utils';

test.describe('nextSelectionValue', () => {
	test('radio заменяет значение', () => {
		expect(nextSelectionValue('radio', 'day', 'week')).toBe('week');
		expect(nextSelectionValue('radio', '', 'week')).toBe('week');
	});

	test('checkbox добавляет и снимает пункт', () => {
		expect(nextSelectionValue('checkbox', [], 'bold')).toEqual(['bold']);
		expect(nextSelectionValue('checkbox', ['italic'], 'bold')).toEqual(['italic', 'bold']);
		expect(nextSelectionValue('checkbox', ['bold', 'italic'], 'bold')).toEqual(['italic']);
	});

	test('checkbox без массива начинает список с пункта', () => {
		expect(nextSelectionValue('checkbox', '', 'bold')).toEqual(['bold']);
	});
});

test.describe('isSelectionSelected', () => {
	test('radio сравнивает строку', () => {
		expect(isSelectionSelected('radio', 'week', 'week')).toBe(true);
		expect(isSelectionSelected('radio', 'day', 'week')).toBe(false);
	});

	test('checkbox ищет пункт в массиве', () => {
		expect(isSelectionSelected('checkbox', ['bold'], 'bold')).toBe(true);
		expect(isSelectionSelected('checkbox', ['italic'], 'bold')).toBe(false);
		expect(isSelectionSelected('checkbox', 'bold', 'bold')).toBe(false);
	});
});

test.describe('selectionItemTabIndex', () => {
	test('radio оставляет в Tab только выбранный пункт', () => {
		expect(selectionItemTabIndex('radio', true, false, false)).toBe(0);
		expect(selectionItemTabIndex('radio', false, false, false)).toBe(-1);
		expect(selectionItemTabIndex('radio', true, true, false)).toBe(-1);
	});

	test('checkbox ставит в Tab каждый доступный пункт', () => {
		expect(selectionItemTabIndex('checkbox', false, false, false)).toBe(0);
		expect(selectionItemTabIndex('checkbox', true, false, true)).toBe(-1);
	});
});

test.describe('tab ids', () => {
	test('связывает вкладку и панель', () => {
		expect(tabTriggerDomId('tabs', 'info')).toBe('tabs-tab-info');
		expect(tabPanelDomId('tabs', 'info')).toBe('tabs-tabpanel-info');
	});
});
