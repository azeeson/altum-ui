import {test, expect} from '@playwright/test';
import {visitStory} from '../helpers/storybook';
import {MOBILE_MEDIA_QUERY} from '../../src/hooks/useMediaQuery';

test.describe('useForm', () => {
	test('показывает ошибку шаблона для неверного email', async ({page}) => {
		await visitStory(page, 'altum-ui-hooks-useform--playground');
		const field = page.getByLabel(/Электронная почта/);
		await field.fill('not-an-email');
		await expect(page.getByText(/Неверный формат почты/)).toBeVisible();
	});

	test('показывает ошибку обязательности при очистке поля', async ({page}) => {
		await visitStory(page, 'altum-ui-hooks-useform--playground');
		const field = page.getByLabel(/Электронная почта/);
		await field.fill('user@mail.ru');
		await field.fill('');
		await expect(page.getByText('Электронная почта обязательна для заполнения')).toBeVisible();
	});
});

test.describe('useMediaQuery', () => {
	test('MOBILE_MEDIA_QUERY совпадает с документированным брейкпоинтом', async () => {
		expect(MOBILE_MEDIA_QUERY).toBe('(max-width: 768px)');
	});
});
