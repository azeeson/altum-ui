import {test, expect} from '@playwright/test';
import {visitStory} from '../helpers/storybook';

test.describe('PasswordField', () => {
	test('принимает введённый пароль', async ({page}) => {
		await visitStory(page, 'altum-components-formfield-passwordfield--playground');
		const input = page.getByRole('textbox', {name: 'Пароль'});
		await input.fill('Secret123');
		await expect(input).toHaveValue('Secret123');
	});
});

test.describe('SearchField', () => {
	test('принимает поисковый запрос', async ({page}) => {
		await visitStory(page, 'altum-components-formfield-searchfield--playground');
		const input = page.getByRole('searchbox').or(page.getByRole('textbox')).first();
		await input.fill('tasks');
		await expect(input).toHaveValue('tasks');
	});
});

test.describe('NumberField', () => {
	test('увеличивает значение спин-контролом', async ({page}) => {
		await visitStory(page, 'altum-components-formfield-numberfield--playground');
		const input = page.getByRole('spinbutton').or(page.getByRole('textbox')).first();
		await expect(input).toHaveValue(/10/);
		await page.getByRole('button', {name: /Увеличить|Increase|Plus|\+/i}).click();
		await expect(input).toHaveValue(/11/);
	});
});

test.describe('PinInput', () => {
	test('принимает цифры по ячейкам', async ({page}) => {
		await visitStory(page, 'altum-components-formfield-pininput--playground');
		const cells = page.locator('input:not([type="hidden"])');
		await expect(cells.first()).toBeVisible();
		expect(await cells.count()).toBeGreaterThanOrEqual(4);
		await cells.first().click();
		await page.keyboard.type('1234');
		await expect(cells.first()).toHaveValue('1');
		await expect(cells.nth(1)).toHaveValue('2');
	});

	test('ошибка на ячейке, delete и края фокуса', async ({page}) => {
		await visitStory(page, 'altum-components-formfield-pininput--states');
		const invalid = page.getByRole('textbox', {name: /Цифра|Digit/}).first();
		await expect(invalid).toHaveAttribute('aria-invalid', 'true');
		await expect(page.getByText('Неверный код')).toHaveCount(1);

		await visitStory(page, 'altum-components-formfield-pininput--playground');
		const cells = page.locator('input:not([type="hidden"])');
		await cells.first().click();
		await page.keyboard.type('12');
		await cells.nth(1).focus();
		await page.keyboard.press('Delete');
		await expect(cells.nth(1)).toHaveValue('');
		await page.keyboard.press('Home');
		await expect(cells.first()).toBeFocused();
		await page.keyboard.press('End');
		await expect(cells.nth(5)).toBeFocused();
	});

	test('вставка ставит фокус после хвоста, цифра по центру', async ({page}) => {
		await visitStory(page, 'altum-components-formfield-pininput--playground');
		const cells = page.locator('input:not([type="hidden"])');
		await cells.first().evaluate((input) => {
			const data = new DataTransfer();
			data.setData('text/plain', '12');
			input.dispatchEvent(new ClipboardEvent('paste', {
				bubbles: true,
				cancelable: true,
				clipboardData: data,
			}));
		});
		await expect(cells.nth(0)).toHaveValue('1');
		await expect(cells.nth(1)).toHaveValue('2');
		await expect(cells.nth(2)).toBeFocused();
		await expect(cells.first()).toHaveCSS('text-align', 'center');
		await expect(cells.first()).toHaveAttribute('maxlength', '1');
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

test.describe('DateField', () => {
	test('открывает сетку календаря', async ({page}) => {
		await visitStory(page, 'altum-components-formfield-datefield--playground');
		await page.getByRole('textbox').click();
		await expect(page.getByRole('grid')).toBeVisible({timeout: 5000});
	});
});

test.describe('TimeField', () => {
	test('открывает списки часов и минут', async ({page}) => {
		await visitStory(page, 'altum-components-formfield-timefield--playground');
		await page.getByRole('textbox').click();
		await expect(page.getByRole('listbox').first()).toBeVisible({timeout: 5000});
	});

	test('клик по часу обновляет поле и не закрывает попап', async ({page}) => {
		await visitStory(page, 'altum-components-formfield-timefield--playground');
		const input = page.getByRole('textbox');
		await input.click();
		const hours = page.getByRole('listbox', {name: /Часы|Hours/i});
		await expect(hours).toBeVisible({timeout: 5000});
		await hours.getByRole('option', {name: '09'}).click();
		await expect(input).toHaveValue('09:00');
		await expect(hours).toBeVisible();
		await expect(page.getByRole('listbox', {name: /Минуты|Minutes/i})).toBeVisible();
	});
});

test.describe('SuggestField', () => {
	test('фильтрует подсказки', async ({page}) => {
		await visitStory(page, 'altum-components-formfield-suggestfield--playground');
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
