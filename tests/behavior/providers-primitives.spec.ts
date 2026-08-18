import {test, expect} from '@playwright/test';
import {visitStory} from '../helpers/storybook';

test.describe('Overlay', () => {
	test('открывает модальный overlay и закрывается по Escape', async ({page}) => {
		await visitStory(page, 'altum-ui-components-overlay--modal-variant');
		await page.getByRole('button', {name: /Открыть modal/i}).click();
		await expect(page.getByRole('dialog', {name: 'Демо-модалка'})).toBeVisible();
		await page.keyboard.press('Escape');
		await expect(page.getByRole('dialog', {name: 'Демо-модалка'})).toBeHidden({timeout: 3000});
	});
});

test.describe('ThemeProvider', () => {
	test('переключает светлую и тёмную тему', async ({page}) => {
		await visitStory(page, 'altum-ui-utilities-themeprovider--playground');
		await expect(page.getByText(/Текущая тема:\s*light/)).toBeVisible();
		await page.getByRole('button', {name: 'Переключить'}).click();
		await expect(page.getByText(/Текущая тема:\s*dark/)).toBeVisible();
	});
});

test.describe('LocaleProvider', () => {
	test('переключает встроенные строки между ru и en', async ({page}) => {
		await visitStory(page, 'altum-ui-utilities-localeprovider--locales');
		await expect(page.getByText('t(common.close):')).toBeVisible();
		await expect(page.getByText(/Закрыть/)).toBeVisible();
		await page.getByRole('button', {name: 'en'}).click();
		await expect(page.getByText(/t\(common\.close\):\s*Close/)).toBeVisible();
	});
});

test.describe('Progress', () => {
	test('отдаёт детерминированный progressbar', async ({page}) => {
		await visitStory(page, 'altum-ui-components-progress--playground');
		const bar = page.getByRole('progressbar');
		await expect(bar).toBeVisible();
		await expect(bar).toHaveAttribute('aria-valuenow', '65');
	});
});
