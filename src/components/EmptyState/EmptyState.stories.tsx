import type {Meta} from '@storybook/react';
import React from 'react';
import {EmptyState, EmptyStateProps} from './EmptyState';
import {Button} from '../Button/Button';
import {IconChecklist} from '../../icons/icons/IconChecklist';
import {componentParameters, story, Story} from '../../storybook/meta';

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
	},
} satisfies Meta<typeof EmptyState>;

export const Playground: Story<EmptyStateProps> = {
	args: {
		icon: <IconChecklist size={48} />,
		title: 'Пока нет задач',
		description: 'Создайте первую задачу, чтобы начать работу с проектом.',
		action: <Button variant='primary' size='sm'>
			Добавить задачу
		</Button>,
	},
	parameters: story('Используйте панель Controls для настройки.'),
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
		action: <Button variant='secondary' size='sm'>
			Сбросить фильтры
		</Button>,
	},
	parameters: story('Без иконки — только текст и действие.'),
};
