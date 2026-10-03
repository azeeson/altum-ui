import {test, expect} from '@playwright/test';
import {visitStory} from '../helpers/storybook';

test.describe('Dropdown', () => {
	test('открывает панель по клику на триггер и показывает контент', async ({page}) => {
		await visitStory(page, 'altum-components-dropdown--playground');

		const trigger = page.getByRole('button', {name: /Открыть/i});
		await expect(trigger).toHaveAttribute('popovertarget');

		await trigger.click();
		await expect(page.getByText('Содержимое выпадающей панели')).toBeVisible();

		const panel = page.locator('body').locator('div').filter({hasText: 'Содержимое выпадающей панели'}).last();
		const triggerBox = await trigger.boundingBox();
		const panelBox = await panel.boundingBox();

		expect(triggerBox).not.toBeNull();
		expect(panelBox).not.toBeNull();

		if (triggerBox && panelBox) {
			expect(panelBox.y).toBeGreaterThanOrEqual(triggerBox.y);
			expect(Math.abs(panelBox.x - triggerBox.x)).toBeLessThan(80);
		}
	});

	test('закрывается по клику снаружи', async ({page}) => {
		await visitStory(page, 'altum-components-dropdown--playground');

		await page.getByRole('button', {name: /Открыть/i}).click();
		await expect(page.getByText('Содержимое выпадающей панели')).toBeVisible();

		await page.mouse.click(8, 8);
		await expect(page.getByText('Содержимое выпадающей панели')).toBeHidden();
	});
});

test.describe('Select', () => {
	test('открывает listbox и выбирает опцию', async ({page}) => {
		await visitStory(page, 'altum-components-formfield-select--playground');

		const trigger = page.getByRole('button', {name: /Город/i});
		await trigger.click();

		const listbox = page.getByRole('listbox');
		await expect(listbox).toBeVisible();

		await page.getByRole('option', {name: 'Казань'}).click();
		await expect(trigger).toContainText('Казань');
		await expect(listbox).toBeHidden();
	});

	test('filterable-стори фильтрует опции', async ({page}) => {
		await visitStory(page, 'altum-components-formfield-select--playground');

		await page.getByRole('button', {name: /Город/i}).click();
		const filter = page.getByRole('searchbox');
		await expect(filter).toBeVisible();

		await filter.fill('Казань');
		await expect(page.getByRole('option', {name: 'Казань'})).toBeVisible();
		await expect(page.getByRole('option', {name: 'Москва'})).toHaveCount(0);
	});

	test('панель и триггер не уже самого длинного пункта', async ({page}) => {
		await visitStory(page, 'altum-components-formfield-select--playground');

		const trigger = page.getByRole('button', {name: /Город/i});
		await trigger.click();

		const option = page.getByRole('option', {name: 'Санкт-Петербург'});
		await expect(option).toBeVisible();

		const truncated = await option.evaluate((el) => {
			const label = el.querySelector('span') ?? el;
			return label.scrollWidth > label.clientWidth + 1;
		});
		expect(truncated).toBe(false);

		const triggerBox = await trigger.boundingBox();
		expect(triggerBox).not.toBeNull();
		if (triggerBox) {
			expect(triggerBox.width).toBeGreaterThan(120);
		}
	});

	test('добавляет выбранный город в чипы', async ({page}) => {
		await visitStory(page, 'altum-components-formfield-select--multiple');

		await page.getByRole('combobox').click();
		await expect(page.getByRole('listbox')).toBeVisible();

		await page.getByRole('option', {name: 'Санкт-Петербург'}).click();
		await expect(page.getByRole('combobox')).toContainText('Санкт-Петербург');
	});
});

test.describe('Checkbox', () => {
	test('переключается в playground-стори', async ({page}) => {
		await visitStory(page, 'altum-components-checkbox--playground');

		const checkbox = page.getByRole('checkbox', {name: /Запомнить меня/i});
		await expect(checkbox).not.toBeChecked();

		await page.getByText('Запомнить меня на 30 дней').click();
		await expect(checkbox).toBeChecked();

		await page.getByText('Запомнить меня на 30 дней').click();
		await expect(checkbox).not.toBeChecked();
	});

	test('принимает controlled-состояние checked', async ({page}) => {
		await visitStory(page, 'altum-test-interaction--checkbox-forced-checked');

		const checkbox = page.getByTestId('forced-checkbox');
		await expect(checkbox).toBeChecked();
	});

	test('controlled-харнесс обновляет вывод', async ({page}) => {
		await visitStory(page, 'altum-test-interaction--checkbox-controlled');

		const state = page.getByTestId('checkbox-state');

		await expect(state).toHaveText('unchecked');
		await page.getByText('Тестовый флажок').click();
		await expect(state).toHaveText('checked');
	});
});

test.describe('Switch', () => {
	test('переключается по клику', async ({page}) => {
		await visitStory(page, 'altum-components-switch--playground');

		const toggle = page.getByRole('switch').first();
		const initial = await toggle.isChecked();

		await page.getByText('Включить тёмный режим').click();
		await expect(toggle).toBeChecked({checked: !initial});

		await page.getByText('Включить тёмный режим').click();
		await expect(toggle).toBeChecked({checked: initial});
	});
});

