import type {Meta} from '@storybook/react';
import React from 'react';
import {LineChart, LineChartProps} from './LineChart';
import {componentParameters, story, Story} from '../../storybook/meta';

export default {
	title: 'altum-ui/Components/LineChart',
	component: LineChart,
	tags: ['autodocs'],
	parameters: componentParameters('Линейный график с поддержкой нескольких наборов данных.'),
	argTypes: {},
} satisfies Meta<typeof LineChart>;

export const Playground: Story<LineChartProps> = {
	render: () => {
		const categories = [
			'Пн',
			'Вт',
			'Ср',
			'Чт',
			'Пт',
			'Сб',
			'Вс'
		];
		const datasets = [
			{
				name: 'Потребление воды (Дом)',
				color: '#3b82f6',
				data: [
					150,
					180,
					130,
					210,
					160,
					240,
					280
				],
			},
		];
		return (
			<div style={{
				maxWidth: '600px',
				backgroundColor: '#fff',
				borderRadius: '12px',
				boxShadow: '0 4px 16px rgba(0,0,0,0.05)'
			}}
			>
				<LineChart categories={categories} datasets={datasets} />
			</div>
		);
	},
	parameters: story('Используйте панель Controls для настройки.'),
};

export const DualDataset: Story<LineChartProps> = {
	render: () => {
		const categories = [
			'Пн',
			'Вт',
			'Ср',
			'Чт',
			'Пт',
			'Сб',
			'Вс'
		];
		const datasets = [
			{
				name: 'Потребление воды (Дом)',
				color: '#3b82f6',
				data: [
					150,
					180,
					130,
					210,
					160,
					240,
					280
				]
			},
			{
				name: 'Потребление воды (Офис)',
				color: '#10b981',
				data: [
					320,
					290,
					350,
					310,
					340,
					100,
					80
				]
			},
		];
		return (
			<div style={{
				maxWidth: '600px',
				backgroundColor: '#fff',
				borderRadius: '12px',
				boxShadow: '0 4px 16px rgba(0,0,0,0.05)'
			}}
			>
				<LineChart categories={categories} datasets={datasets} />
			</div>
		);
	},
	parameters: story('График с двумя наборами данных.'),
};

export const SingleDataset: Story<LineChartProps> = {
	render: () => {
		const categories = [
			'Янв',
			'Фев',
			'Мар',
			'Апр',
			'Май',
			'Июн'
		];
		const datasets = [
			{
				name: 'Расход фильтрации (Завод №1)',
				color: '#ef4444',
				data: [
					42,
					58,
					33,
					89,
					74,
					91
				]
			},
		];
		return (
			<div style={{
				maxWidth: '600px',
				backgroundColor: '#fff',
				borderRadius: '12px',
				boxShadow: '0 4px 16px rgba(0,0,0,0.05)'
			}}
			>
				<LineChart categories={categories} datasets={datasets} />
			</div>
		);
	},
	parameters: story('График с одним набором данных за полгода.'),
};
