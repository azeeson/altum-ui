import {test, expect} from '@playwright/test';
import {visitStory} from '../helpers/storybook';

test.describe('PasswordField', () => {
	test('принимает введённый пароль', async ({page}) => {
		await visitStory(page, 'altum-components-passwordfield--playground');
		const input = page.getByRole('textbox', {name: 'Пароль'});
		await input.fill('Secret123');
		await expect(input).toHaveValue('Secret123');
	});
});

test.describe('SearchField', () => {
	test('принимает поисковый запрос', async ({page}) => {
		await visitStory(page, 'altum-components-searchfield--playground');
		const input = page.getByRole('searchbox').or(page.getByRole('textbox')).first();
		await input.fill('tasks');
		await expect(input).toHaveValue('tasks');
	});
});

test.describe('NumberField', () => {
	test('увеличивает значение спин-контролом', async ({page}) => {
		await visitStory(page, 'altum-components-numberfield--playground');
		const input = page.getByRole('spinbutton').or(page.getByRole('textbox')).first();
		await expect(input).toHaveValue(/10/);
		await page.getByRole('button', {name: /Увеличить|Increase|Plus|\+/i}).click();
		await expect(input).toHaveValue(/11/);
	});
});

test.describe('PinInput', () => {
	test('принимает цифры по ячейкам', async ({page}) => {
		await visitStory(page, 'altum-components-pininput--playground');
		const cells = page.locator('input');
		await expect(cells.first()).toBeVisible();
		expect(await cells.count()).toBeGreaterThanOrEqual(4);
		await cells.first().click();
		await page.keyboard.type('1234');
		await expect(cells.first()).toHaveValue('1');
	});
});

test.describe('Slider', () => {
	test('двигает ползунок с клавиатуры', async ({page}) => {
		await visitStory(page, 'altum-components-slider--playground');
		const thumb = page.getByRole('slider').first();
		await expect(thumb).toBeVisible();
		const before = await thumb.getAttribute('aria-valuenow');
		await thumb.focus();
		await page.keyboard.press('ArrowRight');
		const after = await thumb.getAttribute('aria-valuenow');
		expect(Number(after)).toBeGreaterThan(Number(before));
	});
});

test.describe('DatePicker', () => {
	test('открывает сетку календаря', async ({page}) => {
		await visitStory(page, 'altum-components-datepicker--playground');
		await page.getByRole('button', {name: /\d{2}\.\d{2}\.\d{4}/}).click();
		await expect(page.getByRole('grid')).toBeVisible({timeout: 5000});
	});
});

test.describe('TimePickerField', () => {
	test('открывает списки часов и минут', async ({page}) => {
		await visitStory(page, 'altum-components-timepicker--field-variant');
		await page.getByRole('button', {name: /\d{1,2}:\d{2}/}).or(page.getByRole('combobox')).first().click();
		await expect(page.getByRole('listbox').first()).toBeVisible({timeout: 5000});
	});
});

test.describe('SuggestField', () => {
	test('фильтрует подсказки', async ({page}) => {
		await visitStory(page, 'altum-components-suggestfield--playground');
		const input = page.getByRole('combobox').first();
		await input.click();
		await page.keyboard.type('Каз');
		await expect(page.getByRole('option', {name: /Казань/i})).toBeVisible({timeout: 5000});
	});
});

test.describe('Switch', () => {
	test('переключает состояние checked', async ({page}) => {
		await visitStory(page, 'altum-components-switch--playground');
		const control = page.getByRole('switch').first();
		const wasChecked = await control.isChecked();
		await page.getByText('Включить тёмный режим').click();
		if (wasChecked) {
			await expect(control).not.toBeChecked();
		} else {
			await expect(control).toBeChecked();
		}
	});
});

test.describe('SelectionGroup', () => {
	test('выбирает элемент', async ({page}) => {
		await visitStory(page, 'altum-components-selectiongroup--playground');
		const week = page.getByRole('radio', {name: 'Неделя'});
		await week.click();
		await expect(week).toHaveAttribute('aria-checked', 'true');
	});
});
