import {test, expect} from '@playwright/test';
import {visitStory} from '../helpers/storybook';
import {
	MOBILE_MEDIA_QUERY,
	SIDEBAR_LARGE_MEDIA_QUERY,
	SIDEBAR_MEDIUM_MEDIA_QUERY,
} from '../../src/hooks/useMediaQuery';
import {REDUCED_MOTION_QUERY} from '../../src/hooks/usePrefersReducedMotion';

test.describe('media query constants', () => {
	test('брейкпоинты совпадают с публичным контрактом', () => {
		expect(MOBILE_MEDIA_QUERY).toBe('(max-width: 768px)');
		expect(SIDEBAR_LARGE_MEDIA_QUERY).toBe('(min-width: 1280px)');
		expect(SIDEBAR_MEDIUM_MEDIA_QUERY).toBe('(min-width: 1024px) and (max-width: 1279px)');
		expect(REDUCED_MOTION_QUERY).toBe('(prefers-reduced-motion: reduce)');
	});
});

test.describe('useForm', () => {
	test('показывает ошибку шаблона для неверного email', async ({page}) => {
		await visitStory(page, 'altum-hooks-useform--playground');
		const field = page.getByLabel(/Электронная почта/);
		await field.fill('not-an-email');
		await expect(page.getByText(/Неверный формат почты/)).toBeVisible();
	});

	test('показывает ошибку обязательности при очистке поля', async ({page}) => {
		await visitStory(page, 'altum-hooks-useform--playground');
		const field = page.getByLabel(/Электронная почта/);
		await field.fill('user@mail.ru');
		await field.fill('');
		await expect(page.getByText('Электронная почта обязательна для заполнения')).toBeVisible();
	});

	test('вложенное поле через FormProvider валидирует email', async ({page}) => {
		await visitStory(page, 'altum-hooks-useform--provider');
		const field = page.getByLabel(/Электронная почта/);
		await field.fill('not-an-email');
		await expect(page.getByText(/Неверный формат почты/)).toBeVisible();
	});
});
