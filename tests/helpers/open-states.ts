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
		storyId: 'altum-ui-test-visualopenstates--modal-open',
		snapshot: 'open-modal.png',
	},
	{
		storyId: 'altum-ui-test-visualopenstates--confirm-dialog-destructive-open',
		snapshot: 'open-confirm-dialog-destructive.png',
	},
	{
		storyId: 'altum-ui-test-visualopenstates--confirm-dialog-default-open',
		snapshot: 'open-confirm-dialog-default.png',
	},
	{
		storyId: 'altum-ui-test-visualopenstates--sheet-sidebar-open',
		snapshot: 'open-drawer.png',
	},
	{
		storyId: 'altum-ui-test-visualopenstates--image-lightbox-open',
		snapshot: 'open-image-lightbox.png',
	},
	{
		storyId: 'altum-ui-test-visualopenstates--color-dropdown-open',
		snapshot: 'open-dropdown.png',
	},
	{
		storyId: 'altum-ui-test-visualopenstates--tooltip-visible',
		snapshot: 'open-tooltip.png',
	},
	{
		storyId: 'altum-ui-test-visualopenstates--sheet-open',
		snapshot: 'open-sheet.png',
	},
];

/** Playground-стори — открываем popup интеракцией */
export const INTERACTIVE_OPEN_STATE_SCENARIOS: OpenStateScenario[] = [
	{
		storyId: 'altum-ui-components-dropdown--playground',
		snapshot: 'open-dropdown-playground.png',
		prepare: async (page) => {
			await page.getByRole('button', {name: /Открыть/i}).click();
			await page.getByText('Содержимое выпадающей панели').waitFor({state: 'visible'});
		},
	},
	{
		storyId: 'altum-ui-components-select--playground',
		snapshot: 'open-select-playground.png',
		prepare: async (page) => {
			await page.getByRole('button', {name: /Город/i}).click();
			await page.getByRole('listbox').waitFor({state: 'visible'});
		},
	},
	{
		storyId: 'altum-ui-components-customselect--playground',
		snapshot: 'open-select-filterable.png',
		prepare: async (page) => {
			await page.getByRole('button', {name: /Москва|Выберите город/i}).click();
			await page.getByRole('searchbox').waitFor({state: 'visible'});
			await page.getByRole('listbox').waitFor({state: 'visible'});
		},
	},
	{
		storyId: 'altum-ui-components-customselect--playground',
		snapshot: 'open-combobox-playground.png',
		prepare: async (page) => {
			await page.getByRole('button', {name: /Москва|Выберите город/i}).click();
			await page.getByRole('listbox').waitFor({state: 'visible'});
		},
	},
	{
		storyId: 'altum-ui-components-customselect--compound-multiple',
		snapshot: 'open-combobox-compare.png',
		prepare: async (page) => {
			await page.getByRole('combobox').first().click();
			await page.getByRole('listbox').waitFor({state: 'visible'});
		},
	},
	{
		storyId: 'altum-ui-components-datepicker--playground',
		snapshot: 'open-datepicker-playground.png',
		prepare: async (page) => {
			await page.getByRole('button', {name: /\d{2}\.\d{2}\.\d{4}/}).click();
			await page.getByRole('grid').waitFor({state: 'visible'});
		},
	},
	{
		storyId: 'altum-ui-components-timepicker--field-variant',
		snapshot: 'open-timepicker-field.png',
		prepare: async (page) => {
			await page.getByRole('button', {name: /\d{1,2}:\d{2}/}).or(page.getByRole('combobox')).first().click();
			await page.getByRole('listbox', {name: /Часы|Hours/i}).waitFor({state: 'visible'});
			await page.getByRole('listbox', {name: /Минуты|Minutes/i}).waitFor({state: 'visible'});
		},
	},
	{
		storyId: 'altum-ui-components-timepicker--field-custom-minute',
		snapshot: 'open-timepicker-custom-minute.png',
		prepare: async (page) => {
			await page.getByRole('button', {name: /\d{1,2}:\d{2}/}).or(page.getByRole('combobox')).first().click();
			await page.getByRole('listbox', {name: /Часы|Hours/i}).waitFor({state: 'visible'});
			await page.getByRole('option', {
				name: '14',
				exact: true
			}).waitFor({state: 'visible'});
		},
	},
	{
		storyId: 'altum-ui-components-modal--playground',
		snapshot: 'open-modal-playground.png',
		prepare: async (page) => {
			await page.getByRole('button', {name: /Показать диалог/i}).click();
			await page.getByRole('dialog').waitFor({state: 'visible'});
		},
	},
	{
		storyId: 'altum-ui-components-confirmdialog--playground',
		snapshot: 'open-confirm-dialog-playground.png',
		prepare: async (page) => {
			await page.getByRole('button', {name: /Удалить список/i}).click();
			await page.getByRole('dialog').waitFor({state: 'visible'});
		},
	},
	{
		storyId: 'altum-ui-components-imagelightbox--playground',
		snapshot: 'open-imagelightbox-playground.png',
		prepare: async (page) => {
			await page.getByRole('button', {name: /Открыть lightbox/i}).click();
			await page.getByRole('dialog').waitFor({state: 'visible'});
		},
	},
	{
		storyId: 'altum-ui-components-tooltip--playground',
		snapshot: 'open-tooltip-playground.png',
		prepare: async (page) => {
			await page.getByRole('button', {name: 'Наведи на меня'}).hover();
			await page.getByText('Полезная подсказка сверху').waitFor({state: 'visible'});
		},
	},
	{
		storyId: 'altum-ui-components-backdrop--playground',
		snapshot: 'open-backdrop-playground.png',
		prepare: async (page) => {
			await page.getByRole('button', {name: /Показать backdrop/i}).click();
			await page.getByText('Клик по затемнению закрывает').waitFor({state: 'visible'});
		},
	},
	{
		storyId: 'altum-ui-components-notification--playground',
		snapshot: 'open-notification-playground.png',
		prepare: async (page) => {
			await page.getByRole('button', {name: /Показать уведомление/i}).click();
			await page.getByText('Успешная операция').waitFor({state: 'visible'});
		},
	},
	{
		storyId: 'altum-ui-components-accordion--playground',
		snapshot: 'open-accordion-playground.png',
		prepare: async (page) => {
			await page.getByRole('button', {name: /тарифный план/i}).click();
			await page.getByRole('region', {name: 'Как изменить тарифный план?'}).waitFor({state: 'visible'});
		},
	},
	{
		storyId: 'altum-ui-components-sheet--sidebar-mode',
		snapshot: 'open-drawer-right.png',
		prepare: async (page) => {
			await page.getByRole('button', {name: /Открыть sidebar/i}).click();
			await page.getByRole('dialog').waitFor({state: 'visible'});
		},
	},
	{
		storyId: 'altum-ui-components-tooltip--variants',
		snapshot: 'open-tooltip-positions.png',
		prepare: async (page) => {
			await page.getByRole('button', {name: 'Верх'}).hover();
			await page.getByText('Подсказка сверху').waitFor({state: 'visible'});
		},
	},
	{
		storyId: 'altum-ui-components-sheet--playground',
		snapshot: 'open-sheet-playground.png',
		prepare: async (page) => {
			await page.getByRole('button', {name: /Открыть Sheet/i}).click();
			await page.getByRole('dialog').waitFor({state: 'visible'});
		},
	},
	{
		storyId: 'altum-ui-components-popover--playground',
		snapshot: 'open-popover-playground.png',
		prepare: async (page) => {
			await page.getByRole('button', {name: /Открыть popover/i}).click();
			await page.getByText('Описание или форма внутри всплывающей панели').waitFor({state: 'visible'});
		},
	},
	{
		storyId: 'altum-ui-components-commandpalette--playground',
		snapshot: 'open-commandpalette-playground.png',
		prepare: async (page) => {
			await page.getByRole('button', {name: /Открыть палитру/i}).click();
			await page.getByRole('dialog').waitFor({state: 'visible'});
		},
	},
];
