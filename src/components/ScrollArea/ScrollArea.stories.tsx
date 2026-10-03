import type {Meta} from '@storybook/react';
import React from 'react';
import {ScrollArea, ScrollAreaProps} from './ScrollArea';
import {Stack} from '../Layout';
import {Text} from '../Text/Text';
import {Item} from '../Item/Item';
import {Box} from '../Box/Box';
import {componentParameters, story, Story} from '../../storybook/meta';

const rowStyle: React.CSSProperties = {
	padding: 'var(--altum-g-space-2) var(--altum-g-space-3)',
	borderBottom: '1px solid var(--altum-color-input-border)',
	whiteSpace: 'nowrap',
};

const MONTHS = [
	'Январь',
	'Февраль',
	'Март',
	'Апрель',
	'Май',
	'Июнь',
	'Июль',
	'Август',
	'Сентябрь',
	'Октябрь',
];

export default {
	title: 'altum/Components/ScrollArea',
	component: ScrollArea,
	tags: ['autodocs'],
	parameters: componentParameters(
		'Область со стилизованным скроллом (панели, меню, списки).',
	),
	argTypes: {
		orientation: {
			control: {
				type: 'select',
				options: ['y', 'x', 'both']
			},
			description: 'Оси скролла',
		},
		maxHeight: {
			control: 'number',
			description: 'Максимальная высота (px или CSS)',
		},
		maxWidth: {
			control: 'number',
			description: 'Максимальная ширина (px или CSS)',
		},
	},
} satisfies Meta<typeof ScrollArea>;

export const Playground: Story<ScrollAreaProps> = {
	render: (args) => (
		<ScrollArea {...args}>
			{Array.from({length: 24}, (_, i) => (
				<div key={i} style={rowStyle}>
					Строка списка
					{' '}
					{i + 1}
				</div>
			))}
		</ScrollArea>
	),
	args: {
		maxHeight: 200,
		orientation: 'y',
	},
	parameters: story('Вертикальный скролл длинного списка.'),
};

export const Horizontal: Story<ScrollAreaProps> = {
	render: () => (
		<ScrollArea maxWidth={320} orientation='x'>
			<div style={{
				display: 'flex',
				width: 'max-content'
			}}
			>
				{MONTHS.map((month) => (
					<div
						key={month}
						style={{
							...rowStyle,
							borderBottom: 'none',
							borderRight: '1px solid var(--altum-color-input-border)',
							minWidth: 96,
							textAlign: 'center',
						}}
					>
						{month}
					</div>
				))}
			</div>
		</ScrollArea>
	),
	parameters: story('Горизонтальный скролл (`orientation="x"`).'),
};

export const BothAxes: Story<ScrollAreaProps> = {
	render: () => (
		<ScrollArea
			maxHeight={180}
			maxWidth={280}
			orientation='both'
		>
			<div style={{
				width: 640,
				padding: 'var(--altum-g-space-3)'
			}}
			>
				<Text size='sm'>
					Широкая и высокая таблица: прокрутка по обеим осям.
					Колонка A · Колонка B · Колонка C · Колонка D · Колонка E
				</Text>
				{Array.from({length: 16}, (_, i) => (
					<div key={i} style={rowStyle}>
						Строка
						{' '}
						{i + 1}
						{' '}
						— длинное содержимое, которое не помещается по ширине контейнера
					</div>
				))}
			</div>
		</ScrollArea>
	),
	parameters: story('`orientation="both"` — вертикаль и горизонталь.'),
};

export const Empty: Story<ScrollAreaProps> = {
	render: () => (
		<ScrollArea maxHeight={160}>
			<Text
				size='sm'
				color='muted'
				style={{padding: 'var(--altum-g-space-4)'}}
			>
				Список пуст
			</Text>
		</ScrollArea>
	),
	parameters: story('Короткий контент — скролл не появляется.'),
};

export const UsageExample: Story<ScrollAreaProps> = {
	render: () => (
		<Box
			variant='outlined'
			style={{maxWidth: 360}}
		>
			<Stack gap='none'>
				<div style={{padding: 'var(--altum-g-space-3)'}}>
					<Text size='sm' weight='bold'>
						Участники
					</Text>
				</div>
				<ScrollArea maxHeight={220}>
					{[
						'Алексей Иванов',
						'Мария Сидорова',
						'Пётр Петров',
						'Елена Козлова',
						'Дмитрий Смирнов',
						'Ольга Новикова',
						'Игорь Волков',
						'Анна Морозова',
					].map((name) => (
						<Item
							key={name}
							size='sm'
							title={name}
							description='Инженерия'
						/>
					))}
				</ScrollArea>
			</Stack>
		</Box>
	),
	parameters: story('Список `Item` внутри панели со стилизованным скроллом.'),
};
