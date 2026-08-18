import type {
	Theme,
	ThemeProviderProps,
} from './ThemeProvider.types';
export type {
	Theme,
	ThemeApplyTarget,
	ThemeProviderProps,
} from './ThemeProvider.types';

import React, {
	createContext,
	forwardRef,
	useCallback,
	useContext,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import styles from './ThemeProvider.module.css';
import {cn} from '../../utils/cn';
import {composeRefs} from '../../utils/composeRefs';

interface ThemeContextProps {
	theme: Theme;
	setTheme: (theme: Theme) => void;
	toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

/**
 * Доступ к текущей теме и методам переключения.
 * Должен вызываться внутри {@link ThemeProvider}.
 *
 * @returns Объект с `theme`, `setTheme` и `toggleTheme`.
 * @throws Error, если провайдер не найден в дереве компонентов.
 *
 * @example
 * const { theme, toggleTheme } = useTheme();
 */
export const useTheme = () => {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error('useTheme должен вызываться внутри ThemeProvider');
	}
	return context;
};

const THEME_CLASSES = [styles.light, styles.dark] as const;

function applyThemeToElement(el: Element, theme: Theme): void {
	el.classList.add(styles.themeProvider);
	for (const cls of THEME_CLASSES) {
		el.classList.toggle(cls, cls === styles[theme]);
	}
	if (el instanceof HTMLElement) {
		el.dataset.theme = theme;
	}
}

function clearThemeFromElement(el: Element): void {
	el.classList.remove(styles.themeProvider, ...THEME_CLASSES);
	if (el instanceof HTMLElement) {
		delete el.dataset.theme;
	}
}

function applyThemeToDocument(theme: Theme): void {
	if (typeof document === 'undefined') return;
	for (const el of [document.documentElement, document.body]) {
		applyThemeToElement(el, theme);
	}
}

function clearThemeFromDocument(): void {
	if (typeof document === 'undefined') return;
	for (const el of [document.documentElement, document.body]) {
		clearThemeFromElement(el);
	}
}

/**
 * Корневой провайдер темы light/dark: прокидывает CSS-переменные дизайн-системы
 * на обёртку и опционально на `document.documentElement` / `document.body`.
 * Сохраняет тему в React-контексте для {@link useTheme}.
 *
 * По умолчанию (`applyTo="wrapper"`) тема локальна для поддерева провайдера.
 * Для глобальных порталов на `document.body` передайте `applyTo="document"`.
 *
 * @component
 * @example
 * <ThemeProvider initialTheme="dark">
 *   <App />
 * </ThemeProvider>
 * @example
 * // Контролируемый режим (например, после чтения localStorage)
 * <ThemeProvider theme={theme} onThemeChange={setTheme}>
 *   <App />
 * </ThemeProvider>
 * @example
 * // Легаси: токены на html/body для порталов, смонтированных на body
 * <ThemeProvider applyTo="document" initialTheme="dark">
 *   <App />
 * </ThemeProvider>
 */
export const ThemeProvider = forwardRef<HTMLDivElement, ThemeProviderProps>(function ThemeProvider(
	{
		initialTheme = 'light',
		theme: themeProp,
		onThemeChange,
		applyTo = 'wrapper',
		children,
		className,
		...rest
	},
	ref,
) {
	const isControlled = themeProp !== undefined;
	const [uncontrolledTheme, setUncontrolledTheme] = useState<Theme>(initialTheme);
	const theme = isControlled ? themeProp : uncontrolledTheme;
	const wrapperRef = useRef<HTMLDivElement>(null);

	const setTheme = useCallback((newTheme: Theme) => {
		if (!isControlled) {
			setUncontrolledTheme(newTheme);
		}
		onThemeChange?.(newTheme);
	}, [isControlled, onThemeChange]);

	const toggleTheme = useCallback(() => {
		setTheme(theme === 'light' ? 'dark' : 'light');
	}, [setTheme, theme]);

	const value = useMemo<ThemeContextProps>(() => ({
		theme,
		setTheme,
		toggleTheme,
	}), [theme, setTheme, toggleTheme]);

	// Применить до отрисовки, чтобы первый кадр совпадал с темой.
	useLayoutEffect(() => {
		if (applyTo === 'document') {
			applyThemeToDocument(theme);
		}
		const wrapper = wrapperRef.current;
		if (wrapper) {
			applyThemeToElement(wrapper, theme);
		}
	}, [applyTo, theme]);

	useLayoutEffect(() => () => {
		if (applyTo === 'document') {
			clearThemeFromDocument();
		}
		const wrapper = wrapperRef.current;
		if (wrapper) {
			clearThemeFromElement(wrapper);
		}
	}, [applyTo]);

	return (
		<ThemeContext.Provider value={value}>
			<div
				ref={composeRefs(ref, wrapperRef)}
				className={cn(styles.themeProvider, styles[theme], className)}
				data-theme={theme}
				{...rest}
			>
				{children}
			</div>
		</ThemeContext.Provider>
	);
});

ThemeProvider.displayName = 'ThemeProvider';
