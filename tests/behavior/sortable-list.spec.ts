import {test, expect} from '@playwright/test';
import {visitStory} from '../helpers/storybook';

test.describe('SortableList', () => {
	test('меняет порядок элементов через drag and drop', async ({page}) => {
		await visitStory(page, 'altum-ui-components-sortablelist--grab-anywhere');

		const items = page.getByRole('listitem');
		await expect(items).toHaveCount(5);

		const firstText = await items.nth(0).innerText();
		const secondText = await items.nth(1).innerText();

		const firstBox = await items.nth(0).boundingBox();
		const secondBox = await items.nth(1).boundingBox();

		expect(firstBox).not.toBeNull();
		expect(secondBox).not.toBeNull();

		if (!firstBox || !secondBox) return;

		const startX = firstBox.x + firstBox.width / 2;
		const startY = firstBox.y + firstBox.height / 2;
		const endY = secondBox.y + secondBox.height + 12;

		await page.mouse.move(startX, startY);
		await page.mouse.down();
		await page.mouse.move(startX, endY, {steps: 12});
		await page.mouse.up();

		await page.waitForTimeout(500);

		const textsAfter = await items.allInnerTexts();
		expect(textsAfter[0]).toContain(secondText.trim());
		expect(textsAfter[1]).toContain(firstText.trim());
	});
});
