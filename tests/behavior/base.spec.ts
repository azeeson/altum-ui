import {test, expect} from '@playwright/test';
import {visitStory} from '../helpers/storybook';

test.describe('FieldBase', () => {
	test('очищает введённое значение через Clear', async ({page}) => {
		await visitStory(page, 'altum-ui-test-base--field-base-clear');
		const input = page.getByLabel('Сумма');
		await input.fill('1200');
		await expect(page.getByText('Введите сумму')).toHaveCount(0);
		await page.getByRole('button', {name: /Очистить|Clear/i}).click();
		await expect(input).toHaveValue('');
		await expect(page.getByText('Введите сумму')).toBeVisible();
	});
});

test.describe('ButtonBase', () => {
	test('отдаёт недоступную кнопку и ссылку', async ({page}) => {
		await visitStory(page, 'altum-ui-test-base--button-base-states');
		await expect(page.getByRole('button', {name: 'Действие'})).toBeEnabled();
		await expect(page.getByRole('button', {name: 'Недоступно'})).toBeDisabled();
		await expect(page.getByRole('link', {name: 'Ссылка'})).toHaveAttribute('href', '#base-link');
	});
});

test.describe('ToggleControlBase', () => {
	test('переключает нативный input с лейбла', async ({page}) => {
		await visitStory(page, 'altum-ui-test-base--toggle-control-base-label');
		const checkbox = page.getByRole('checkbox', {name: 'Согласен'});
		await expect(checkbox).not.toBeChecked();
		await page.getByText('Согласен').click();
		await expect(checkbox).toBeChecked();
	});
});

test.describe('DialogBase', () => {
	test('закрывается кнопкой Close в Header', async ({page}) => {
		await visitStory(page, 'altum-ui-test-base--dialog-base-chrome');
		await expect(page.getByRole('heading', {name: 'Заголовок'})).toBeVisible();
		await page.getByRole('button', {name: /Закрыть|Close/i}).click();
		await expect(page.getByText('Диалог закрыт')).toBeVisible();
	});
});

test.describe('ChartBase', () => {
	test('рендерит серии легенды', async ({page}) => {
		await visitStory(page, 'altum-ui-test-base--chart-base-legend');
		await expect(page.getByLabel('Демо-график')).toBeVisible();
		await expect(page.getByText('Серия A')).toBeVisible();
		await expect(page.getByText('Серия B')).toBeVisible();
	});
});

test.describe('MediaRowBase', () => {
	test('рендерит полиморфный корень article', async ({page}) => {
		await visitStory(page, 'altum-ui-test-base--media-row-base-article');
		const article = page.locator('article');
		await expect(article).toBeVisible();
		await expect(article.getByText('Заголовок строки')).toBeVisible();
		await expect(article.getByText('Описание')).toBeVisible();
	});
});

test.describe('ListOptionBase', () => {
	test('помечает выбранную опцию', async ({page}) => {
		await visitStory(page, 'altum-ui-test-base--list-option-base-selected');
		await expect(page.getByRole('button', {name: 'Выбранная опция'})).toHaveAttribute(
			'aria-selected',
			'true',
		);
	});
});
