import {test, expect} from '@playwright/test';
import {visitStory} from '../helpers/storybook';

test.describe('Button', () => {
	test('состояния disabled и loading не активируются', async ({page}) => {
		await visitStory(page, 'altum-components-button--all-variants');
		await expect(page.getByRole('button', {name: 'Заблокировано'})).toBeDisabled();
		await expect(page.getByRole('button', {name: /Сохранение/i})).toHaveAttribute('aria-busy', 'true');
	});

	test('отдаёт недоступную кнопку и ссылку', async ({page}) => {
		await visitStory(page, 'altum-components-button--as-link');
		await expect(page.getByRole('button', {name: 'Действие'})).toBeEnabled();
		await expect(page.getByRole('button', {name: 'Недоступно'})).toBeDisabled();
		await expect(page.getByRole('link', {name: 'Ссылка'})).toHaveAttribute('href', '#base-link');
	});
});

test.describe('Chip', () => {
	test('удаляет чип', async ({page}) => {
		await visitStory(page, 'altum-components-chip--removable');
		await expect(page.getByText('React')).toBeVisible();
		await page.getByRole('button', {name: /Удалить React/i}).click();
		await expect(page.getByText('React')).toHaveCount(0);
	});
});

test.describe('Notification', () => {
	test('показывает тост из playground', async ({page}) => {
		await visitStory(page, 'altum-components-notification--playground');
		await page.getByRole('button', {name: /Показать уведомление/i}).click();
		await expect(page.getByText(/Успешн|уведомлен/i).first()).toBeVisible({timeout: 5000});
	});
});

test.describe('Sidebar', () => {
	test('выбирает пункт навигации', async ({page}) => {
		await visitStory(page, 'altum-components-sidebar--playground');
		const orders = page.getByRole('button', {name: /Заказы/});
		await expect(page.getByRole('button', {name: 'Обзор'})).toHaveAttribute('aria-current', 'page');
		await orders.click();
		await expect(orders).toHaveAttribute('aria-current', 'page');
	});
});
