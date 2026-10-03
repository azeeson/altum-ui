import type {
	Theme,
	ThemeProviderProps,
} from './ThemeProvider.types';
export type {
	Theme,
	ThemeApplyTarget,
	ThemeProviderProps,
} from './ThemeProvider.types';

import {useRequiredContext} from '../../hooks/useRequiredContext';
import React, {
	createContext,
	useCallback,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import styles from './ThemeProvider.module.css';
import {cn} from '../../core/utils/cn';
import {uRef} from '../../core/utils/bundle';

interface ThemeContextProps {
	theme: Theme;
	setTheme: (theme: Theme) => void;
	toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps | null>(null);

/**
 * Доступ к текущей теме и методам переключения.
 * Должен вызываться внутри {@link ThemeProvider}.
 */
export const useTheme = () => useRequiredContext(
	ThemeContext,
	'useTheme должен вызываться внутри ThemeProvider',
);

function applyThemeToElement(el: Element, theme: Theme): void {
	el.classList.add(styles.themeProvider);
	if (el instanceof HTMLElement) {
		el.dataset.theme = theme;
	}
}

function clearThemeFromElement(el: Element): void {
	el.classList.remove(styles.themeProvider);
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
 * Корневой провайдер темы light/dark: CSS-переменные через `data-theme`.
 *
 * @component
 */
export const ThemeProvider = ({
	initialTheme = 'light',
	theme: themeProp,
	onThemeChange,
	applyTo = 'wrapper',
	children,
	className,
	rootRef,
	...rest
}: ThemeProviderProps) => {
	const isControlled = themeProp !== undefined;
	const [uncontrolledTheme, setUncontrolledTheme] = useState<Theme>(initialTheme);
	const theme = isControlled ? themeProp : uncontrolledTheme;
	const wrapperRef = useRef<HTMLDivElement>(null);

	const setTheme = useCallback((newTheme: Theme) => {
		if (!isControlled) setUncontrolledTheme(newTheme);
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

	useLayoutEffect(() => {
		if (applyTo === 'document') {
			applyThemeToDocument(theme);
			return;
		}
		const wrapper = wrapperRef.current;
		if (wrapper) applyThemeToElement(wrapper, theme);
	}, [applyTo, theme]);

	useLayoutEffect(() => () => {
		if (applyTo === 'document') clearThemeFromDocument();
		const wrapper = wrapperRef.current;
		if (wrapper) clearThemeFromElement(wrapper);
	}, [applyTo]);

	const themeOnWrapper = applyTo !== 'document';

	return (
		<ThemeContext.Provider value={value}>
			<div
				ref={uRef(rootRef, wrapperRef)}
				className={cn(themeOnWrapper && styles.themeProvider, className)}
				data-theme={themeOnWrapper ? theme : undefined}
				{...rest}
			>
				{children}
			</div>
		</ThemeContext.Provider>
	);
};
