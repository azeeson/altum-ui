import {test, expect} from '@playwright/test';
import {visitStory} from '../helpers/storybook';

test.describe('Popover', () => {
	test('открывается по клику на триггер и закрывается по Escape', async ({page}) => {
		await visitStory(page, 'altum-components-popover--playground');
		await page.getByRole('button', {name: /Открыть popover/i}).click();
		await expect(page.getByText('Описание или форма внутри всплывающей панели')).toBeVisible();
		await page.keyboard.press('Escape');
		await expect(page.getByText('Описание или форма внутри всплывающей панели')).toBeHidden();
	});
});

test.describe('Menu', () => {
	test('открывает меню с иконки-триггера', async ({page}) => {
		await visitStory(page, 'altum-components-menu--playground');
		await page.getByRole('button', {name: /Меню действий/i}).click();
		await expect(page.getByRole('listbox').or(page.getByRole('menu'))).toBeVisible({timeout: 5000});
		await page.keyboard.press('Escape');
	});
});

test.describe('Menu context', () => {
	test('открывается по правому клику', async ({page}) => {
		await visitStory(page, 'altum-components-menu--context');
		const surface = page.getByText(/Правый клик/i);
		await expect(surface).toBeVisible();
		await surface.click({button: 'right'});
		await expect(page.getByRole('listbox').or(page.getByRole('menu'))).toBeVisible({timeout: 5000});
	});
});

test.describe('ConfirmDialog', () => {
	test('открывается с триггера и закрывается по отмене', async ({page}) => {
		await visitStory(page, 'altum-components-confirmdialog--playground');
		await page.getByRole('button', {name: /Удалить список/i}).click();
		await expect(page.getByRole('dialog')).toBeVisible();
		await page.getByRole('button', {name: /Отмена/i}).click();
		await expect(page.getByRole('dialog')).toBeHidden();
	});
});

test.describe('CommandPalette', () => {
	test('открывает палитру, выполняет команду и закрывается по Escape', async ({page}) => {
		await visitStory(page, 'altum-components-commandpalette--playground');
		await page.getByRole('button', {name: /Открыть палитру/i}).click();
		await expect(page.getByRole('dialog')).toBeVisible();
		await page.getByRole('option', {name: /Открыть файл/i}).click();
		await expect(page.getByText(/Последняя команда:\s*Открыть файл/)).toBeVisible();
		await page.getByRole('button', {name: /Открыть палитру/i}).click();
		await expect(page.getByRole('dialog')).toBeVisible();
		await page.keyboard.press('Escape');
		await expect(page.getByRole('dialog')).toBeHidden({timeout: 3000});
	});
});

test.describe('Collapse', () => {
	test('переключает контент', async ({page}) => {
		await visitStory(page, 'altum-components-collapse--playground');
		await page.getByRole('button', {name: /Показать спойлер/i}).click();
		await expect(page.getByText('Плавный раскрывающийся текст под спойлером!')).toBeVisible();
	});
});

test.describe('Tooltip', () => {
	test('показывается при наведении', async ({page}) => {
		await visitStory(page, 'altum-components-tooltip--playground');
		await page.getByRole('button', {name: 'Наведи на меня'}).hover();
		await expect(page.getByText('Полезная подсказка сверху')).toBeVisible();
	});
});
