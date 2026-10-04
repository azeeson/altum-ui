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

test.describe('useStickyChrome', () => {
	test('делит порог флага и прогресс заливки', async ({page}) => {
		await visitStory(page, 'altum-hooks-usestickychrome--task-list');
		const shell = page.getByTestId('chrome-shell');
		const scroll = page.getByTestId('chrome-scroll');
		const readProgress = () => scroll.evaluate((node) => (
			getComputedStyle(node).getPropertyValue('--demo-chrome-progress').trim()
		));

		await expect.poll(readProgress).toBe('0');
		await expect(shell).not.toHaveAttribute('data-workspace-scrolled');
		const size = await shell.evaluate((node) => (
			getComputedStyle(node).getPropertyValue('--demo-scrollbar-size').trim()
		));
		expect(size).toMatch(/^\d+px$/);

		await scroll.evaluate((node) => {
			node.scrollTop = 2;
		});
		await expect.poll(readProgress).not.toBe('0');
		await expect(shell).not.toHaveAttribute('data-workspace-scrolled');

		await scroll.evaluate((node) => {
			node.scrollTop = 80;
		});
		await expect(shell).toHaveAttribute('data-workspace-scrolled', '');
		const mid = Number(await readProgress());
		expect(mid).toBeGreaterThan(0);
		expect(mid).toBeLessThan(1);

		await scroll.evaluate((node) => {
			node.scrollTop = 120;
		});
		await expect.poll(readProgress).toBe('1');
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
