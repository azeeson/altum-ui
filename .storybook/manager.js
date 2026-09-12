import {addons} from '@storybook/manager-api';
import {GLOBALS_UPDATED, SET_CONFIG, SET_GLOBALS, UPDATE_GLOBALS} from '@storybook/core-events';
import {ensure} from '@storybook/theming';
import store from 'store2';
import {altumLightDocs, altumDarkDocs} from './docsTheme';
import {normalizeTheme, readStoredTheme, writeStoredTheme} from './themeStorage';

const STORYBOOK_MANAGER_STORE_KEY = '@storybook/manager/store';

function managerTheme(mode) {
	// ensure() собирает вложенные background.*, которые Emotion реально рисует
	return ensure(mode === 'dark' ? altumDarkDocs : altumLightDocs);
}

/** Пишем в store менеджера SB, чтобы getInitialState() подхватил тёмный хром при перезагрузке. */
function persistThemeToManagerStore(theme) {
	try {
		const prev = store.local.get(STORYBOOK_MANAGER_STORE_KEY) || {};
		store.local.set(STORYBOOK_MANAGER_STORE_KEY, {...prev, theme});
	} catch {
		// игнорируем
	}
}

function paintHtmlShell(mode) {
	try {
		document.documentElement.setAttribute('data-altum-manager-theme', mode);
		document.documentElement.style.background =
			mode === 'dark' ? '#141416' : '#f8fafc';
	} catch {
		// игнорируем
	}
}

function seedConfigTheme(theme) {
	addons.getConfig().theme = theme;
}

const initialMode = readStoredTheme();
const initialTheme = managerTheme(initialMode);

paintHtmlShell(initialMode);
persistThemeToManagerStore(initialTheme);
seedConfigTheme(initialTheme);
addons.setConfig({theme: initialTheme});

addons.register('altum/theme-persist', (api) => {
	let applying = false;

	function applyTheme(mode) {
		const themeMode = normalizeTheme(mode);
		const theme = managerTheme(themeMode);

		writeStoredTheme(themeMode);
		persistThemeToManagerStore(theme);
		paintHtmlShell(themeMode);
		seedConfigTheme(theme);

		if (typeof api.setOptions === 'function') {
			applying = true;
			try {
				api.setOptions({theme});
			} finally {
				applying = false;
			}
		}
	}

	function applyStored() {
		applyTheme(readStoredTheme());
	}

	applyStored();

	// layout.init выполняется после register в том же useEffect и может сбросить тему —
	// повторно применяем после этого тика и ещё несколько раз.
	queueMicrotask(applyStored);
	setTimeout(applyStored, 0);
	setTimeout(applyStored, 50);
	setTimeout(applyStored, 250);

	const channel = addons.getChannel();
	const onGlobals = ({globals} = {}) => {
		if (globals?.theme != null) applyTheme(globals.theme);
	};

	channel.on(UPDATE_GLOBALS, onGlobals);
	channel.on(GLOBALS_UPDATED, onGlobals);
	channel.on(SET_GLOBALS, ({globals} = {}) => {
		applyTheme(globals?.theme ?? readStoredTheme());
	});

	channel.on(SET_CONFIG, () => {
		if (applying) return;
		setTimeout(applyStored, 0);
	});
});
