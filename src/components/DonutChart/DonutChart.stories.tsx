import type {Meta} from '@storybook/react';
import React from 'react';
import {DonutChart, DonutChartProps} from './DonutChart';
import {componentParameters, story, Story} from '../../storybook/meta';

const SEGMENTS = [
	{
		id: 'done',
		label: 'Готово',
		value: 42
	},
	{
		id: 'progress',
		label: 'В работе',
		value: 18
	},
	{
		id: 'review',
		label: 'На проверке',
		value: 9
	},
	{
		id: 'blocked',
		label: 'Заблокировано',
		value: 5
	},
];

export default {
	title: 'altum/Components/DonutChart',
	component: DonutChart,
	tags: ['autodocs'],
	parameters: componentParameters(
		'Кольцевая диаграмма. При `hoverExpand` наведение увеличивает сегмент и показывает значение в центре (также с легенды).',
	),
} satisfies Meta<typeof DonutChart>;

export const Playground: Story<DonutChartProps> = {
	render: () => (
		<DonutChart segments={SEGMENTS} />
	),
	parameters: story('Наведите на сегмент или строку легенды — enlarge + значение в центре.'),
};

export const WithCenter: Story<DonutChartProps> = {
	render: () => (
		<DonutChart
			segments={SEGMENTS}
			centerValue='74'
			centerLabel='задач'
			size={180}
		/>
	),
	parameters: story('Центр по умолчанию; при hover заменяется на значение сегмента.'),
};

export const WithoutHover: Story<DonutChartProps> = {
	render: () => (
		<DonutChart
			segments={SEGMENTS}
			centerValue='74'
			centerLabel='задач'
			hoverExpand={false}
		/>
	),
	parameters: story('Интерактив отключён (`hoverExpand={false}`).'),
};
