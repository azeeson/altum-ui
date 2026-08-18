import type {Meta} from '@storybook/react';
import React from 'react';
import {BarChart, BarChartProps} from './BarChart';
import {componentParameters, story, Story} from '../../storybook/meta';

const CATEGORIES = [
	'Пн',
	'Вт',
	'Ср',
	'Чт',
	'Пт',
	'Сб',
	'Вс'
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
			25
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
			3
		],
	},
];

export default {
	title: 'altum-ui/Components/BarChart',
	component: BarChart,
	tags: ['autodocs'],
	parameters: componentParameters(
		'Столбчатый SVG-график. По умолчанию при наведении на столбец показывается его значение (`showHoverValue`).',
	),
} satisfies Meta<typeof BarChart>;

export const Playground: Story<BarChartProps> = {
	render: () => (
		<div style={{maxWidth: 560}}>
			<BarChart categories={CATEGORIES} datasets={[DATASETS[0]]} />
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
