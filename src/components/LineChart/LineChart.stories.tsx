import type {Meta} from '@storybook/react';
import React from 'react';
import {LineChart, LineChartProps} from './LineChart';
import {Card} from '../Card/Card';
import {Stack} from '../Layout';
import {Text} from '../Text/Text';
import {componentParameters, story, Story} from '../../storybook/meta';

const WEEK = [
	'Пн',
	'Вт',
	'Ср',
	'Чт',
	'Пт',
	'Сб',
	'Вс',
];

const MONTHS = [
	'Янв',
	'Фев',
	'Мар',
	'Апр',
	'Май',
	'Июн',
];

const HOME_SERIES = {
	name: 'Потребление воды (Дом)',
	color: 'var(--altum-color-brand)',
	data: [
		150,
		180,
		130,
		210,
		160,
		240,
		280,
	],
};

const OFFICE_SERIES = {
	name: 'Потребление воды (Офис)',
	color: 'var(--altum-color-status-success)',
	data: [
		320,
		290,
		350,
		310,
		340,
		100,
		80,
	],
};

export default {
	title: 'altum/Components/LineChart',
	component: LineChart,
	tags: ['autodocs'],
	parameters: componentParameters('Линейный график с поддержкой нескольких наборов данных.'),
	argTypes: {
		height: {
			control: {
				type: 'number',
				min: 120,
				max: 480,
			},
			description: 'Высота графика, px',
		},
	},
} satisfies Meta<typeof LineChart>;

export const Playground: Story<LineChartProps> = {
	args: {
		height: 300,
	},
	render: (args) => (
		<div style={{maxWidth: 600}}>
			<LineChart
				{...args}
				categories={WEEK}
				datasets={[HOME_SERIES]}
			/>
		</div>
	),
	parameters: story('Используйте панель Controls для настройки высоты.'),
};

export const DualDataset: Story<LineChartProps> = {
	render: () => (
		<div style={{maxWidth: 600}}>
			<LineChart
				categories={WEEK}
				datasets={[HOME_SERIES, OFFICE_SERIES,]}
			/>
		</div>
	),
	parameters: story('График с двумя наборами данных.'),
};

export const SingleDataset: Story<LineChartProps> = {
	render: () => (
		<div style={{maxWidth: 600}}>
			<LineChart
				categories={MONTHS}
				datasets={[
					{
						name: 'Расход фильтрации (Завод №1)',
						color: 'var(--altum-color-status-error)',
						data: [
							42,
							58,
							33,
							89,
							74,
							91,
						],
					},
				]}
			/>
		</div>
	),
	parameters: story('График с одним набором данных за полгода.'),
};

export const Sizes: Story<LineChartProps> = {
	render: () => (
		<Stack gap='lg' style={{maxWidth: 600}}>
			<LineChart
				categories={WEEK}
				datasets={[HOME_SERIES]}
				height={160}
			/>
			<LineChart
				categories={WEEK}
				datasets={[HOME_SERIES]}
				height={320}
			/>
		</Stack>
	),
	parameters: story('Компактная и высокая высота графика.'),
};

export const Empty: Story<LineChartProps> = {
	render: () => (
		<div style={{maxWidth: 600}}>
			<LineChart categories={[]} datasets={[]} />
		</div>
	),
	parameters: story('Пустые категории и серии.'),
};

export const OverflowText: Story<LineChartProps> = {
	render: () => (
		<div style={{maxWidth: 420}}>
			<LineChart
				categories={[
					'Январь, факт',
					'Февраль, прогноз',
					'Март, корректировка',
					'Апрель',
				]}
				datasets={[
					{
						name: 'Очень длинное имя серии потребления',
						color: 'var(--altum-color-brand)',
						data: [
							42,
							58,
							33,
							89,
						],
					},
				]}
				height={240}
			/>
		</div>
	),
	parameters: story('Длинные подписи категорий и серии.'),
};

export const Interaction: Story<LineChartProps> = {
	render: () => (
		<div style={{maxWidth: 600}}>
			<LineChart categories={WEEK} datasets={[HOME_SERIES]} />
		</div>
	),
	play: async ({canvasElement}) => {
		const point = canvasElement.querySelector('circle, path');
		point?.dispatchEvent(new MouseEvent('mouseenter', {bubbles: true}));
	},
	parameters: story('Play наводит на точку/линию графика.'),
};

export const UsageExample: Story<LineChartProps> = {
	render: () => (
		<Card
			style={{maxWidth: 600}}
			header={(
				<Text weight='bold'>
					Потребление воды
				</Text>
			)}
		>
			<Stack gap='sm'>
				<Text size='sm' color='muted'>
					Дом и офис за неделю.
				</Text>
				<LineChart
					categories={WEEK}
					datasets={[HOME_SERIES, OFFICE_SERIES,]}
					height={240}
				/>
			</Stack>
		</Card>
	),
	parameters: story('График внутри карточки дашборда.'),
};
