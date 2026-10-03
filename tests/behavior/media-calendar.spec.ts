import {test, expect} from '@playwright/test';
import {visitStory} from '../helpers/storybook';

test.describe('Media', () => {
	test('показывает локальное демо-изображение', async ({page}) => {
		await visitStory(page, 'altum-components-media--playground');
		await expect(page.locator('#storybook-root img').first()).toHaveAttribute('src', /\/images\/img00001\.jpeg/);
	});
});

test.describe('ImageGallery', () => {
	test('рендерит изображения галереи', async ({page}) => {
		await visitStory(page, 'altum-components-imagegallery--playground');
		const image = page.locator('#storybook-root img').first();
		await expect(image).toBeVisible();
		await expect(image).toHaveAttribute('src', /\/images\/img00001\.jpeg/);
	});

	test('одно изображение без стрелок', async ({page}) => {
		await visitStory(page, 'altum-components-imagegallery--single-image');
		await expect(page.locator('#storybook-root img').first()).toBeVisible();
		await expect(page.getByRole('button', {name: 'Предыдущее изображение'})).toHaveCount(0);
		await expect(page.getByRole('button', {name: 'Следующее изображение'})).toHaveCount(0);
	});
});

test.describe('ImageLightbox', () => {
	test('открывает диалог lightbox и закрывается по Escape', async ({page}) => {
		await visitStory(page, 'altum-components-imagelightbox--playground');
		await page.getByRole('button', {name: /Открыть lightbox/i}).click();
		await expect(page.getByRole('dialog')).toBeVisible();
		await expect(page.getByRole('dialog').locator('img').first()).toHaveAttribute('src', /\/images\/img00001\.jpeg/);
		await page.keyboard.press('Escape');
		await expect(page.getByRole('dialog')).toBeHidden({timeout: 3000});
	});
});

test.describe('ImageCrop', () => {
	test('открывает диалог кадрирования после выбора изображения', async ({page}) => {
		await visitStory(page, 'altum-components-imagecrop--with-upload-zone');
		await page.locator('input[type="file"]').setInputFiles({
			name: 'photo.png',
			mimeType: 'image/png',
			buffer: Buffer.from(
				'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
				'base64',
			),
		});
		await expect(page.getByRole('dialog')).toBeVisible({timeout: 5000});
	});
});

test.describe('UploadZone', () => {
	test('показывает число выбранных файлов после выбора файла', async ({page}) => {
		await visitStory(page, 'altum-components-uploadzone--playground');
		await page.locator('input[type="file"]').setInputFiles({
			name: 'note.txt',
			mimeType: 'text/plain',
			buffer: Buffer.from('hello'),
		});
		await expect(page.getByText(/Выбран 1 файл|1 file selected/i)).toBeVisible();
	});
});

test.describe('FileList', () => {
	test('показывает список файлов', async ({page}) => {
		await visitStory(page, 'altum-components-filelist--playground');
		await expect(page.getByText('contract.pdf')).toBeVisible();
	});
});

test.describe('Rating', () => {
	test('меняет выбранное значение', async ({page}) => {
		await visitStory(page, 'altum-components-rating--playground');
		await expect(page.getByText(/Выбрано:\s*3/)).toBeVisible();
		await page.getByRole('radio').nth(4).click();
		await expect(page.getByText(/Выбрано:\s*5/)).toBeVisible();
	});
});

test.describe('ColorSwatchGroup', () => {
	test('выбирает образец в radiogroup', async ({page}) => {
		await visitStory(page, 'altum-components-colorswatchgroup--playground');
		const group = page.getByRole('radiogroup');
		await expect(group).toBeVisible();
		const radios = group.getByRole('radio');
		await radios.nth(1).click();
		await expect(radios.nth(1)).toBeChecked();
	});

	test('образцы залиты цветом палитры', async ({page}) => {
		await visitStory(page, 'altum-components-colorswatchgroup--playground');
		const first = page.getByRole('radio').first();
		const backgroundColor = await first.evaluate((el) => getComputedStyle(el).backgroundColor);
		expect(backgroundColor).toBe('rgb(239, 68, 68)');
	});
});

