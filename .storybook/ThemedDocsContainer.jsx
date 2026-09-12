import React, {useEffect, useState} from 'react';
import {DocsContainer} from '@storybook/blocks';
import {addons} from '@storybook/preview-api';
import {GLOBALS_UPDATED, UPDATE_GLOBALS} from '@storybook/core-events';
import {ThemeProvider} from '../src/components/ThemeProvider/ThemeProvider';
import {getDocsTheme} from './docsTheme';
import {normalizeTheme, readStoredTheme, writeStoredTheme} from './themeStorage';
import './docsFullPage.css';

function resolveThemeMode(context) {
	return normalizeTheme(
		context?.globals?.theme
		?? context?.store?.userGlobals?.theme
		?? readStoredTheme(),
	);
}

/**
 * Страницы документации: ThemeProvider altum (document) + тема хрома docs Storybook,
 * синхронизированы с Theme в тулбаре и сохраняются в localStorage.
 */
export const ThemedDocsContainer = (props) => {
	const [themeMode, setThemeMode] = useState(() => resolveThemeMode(props.context));

	useEffect(() => {
		const channel = addons.getChannel();
		const onGlobals = (payload) => {
			const next = normalizeTheme(payload?.globals?.theme);
			writeStoredTheme(next);
			setThemeMode(next);
		};
		channel.on(UPDATE_GLOBALS, onGlobals);
		channel.on(GLOBALS_UPDATED, onGlobals);
		return () => {
			channel.off(UPDATE_GLOBALS, onGlobals);
			channel.off(GLOBALS_UPDATED, onGlobals);
		};
	}, []);

	useEffect(() => {
		const fromContext = props.context?.globals?.theme;
		if (fromContext === 'light' || fromContext === 'dark') {
			setThemeMode(fromContext);
			writeStoredTheme(fromContext);
		}
	}, [props.context?.globals?.theme]);

	const docsTheme = getDocsTheme(themeMode);

	return (
		<ThemeProvider
			key={themeMode}
			theme={themeMode}
			applyTo='document'
		>
			<div
				className='altum-docs-shell'
				data-theme={themeMode}
				style={{
					minHeight: '100%',
					background: themeMode === 'dark' ? 'var(--bg-color-zone, #141416)' : 'var(--bg-color-zone, #f8fafc)',
					color: 'var(--text-color-zone, inherit)',
				}}
			>
				<DocsContainer
					{...props}
					theme={docsTheme}
				/>
			</div>
		</ThemeProvider>
	);
};
