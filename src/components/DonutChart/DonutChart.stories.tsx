import type {Meta} from '@storybook/react';
import React from 'react';
import {DonutChart, DonutChartProps} from './DonutChart';
import {Card} from '../Card/Card';
import {Inline, Stack} from '../Layout';
import {Text} from '../Text/Text';
import {componentParameters, story, Story} from '../../storybook/meta';

const SEGMENTS = [
	{
		id: 'done',
		label: 'Готово',
		value: 42,
	},
	{
		id: 'progress',
		label: 'В работе',
		value: 18,
	},
	{
		id: 'review',
		label: 'На проверке',
		value: 9,
	},
	{
		id: 'blocked',
		label: 'Заблокировано',
		value: 5,
	},
];

export default {
	title: 'altum/Components/DonutChart',
	component: DonutChart,
	tags: ['autodocs'],
	parameters: componentParameters(
		'Кольцевая диаграмма. При `hoverExpand` наведение увеличивает сегмент и показывает значение в центре (также с легенды).',
	),
	argTypes: {
		size: {
			control: {
				type: 'number',
				min: 80,
				max: 320,
			},
			description: 'Диаметр, px',
		},
		thickness: {
			control: {
				type: 'number',
				min: 8,
				max: 48,
			},
			description: 'Толщина кольца, px',
		},
		centerValue: {
			control: 'text',
			description: 'Значение в центре',
		},
		centerLabel: {
			control: 'text',
			description: 'Подпись в центре',
		},
		showLegend: {
			control: 'boolean',
			description: 'Показать легенду',
		},
		hoverExpand: {
			control: 'boolean',
			description: 'Увеличивать сегмент при наведении',
		},
	},
} satisfies Meta<typeof DonutChart>;

export const Playground: Story<DonutChartProps> = {
	args: {
		size: 160,
		thickness: 22,
		showLegend: true,
		hoverExpand: true,
	},
	render: (args) => (
		<DonutChart {...args} segments={SEGMENTS} />
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

export const WithoutLegend: Story<DonutChartProps> = {
	render: () => (
		<DonutChart
			segments={SEGMENTS}
			centerValue='74'
			centerLabel='задач'
			showLegend={false}
		/>
	),
	parameters: story('Только кольцо, без легенды.'),
};

export const Sizes: Story<DonutChartProps> = {
	render: () => (
		<Inline gap='lg' align='center'>
			<DonutChart
				segments={SEGMENTS}
				size={120}
				thickness={16}
				showLegend={false}
			/>
			<DonutChart
				segments={SEGMENTS}
				size={160}
				thickness={22}
				showLegend={false}
			/>
			<DonutChart
				segments={SEGMENTS}
				size={220}
				thickness={28}
				showLegend={false}
			/>
		</Inline>
	),
	parameters: story('Диаметры 120 / 160 / 220.'),
};

export const Empty: Story<DonutChartProps> = {
	render: () => (
		<DonutChart
			segments={[]}
			centerValue='0'
			centerLabel='нет данных'
		/>
	),
	parameters: story('Пустые сегменты.'),
};

export const OverflowText: Story<DonutChartProps> = {
	render: () => (
		<div style={{maxWidth: 360}}>
			<DonutChart
				segments={[
					{
						label: 'Очень длинная категория с уточнением статуса',
						value: 42,
					},
					{
						label: 'Ещё более длинная подпись сегмента легенды',
						value: 18,
					},
					{
						label: 'Прочее',
						value: 9,
					},
				]}
				centerValue='69'
				centerLabel='всего записей в очереди'
			/>
		</div>
	),
	parameters: story('Длинные подписи сегментов и центра.'),
};

export const Interaction: Story<DonutChartProps> = {
	render: () => (
		<DonutChart
			segments={SEGMENTS}
			centerValue='74'
			centerLabel='задач'
		/>
	),
	play: async ({canvasElement}) => {
		const segment = canvasElement.querySelector('path');
		segment?.dispatchEvent(new MouseEvent('mouseenter', {bubbles: true}));
	},
	parameters: story('Play наводит на первый сегмент.'),
};

export const UsageExample: Story<DonutChartProps> = {
	render: () => (
		<Card
			style={{maxWidth: 420}}
			header={(
				<Text weight='bold'>
					Статус задач
				</Text>
			)}
		>
			<Stack gap='sm'>
				<Text size='sm' color='muted'>
					Распределение спринта.
				</Text>
				<DonutChart
					segments={SEGMENTS}
					centerValue='74'
					centerLabel='задач'
					size={180}
				/>
			</Stack>
		</Card>
	),
	parameters: story('Диаграмма в карточке дашборда.'),
};
