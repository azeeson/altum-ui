import type {Meta} from '@storybook/react';
import React from 'react';
import {DescriptionList, DescriptionListProps} from './DescriptionList';
import {Badge} from '../Badge/Badge';
import {Card} from '../Card/Card';
import {Inline, Stack} from '../Layout/Layout';
import {Text} from '../Text/Text';
import {Title} from '../Title/Title';
import {Avatar} from '../Avatar/Avatar';
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
			<Badge
				variant='success'
				label='Активен'
				position='standalone'
			/>
		)
	},
	{
		label: 'Последний вход',
		value: '15.07.2026, 14:30'
	},
];

export default {
	title: 'altum/Components/DescriptionList',
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
		columns: 1,
	},
	parameters: story('Подпись над значением (`layout="stacked"`). Controls: layout, columns.'),
};

export const InlineLayout: Story<DescriptionListProps> = {
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

export const ThreeColumns: Story<DescriptionListProps> = {
	render: () => (
		<div style={{maxWidth: 720}}>
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
				columns={3}
			/>
		</div>
	),
	parameters: story('Три колонки (`columns={3}`).'),
};

export const Empty: Story<DescriptionListProps> = {
	args: {
		items: [],
	},
	parameters: story('Пустой список пар.'),
};

export const OverflowText: Story<DescriptionListProps> = {
	render: () => (
		<div style={{maxWidth: 280}}>
			<DescriptionList
				layout='stacked'
				items={[
					{
						label: 'Юридическое наименование',
						value: 'Общество с ограниченной ответственностью «Северо-Западные Интеграционные Системы»',
					},
					{
						label: 'Идентификатор',
						value: 'org_live_supercalifragilisticexpialidocious_workspace',
					},
				]}
			/>
		</div>
	),
	parameters: story('Длинные label / value в узкой колонке.'),
};

export const UsageExample: Story<DescriptionListProps> = {
	render: () => (
		<div style={{maxWidth: 440}}>
			<Card>
				<Stack gap='md'>
					<Inline gap='sm' align='center'>
						<Avatar
							name='Алексей Иванов'
							size='md'
							status='online'
						/>
						<Stack gap='none'>
							<Title level={4}>
								Алексей Иванов
							</Title>
							<Text size='xs' color='muted'>
								Профиль сотрудника
							</Text>
						</Stack>
					</Inline>
					<DescriptionList
						layout='inline'
						items={ITEMS}
					/>
				</Stack>
			</Card>
		</div>
	),
	parameters: story('Карточка профиля: аватар и inline description list.'),
};
