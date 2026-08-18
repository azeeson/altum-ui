import {test, expect, type Locator, type Page} from '@playwright/test';
import {visitStory} from '../helpers/storybook';
import {getFormattedValue} from '../../src/components/MaskedField/MaskedField.utils';

const PHONE_MASK = '+7 (999) 999-99-99';
const DATE_MASK = '99.99.9999';
const TIME_MASK = '99:99';

async function typeDigits(input: Locator, digits: string): Promise<void> {
	await input.focus();
	for (const digit of digits) {
		await input.press(digit);
	}
}

async function setCaret(input: Locator, pos: number): Promise<void> {
	await input.evaluate((el, position) => {
		const node = el as HTMLInputElement;
		node.focus();
		node.setSelectionRange(position, position);
	}, pos);
}

async function getCaret(input: Locator): Promise<number | null> {
	return input.evaluate((el) => (el as HTMLInputElement).selectionStart);
}

async function expectDigits(page: Page, value: string, testId = 'masked-digits'): Promise<void> {
	await expect(page.getByTestId(testId)).toHaveText(value);
}

async function expectFormatted(input: Locator, value: string): Promise<void> {
	await expect(input).toHaveValue(value);
}

async function pasteIntoInput(input: Locator, text: string): Promise<void> {
	await input.focus();
	await input.evaluate((el, value) => {
		const node = el as HTMLInputElement;
		const proto = window.HTMLInputElement.prototype;
		const descriptor = Object.getOwnPropertyDescriptor(proto, 'value');
		descriptor?.set?.call(node, value);
		node.dispatchEvent(new Event('input', {bubbles: true}));
	}, text);
}

test.describe('MaskedField — отображение и оверлей маски', () => {
	test('пустое поле не показывает литералы маски как значение', async ({page}) => {
		await visitStory(page, 'altum-test-maskedfield--phone-controlled');

		const input = page.getByTestId('masked-input');
		await expectFormatted(input, '');
		await expectDigits(page, '');
	});

	test('фокус показывает aria-hidden направляющие оверлея маски', async ({page}) => {
		await visitStory(page, 'altum-test-maskedfield--phone-controlled');

		const input = page.getByTestId('masked-input');
		await input.focus();

		const overlay = page.getByTestId('masked-overlay');
		await expect(overlay).toBeVisible();
		await expect(overlay).toHaveAttribute('aria-hidden', 'true');
		await expect(overlay).toContainText('_');
	});

	test('input и оверлей маски используют один UI font-family', async ({page}) => {
		await visitStory(page, 'altum-test-maskedfield--phone-controlled');

		const input = page.getByTestId('masked-input');
		await input.focus();
		await typeDigits(input, '9');

		const fonts = await page.evaluate(() => {
			const field = document.querySelector('[data-testid="masked-input"]') as HTMLInputElement | null;
			const overlay = document.querySelector('[data-testid="masked-overlay"]') as HTMLElement | null;
			if (!field || !overlay) return null;
			const mono = getComputedStyle(document.documentElement)
				.getPropertyValue('--altum-g-font-family-mono')
				.trim();
			return {
				input: getComputedStyle(field).fontFamily,
				overlay: getComputedStyle(overlay).fontFamily,
				mono,
			};
		});

		expect(fonts).not.toBeNull();
		expect(fonts!.input).toBe(fonts!.overlay);
		expect(fonts!.input.toLowerCase()).not.toMatch(/mono|menlo|consolas|courier|monaco/);
		if (fonts!.mono) {
			expect(fonts!.input.replace(/\s+/g, ' ')).not.toBe(fonts!.mono.replace(/\s+/g, ' '));
		}
	});

	test('content box оверлея маски совпадает с началом текста input', async ({page}) => {
		await visitStory(page, 'altum-test-maskedfield--phone-controlled');

		const input = page.getByTestId('masked-input');
		await input.focus();
		await typeDigits(input, '3');

		const delta = await page.evaluate(() => {
			const field = document.querySelector('[data-testid="masked-input"]') as HTMLInputElement | null;
			const overlay = document.querySelector('[data-testid="masked-overlay"]') as HTMLElement | null;
			if (!field || !overlay) return null;
			const fieldStyle = getComputedStyle(field);
			const overlayStyle = getComputedStyle(overlay);
			const fieldRect = field.getBoundingClientRect();
			const overlayRect = overlay.getBoundingClientRect();
			const fieldContentLeft = fieldRect.left
				+ Number.parseFloat(fieldStyle.borderLeftWidth)
				+ Number.parseFloat(fieldStyle.paddingLeft);
			const overlayContentLeft = overlayRect.left
				+ Number.parseFloat(overlayStyle.borderLeftWidth)
				+ Number.parseFloat(overlayStyle.paddingLeft);
			return {
				dx: Math.abs(fieldContentLeft - overlayContentLeft),
				fieldFontSize: fieldStyle.fontSize,
				overlayFontSize: overlayStyle.fontSize,
				fieldLineHeight: fieldStyle.lineHeight,
				overlayLineHeight: overlayStyle.lineHeight,
			};
		});

		expect(delta).not.toBeNull();
		expect(delta!.dx).toBeLessThan(0.5);
		expect(delta!.fieldFontSize).toBe(delta!.overlayFontSize);
		expect(delta!.fieldLineHeight).toBe(delta!.overlayLineHeight);
	});

	test('maskAsPlaceholder задаёт placeholder из маски', async ({page}) => {
		await visitStory(page, 'altum-test-maskedfield--mask-as-placeholder');

		const input = page.getByTestId('masked-input');
		await expect(input).toHaveAttribute('placeholder', '__.__.____');
	});

	test('форматированное значение соответствует маске после ввода', async ({page}) => {
		await visitStory(page, 'altum-test-maskedfield--phone-controlled');

		const input = page.getByTestId('masked-input');
		await typeDigits(input, '912');
		await expectDigits(page, '912');
		await expectFormatted(input, getFormattedValue('912', PHONE_MASK));
	});
});

