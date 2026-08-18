import type {Meta} from '@storybook/react';
import React from 'react';
import {Marker, MarkerProps} from './Marker';
import {Spinner} from '../Spinner/Spinner';
import {IconSearch} from '../../icons/icons/IconSearch';
import {componentParameters, story, Story} from '../../storybook/meta';

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
	},
} satisfies Meta<typeof Marker>;

export const Default: Story<MarkerProps> = {
	render: () => (
		<Marker>
			<Marker.Icon>
				<IconSearch size={14} />
			</Marker.Icon>
			<Marker.Content>
				Просмотрено 4 файла
			</Marker.Content>
		</Marker>
	),
	parameters: story('Базовый маркер с иконкой поиска.'),
};

export const Status: Story<MarkerProps> = {
	render: () => (
		<Marker role='status'>
			<Marker.Icon aria-hidden={false}>
				<Spinner size={14} />
			</Marker.Icon>
			<Marker.Content shimmer>
				Ищем совпадения…
			</Marker.Content>
		</Marker>
	),
	parameters: story('role=status со спиннером и shimmer-анимацией текста.'),
};

export const Separator: Story<MarkerProps> = {
	render: () => (
		<Marker variant='separator'>
			<Marker.Content>
				Сегодня
			</Marker.Content>
		</Marker>
	),
	parameters: story('Подпись на линии-разделителе.'),
};

export const NoteAndRow: Story<MarkerProps> = {
	render: () => (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				gap: 'var(--altum-g-space-3)',
				maxWidth: 360,
			}}
		>
			<Marker variant='note'>
				<Marker.Content>
					Сообщение отредактировано
				</Marker.Content>
			</Marker>
			<Marker variant='row'>
				<Marker.Icon>
					<IconSearch size={14} />
				</Marker.Icon>
				<Marker.Content>
					Найдено 12 результатов по запросу «календарь»
				</Marker.Content>
			</Marker>
		</div>
	),
	parameters: story('Варианты note (мягкий info-блок) и row (bordered строка).'),
};
