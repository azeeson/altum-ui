import {test, expect} from '@playwright/test';
import {visitStory} from '../helpers/storybook';

test.describe('TextField', () => {
	test('принимает введённое значение', async ({page}) => {
		await visitStory(page, 'altum-ui-components-textfield--playground');

		const input = page.getByRole('textbox').first();
		await input.fill('Hello altum');
		await expect(input).toHaveValue('Hello altum');
	});
});

test.describe('TextareaField', () => {
	test('принимает многострочный ввод', async ({page}) => {
		await visitStory(page, 'altum-ui-components-textareafield--playground');

		const textarea = page.getByRole('textbox');
		await textarea.fill('Line 1\nLine 2');
		await expect(textarea).toHaveValue('Line 1\nLine 2');
	});
});

test.describe('SegmentedControl', () => {
	test('переключает активный сегмент', async ({page}) => {
		await visitStory(page, 'altum-ui-components-segmentedcontrol--playground');

		const segments = page.getByRole('radio');
		const count = await segments.count();
		test.skip(count < 2, 'Нужно хотя бы два сегмента');

		const second = segments.nth(1);
		await second.click();
		await expect(second).toHaveAttribute('aria-checked', 'true');
	});
});

test.describe('Fieldset', () => {
	test('рендерит легенду и поля', async ({page}) => {
		await visitStory(page, 'altum-ui-components-fieldset--playground');

		await expect(page.getByText('Контактные данные')).toBeVisible();
		await expect(page.getByRole('textbox').first()).toBeVisible();
	});
});

test.describe('FieldLabel', () => {
	test('рендерит лейбл и контент в вертикальной раскладке', async ({page}) => {
		await visitStory(page, 'altum-ui-components-fieldlabel--playground');

		await expect(page.getByText('Эл. почта')).toBeVisible();
		await expect(page.getByText('alex@example.com')).toBeVisible();
	});
});
