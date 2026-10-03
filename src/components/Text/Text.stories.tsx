import type {Meta} from '@storybook/react';
import React from 'react';
import {Text, TextProps} from './Text';
import {Card} from '../Card/Card';
import {Stack} from '../Layout';
import {Title} from '../Title/Title';
import {Link} from '../Link/Link';
import {componentParameters, story, Story} from '../../storybook/meta';

const SIZES = [
	'xs',
	'sm',
	'md',
	'lg',
	'xl'
] as const;

const WEIGHTS = [
	'normal',
	'medium',
	'semibold',
	'bold'
] as const;

const COLORS = [
	'primary',
	'secondary',
	'tertiary',
	'muted',
	'info',
	'success',
	'warning',
	'error',
	'disabled'
] as const;

export default {
	title: 'altum/Components/Text',
	component: Text,
	tags: ['autodocs'],
	parameters: componentParameters('Текстовый элемент с размерами, начертаниями и семантическими цветами.'),
	argTypes: {
		size: {
			control: {
				type: 'select',
				options: [...SIZES]
			},
			description: 'Размер текста',
		},
		weight: {
			control: {
				type: 'select',
				options: [...WEIGHTS]
			},
			description: 'Начертание',
		},
		color: {
			control: {
				type: 'select',
				options: [...COLORS]
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
		weight: 'normal',
		as: 'span',
	},
	parameters: story('Используйте панель Controls для настройки.'),
};

export const BlockCopy: Story<TextProps> = {
	render: () => (
		<Stack gap='xs' style={{maxWidth: 360}}>
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
		</Stack>
	),
	parameters: story('Блочный copy: as="p" / as="div". Дефолт as="span" — inline.'),
};

export const Colors: Story<TextProps> = {
	render: () => (
		<Stack gap='sm'>
			{COLORS.map((color) => (
				<Text key={color} color={color}>
					Пример: цвет
					{' '}
					{color}
				</Text>
			))}
		</Stack>
	),
	parameters: story('Все семантические цвета текста.'),
};

export const Sizes: Story<TextProps> = {
	render: () => (
		<Stack gap='sm'>
			{SIZES.map((size) => (
				<Text key={size} size={size}>
					Text size=
					{size}
				</Text>
			))}
			{WEIGHTS.map((weight) => (
				<Text key={weight} weight={weight}>
					weight=
					{weight}
				</Text>
			))}
		</Stack>
	),
	parameters: story('Размеры `xs`–`xl` и начертания, включая `semibold`.'),
};

export const OverflowText: Story<TextProps> = {
	render: () => (
		<div style={{maxWidth: 220}}>
			<Text as='p' size='sm'>
				Длинный абзац в узкой колонке: идентификатор SUPERCALENDAR_INTEGRATION_TOKEN_V3
				должен переноситься, а не выталкивать соседние блоки.
			</Text>
		</div>
	),
	parameters: story('Перенос длинного текста в узком контейнере.'),
};

export const UsageExample: Story<TextProps> = {
	render: () => (
		<div style={{maxWidth: 420}}>
			<Card>
				<Stack gap='sm'>
					<Title level={3}>
						Политика хранения
					</Title>
					<Text
						as='p'
						size='sm'
						color='secondary'
					>
						Логи хранятся 30 дней, затем архивируются. Персональные данные
						удаляются по запросу в течение 14 дней.
					</Text>
					<Text
						as='p'
						size='xs'
						color='muted'
					>
						Подробнее — в
						{' '}
						<Link
							href='#'
							variant='primary'
							size='sm'
						>
							справке по безопасности
						</Link>
						.
					</Text>
				</Stack>
			</Card>
		</div>
	),
	parameters: story('Статья в карточке: Title, абзац и ссылка внутри Text.'),
};
