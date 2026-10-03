import React, {useEffect} from 'react';
import {ThemeProvider} from '../src/components/ThemeProvider/ThemeProvider';
import {NotificationProvider} from '../src/components/Notification/toast';
import {ThemedDocsContainer} from './ThemedDocsContainer';
import {normalizeTheme, readStoredTheme, writeStoredTheme} from './themeStorage';
import './preview.css';
import './docsFullPage.css';

const storedTheme = readStoredTheme();

export const parameters = {
	actions: {argTypesRegex: '^on[A-Z].*'},
	controls: {
		expanded: true,
		matchers: {
			color: /(background|color)$/i,
			date: /Date$/i,
		},
	},
	docs: {
		toc: true,
		container: ThemedDocsContainer,
		/**
		 * `dynamic` прогоняет отрендеренное дерево через react-element-to-jsx-string
		 * (formatComplexDataStructure). На пропах вроде ReactNode / callbacks /
		 * больших массивах UI может зависнуть на минуты. `code` показывает текст стори.
		 */
		source: {
			type: 'code',
			excludeDecorators: true,
		},
	},
	options: {
		storySort: {
			method: 'alphabetical',
			order: [
				'altum',
				[
					'About',
					'Components',
					'Mobile',
					'Common',
					'Internal',
					'Utilities',
					'Hooks',
					'Icons',
					'Examples',
					'Test',
				],
			],
		},
	},
};

export const initialGlobals = {
	theme: storedTheme,
};

export const globalTypes = {
	theme: {
		name: 'Theme',
		description: 'Глобальная тема оформления (сохраняется в localStorage)',
		defaultValue: storedTheme,
		toolbar: {
			icon: 'circlehollow',
			items: [
				{
					value: 'light',
					title: 'Light',
					icon: 'circlehollow',
				},
				{
					value: 'dark',
					title: 'Dark',
					icon: 'circle',
				},
			],
			showName: true,
			dynamicTitle: true,
		},
	},
};

export const decorators = [
	(Story, context) => {
		const theme = normalizeTheme(context.globals?.theme ?? storedTheme);

		useEffect(() => {
			writeStoredTheme(theme);
		}, [theme]);

		return (
			<ThemeProvider
				key={theme}
				theme={theme}
				applyTo='document'
			>
				<NotificationProvider>
					<div style={{
						padding: '20px',
						minHeight: '100%',
						background: 'var(--altum-color-bg)',
						color: 'var(--altum-color-text)',
					}}
					>
						<Story />
					</div>
				</NotificationProvider>
			</ThemeProvider>
		);
	},
];
