import type {Meta} from '@storybook/react';
import React from 'react';
import {DescriptionList, DescriptionListProps} from './DescriptionList';
import {Badge} from '../Badge/Badge';
import {componentParameters, story, Story} from '../../storybook/meta';

const ITEMS = [
	{
		label: 'Эл. почта',
		value: 'alex@example.com'
	},
	{
		label: 'Роль',
		value: 'Администратор'
	},
	{
		label: 'Статус',
		value: (
			<Badge variant='success'>
				Активен
			</Badge>
		)
	},
	{
		label: 'Последний вход',
		value: '15.07.2026, 14:30'
	},
];

export default {
	title: 'altum-ui/Components/DescriptionList',
	component: DescriptionList,
	tags: ['autodocs'],
	parameters: componentParameters(
		'Список описаний (key–value) для карточки сущности и read-only настроек.',
	),
	argTypes: {
		layout: {
			control: {
				type: 'select',
				options: ['stacked', 'inline']
			},
		},
		columns: {
			control: {
				type: 'select',
				options: [1, 2, 3]
			},
		},
	},
} satisfies Meta<typeof DescriptionList>;

export const Playground: Story<DescriptionListProps> = {
	args: {
		items: ITEMS,
		layout: 'stacked',
	},
	parameters: story('Подпись над значением (`layout="stacked"`).'),
};

export const Inline: Story<DescriptionListProps> = {
	args: {
		items: ITEMS,
		layout: 'inline',
	},
	parameters: story('Подпись и значение в одной строке.'),
};

export const Columns: Story<DescriptionListProps> = {
	render: () => (
		<div style={{maxWidth: 640}}>
			<DescriptionList
				items={[
					...ITEMS,
					{
						label: 'Телефон',
						value: '+7 900 123-45-67'
					},
					{
						label: 'Отдел',
						value: 'Разработка'
					},
					{
						label: 'Город',
						value: 'Москва'
					},
				]}
				layout='stacked'
				columns={2}
			/>
		</div>
	),
	parameters: story('Две колонки через `columns={2}`.'),
};
