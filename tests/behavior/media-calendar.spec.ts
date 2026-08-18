import {test, expect} from '@playwright/test';
import {visitStory} from '../helpers/storybook';

test.describe('ImageGallery', () => {
	test('рендерит изображения галереи', async ({page}) => {
		await visitStory(page, 'altum-components-imagegallery--playground');
		await expect(page.getByRole('img').first()).toBeVisible();
	});
});

test.describe('ImageLightbox', () => {
	test('открывает диалог lightbox и закрывается по Escape', async ({page}) => {
		await visitStory(page, 'altum-components-imagelightbox--playground');
		await page.getByRole('button', {name: /Открыть lightbox/i}).click();
		await expect(page.getByRole('dialog')).toBeVisible();
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
		await expect(page.getByText(/Выбрано файлов:\s*1|Selected files:\s*1/i)).toBeVisible();
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
});

test.describe('Calendar', () => {
	test('переходит к следующему месяцу', async ({page}) => {
		await visitStory(page, 'altum-components-calendar--playground');
		await expect(page.getByRole('grid')).toBeVisible();
		await page.getByRole('button', {name: /следующ|next/i}).click();
		await expect(page.getByRole('grid')).toBeVisible();
	});
});

test.describe('DateRangePicker', () => {
	test('открывает календарь диапазона', async ({page}) => {
		await visitStory(page, 'altum-components-daterangepicker--playground');
		await page.getByRole('button').first().click();
		await expect(page.getByRole('grid')).toBeVisible();
	});
});

test.describe('DayStripCalendar', () => {
	test('переходит к следующему диапазону дней', async ({page}) => {
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

test.describe('TimePicker', () => {
	test('показывает списки часов и минут', async ({page}) => {
		await visitStory(page, 'altum-components-timepicker--playground');
		await expect(page.getByRole('listbox', {name: /Часы|Hours/i})).toBeVisible();
		await expect(page.getByRole('listbox', {name: /Минуты|Minutes/i})).toBeVisible();
	});
});
