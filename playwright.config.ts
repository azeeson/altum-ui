import {defineConfig, devices} from '@playwright/test';

const STORYBOOK_PORT = 6007;

export default defineConfig({
	testDir: './tests',
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 2 : undefined,
	reporter: [['list'], ['html', {open: 'never'}]],
	timeout: 60_000,
	expect: {
		timeout: 10_000,
		toHaveScreenshot: {
			animations: 'disabled',
			caret: 'hide',
			maxDiffPixelRatio: 0.02,
		},
	},
	use: {
		baseURL: `http://127.0.0.1:${STORYBOOK_PORT}`,
		trace: 'on-first-retry',
		screenshot: 'only-on-failure',
		viewport: {
			width: 900,
			height: 700
		},
		colorScheme: 'light',
	},
	projects: [
		{
			name: 'chromium',
			use: {...devices['Desktop Chrome']},
		},
	],
	webServer: {
		command: `npx http-server dist-storybook -p ${STORYBOOK_PORT} -c-1 --silent`,
		url: `http://127.0.0.1:${STORYBOOK_PORT}`,
		reuseExistingServer: !process.env.CI,
		timeout: 120_000,
	},
});
