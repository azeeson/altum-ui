import {test, expect} from '@playwright/test';
import {visitStory, getStoryRoot} from '../helpers/storybook';

test.describe('Avatar', () => {
	test('рендерит инициалы из имени', async ({page}) => {
		await visitStory(page, 'altum-components-avatar--playground');
		await expect(await getStoryRoot(page)).toContainText(/АИ|Алексей/);
	});
});

test.describe('Badge', () => {
	test('показывает числовую метку на хосте', async ({page}) => {
		await visitStory(page, 'altum-components-badge--playground');
		await expect(page.getByRole('button', {name: /Входящие/})).toBeVisible();
		await expect(await getStoryRoot(page)).toContainText('9');
	});
});

test.describe('Box', () => {
	test('рендерит контент playground', async ({page}) => {
		await visitStory(page, 'altum-components-box--playground');
		await expect(await getStoryRoot(page)).toBeVisible();
		await expect(page.locator('#storybook-root *').first()).toBeVisible();
	});
});

test.describe('Container', () => {
	test('рендерит ограниченную оболочку страницы', async ({page}) => {
		await visitStory(page, 'altum-components-container--playground');
		await expect(await getStoryRoot(page)).toBeVisible();
	});
});

test.describe('Page', () => {
	test('рендерит заголовок страницы', async ({page}) => {
		await visitStory(page, 'altum-components-container--page-alias');
		await expect(page.getByRole('heading', {name: 'Заказы'})).toBeVisible();
	});
});

test.describe('Grid', () => {
	test('рендерит сетку элементов', async ({page}) => {
		await visitStory(page, 'altum-components-grid--playground');
		await expect(await getStoryRoot(page)).toBeVisible();
	});
});

test.describe('Layout', () => {
	test('составной layout отдаёт header и content', async ({page}) => {
		await visitStory(page, 'altum-components-layout--playground');
		await expect(await getStoryRoot(page)).toBeVisible();
	});

	test('Stack рендерит потомков', async ({page}) => {
		await visitStory(page, 'altum-components-stack--playground');
		await expect(await getStoryRoot(page)).toBeVisible();
	});

	test('Inline рендерит теги и бейджи', async ({page}) => {
		await visitStory(page, 'altum-components-inline--tags-and-badges');
		await expect(await getStoryRoot(page)).toBeVisible();
	});

	test('Split рендерит две панели', async ({page}) => {
		await visitStory(page, 'altum-components-split--playground');
		await expect(await getStoryRoot(page)).toBeVisible();
	});

	test('ControlRow рендерит ряд контролов', async ({page}) => {
		await visitStory(page, 'altum-components-controlrow--playground');
		await expect(await getStoryRoot(page)).toBeVisible();
	});

	test('LayoutItem рендерится', async ({page}) => {
		await visitStory(page, 'altum-components-layoutitem--playground');
		await expect(await getStoryRoot(page)).toBeVisible();
	});
});

test.describe('Skeleton', () => {
	test('рендерит плейсхолдер загрузки', async ({page}) => {
		await visitStory(page, 'altum-components-skeleton--playground');
		await expect(page.locator('#storybook-root [class*="Skeleton"]').first()).toBeVisible();
	});
});

test.describe('Spinner', () => {
	test('отдаёт вежливый status', async ({page}) => {
		await visitStory(page, 'altum-components-spinner--playground');
		await expect(page.getByRole('status').first()).toBeVisible();
	});
});

test.describe('FormMessage', () => {
	test('рендерит подсказку под полем', async ({page}) => {
		await visitStory(page, 'altum-components-formmessage--playground');
		await expect(page.getByText('Мы не передаём email третьим лицам')).toBeVisible();
	});
});

test.describe('EmptyState', () => {
	test('показывает заголовок и действие', async ({page}) => {
		await visitStory(page, 'altum-components-emptystate--playground');
		await expect(page.getByText('Пока нет задач')).toBeVisible();
		await expect(page.getByRole('button', {name: 'Добавить задачу'})).toBeVisible();
	});
});