test.describe('Radio', () => {
	test('группа выбирает одну опцию', async ({page}) => {
		await visitStory(page, 'altum-components-radio--group');

		const optionB = page.getByRole('radio', {name: 'PayPal'});
		const optionC = page.getByRole('radio', {name: 'ЮKassa'});

		await page.getByText('PayPal', {exact: true}).click();
		await expect(optionB).toBeChecked();
		await expect(optionC).not.toBeChecked();

		await page.getByText('ЮKassa', {exact: true}).click();
		await expect(optionC).toBeChecked();
		await expect(optionB).not.toBeChecked();
	});
});

test.describe('Tabs', () => {
	test('переключает активную панель вкладки', async ({page}) => {
		await visitStory(page, 'altum-components-tabs--playground');

		const tabs = page.getByRole('tab');
		const count = await tabs.count();
		test.skip(count < 2, 'Нужно хотя бы две вкладки');

		const secondTab = tabs.nth(1);
		await secondTab.click();
		await expect(secondTab).toHaveAttribute('aria-selected', 'true');
		await expect(page.getByRole('tabpanel')).toContainText('приложения');
	});
});

test.describe('PopupSwitch', () => {
	test('открывает список под кнопкой', async ({page}) => {
		await visitStory(page, 'altum-components-popupswitch--playground');

		const trigger = page.getByRole('button', {name: 'Неделя'});
		await expect(trigger).toHaveAttribute('aria-expanded', 'false');
		await expect(trigger).toHaveAttribute('aria-haspopup', 'listbox');

		await trigger.click();
		await expect(trigger).toHaveAttribute('aria-expanded', 'true');

		const listbox = page.getByRole('listbox');
		const option = page.getByRole('option', {
			name: 'Неделя',
			exact: true
		});
		await expect(listbox).toBeVisible();
		await expect(option).toHaveAttribute('aria-selected', 'true');
	});

	test('выбор пункта меняет подпись и закрывает список', async ({page}) => {
		await visitStory(page, 'altum-components-popupswitch--playground');

		await page.getByRole('button', {name: 'Неделя'}).click();
		await page.getByRole('option', {
			name: 'Месяц',
			exact: true
		}).click();

		const trigger = page.getByRole('button', {name: 'Месяц'});
		await expect(trigger).toBeVisible();
		await expect(trigger).toHaveAttribute('aria-expanded', 'false');
		await expect(page.getByRole('listbox')).toBeHidden();
	});

	test('Escape закрывает список и возвращает фокус на кнопку', async ({page}) => {
		await visitStory(page, 'altum-components-popupswitch--playground');

		const trigger = page.getByRole('button', {name: 'Неделя'});
		await trigger.click();
		await expect(page.getByRole('listbox')).toBeVisible();

		await page.keyboard.press('Escape');
		await expect(page.getByRole('listbox')).toBeHidden();
		await expect(trigger).toBeFocused();
	});

	test('клик снаружи закрывает список', async ({page}) => {
		await visitStory(page, 'altum-components-popupswitch--playground');

		await page.getByRole('button', {name: 'Неделя'}).click();
		await expect(page.getByRole('listbox')).toBeVisible();

		const viewport = page.viewportSize();
		await page.mouse.click((viewport?.width ?? 900) - 8, (viewport?.height ?? 700) - 8);
		await expect(page.getByRole('listbox')).toBeHidden();
	});

	test('стрелки и Enter выбирают пункт', async ({page}) => {
		await visitStory(page, 'altum-components-popupswitch--playground');

		const trigger = page.getByRole('button', {name: 'Неделя'});
		await trigger.focus();
		await page.keyboard.press('ArrowDown');

		await expect(page.getByRole('listbox')).toBeVisible();
		await expect(page.getByRole('option', {
			name: 'Неделя',
			exact: true
		})).toBeFocused();

		await page.keyboard.press('ArrowDown');
		await expect(page.getByRole('option', {
			name: 'Месяц',
			exact: true
		})).toBeFocused();

		await page.keyboard.press('Enter');
		await expect(page.getByRole('button', {name: 'Месяц'})).toBeFocused();
		await expect(page.getByRole('listbox')).toBeHidden();
	});

	test('длинный список у нижнего края не вылезает из вьюпорта', async ({page}) => {
		await visitStory(page, 'altum-components-popupswitch--near-bottom');

		await page.getByRole('button', {name: 'Пункт 12'}).click();
		const listbox = page.getByRole('listbox');
		await expect(listbox).toHaveAttribute('data-ready', '');

		const box = await listbox.boundingBox();
		const viewport = page.viewportSize();
		expect(box).not.toBeNull();
		expect(viewport).not.toBeNull();
		if (box && viewport) {
			expect(box.y).toBeGreaterThanOrEqual(7);
			expect(box.y + box.height).toBeLessThanOrEqual(viewport.height - 7);
		}
	});
});

test.describe('Accordion', () => {
	test('раскрывает секцию по клику', async ({page}) => {
		await visitStory(page, 'altum-components-accordion--playground');

		const trigger = page.getByRole('button', {name: /тарифный план/i});
		await trigger.click();
		await expect(trigger).toHaveAttribute('aria-expanded', 'true');
		await expect(
			page.getByRole('region', {name: 'Как изменить тарифный план?'}),
		).toContainText('Настроек профиля');
	});
});
