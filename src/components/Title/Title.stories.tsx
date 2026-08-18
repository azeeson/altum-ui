import type {Meta} from '@storybook/react';
import React from 'react';
import {Title, TitleProps} from './Title';
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
		<div style={{
			display: 'flex',
			flexDirection: 'column',
			gap: '12px',
		}}
		>
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
		</div>
	),
	parameters: story('Уровни H1–H4 с разным начертанием.'),
};
