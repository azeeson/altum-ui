/** Общее сохранение темы Storybook (manager и preview делят same-origin localStorage). */

export const THEME_STORAGE_KEY = 'altum-ui.storybook.theme';

/**
 * @returns {'light' | 'dark'}
 */
export function readStoredTheme() {
	if (typeof window === 'undefined') return 'light';
	try {
		const value = window.localStorage.getItem(THEME_STORAGE_KEY);
		return value === 'dark' || value === 'light' ? value : 'light';
	} catch {
		return 'light';
	}
}

/**
 * @param {unknown} theme
 */
export function writeStoredTheme(theme) {
	if (typeof window === 'undefined') return;
	if (theme !== 'dark' && theme !== 'light') return;
	try {
		window.localStorage.setItem(THEME_STORAGE_KEY, theme);
	} catch {
		// приватный режим / квота
	}
}

/**
 * @param {unknown} theme
 * @returns {'light' | 'dark'}
 */
export function normalizeTheme(theme) {
	return theme === 'dark' ? 'dark' : 'light';
}
