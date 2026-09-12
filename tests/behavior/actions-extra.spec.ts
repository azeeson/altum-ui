import {test, expect} from '@playwright/test';
import {visitStory} from '../helpers/storybook';

test.describe('ButtonIcon', () => {
	test('рендерит доступную кнопку-иконку', async ({page}) => {
		await visitStory(page, 'altum-components-buttonicon--playground');
		const button = page.getByRole('button', {name: 'Меню'});
		await expect(button).toBeVisible();
		await expect(button).toBeEnabled();
		await button.click();
	});
});

test.describe('ButtonGroup', () => {
	test('отдаёт сгруппированные иконки-действия', async ({page}) => {
		await visitStory(page, 'altum-components-buttongroup--playground');
		await expect(page.getByRole('button', {name: 'Вверх'})).toBeVisible();
		await page.getByRole('button', {name: 'Вниз'}).click();
	});
});

test.describe('Overflow', () => {
	test('открывает overflow-меню и выполняет скрытое действие', async ({page}) => {
		await visitStory(page, 'altum-components-overflow--visible-two');
		await page.getByRole('button', {name: /Ещё|More/i}).click();
		await page.getByRole('option', {name: 'Поделиться'}).click();
		await expect(page.getByText(/Последнее действие:\s*Поделиться/)).toBeVisible();
	});

	test('открывает overflow-меню для скрытых элементов', async ({page}) => {
		await visitStory(page, 'altum-components-overflow--group-playground');
		const more = page.getByRole('button', {name: /Показать ещё|Show more/i});
		await expect(more).toBeVisible();
		await more.click();
		await expect(more).toHaveAttribute('aria-expanded', 'true');
	});
});

test.describe('ActionSheetTrigger', () => {
	test('открывает overflow-действия с карточки-хоста', async ({page}) => {
		await visitStory(page, 'altum-components-actionsheettrigger--playground');
		await expect(page.getByText(/Зажмите карточку/i)).toBeVisible();
		await page.getByRole('button', {name: /Ещё действия|More actions/i}).click();
		await page.getByRole('option', {name: 'Дублировать'}).click();
		await expect(page.getByText(/Действие:\s*Дублировать/)).toBeVisible();
	});
});

test.describe('Link', () => {
	test('отдаёт навигационную ссылку', async ({page}) => {
		await visitStory(page, 'altum-components-link--playground');
		await expect(page.getByRole('link', {name: /Нажмите сюда/i})).toBeVisible();
	});
});

test.describe('SkipLink', () => {
	test('появляется при фокусе с клавиатуры', async ({page}) => {
		await visitStory(page, 'altum-utilities-skiplink--playground');
		await page.keyboard.press('Tab');
		await expect(page.getByRole('link', {name: /основному содержимому/i})).toBeVisible();
	});
});

test.describe('Steps', () => {
	test('переходит к следующему шагу', async ({page}) => {
		await visitStory(page, 'altum-components-steps--playground');
		await page.getByRole('button', {name: 'Далее'}).click();
		await expect(page.getByText('Загрузка документов')).toBeVisible();
	});
});
