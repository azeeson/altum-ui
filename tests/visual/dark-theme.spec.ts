import {test, expect} from '@playwright/test';
import {visitStory, getStoryRoot} from '../helpers/storybook';

const DARK_STORY_IDS = [
	'altum-utilities-themeprovider--with-dark-initial',
	'altum-components-box--surface-adaptation',
	'altum-components-button--all-variants',
	'altum-components-alert--variants',
	'altum-components-card--variants',
	'altum-components-formfield-textfield--playground',
	'altum-components-formfield-select--playground',
	'altum-components-table--playground',
	'altum-components-accordion--playground',
	'altum-components-segmentedcontrol--playground',
	'altum-components-pagination--playground',
	'altum-components-notification--playground',
];

const DARK_OVERLAY_STORY_IDS = ['altum-test-visualopenstates--modal-open', 'altum-test-visualopenstates--sheet-open'];

test.describe('Визуальная регрессия — тёмная тема', () => {
	for (const storyId of DARK_STORY_IDS) {
		test(`dark snapshot: ${storyId}`, async ({page}) => {
			await visitStory(page, storyId, {theme: 'dark'});
			const root = await getStoryRoot(page);
			await expect(root).toHaveScreenshot(`${storyId}.png`, {
				fullPage: true,
			});
		});
	}

	for (const storyId of DARK_OVERLAY_STORY_IDS) {
		test(`dark overlay: ${storyId}`, async ({page}) => {
			await visitStory(page, storyId, {theme: 'dark'});
			await page.evaluate(() => document.fonts?.ready);
			await page.waitForTimeout(250);
			await expect(page).toHaveScreenshot(`${storyId}.png`, {
				fullPage: true,
				animations: 'disabled',
			});
		});
	}

	test('dark overlay: Menu', async ({page}) => {
		await visitStory(page, 'altum-components-menu--playground', {theme: 'dark'});
		await page.getByRole('button', {name: 'Меню действий'}).click();
		await page.getByRole('option', {name: 'Переименовать'}).waitFor({state: 'visible'});
		await expect(page).toHaveScreenshot('dark-menu-open.png', {
			fullPage: true,
			animations: 'disabled',
		});
	});

	test('dark overlay: Select', async ({page}) => {
		await visitStory(page, 'altum-components-formfield-select--playground', {theme: 'dark'});
		await page.getByRole('button', {name: /Город/i}).click();
		await page.getByRole('listbox').waitFor({state: 'visible'});
		await expect(page).toHaveScreenshot('dark-select-open.png', {
			fullPage: true,
			animations: 'disabled',
		});
	});

	test('dark overlay: Command Palette', async ({page}) => {
		await visitStory(page, 'altum-components-commandpalette--playground', {theme: 'dark'});
		await page.getByRole('button', {name: /Открыть палитру/i}).click();
		await page.getByRole('dialog').waitFor({state: 'visible'});
		await expect(page).toHaveScreenshot('dark-commandpalette-open.png', {
			fullPage: true,
			animations: 'disabled',
		});
	});

	test('dark focus-visible на Button', async ({page}) => {
		await visitStory(page, 'altum-components-button--all-variants', {theme: 'dark'});
		await page.locator('button').first().focus();
		const root = await getStoryRoot(page);
		await expect(root).toHaveScreenshot('dark-button-focus-visible.png');
	});

	test('dark hover на Card', async ({page}) => {
		await visitStory(page, 'altum-components-card--hoverable-card', {theme: 'dark'});
		await page.getByText('Интерактивная панель').hover();
		const root = await getStoryRoot(page);
		await expect(root).toHaveScreenshot('dark-card-hover.png');
	});

	test('dark Switch on', async ({page}) => {
		await visitStory(page, 'altum-components-switch--sizes', {theme: 'dark'});
		const root = await getStoryRoot(page);
		await expect(root).toHaveScreenshot('dark-switch-on.png');
	});
});
