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

	test('первый пункт без подсветки до наведения', async ({page}) => {
		await visitStory(page, 'altum-components-actionlist--with-static-list');
		await expect(page.getByRole('listbox')).not.toHaveAttribute('aria-activedescendant');
	});

	test('уход указателя не возвращает подсветку на первый пункт', async ({page}) => {
		await visitStory(page, 'altum-components-actionlist--with-static-list');
		await page.getByRole('option', {name: /Сегодня/i}).hover();
		await expect(page.getByRole('listbox')).toHaveAttribute('aria-activedescendant', /.+/);
		await page.mouse.move(0, 0);
		await expect(page.getByRole('listbox')).not.toHaveAttribute('aria-activedescendant');
	});

	test('стрелка вниз подсвечивает первый пункт', async ({page}) => {
		await visitStory(page, 'altum-components-actionlist--playground');
		await page.getByRole('searchbox').focus();
		await page.keyboard.press('ArrowDown');
		await expect(page.getByRole('listbox')).toHaveAttribute('aria-activedescendant', /.+/);
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
		const checkbox = page.getByRole('checkbox', {name: /Выбрать строку 1/});
		await page.locator('label').filter({has: checkbox}).click();
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
