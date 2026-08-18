import type {Page} from '@playwright/test';

export const STORYBOOK_PORT = 6007;
export const STORYBOOK_BASE_URL = `http://127.0.0.1:${STORYBOOK_PORT}`;

export async function visitStory(page: Page, storyId: string): Promise<void> {
	const pageErrors: string[] = [];
	const onPageError = (error: Error) => {
		pageErrors.push(error.message);
	};
	page.on('pageerror', onPageError);

	try {
		await page.goto(`${STORYBOOK_BASE_URL}/iframe.html?id=${storyId}&viewMode=story`);
		await page.waitForSelector('#storybook-root', {state: 'attached'});
		await page.waitForLoadState('networkidle');
		await page.evaluate(() => document.fonts?.ready);
		await page.locator('#storybook-root img').evaluateAll(async (imgs) => {
			await Promise.all(imgs.map((node) => {
				const img = node as HTMLImageElement;
				if (img.complete) return undefined;
				return new Promise<void>((resolve) => {
					img.addEventListener('load', () => resolve(), {once: true});
					img.addEventListener('error', () => resolve(), {once: true});
				});
			}));
		});
		await page.waitForTimeout(150);

		const errorOverlay = page.locator('.sb-show-errordisplay, #error-message');
		if (await errorOverlay.first().isVisible().catch(() => false)) {
			const detail = (await errorOverlay.first().innerText().catch(() => '')).trim();
			throw new Error(`Storybook не смог отрисовать ${storyId}${detail ? `: ${detail}` : ''}`);
		}
		if (pageErrors.length > 0) {
			throw new Error(`pageerror в ${storyId}: ${pageErrors.join('; ')}`);
		}
	} finally {
		page.off('pageerror', onPageError);
	}
}

export async function getStoryRoot(page: Page) {
	return page.locator('#storybook-root');
}
