import {test, expect} from '@playwright/test';
import {visitStory} from '../helpers/storybook';
import {
	INTERACTIVE_OPEN_STATE_SCENARIOS,
	STATIC_OPEN_STATE_SCENARIOS,
} from '../helpers/open-states';

async function snapshotOpenOverlay(page: import('@playwright/test').Page, snapshot: string) {
	await page.evaluate(() => document.fonts?.ready);
	await page.waitForTimeout(250);
	await expect(page).toHaveScreenshot(snapshot, {
		fullPage: true,
		animations: 'disabled',
	});
}

test.describe('Визуальная регрессия — открытые / активные состояния', () => {
	for (const scenario of STATIC_OPEN_STATE_SCENARIOS) {
		test(`статическое открытие: ${scenario.storyId}`, async ({page}) => {
			await visitStory(page, scenario.storyId);
			if (scenario.prepare) {
				await scenario.prepare(page);
			}
			await snapshotOpenOverlay(page, scenario.snapshot);
		});
	}

	for (const scenario of INTERACTIVE_OPEN_STATE_SCENARIOS) {
		test(`интерактивное открытие: ${scenario.snapshot}`, async ({page}) => {
			await visitStory(page, scenario.storyId);
			await scenario.prepare?.(page);
			await snapshotOpenOverlay(page, scenario.snapshot);
		});
	}
});