test.describe('Text', () => {
	test('рендерит текст', async ({page}) => {
		await visitStory(page, 'altum-components-text--playground');
		await expect(page.getByText('Пример текста компонента')).toBeVisible();
	});
});

test.describe('Title', () => {
	test('рендерит h1', async ({page}) => {
		await visitStory(page, 'altum-components-title--playground');
		await expect(page.getByRole('heading', {
			level: 1,
			name: 'Главный заголовок страницы (H1)',
		})).toBeVisible();
	});
});

test.describe('Separator', () => {
	test('отдаёт разделитель', async ({page}) => {
		await visitStory(page, 'altum-components-separator--playground');
		await expect(page.getByRole('separator').first()).toBeVisible();
	});

	test('рендерит подписанный разделитель', async ({page}) => {
		await visitStory(page, 'altum-components-separator--with-label');
		await expect(page.getByText('или')).toBeVisible();
	});
});

test.describe('VisuallyHidden', () => {
	test('оставляет текст в дереве доступности', async ({page}) => {
		await visitStory(page, 'altum-utilities-visuallyhidden--playground');
		await expect(page.getByText('Закрыть диалог')).toBeAttached();
	});
});

test.describe('LiveRegion', () => {
	test('озвучивает сообщение и обновляет его', async ({page}) => {
		await visitStory(page, 'altum-utilities-liveregion--playground');
		const status = page.getByRole('status');
		await expect(status).toBeAttached();
		await expect(status).toHaveText('Файл сохранён');
		await page.getByRole('button', {name: 'Сохранить'}).click();
		await expect(status).toHaveText('Изменения сохранены');
	});
});

test.describe('RelativeTime', () => {
	test('рендерит элементы time', async ({page}) => {
		await visitStory(page, 'altum-components-relativetime--playground');
		await expect(page.locator('time').first()).toBeVisible();
	});
});

test.describe('Kbd', () => {
	test('рендерит глифы клавиатуры', async ({page}) => {
		await visitStory(page, 'altum-components-kbd--playground');
		await expect(page.getByText('Ctrl')).toBeVisible();
		await expect(page.locator('kbd').first()).toBeVisible();
	});
});

test.describe('Marker', () => {
	test('рендерит текст маркера', async ({page}) => {
		await visitStory(page, 'altum-components-marker--playground');
		await expect(page.getByText('Просмотрено 4 файла')).toBeVisible();
	});
});

test.describe('Media', () => {
	test('рендерит изображение', async ({page}) => {
		await visitStory(page, 'altum-components-media--playground');
		await expect(page.locator('#storybook-root img').first()).toBeVisible();
	});
});

test.describe('AspectRatio', () => {
	test('рендерит метку соотношения', async ({page}) => {
		await visitStory(page, 'altum-components-aspectratio--square');
		await expect(page.getByText('1:1')).toBeVisible();
	});
});

test.describe('Attachment', () => {
	test('показывает метаданные файла', async ({page}) => {
		await visitStory(page, 'altum-components-attachment--playground');
		await expect(page.getByText('report.pdf')).toBeVisible();
	});
});

test.describe('DescriptionList', () => {
	test('рендерит термин и значение', async ({page}) => {
		await visitStory(page, 'altum-components-descriptionlist--playground');
		await expect(page.getByText('Эл. почта')).toBeVisible();
		await expect(page.getByText('alex@example.com')).toBeVisible();
	});
});

test.describe('StatBadge', () => {
	test('рендерит метку и значение', async ({page}) => {
		await visitStory(page, 'altum-components-statbadge--playground');
		await expect(page.getByText('Готово')).toBeVisible();
		await expect(page.getByText('12')).toBeVisible();
	});
});

test.describe('SafeArea', () => {
	test('рендерит демо безопасной зоны', async ({page}) => {
		await visitStory(page, 'altum-mobile-safearea--playground');
		await expect(await getStoryRoot(page)).toBeVisible();
	});
});
