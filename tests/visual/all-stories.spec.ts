import {test, expect} from '@playwright/test';
import {getVisualStoryIds} from '../helpers/load-stories';
import {visitStory, getStoryRoot} from '../helpers/storybook';

const storyIds = getVisualStoryIds();

test.describe('Визуальная регрессия — стори Storybook', () => {
	for (const storyId of storyIds) {
		test(`snapshot: ${storyId}`, async ({page}) => {
			await visitStory(page, storyId);
			const root = await getStoryRoot(page);
			await expect(root).toHaveScreenshot(`${storyId}.png`, {
				fullPage: true,
			});
		});
	}
});