test.describe('MaskedField — ввод по маске', () => {
	test('вводит полный номер телефона по маске', async ({page}) => {
		await visitStory(page, 'altum-test-maskedfield--phone-controlled');

		const input = page.getByTestId('masked-input');
		await typeDigits(input, '9123456789');

		await expectDigits(page, '9123456789');
		await expectFormatted(input, '+7 (912) 345-67-89');
	});

	test('вводит дату по маске', async ({page}) => {
		await visitStory(page, 'altum-test-maskedfield--date-controlled');

		const input = page.getByTestId('masked-input');
		await typeDigits(input, '15072024');

		await expectDigits(page, '15072024');
		await expectFormatted(input, getFormattedValue('15072024', DATE_MASK));
	});

	test('вводит время по маске', async ({page}) => {
		await visitStory(page, 'altum-test-maskedfield--time-controlled');

		const input = page.getByTestId('masked-input');
		await typeDigits(input, '0930');

		await expectDigits(page, '0930');
		await expectFormatted(input, getFormattedValue('0930', TIME_MASK));
	});

	test('игнорирует цифры сверх ёмкости маски', async ({page}) => {
		await visitStory(page, 'altum-test-maskedfield--phone-controlled');

		const input = page.getByTestId('masked-input');
		await typeDigits(input, '91234567890123');

		await expectDigits(page, '9123456789');
		await expectFormatted(input, '+7 (912) 345-67-89');
	});

	test('игнорирует буквы и разделители во вводе', async ({page}) => {
		await visitStory(page, 'altum-test-maskedfield--phone-controlled');

		const input = page.getByTestId('masked-input');
		await input.focus();
		await input.press('a');
		await input.press('-');
		await input.press(' ');
		await typeDigits(input, '91');

		await expectDigits(page, '91');
		await expectFormatted(input, getFormattedValue('91', PHONE_MASK));
	});
});

test.describe('MaskedField — удаление и продолжение ввода', () => {
	test('стирает через литералы Backspace и продолжает ввод', async ({page}) => {
		await visitStory(page, 'altum-test-maskedfield--phone-controlled');

		const input = page.getByTestId('masked-input');
		await typeDigits(input, '9123');
		await expectDigits(page, '9123');
		await expectFormatted(input, '+7 (912) 3');

		// Каретка в конце; Backspace удаляет последнюю цифру, затем «)» / пробел при необходимости
		await input.press('Backspace');
		await expectDigits(page, '912');
		await expectFormatted(input, '+7 (912) ');

		await input.press('Backspace');
		await expectDigits(page, '91');
		await expectFormatted(input, '+7 (91');

		await typeDigits(input, '05');
		await expectDigits(page, '9105');
		await expectFormatted(input, getFormattedValue('9105', PHONE_MASK));
	});

	test('несколько Backspace из заполненного значения сокращают цифры', async ({page}) => {
		await visitStory(page, 'altum-test-maskedfield--phone-controlled');

		const input = page.getByTestId('masked-input');
		await page.getByTestId('fill-full').click();
		await expectDigits(page, '9123456789');

		await input.focus();
		await setCaret(input, '+7 (912) 345-67-89'.length);

		for (let i = 0; i < 4; i++) {
			await input.press('Backspace');
		}

		await expectDigits(page, '912345');
		await expectFormatted(input, getFormattedValue('912345', PHONE_MASK));
	});
});

