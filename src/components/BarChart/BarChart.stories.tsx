import type {Meta} from '@storybook/react';
import React from 'react';
import {BarChart, BarChartProps} from './BarChart';
import {Card} from '../Card/Card';
import {Stack} from '../Layout';
import {Text} from '../Text/Text';
import {componentParameters, story, Story} from '../../storybook/meta';

const CATEGORIES = [
	'Пн',
	'Вт',
	'Ср',
	'Чт',
	'Пт',
	'Сб',
	'Вс',
];

const DATASETS = [
	{
		name: 'Заказы',
		data: [
			12,
			19,
			8,
			15,
			22,
			18,
			25,
		],
	},
	{
		name: 'Возвраты',
		data: [
			2,
			3,
			1,
			4,
			2,
			5,
			3,
		],
	},
];

const LONG_CATEGORIES = [
	'Понедельник, утро',
	'Вторник, дневная смена',
	'Среда, пиковая нагрузка',
	'Четверг',
];

export default {
	title: 'altum/Components/BarChart',
	component: BarChart,
	tags: ['autodocs'],
	parameters: componentParameters(
		'Столбчатый SVG-график. По умолчанию при наведении на столбец показывается его значение (`showHoverValue`).',
	),
	argTypes: {
		height: {
			control: {
				type: 'number',
				min: 120,
				max: 480,
			},
			description: 'Высота графика, px',
		},
		showValues: {
			control: 'boolean',
			description: 'Показывать значения над столбцами всегда',
		},
		showHoverValue: {
			control: 'boolean',
			description: 'Подсказка значения при наведении',
		},
	},
} satisfies Meta<typeof BarChart>;

export const Playground: Story<BarChartProps> = {
	args: {
		height: 280,
		showValues: false,
		showHoverValue: true,
	},
	render: (args) => (
		<div style={{maxWidth: 560}}>
			<BarChart
				{...args}
				categories={CATEGORIES}
				datasets={[DATASETS[0]]}
			/>
		</div>
	),
	parameters: story('Наведите на столбец — подсказка с категорией и значением.'),
};

export const MultiSeriesHover: Story<BarChartProps> = {
	render: () => (
		<div style={{maxWidth: 560}}>
			<BarChart categories={CATEGORIES} datasets={DATASETS} />
		</div>
	),
	parameters: story('Несколько серий: в подсказке категория, имя серии и значение.'),
};

export const WithValues: Story<BarChartProps> = {
	render: () => (
		<div style={{maxWidth: 560}}>
			<BarChart
				categories={CATEGORIES}
				datasets={DATASETS}
				showValues
				showHoverValue={false}
			/>
		</div>
	),
	parameters: story('Постоянные подписи над столбцами (`showValues`), hover-подсказка выключена.'),
};

export const Sizes: Story<BarChartProps> = {
	render: () => (
		<Stack gap='lg' style={{maxWidth: 560}}>
			<BarChart
				categories={CATEGORIES}
				datasets={[DATASETS[0]]}
				height={160}
			/>
			<BarChart
				categories={CATEGORIES}
				datasets={[DATASETS[0]]}
				height={320}
			/>
		</Stack>
	),
	parameters: story('Компактная и высокая высота графика.'),
};

export const Empty: Story<BarChartProps> = {
	render: () => (
		<div style={{maxWidth: 560}}>
			<BarChart categories={[]} datasets={[]} />
		</div>
	),
	parameters: story('Пустые категории и серии.'),
};

export const OverflowText: Story<BarChartProps> = {
	render: () => (
		<div style={{maxWidth: 420}}>
			<BarChart
				categories={LONG_CATEGORIES}
				datasets={[
					{
						name: 'Очень длинное имя серии для легенды',
						data: [
							12,
							8,
							21,
							5,
						],
					},
				]}
				height={240}
			/>
		</div>
	),
	parameters: story('Длинные подписи категорий и серии.'),
};

export const Interaction: Story<BarChartProps> = {
	render: () => (
		<div style={{maxWidth: 560}}>
			<BarChart categories={CATEGORIES} datasets={[DATASETS[0]]} />
		</div>
	),
	play: async ({canvasElement}) => {
		const bar = canvasElement.querySelector('rect');
		bar?.dispatchEvent(new MouseEvent('mouseenter', {bubbles: true}));
	},
	parameters: story('Play наводит на первый столбец — hover-подсказка.'),
};

export const UsageExample: Story<BarChartProps> = {
	render: () => (
		<Card
			style={{maxWidth: 560}}
			header={(
				<Text weight='bold'>
					Заказы за неделю
				</Text>
			)}
		>
			<Stack gap='sm'>
				<Text size='sm' color='muted'>
					Сравнение заказов и возвратов.
				</Text>
				<BarChart
					categories={CATEGORIES}
					datasets={DATASETS}
					height={240}
				/>
			</Stack>
		</Card>
	),
	parameters: story('График внутри карточки дашборда.'),
};
