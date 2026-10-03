import {test, expect} from '@playwright/test';
import {visitStory} from '../helpers/storybook';

test.describe('TextField', () => {
	test('принимает введённое значение', async ({page}) => {
		await visitStory(page, 'altum-components-formfield-textfield--playground');

		const input = page.getByRole('textbox').first();
		await input.fill('Hello altum');
		await expect(input).toHaveValue('Hello altum');
	});
});

test.describe('TextareaField', () => {
	test('принимает многострочный ввод', async ({page}) => {
		await visitStory(page, 'altum-components-formfield-textareafield--playground');

		const textarea = page.getByRole('textbox');
		await textarea.fill('Line 1\nLine 2');
		await expect(textarea).toHaveValue('Line 1\nLine 2');
	});

	test('авто-рост без ручки и со стартовым minRows', async ({page}) => {
		await visitStory(page, 'altum-components-formfield-textareafield--auto-resize');
		const textarea = page.locator('#textarea-auto-resize');
		await expect(textarea).toHaveCSS('resize', 'none');

		await page.goto('/iframe.html?id=altum-components-formfield-textareafield--playground&viewMode=story&args=minRows:3');
		await page.waitForSelector('#storybook-root textarea');
		const sized = page.locator('#textarea-playground');
		await expect(sized).toHaveAttribute('rows', '3');
	});

	test('неконтролируемое поле растёт по вводу', async ({page}) => {
		await visitStory(page, 'altum-components-formfield-textareafield--empty');
		const textarea = page.getByRole('textbox');
		const before = await textarea.evaluate((node) => node.getBoundingClientRect().height);
		await textarea.fill('one\ntwo\nthree\nfour');
		const height = () => textarea.evaluate((node) => node.getBoundingClientRect().height);
		await expect.poll(height).toBeGreaterThan(before + 8);
	});
});

test.describe('SegmentedControl', () => {
	test('переключает активный сегмент', async ({page}) => {
		await visitStory(page, 'altum-components-segmentedcontrol--playground');

		const segments = page.getByRole('radio');
		const count = await segments.count();
		test.skip(count < 2, 'Нужно хотя бы два сегмента');

		const second = segments.nth(1);
		await second.click();
		await expect(second).toHaveAttribute('aria-checked', 'true');
	});
});

test.describe('ButtonGroup', () => {
	test('склеивает кнопки без роли radiogroup', async ({page}) => {
		await visitStory(page, 'altum-components-buttongroup--playground');

		await expect(page.getByRole('group').first()).toBeVisible();
		await expect(page.getByRole('radio')).toHaveCount(0);
	});
});

test.describe('SelectionGroup', () => {
	test('checkbox переключает aria-checked', async ({page}) => {
		await visitStory(page, 'altum-components-selectiongroup--checkbox-buttons');

		const bold = page.getByRole('checkbox', {name: 'Жирный'});
		await expect(bold).toHaveAttribute('aria-checked', 'false');
		await bold.click();
		await expect(bold).toHaveAttribute('aria-checked', 'true');
		await bold.click();
		await expect(bold).toHaveAttribute('aria-checked', 'false');
	});
});

test.describe('Tabs', () => {
	test('переключает вкладку', async ({page}) => {
		await visitStory(page, 'altum-components-tabs--playground');

		const tab = page.getByRole('tab', {name: 'Приложение'});
		await tab.click();
		await expect(tab).toHaveAttribute('aria-selected', 'true');
		await expect(page.getByRole('tab', {name: 'Профиль'})).toHaveAttribute('aria-selected', 'false');
	});
});

test.describe('Fieldset', () => {
	test('рендерит легенду и поля', async ({page}) => {
		await visitStory(page, 'altum-components-fieldset--playground');

		await expect(page.getByText('Контактные данные')).toBeVisible();
		await expect(page.getByRole('textbox').first()).toBeVisible();
	});
});

test.describe('FieldLabel', () => {
	test('рендерит лейбл и контент в вертикальной раскладке', async ({page}) => {
		await visitStory(page, 'altum-components-fieldlabel--playground');

		await expect(page.getByText('Эл. почта')).toBeVisible();
		await expect(page.getByText('alex@example.com')).toBeVisible();
	});
});
