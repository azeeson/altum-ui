import type {Meta} from '@storybook/react';
import React from 'react';
import {Text, TextProps} from './Text';
import {componentParameters, story, Story} from '../../storybook/meta';

export default {
	title: 'altum-ui/Components/Text',
	component: Text,
	tags: ['autodocs'],
	parameters: componentParameters('Текстовый элемент с размерами, начертаниями и семантическими цветами.'),
	argTypes: {
		size: {
			control: {
				type: 'select',
				options: [
					'xs',
					'sm',
					'md',
					'lg',
					'xl'
				]
			},
			description: 'Размер текста',
		},
		weight: {
			control: {
				type: 'select',
				options: ['normal', 'medium', 'bold']
			},
			description: 'Начертание',
		},
		color: {
			control: {
				type: 'select',
				options: [
					'primary',
					'secondary',
					'tertiary',
					'muted',
					'info',
					'success',
					'warning',
					'error',
					'disabled'
				]
			},
			description: 'Семантический цвет',
		},
		as: {
			control: {
				type: 'select',
				options: [
					'span',
					'p',
					'div',
					'h1',
					'h2',
					'h3',
					'label'
				],
			},
			description: 'HTML-элемент. Дефолт span (inline); для блочного copy — p / div.',
		},
		children: {
			control: 'text',
			description: 'Текст'
		},
	},
} satisfies Meta<typeof Text>;

export const Playground: Story<TextProps> = {
	args: {
		children: 'Пример текста компонента',
		size: 'md',
		color: 'primary',
	},
	parameters: story('Используйте панель Controls для настройки.'),
};

export const BlockCopy: Story<TextProps> = {
	render: () => (
		<div style={{
			display: 'flex',
			flexDirection: 'column',
			gap: 'var(--altum-g-space-2)',
			maxWidth: 360,
		}}
		>
			<Text
				as='p'
				size='lg'
				weight='medium'
			>
				Заголовок секции
			</Text>
			<Text
				as='p'
				size='sm'
				color='secondary'
			>
				Подсказка под заголовком. Без as=&quot;p&quot; два Text склеятся в одну строку.
			</Text>
		</div>
	),
	parameters: story('Блочный copy: as="p" / as="div". Дефолт as="span" — inline.'),
};

export const Colors: Story<TextProps> = {
	render: () => (
		<div style={{
			display: 'flex',
			flexDirection: 'column',
			gap: '12px'
		}}
		>
			<Text color='primary'>
				Пример: цвет primary (основной цвет ввода)
			</Text>
			<Text color='secondary'>
				Пример: цвет secondary (второстепенные надписи)
			</Text>
			<Text color='tertiary'>
				Пример: цвет tertiary (подписи, легенда)
			</Text>
			<Text color='muted'>
				Пример: цвет muted (второстепенные подсказки, метаданные)
			</Text>
			<Text color='info'>
				Пример: цвет info (справочная информация)
			</Text>
			<Text color='success'>
				Пример: цвет success (успешные отчёты)
			</Text>
			<Text color='warning'>
				Пример: цвет warning (предупреждения)
			</Text>
			<Text color='error'>
				Пример: цвет error (критические ошибки)
			</Text>
			<Text color='disabled'>
				Пример: цвет disabled (заблокированный текст)
			</Text>
		</div>
	),
	parameters: story('Все семантические цвета текста.'),
};

export const Sizes: Story<TextProps> = {
	render: () => (
		<div style={{
			display: 'flex',
			flexDirection: 'column',
			gap: '12px',
		}}
		>
			{([
				'xs',
				'sm',
				'md',
				'lg',
				'xl'
			] as const).map((size) => (
				<Text key={size} size={size}>
					Text size=
					{size}
				</Text>
			))}
			<Text weight='bold'>
				weight=bold
			</Text>
			<Text weight='medium'>
				weight=medium
			</Text>
		</div>
	),
	parameters: story('Размеры `xs`–`xl` и начертания.'),
};