test.describe('MaskedField — правка в середине строки', () => {
	test('Backspace удаляет цифру в середине и сохраняет каретку', async ({page}) => {
		await visitStory(page, 'altum-test-maskedfield--phone-controlled');

		const input = page.getByTestId('masked-input');
		await page.getByTestId('fill-full').click();
		await expectFormatted(input, '+7 (912) 345-67-89');

		// Отображение: +7 (912) … — цифра «1» на индексе 5; каретка после неё (6) + Backspace
		await input.focus();
		await setCaret(input, 6);
		await input.press('Backspace');

		await expectDigits(page, '923456789');
		await expectFormatted(input, getFormattedValue('923456789', PHONE_MASK));

		const caret = await getCaret(input);
		expect(caret).toBe(getFormattedValue('9', PHONE_MASK).length);
	});

	test('вводит цифру в середине значения', async ({page}) => {
		await visitStory(page, 'altum-test-maskedfield--phone-controlled');

		const input = page.getByTestId('masked-input');
		await page.getByTestId('fill-partial').click();
		await expectDigits(page, '912');
		await expectFormatted(input, '+7 (912) ');

		// Каретка после "+7 (9" (индекс 5) — вставить "0" перед "12"
		await input.focus();
		await setCaret(input, 5);
		await input.press('0');

		await expectDigits(page, '9012');
		await expectFormatted(input, getFormattedValue('9012', PHONE_MASK));
	});

	test('удаляет выделенный диапазон в середине через Backspace', async ({page}) => {
		await visitStory(page, 'altum-test-maskedfield--phone-controlled');

		const input = page.getByTestId('masked-input');
		await page.getByTestId('fill-full').click();

		// Выделить "12" внутри "(912)" — индексы 5..7 в "+7 (912) 345-67-89"
		await input.focus();
		await input.evaluate((el) => {
			const node = el as HTMLInputElement;
			node.setSelectionRange(5, 7);
		});
		await input.press('Backspace');

		// Оставшиеся цифры пользователя: 9 + 3456789 = 93456789
		await expectDigits(page, '93456789');
		await expectFormatted(input, getFormattedValue('93456789', PHONE_MASK));
	});
	test('Delete удаляет следующую цифру через литералы', async ({page}) => {
		await visitStory(page, 'altum-test-maskedfield--phone-controlled');

		const input = page.getByTestId('masked-input');
		await page.getByTestId('fill-full').click();
		await expectDigits(page, '9123456789');

		// Каретка перед ")" в "+7 (912) 345-67-89" — индекс 7 это ")"
		await input.focus();
		await setCaret(input, 7);
		await input.press('Delete');

		// Удаляет первую цифру после ")" (индекс цифры 3 → "3"), остаётся 912456789
		await expectDigits(page, '912456789');
		await expectFormatted(input, getFormattedValue('912456789', PHONE_MASK));
	});
});

test.describe('MaskedField — вставка, префикс, усечение', () => {
	test('вставка чистых цифр заполняет маску', async ({page}) => {
		await visitStory(page, 'altum-test-maskedfield--phone-controlled');

		const input = page.getByTestId('masked-input');
		await pasteIntoInput(input, '9123456789');

		await expectDigits(page, '9123456789');
		await expectFormatted(input, '+7 (912) 345-67-89');
	});

	test('вставка форматированного телефона снимает литералы и статический префикс', async ({page}) => {
		await visitStory(page, 'altum-test-maskedfield--phone-controlled');

		const input = page.getByTestId('masked-input');
		await pasteIntoInput(input, '+7 (912) 345-67-89');

		await expectDigits(page, '9123456789');
		await expectFormatted(input, '+7 (912) 345-67-89');
	});

	test('ввод ведущей цифры кода страны не дублирует префикс', async ({page}) => {
		await visitStory(page, 'altum-test-maskedfield--phone-controlled');

		const input = page.getByTestId('masked-input');
		await typeDigits(input, '79123456789');

		await expectDigits(page, '9123456789');
		await expectFormatted(input, '+7 (912) 345-67-89');
	});

	test('вставка обрезается до ёмкости цифр маски', async ({page}) => {
		await visitStory(page, 'altum-test-maskedfield--phone-controlled');

		const input = page.getByTestId('masked-input');
		await pasteIntoInput(input, '91234567890123456789');

		await expectDigits(page, '9123456789');
		await expectFormatted(input, '+7 (912) 345-67-89');
	});
});

