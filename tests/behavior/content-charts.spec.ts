import {test, expect} from '@playwright/test';
import {visitStory} from '../helpers/storybook';

test.describe('SwipeToAction', () => {
	test('рендерит контент свайп-строки', async ({page}) => {
		await visitStory(page, 'altum-mobile-swipetoaction--with-item');
		await expect(page.getByText('Уведомление')).toBeVisible();
	});
});

test.describe('PullToRefresh', () => {
	test('показывает список и счётчик обновлений', async ({page}) => {
		await visitStory(page, 'altum-mobile-pulltorefresh--playground');
		await expect(page.getByText(/Обновлений:\s*0/)).toBeVisible();
		await expect(page.getByText('Элемент 1', {exact: true})).toBeVisible();
	});
});

test.describe('Timeline', () => {
	test('переключает сворачиваемые детали', async ({page}) => {
		await visitStory(page, 'altum-components-timeline--collapsible-details');
		const toggle = page.locator('summary').first();
		await expect(toggle).toBeVisible();
		await toggle.click();
	});
});

test.describe('ScrollArea', () => {
	test('рендерит прокручиваемую область', async ({page}) => {
		await visitStory(page, 'altum-components-scrollarea--playground');
		await expect(page.locator('#storybook-root')).toBeVisible();
	});
});

test.describe('Item', () => {
	test('рендерит заголовок и действие', async ({page}) => {
		await visitStory(page, 'altum-components-item--playground');
		await expect(page.getByText('Настройки')).toBeVisible();
		await page.getByRole('button', {name: 'Открыть'}).click();
	});
});

test.describe('Card', () => {
	test('рендерит контент карточки с hover', async ({page}) => {
		await visitStory(page, 'altum-components-card--hoverable-card');
		await expect(page.getByText('Интерактивная панель')).toBeVisible();
	});
});

test.describe('Bubble', () => {
	test('переключает реакцию', async ({page}) => {
		await visitStory(page, 'altum-components-bubble--with-reactions');
		const reaction = page.getByRole('button').filter({hasText: '👍'}).first();
		await expect(reaction).toBeVisible();
		await reaction.click();
	});
});

test.describe('Alert', () => {
	test('закрывается и может быть показан снова', async ({page}) => {
		await visitStory(page, 'altum-components-alert--dismissible');
		await expect(page.getByText('Можно закрыть')).toBeVisible();
		await page.getByRole('button', {name: /Закрыть|Close/i}).click();
		await expect(page.getByRole('button', {name: 'Показать снова'})).toBeVisible();
	});
});

test.describe('FocusTrap', () => {
	test('активирует ловушку из playground', async ({page}) => {
		await visitStory(page, 'altum-utilities-focustrap--playground');
		await page.getByRole('button', {name: /Включить FocusTrap/i}).click();
		await expect(page.getByRole('button', {name: /Выключить FocusTrap/i})).toBeVisible();
	});
});

test.describe('BarChart', () => {
	test('рендерит график', async ({page}) => {
		await visitStory(page, 'altum-components-barchart--playground');
		await expect(page.locator('svg').first()).toBeVisible();
	});
});

test.describe('LineChart', () => {
	test('рендерит график', async ({page}) => {
		await visitStory(page, 'altum-components-linechart--playground');
		await expect(page.locator('svg').first()).toBeVisible();
	});
});

test.describe('DonutChart', () => {
	test('рендерит график', async ({page}) => {
		await visitStory(page, 'altum-components-donutchart--playground');
		await expect(page.locator('svg').first()).toBeVisible();
	});
});
