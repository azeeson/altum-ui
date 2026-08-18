import {test, expect} from '@playwright/test';
import {visitStory} from '../helpers/storybook';

test.describe('Modal', () => {
	test('открывает диалог и блокирует взаимодействие с фоном', async ({page}) => {
		await visitStory(page, 'altum-test-interaction--modal-blocks-background');

		await page.getByTestId('open-modal').click();
		const dialog = page.getByRole('dialog');
		await expect(dialog).toBeVisible();
		await expect(dialog).toContainText('Тестовая модалка');

		const bgButton = page.getByTestId('bg-button');
		const box = await bgButton.boundingBox();
		expect(box).not.toBeNull();
		if (box) {
			await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
		}
		await expect(page.getByTestId('bg-clicks')).toHaveText('0');
	});

	test('закрывается кнопкой футера в playground-стори', async ({page}) => {
		await visitStory(page, 'altum-components-modal--playground');

		await page.getByRole('button', {name: /Показать диалог/i}).click();
		const dialog = page.getByRole('dialog');
		await expect(dialog).toBeVisible();

		await page.getByRole('contentinfo').getByRole('button', {name: /Закрыть/i}).click();
		await expect(dialog).toBeHidden();
	});

	test('закрывается по Escape', async ({page}) => {
		await visitStory(page, 'altum-components-modal--playground');

		await page.getByRole('button', {name: /Показать диалог/i}).click();
		await expect(page.getByRole('dialog')).toBeVisible();

		await page.keyboard.press('Escape');
		await expect(page.getByRole('dialog')).toBeHidden();
	});

	/** После закрытия страница должна получать клики (без призрачного scrim). */
	test('отдаёт клики после закрытия по Escape', async ({page}) => {
		await visitStory(page, 'altum-test-interaction--modal-blocks-background');

		await page.getByTestId('open-modal').click();
		await expect(page.getByRole('dialog')).toBeVisible();
		await page.keyboard.press('Escape');
		await expect(page.getByRole('dialog')).toBeHidden({timeout: 3000});

		const bgButton = page.getByTestId('bg-button');
		await bgButton.click();
		await expect(page.getByTestId('bg-clicks')).toHaveText('1');
	});
});

test.describe('Backdrop', () => {
	test('блокирует клики по контенту ниже в стори variants', async ({page}) => {
		await visitStory(page, 'altum-components-backdrop--variants');

		const containers = page.locator('div').filter({hasText: 'Контент под слоем'});
		await expect(containers.first()).toBeVisible();

		const box = await containers.first().boundingBox();
		if (!box) return;

		await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
		await expect(containers.first()).toBeVisible();
	});
});

test.describe('Sheet', () => {
	test('открывается из playground', async ({page}) => {
		await visitStory(page, 'altum-components-sheet--playground');

		await page.getByRole('button').first().click();
		await expect(page.getByRole('dialog')).toBeVisible();
	});
});

test.describe('Tooltip', () => {
	test('показывается при наведении', async ({page}) => {
		await visitStory(page, 'altum-components-tooltip--playground');

		const trigger = page.getByRole('button', {name: 'Наведи на меня'});
		await trigger.hover();
		await expect(page.getByText('Полезная подсказка сверху')).toBeVisible({timeout: 5000});
	});

	/** Быстрое наведение по стеку не должно оставлять несколько нарисованных подсказок. */
	test('оставляет не больше одной подсказки в стеке иконок', async ({page}) => {
		await visitStory(page, 'altum-components-tooltip--icon-stack-mutex');

		const home = page.getByRole('button', {name: 'Главная'});
		const search = page.getByRole('button', {name: 'Поиск'});
		const settings = page.getByRole('button', {name: 'Настройки'});

		await home.hover();
		await expect(page.getByRole('tooltip')).toHaveCount(1, {timeout: 3000});

		await search.hover();
		await page.waitForTimeout(80);
		await expect(page.getByRole('tooltip')).toHaveCount(1);

		await settings.hover();
		await page.waitForTimeout(80);
		await expect(page.getByRole('tooltip')).toHaveCount(1);
		await expect(page.getByRole('tooltip')).toContainText('Настройки');
	});
});
