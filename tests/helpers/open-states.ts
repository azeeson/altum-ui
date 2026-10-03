import type {Page} from '@playwright/test';

export interface OpenStateScenario {
	/** Имя файла снапшота (без пути) */
	snapshot: string;
	/** id стори Storybook */
	storyId: string;
	/** Открыть overlay / popup перед скриншотом */
	prepare?: (page: Page) => Promise<void>;
}

/** Стори с заранее открытым состоянием (портальные оверлеи) */
export const STATIC_OPEN_STATE_SCENARIOS: OpenStateScenario[] = [
	{
		storyId: 'altum-test-visualopenstates--modal-open',
		snapshot: 'open-modal.png',
	},
	{
		storyId: 'altum-test-visualopenstates--confirm-dialog-destructive-open',
		snapshot: 'open-confirm-dialog-destructive.png',
	},
	{
		storyId: 'altum-test-visualopenstates--confirm-dialog-default-open',
		snapshot: 'open-confirm-dialog-default.png',
	},
	{
		storyId: 'altum-test-visualopenstates--sheet-sidebar-open',
		snapshot: 'open-drawer.png',
	},
	{
		storyId: 'altum-test-visualopenstates--image-lightbox-open',
		snapshot: 'open-image-lightbox.png',
	},
	{
		storyId: 'altum-test-visualopenstates--dropdown-open',
		snapshot: 'open-dropdown.png',
	},
	{
		storyId: 'altum-test-visualopenstates--tooltip-visible',
		snapshot: 'open-tooltip.png',
	},
	{
		storyId: 'altum-test-visualopenstates--sheet-open',
		snapshot: 'open-sheet.png',
	},
];

