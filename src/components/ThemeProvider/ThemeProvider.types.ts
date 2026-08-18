import type React from 'react';
import type {ComponentPropsWithoutRef} from 'react';

/** Активная цветовая схема приложения: светлая или тёмная. */
export type Theme = 'light' | 'dark';

/** Куда применять классы темы и `data-theme`. */
export type ThemeApplyTarget = 'wrapper' | 'document';

export interface ThemeProviderProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
	/**
	 * Неконтролируемая начальная тема (снимок на момент монтирования).
	 * Игнорируется, если задана `theme`. Чтобы отреагировать на хранилище после монтирования, передайте контролируемую `theme`
	 * или перемонтируйте с `key={storedTheme}`.
	 * @default 'light'
	 */
	initialTheme?: Theme;
	/**
	 * Контролируемая тема. Если задана, провайдер зеркалит это значение и вызывает `onThemeChange` из `setTheme`.
	 */
	theme?: Theme;
	/** Срабатывает при смене темы через `setTheme` / `toggleTheme` (контролируемый или нет). */
	onThemeChange?: (theme: Theme) => void;
	/**
	 * Куда применять классы темы и `data-theme`.
	 * - `'wrapper'` (по умолчанию) — только на обёртку провайдера;
	 * - `'document'` — на `document.documentElement`, `document.body` и обёртку (legacy, порталы на `body`).
	 * @default 'wrapper'
	 */
	applyTo?: ThemeApplyTarget;
	children: React.ReactNode;
}
