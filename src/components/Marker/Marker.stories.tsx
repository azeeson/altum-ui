import type {Meta} from '@storybook/react';
import React from 'react';
import {Marker, MarkerProps} from './Marker';
import {Card} from '../Card/Card';
import {Stack} from '../Layout/Layout';
import {Text} from '../Text/Text';
import {Spinner} from '../Spinner/Spinner';
import {IconSearch} from '../../icons/icons/IconSearch';
import {componentParameters, story, Story} from '../../storybook/meta';

const LONG_TEXT = 'Найдено 128 результатов по очень длинному запросу «ежеквартальный финансовый отчёт с приложениями»';

export default {
	title: 'altum/Components/Marker',
	component: Marker,
	tags: ['autodocs'],
	parameters: componentParameters(
		'Inline-маркер в ленте: статус, системная заметка, bordered-row или labeled separator.',
	),
	argTypes: {
		variant: {
			control: {
				type: 'select',
				options: [
					'default',
					'separator',
					'note',
					'row'
				],
			},
			description: 'Внешний вид маркера',
		},
		shimmer: {
			control: 'boolean',
			description: 'Мерцание текста (loading / searching)',
		},
		children: {
			control: 'text',
			description: 'Текст маркера',
		},
	},
} satisfies Meta<typeof Marker>;

export const Playground: Story<MarkerProps> = {
	args: {
		variant: 'default',
		shimmer: false,
		children: 'Просмотрено 4 файла',
	},
	render: (args) => (
		<Marker
			{...args}
			icon={args.icon ?? <IconSearch size={14} />}
		>
			{args.children}
		</Marker>
	),
	parameters: story('Базовый маркер с иконкой поиска. Controls меняют variant / shimmer / текст.'),
};

export const Status: Story<MarkerProps> = {
	render: () => (
		<Marker
			role='status'
			icon={<Spinner size={14} />}
			shimmer
		>
			Ищем совпадения…
		</Marker>
	),
	parameters: story('role=status со спиннером и shimmer-анимацией текста.'),
};

export const Separator: Story<MarkerProps> = {
	render: () => (
		<Marker variant='separator'>
			Сегодня
		</Marker>
	),
	parameters: story('Подпись на линии-разделителе.'),
};

export const NoteAndRow: Story<MarkerProps> = {
	render: () => (
		<Stack gap='sm' style={{maxWidth: 360}}>
			<Marker variant='note'>
				Сообщение отредактировано
			</Marker>
			<Marker variant='row' icon={<IconSearch size={14} />}>
				Найдено 12 результатов по запросу «календарь»
			</Marker>
		</Stack>
	),
	parameters: story('Варианты note (мягкий info-блок) и row (bordered строка).'),
};

export const Variants: Story<MarkerProps> = {
	render: () => (
		<Stack gap='sm' style={{maxWidth: 360}}>
			<Marker variant='default' icon={<IconSearch size={14} />}>
				default
			</Marker>
			<Marker variant='separator'>
				separator
			</Marker>
			<Marker variant='note'>
				note
			</Marker>
			<Marker variant='row' icon={<IconSearch size={14} />}>
				row
			</Marker>
		</Stack>
	),
	parameters: story('Все визуальные варианты рядом.'),
};

export const OverflowText: Story<MarkerProps> = {
	render: () => (
		<div style={{maxWidth: 280}}>
			<Marker
				variant='row'
				icon={<IconSearch size={14} />}
			>
				{LONG_TEXT}
			</Marker>
		</div>
	),
	parameters: story('Длинный текст в узкой колонке.'),
};

export const UsageExample: Story<MarkerProps> = {
	render: () => (
		<Card
			variant='outlined'
			header={(
				<Text weight='bold'>
					Лента
				</Text>
			)}
			style={{maxWidth: 400}}
		>
			<Stack gap='sm'>
				<Text size='sm'>
					Файл contract.pdf добавлен в проект.
				</Text>
				<Marker variant='separator'>
					Сегодня
				</Marker>
				<Text size='sm'>
					Комментарий от Анны.
				</Text>
				<Marker
					variant='note'
					icon={<IconSearch size={14} />}
				>
					Системная заметка: индекс обновлён
				</Marker>
			</Stack>
		</Card>
	),
	parameters: story('Маркеры как разделители и системные заметки в ленте Card.'),
};