/** Playground-стори — открываем popup интеракцией */
export const INTERACTIVE_OPEN_STATE_SCENARIOS: OpenStateScenario[] = [
	{
		storyId: 'altum-components-dropdown--playground',
		snapshot: 'open-dropdown-playground.png',
		prepare: async (page) => {
			await page.getByRole('button', {name: /Открыть/i}).click();
			await page.getByText('Содержимое выпадающей панели').waitFor({state: 'visible'});
		},
	},
	{
		storyId: 'altum-components-formfield-select--playground',
		snapshot: 'open-select-playground.png',
		prepare: async (page) => {
			await page.getByRole('button', {name: /Город/i}).click();
			await page.getByRole('listbox').waitFor({state: 'visible'});
		},
	},
	{
		storyId: 'altum-components-formfield-select--playground',
		snapshot: 'open-select-filterable.png',
		prepare: async (page) => {
			await page.getByRole('button', {name: /Город/i}).click();
			await page.getByRole('searchbox').waitFor({state: 'visible'});
			await page.getByRole('listbox').waitFor({state: 'visible'});
		},
	},
	{
		storyId: 'altum-components-formfield-select--playground',
		snapshot: 'open-combobox-playground.png',
		prepare: async (page) => {
			await page.getByRole('button', {name: /Город/i}).click();
			await page.getByRole('listbox').waitFor({state: 'visible'});
		},
	},
	{
		storyId: 'altum-components-formfield-select--multiple',
		snapshot: 'open-combobox-compare.png',
		prepare: async (page) => {
			await page.getByRole('combobox').first().click();
			await page.getByRole('listbox').waitFor({state: 'visible'});
		},
	},
	{
		storyId: 'altum-components-formfield-datefield--playground',
		snapshot: 'open-datefield-playground.png',
		prepare: async (page) => {
			await page.getByRole('textbox', {name: /Укажите дату|дата|date/i}).click();
			await page.getByRole('grid').waitFor({state: 'visible'});
		},
	},
	{
		storyId: 'altum-components-formfield-timefield--playground',
		snapshot: 'open-timefield-field.png',
		prepare: async (page) => {
			await page.getByRole('textbox').first().click();
			await page.getByRole('listbox', {name: /Часы|Hours/i}).waitFor({state: 'visible'});
			await page.getByRole('listbox', {name: /Минуты|Minutes/i}).waitFor({state: 'visible'});
		},
	},
	{
		storyId: 'altum-components-formfield-timefield--custom-minute',
		snapshot: 'open-timefield-custom-minute.png',
		prepare: async (page) => {
			await page.getByRole('textbox').first().click();
			await page.getByRole('listbox', {name: /Часы|Hours/i}).waitFor({state: 'visible'});
			const minutes = page.getByRole('listbox', {name: /Минуты|Minutes/i});
			await minutes.waitFor({state: 'visible'});
			await minutes.getByRole('option', {
				name: '14',
				exact: true,
			}).waitFor({state: 'visible'});
		},
	},
	{
		storyId: 'altum-components-modal--playground',
		snapshot: 'open-modal-playground.png',
		prepare: async (page) => {
			await page.getByRole('button', {name: /Показать диалог/i}).click();
			await page.getByRole('dialog').waitFor({state: 'visible'});
		},
	},
	{
		storyId: 'altum-components-confirmdialog--playground',
		snapshot: 'open-confirm-dialog-playground.png',
		prepare: async (page) => {
			await page.getByRole('button', {name: /Удалить список/i}).click();
			await page.getByRole('dialog').waitFor({state: 'visible'});
		},
	},
	{
		storyId: 'altum-components-imagelightbox--playground',
		snapshot: 'open-imagelightbox-playground.png',
		prepare: async (page) => {
			await page.getByRole('button', {name: /Открыть lightbox/i}).click();
			await page.getByRole('dialog').waitFor({state: 'visible'});
		},
	},
	{
		storyId: 'altum-components-tooltip--playground',
		snapshot: 'open-tooltip-playground.png',
		prepare: async (page) => {
			await page.getByRole('button', {name: 'Наведи на меня'}).hover();
			await page.getByText('Полезная подсказка сверху').waitFor({state: 'visible'});
		},
	},
	{
		storyId: 'altum-components-backdrop--playground',
		snapshot: 'open-backdrop-playground.png',
		prepare: async (page) => {
			await page.getByRole('button', {name: /Показать backdrop/i}).click();
			await page.getByText('Клик по затемнению закрывает').waitFor({state: 'visible'});
		},
	},
	{
		storyId: 'altum-components-notification--playground',
		snapshot: 'open-notification-playground.png',
		prepare: async (page) => {
			await page.getByRole('button', {name: /Показать уведомление/i}).click();
			await page.getByText('Успешная операция').waitFor({state: 'visible'});
		},
	},
	{
		storyId: 'altum-components-accordion--playground',
		snapshot: 'open-accordion-playground.png',
		prepare: async (page) => {
			await page.getByRole('button', {name: /тарифный план/i}).click();
			await page.getByRole('region', {name: 'Как изменить тарифный план?'}).waitFor({state: 'visible'});
		},
	},
	{
		storyId: 'altum-components-sheet--sidebar-mode',
		snapshot: 'open-drawer-right.png',
		prepare: async (page) => {
			await page.getByRole('button', {name: /Открыть sidebar/i}).click();
			await page.getByRole('dialog').waitFor({state: 'visible'});
		},
	},
	{
		storyId: 'altum-components-tooltip--variants',
		snapshot: 'open-tooltip-positions.png',
		prepare: async (page) => {
			await page.getByRole('button', {name: 'Верх'}).hover();
			await page.getByText('Подсказка сверху').waitFor({state: 'visible'});
		},
	},
	{
		storyId: 'altum-components-sheet--playground',
		snapshot: 'open-sheet-playground.png',
		prepare: async (page) => {
			await page.getByRole('button', {name: /Открыть Sheet/i}).click();
			await page.getByRole('dialog').waitFor({state: 'visible'});
		},
	},
	{
		storyId: 'altum-components-popover--playground',
		snapshot: 'open-popover-playground.png',
		prepare: async (page) => {
			await page.getByRole('button', {name: /Открыть popover/i}).click();
			await page.getByText('Описание или форма внутри всплывающей панели').waitFor({state: 'visible'});
		},
	},
	{
		storyId: 'altum-components-commandpalette--playground',
		snapshot: 'open-commandpalette-playground.png',
		prepare: async (page) => {
			await page.getByRole('button', {name: /Открыть палитру/i}).click();
			await page.getByRole('dialog').waitFor({state: 'visible'});
		},
	},
];
