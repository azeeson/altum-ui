import type {Meta} from '@storybook/react';
import React from 'react';
import {Title, TitleProps} from './Title';
import {Card} from '../Card/Card';
import {Inline, Stack} from '../Layout/Layout';
import {Text} from '../Text/Text';
import {Badge} from '../Badge/Badge';
import {Button} from '../Button/Button';
import {componentParameters, story, Story} from '../../storybook/meta';

export default {
	title: 'altum/Components/Title',
	component: Title,
	tags: ['autodocs'],
	parameters: componentParameters('Заголовок с уровнями H1–H4 и настройкой начертания.'),
	argTypes: {
		level: {
			control: {
				type: 'select',
				options: [
					1,
					2,
					3,
					4,
				]
			},
			description: 'Уровень заголовка',
		},
		weight: {
			control: {
				type: 'select',
				options: ['normal', 'medium', 'bold']
			},
			description: 'Начертание',
		},
		children: {
			control: 'text',
			description: 'Текст заголовка'
		},
	},
} satisfies Meta<typeof Title>;

export const Playground: Story<TitleProps> = {
	args: {
		children: 'Главный заголовок страницы (H1)',
		level: 1,
		weight: 'bold',
	},
	parameters: story('Используйте панель Controls для настройки.'),
};

export const Levels: Story<TitleProps> = {
	render: () => (
		<Stack gap='sm'>
			<Title level={1} weight='bold'>
				Главный заголовок страницы (H1)
			</Title>
			<Title level={2} weight='bold'>
				Раздел документации (H2)
			</Title>
			<Title level={3} weight='medium'>
				Подраздел настроек (H3)
			</Title>
			<Title level={4} weight='normal'>
				Метка блока формы (H4)
			</Title>
		</Stack>
	),
	parameters: story('Уровни H1–H4 с разным начертанием.'),
};

export const Weights: Story<TitleProps> = {
	render: () => (
		<Stack gap='sm'>
			<Title level={3} weight='normal'>
				normal
			</Title>
			<Title level={3} weight='medium'>
				medium
			</Title>
			<Title level={3} weight='bold'>
				bold
			</Title>
		</Stack>
	),
	parameters: story('Начертания на одном уровне H3.'),
};

export const OverflowText: Story<TitleProps> = {
	render: () => (
		<div style={{maxWidth: 240}}>
			<Title level={2}>
				Сверхдлинный заголовок раздела без пробелов-переносов: НастройкиИнтеграцийКалендаря
			</Title>
		</div>
	),
	parameters: story('Длинный заголовок в узком контейнере.'),
};

export const UsageExample: Story<TitleProps> = {
	render: () => (
		<div style={{maxWidth: 480}}>
			<Card>
				<Stack gap='sm'>
					<Inline
						gap='sm'
						align='center'
						wrap
					>
						<Title level={2}>
							Проекты команды
						</Title>
						<Badge
							label='12'
							variant='info'
							position='standalone'
							size='sm'
						/>
					</Inline>
					<Text
						as='p'
						size='sm'
						color='secondary'
					>
						Активные репозитории и статус поставки за текущий спринт.
					</Text>
					<Button size='sm'>
						Создать проект
					</Button>
				</Stack>
			</Card>
		</div>
	),
	parameters: story('Шапка страницы: Title + Badge + подзаголовок Text + действие.'),
};