test.describe('Calendar', () => {
	test('переходит к следующему месяцу', async ({page}) => {
		await visitStory(page, 'altum-components-calendar--playground');
		await expect(page.getByRole('grid')).toBeVisible();
		await page.getByRole('button', {name: /следующ|next/i}).click();
		await expect(page.getByRole('grid')).toBeVisible();
	});
});

test.describe('DateRangeField', () => {
	test('пустой лейбл не приподнят', async ({page}) => {
		await visitStory(page, 'altum-components-formfield-daterangefield--playground');
		const label = page.locator('label').filter({hasText: 'Период отчёта'});
		await expect(label).toBeVisible();
		const scaleX = await label.evaluate((el) => {
			const transform = getComputedStyle(el).transform;
			if (!transform || transform === 'none') return 1;
			return new DOMMatrixReadOnly(transform).a;
		});
		expect(scaleX).toBeCloseTo(1, 2);
	});

	test('открывает календарь диапазона', async ({page}) => {
		await visitStory(page, 'altum-components-formfield-daterangefield--playground');
		await page.getByLabel('Период отчёта').click();
		await expect(page.getByRole('grid')).toBeVisible();
	});

	test('split: календарь закрывается после ухода со второго поля', async ({page}) => {
		await visitStory(page, 'altum-components-formfield-daterangefield--variants');
		const start = page.getByLabel('С', {exact: true});
		const end = page.getByLabel('По', {exact: true});
		await start.click();
		await expect(page.getByRole('grid')).toBeVisible();
		await end.click();
		await expect(page.getByRole('grid')).toBeVisible();
		await page.getByText('layout="single"').click();
		await expect(page.getByRole('grid')).toBeHidden();
	});
});

test.describe('DayStripCalendar', () => {
	test('шапка листает окно и не меняет выбранный день', async ({page}) => {
		await visitStory(page, 'altum-components-daystripcalendar--playground');
		const selected = page.getByText(/Выбрано:/);
		const before = (await selected.innerText()).trim();
		const listbox = page.getByRole('listbox', {name: /Дни|Days/i});
		const firstBefore = (await listbox.getByRole('option').first().innerText()).trim();
		await page.getByRole('button', {name: /Следующий день|Next day/i}).click();
		await expect(selected).toHaveText(before);
		await expect(listbox.getByRole('option').first()).not.toHaveText(firstBefore);
	});

	test('сдвигает полосу, когда выбранный день выходит за край', async ({page}) => {
		await visitStory(page, 'altum-components-daystripcalendar--playground');
		const listbox = page.getByRole('listbox', {name: /Дни|Days/i});
		await listbox.getByRole('option').last().click();
		const firstBefore = (await listbox.getByRole('option').first().innerText()).trim();
		await page.getByRole('button', {name: /Следующий день|Next day/i}).click();
		await expect(listbox.getByRole('option').first()).not.toHaveText(firstBefore);
	});

	test('выбирает другой день в полосе', async ({page}) => {
		await visitStory(page, 'altum-components-daystripcalendar--playground');
		const selected = page.getByText(/Выбрано:/);
		await expect(selected).toBeVisible();
		const before = (await selected.innerText()).trim();
		await page.getByRole('option', {selected: false}).first().click();
		await expect(selected).not.toHaveText(before);
	});
});

test.describe('CalendarBoard', () => {
	test('переключается с месячного вида на недельный', async ({page}) => {
		await visitStory(page, 'altum-components-calendarboard--playground');
		await expect(page.getByText('Отпуск').first()).toBeVisible();
		await page.getByRole('radio', {name: 'Неделя'}).click();
		await expect(page.getByRole('radio', {name: 'Неделя'})).toHaveAttribute('aria-checked', 'true');
	});
});

test.describe('TimeField', () => {
	test('показывает списки часов и минут', async ({page}) => {
		await visitStory(page, 'altum-components-formfield-timefield--playground');
		await page.getByRole('textbox').click();
		await expect(page.getByRole('listbox', {name: /Часы|Hours/i})).toBeVisible();
		await expect(page.getByRole('listbox', {name: /Минуты|Minutes/i})).toBeVisible();
	});
});
