import type {Meta} from '@storybook/react';
import {Timeline, TimelineProps} from './Timeline';
import {componentParameters, story, Story} from '../../storybook/meta';

export default {
	title: 'altum/Components/Timeline',
	component: Timeline,
	tags: ['autodocs'],
	parameters: componentParameters('История событий и статусов.'),
} satisfies Meta<typeof Timeline>;

export const Playground: Story<TimelineProps> = {
	args: {
		items: [
			{
				id: '1',
				title: 'Заказ создан',
				description: 'Клиент оформил заказ #1042',
				time: '10:12',
				status: 'success',
			},
			{
				id: '2',
				title: 'Оплачен',
				description: 'Списание с карты *4242',
				time: '10:14',
				status: 'info',
			},
			{
				id: '3',
				title: 'Сборка',
				description: 'На складе №2',
				time: '11:40',
				status: 'warning',
			},
			{
				id: '4',
				title: 'Отменён',
				description: 'По запросу клиента',
				time: '12:05',
				status: 'error',
			},
		],
	},
	parameters: story('Статусы заказа.'),
};

const DETAIL_ITEMS = [
	{
		id: '1',
		title: 'Заказ создан',
		description: 'Клиент оформил заказ #1042',
		time: '10:12',
		status: 'success' as const,
		details: 'IP: 192.168.0.1, браузер Chrome',
	},
	{
		id: '2',
		title: 'Оплачен',
		description: 'Списание с карты *4242',
		time: '10:14',
		status: 'info' as const,
		details: 'Идентификатор транзакции: tx_8f3a2b',
	},
	{
		id: '3',
		title: 'В доставке',
		description: 'Курьер выехал',
		time: '11:40',
		status: 'warning' as const,
	},
];

export const Horizontal: Story<TimelineProps> = {
	args: {
		orientation: 'horizontal',
		items: DETAIL_ITEMS,
		currentId: '2',
	},
	parameters: story('Горизонтальная ориентация с акцентом на текущем шаге.'),
};

export const CollapsibleDetails: Story<TimelineProps> = {
	args: {
		items: DETAIL_ITEMS,
		defaultExpandedIds: ['1'],
	},
	parameters: story('`details` раскрываются по кнопке «Подробнее».'),
};

export const CurrentId: Story<TimelineProps> = {
	args: {
		items: DETAIL_ITEMS,
		currentId: '2',
	},
	parameters: story('`currentId` — визуальный акцент на текущем пункте.'),
};
