import type {Meta} from '@storybook/react';
import React from 'react';
import {EmptyState, EmptyStateProps} from './EmptyState';
import {Button} from '../Button/Button';
import {Card} from '../Card/Card';
import {Stack} from '../Layout/Layout';
import {IconChecklist} from '../../icons/icons/IconChecklist';
import {IconSearch} from '../../icons/icons/IconSearch';
import {IconInbox} from '../../icons/icons/IconInbox';
import {componentParameters, story, Story} from '../../storybook/meta';

const LONG_TITLE = 'Ничего не найдено по запросу «ежеквартальный финансовый отчёт за прошлый год»';
const LONG_DESCRIPTION = 'Попробуйте изменить фильтры, сократить поисковый запрос или сбросить все ограничения. '.repeat(3);

export default {
	title: 'altum/Components/EmptyState',
	component: EmptyState,
	tags: ['autodocs'],
	parameters: componentParameters('Заглушка для пустых списков и разделов с иконкой, текстом и действием.'),
	argTypes: {
		title: {
			control: 'text',
			description: 'Заголовок'
		},
		description: {
			control: 'text',
			description: 'Описание'
		},
		size: {
			control: {
				type: 'select',
				options: ['sm', 'md', 'lg'],
			},
			description: 'Плотность блока',
		},
	},
} satisfies Meta<typeof EmptyState>;

export const Playground: Story<EmptyStateProps> = {
	args: {
		icon: <IconChecklist size={48} />,
		title: 'Пока нет задач',
		description: 'Создайте первую задачу, чтобы начать работу с проектом.',
		action: (
			<Button variant='primary' size='sm'>
				Добавить задачу
			</Button>
		),
		size: 'md',
	},
	parameters: story('Используйте панель Controls для настройки.'),
};

export const Sizes: Story<EmptyStateProps> = {
	render: () => (
		<Stack gap='lg'>
			{(['sm', 'md', 'lg'] as const).map((size) => (
				<EmptyState
					key={size}
					size={size}
					icon={<IconInbox size={size === 'sm' ? 32 : 48} />}
					title={`Пустой список (${size})`}
					description='Размер влияет на плотность иконки и типографику.'
					action={(
						<Button
							variant='secondary'
							size='sm'
						>
							Создать
						</Button>
					)}
				/>
			))}
		</Stack>
	),
	parameters: story('Размеры sm / md / lg.'),
};

export const Minimal: Story<EmptyStateProps> = {
	args: {
		title: 'Здесь пока пусто',
	},
	parameters: story('Минимальный вариант только с заголовком.'),
};

export const WithoutIcon: Story<EmptyStateProps> = {
	args: {
		title: 'Ничего не найдено',
		description: 'Попробуйте изменить фильтры или поисковый запрос.',
		action: (
			<Button variant='secondary' size='sm'>
				Сбросить фильтры
			</Button>
		),
	},
	parameters: story('Без иконки — только текст и действие.'),
};

export const OverflowText: Story<EmptyStateProps> = {
	render: () => (
		<div style={{maxWidth: 280}}>
			<EmptyState
				icon={<IconSearch size={40} />}
				title={LONG_TITLE}
				description={LONG_DESCRIPTION}
				action={(
					<Button variant='secondary' size='sm'>
						Сбросить длинный фильтр поиска
					</Button>
				)}
			/>
		</div>
	),
	parameters: story('Длинный заголовок и описание в узком контейнере.'),
};

export const Interaction: Story<EmptyStateProps> = {
	args: {
		icon: <IconChecklist size={48} />,
		title: 'Пока нет задач',
		description: 'Создайте первую задачу, чтобы начать работу с проектом.',
		action: (
			<Button variant='primary' size='sm'>
				Добавить задачу
			</Button>
		),
	},
	play: async ({canvasElement}) => {
		const button = canvasElement.querySelector('button');
		if (!(button instanceof HTMLButtonElement)) {
			throw new Error('Не найдена кнопка EmptyState');
		}
		button.focus();
		button.click();
	},
	parameters: story('Play: фокус и клик по действию.'),
};

export const UsageExample: Story<EmptyStateProps> = {
	render: () => (
		<Card
			variant='outlined'
			header='Входящие'
			style={{maxWidth: 420}}
		>
			<EmptyState
				size='sm'
				icon={<IconInbox size={32} />}
				title='Писем нет'
				description='Новые сообщения появятся здесь.'
				action={(
					<Button variant='tinted' size='sm'>
						Написать
					</Button>
				)}
			/>
		</Card>
	),
	parameters: story('Компактный EmptyState внутри Card.'),
};
