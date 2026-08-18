import {test, expect} from '@playwright/test';
import {visitStory} from '../helpers/storybook';

test.describe('Listbox', () => {
	test('выбирает опцию', async ({page}) => {
		await visitStory(page, 'altum-components-listbox--single');
		await page.getByRole('option', {name: 'Дизайн'}).click();
		await expect(page.getByRole('option', {name: 'Дизайн'})).toHaveAttribute('aria-selected', 'true');
	});
});

test.describe('ActionList', () => {
	test('активирует элемент', async ({page}) => {
		await visitStory(page, 'altum-components-actionlist--playground');
		await page.getByRole('option', {name: /Входящие/i}).click();
		await expect(page.getByText('Выбрано: Входящие')).toBeVisible();
	});
});

test.describe('Pagination', () => {
	test('переходит на следующую страницу', async ({page}) => {
		await visitStory(page, 'altum-components-pagination--playground');
		await page.getByRole('button', {name: /Следующая страница|Next page/i}).click();
		await expect(page.getByRole('button', {name: /Страница 2|Page 2/i})).toHaveAttribute('aria-current', 'page');
	});
});

test.describe('Table', () => {
	test('переключает выбор строки', async ({page}) => {
		await visitStory(page, 'altum-components-table--playground');
		const checkbox = page.getByRole('checkbox').nth(1);
		await expect(checkbox).toBeVisible();
		await checkbox.click();
		await expect(checkbox).toBeChecked();
	});
});

test.describe('VirtualList', () => {
	test('прокручивает к далёкому индексу', async ({page}) => {
		await visitStory(page, 'altum-components-virtuallist--playground');
		await page.getByRole('button', {name: /элементу 501/i}).click();
		await expect(page.getByText('Элемент 501')).toBeVisible({timeout: 5000});
	});
});
