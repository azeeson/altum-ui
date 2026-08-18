import type {Meta} from '@storybook/react';
import React from 'react';
import {ThemeProvider, useTheme, type Theme} from './ThemeProvider';
import {Button} from '../Button/Button';
import {TextField} from '../TextField/TextField';
import {Stack, Inline} from '../Layout/Layout';
import {Text} from '../Text/Text';
import {Box} from '../Box/Box';
import {componentParameters, story, Story} from '../../storybook/meta';

export default {
	title: 'altum-ui/Utilities/ThemeProvider',
	component: ThemeProvider,
	tags: ['autodocs'],
	parameters: componentParameters(
		'Корневой провайдер light/dark: CSS-токены и `useTheme`.',
	),
	argTypes: {
		initialTheme: {
			control: {
				type: 'select',
				options: ['light', 'dark']
			},
		},
	},
} satisfies Meta<typeof ThemeProvider>;

function ThemeDemo() {
	const {theme, setTheme, toggleTheme} = useTheme();
	return (
		<Stack gap='md'>
			<Text size='sm'>
				Текущая тема:
				{' '}
				<strong>
					{theme}
				</strong>
			</Text>
			<Inline gap='sm'>
				<Button size='sm' onClick={toggleTheme}>
					Переключить
				</Button>
				{(['light', 'dark'] as Theme[]).map((value) => (
					<Button
						key={value}
						size='sm'
						variant={theme === value ? 'primary' : 'secondary'}
						onClick={() => setTheme(value)}
					>
						{value}
					</Button>
				))}
			</Inline>
			<Box
				variant='outlined'
				border
				padding='md'
			>
				<Stack gap='sm'>
					<TextField
						label='Пример поля'
						placeholder='Текст'
						width='full'
					/>
					<Inline gap='sm'>
						<Button variant='primary' size='sm'>
							Primary
						</Button>
						<Button variant='tinted' size='sm'>
							Tinted
						</Button>
						<Button variant='ghost' size='sm'>
							Ghost
						</Button>
					</Inline>
				</Stack>
			</Box>
		</Stack>
	);
}

export const Playground: Story<React.ComponentProps<typeof ThemeProvider>> = {
	render: (args) => (
		<ThemeProvider {...args}>
			<ThemeDemo />
		</ThemeProvider>
	),
	args: {
		initialTheme: 'light',
	},
	parameters: story('Переключение темы через `useTheme` (вложенный ThemeProvider).'),
};

export const WithDarkInitial: Story<React.ComponentProps<typeof ThemeProvider>> = {
	render: () => (
		<ThemeProvider initialTheme='dark'>
			<ThemeDemo />
		</ThemeProvider>
	),
	parameters: story('Стартовая тема `dark` (wrapper-only, default).'),
};

export const WithDocumentApplyTo: Story<React.ComponentProps<typeof ThemeProvider>> = {
	render: () => (
		<ThemeProvider initialTheme='dark' applyTo='document'>
			<ThemeDemo />
		</ThemeProvider>
	),
	parameters: story('Тема на `document.documentElement` + `body` (для порталов на body).'),
};
