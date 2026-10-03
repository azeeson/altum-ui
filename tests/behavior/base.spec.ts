import {test, expect} from '@playwright/test';
import {visitStory} from '../helpers/storybook';

test.describe('TextField', () => {
	test('очищает введённое значение через Clear', async ({page}) => {
		await visitStory(page, 'altum-test-base--field-base-clear');
		const input = page.getByLabel('Сумма');
		await input.fill('1200');
		await expect(page.getByText('Введите сумму')).toHaveCount(0);
		await page.getByRole('button', {name: /Очистить|Clear/i}).click();
		await expect(input).toHaveValue('');
		await expect(page.getByText('Введите сумму')).toBeVisible();
	});
});

test.describe('ToggleControlBase', () => {
	test('переключает нативный input с лейбла', async ({page}) => {
		await visitStory(page, 'altum-test-base--toggle-control-base-label');
		const checkbox = page.getByRole('checkbox', {name: 'Согласен'});
		await expect(checkbox).not.toBeChecked();
		await page.getByText('Согласен').click();
		await expect(checkbox).toBeChecked();
	});
});

test.describe('ChartBase', () => {
	test('рендерит серии легенды', async ({page}) => {
		await visitStory(page, 'altum-test-base--chart-base-legend');
		await expect(page.getByLabel('Демо-график')).toBeVisible();
		await expect(page.getByText('Серия A')).toBeVisible();
		await expect(page.getByText('Серия B')).toBeVisible();
	});
});

test.describe('Listbox option', () => {
	test('помечает выбранную опцию', async ({page}) => {
		await visitStory(page, 'altum-test-base--list-option-base-selected');
		await expect(page.getByRole('button', {name: 'Выбранная опция'})).toHaveAttribute(
			'aria-selected',
			'true',
		);
	});
});
