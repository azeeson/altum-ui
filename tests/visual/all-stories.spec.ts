import type {Locator, Page} from '@playwright/test';
import {test, expect} from '@playwright/test';
import {getVisualStoryIds} from '../helpers/load-stories';
import {visitStory, getStoryRoot} from '../helpers/storybook';

const storyIds = getVisualStoryIds();

/** Видимый `<dialog>` или popover. Пустой контейнер тостов тоже `:popover-open`, но не виден. */
async function visibleLayer(page: Page): Promise<Locator | null> {
	const candidates = [page.locator('dialog[open]'), page.locator(':popover-open')];
	for (const group of candidates) {
		const count = await group.count();
		for (let index = 0; index < count; index += 1) {
			const item = group.nth(index);
			if (await item.isVisible()) return item;
		}
	}
	return null;
}

test.describe('Визуальная регрессия — стори Storybook', () => {
	for (const storyId of storyIds) {
		test(`snapshot: ${storyId}`, async ({page}) => {
			await visitStory(page, storyId);
			const root = await visibleLayer(page) ?? await getStoryRoot(page);
			await expect(root).toHaveScreenshot(`${storyId}.png`, {
				fullPage: true,
			});
		});
	}
});