test.describe('MaskedField — очистка, controlled, каретка, a11y', () => {
	test('кнопка очистки сбрасывает цифры и значение', async ({page}) => {
		await visitStory(page, 'altum-test-maskedfield--with-clear');

		const input = page.getByTestId('masked-input');
		await expectDigits(page, '9123456789');
		await expectFormatted(input, '+7 (912) 345-67-89');

		await page.getByRole('button', {name: 'Очистить'}).click();

		await expectDigits(page, '');
		await expectFormatted(input, '');

		await input.focus();
		await expectFormatted(input, '');
	});

	test('controlled-пресеты синхронизируют отображение снаружи', async ({page}) => {
		await visitStory(page, 'altum-test-maskedfield--phone-controlled');

		const input = page.getByTestId('masked-input');

		await page.getByTestId('fill-partial').click();
		await expectDigits(page, '912');
		await expectFormatted(input, '+7 (912) ');

		await page.getByTestId('fill-full').click();
		await expectDigits(page, '9123456789');
		await expectFormatted(input, '+7 (912) 345-67-89');

		await page.getByTestId('reset').click();
		await expectDigits(page, '');
		await expectFormatted(input, '');
	});

	test('controlled-значение с форматированной строкой очищается для отображения', async ({page}) => {
		await visitStory(page, 'altum-test-maskedfield--phone-controlled');

		const input = page.getByTestId('masked-input');
		await page.getByTestId('fill-formatted-value').click();

		// Родитель может хранить отформатированную строку; отображение input снимает не-цифры через getFormattedValue
		await expect(page.getByTestId('masked-digits')).toHaveText('+7 (900) 111-22-33');
		await expectFormatted(input, getFormattedValue('+7 (900) 111-22-33', PHONE_MASK));
	});

	test('каретка уходит в конец при вводе в конце', async ({page}) => {
		await visitStory(page, 'altum-test-maskedfield--phone-controlled');

		const input = page.getByTestId('masked-input');
		await typeDigits(input, '912');

		const formatted = getFormattedValue('912', PHONE_MASK);
		await expectFormatted(input, formatted);
		expect(await getCaret(input)).toBe(formatted.length);
	});

	test('клик ограничивает каретку, которая попала бы за отображаемое значение', async ({page}) => {
		await visitStory(page, 'altum-test-maskedfield--phone-controlled');

		const input = page.getByTestId('masked-input');
		await page.getByTestId('fill-partial').click();
		const displayLen = getFormattedValue('912', PHONE_MASK).length;

		await input.evaluate((el) => {
			const node = el as HTMLInputElement;
			node.focus();
			node.setSelectionRange(100, 100);
			node.dispatchEvent(new MouseEvent('click', {bubbles: true}));
		});

		expect(await getCaret(input)).toBe(displayLen);
	});

	test('отдаёт роль textbox и подписанный контрол', async ({page}) => {
		await visitStory(page, 'altum-test-maskedfield--phone-controlled');

		const input = page.getByRole('textbox', {name: /Телефон/i});
		await expect(input).toBeVisible();
		await expect(input).toHaveAttribute('data-testid', 'masked-input');
	});
});

test.describe('MaskedField — disabled и readOnly', () => {
	test('disabled игнорирует ввод и Backspace', async ({page}) => {
		await visitStory(page, 'altum-test-maskedfield--disabled-and-read-only');

		const input = page.getByTestId('masked-input-disabled');
		await expect(page.getByTestId('masked-digits-disabled')).toHaveText('9123456789');

		await input.focus({force: true});
		await input.press('Backspace');
		await input.press('1');

		await expect(page.getByTestId('masked-digits-disabled')).toHaveText('9123456789');
		await expect(input).toHaveValue('+7 (912) 345-67-89');
	});

	test('readOnly игнорирует ввод и Backspace', async ({page}) => {
		await visitStory(page, 'altum-test-maskedfield--disabled-and-read-only');

		const input = page.getByTestId('masked-input-readonly');
		await expect(page.getByTestId('masked-digits-readonly')).toHaveText('9123456789');

		await input.focus();
		await setCaret(input, '+7 (912) 345-67-89'.length);
		await input.press('Backspace');
		await input.press('1');

		await expect(page.getByTestId('masked-digits-readonly')).toHaveText('9123456789');
		await expect(input).toHaveValue('+7 (912) 345-67-89');
	});
});
