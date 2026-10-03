import type {Meta} from '@storybook/react';
import React from 'react';
import {Timeline, TimelineProps} from './Timeline';
import {Card} from '../Card/Card';
import {Stack} from '../Layout';
import {Text} from '../Text/Text';
import {Title} from '../Title/Title';
import {componentParameters, story, Story} from '../../storybook/meta';
import {playClick} from '../../storybook/play';

const ORDER_ITEMS = [
	{
		id: '1',
		title: 'Заказ создан',
		description: 'Клиент оформил заказ #1042',
		time: '10:12',
		status: 'success' as const,
	},
	{
		id: '2',
		title: 'Оплачен',
		description: 'Списание с карты *4242',
		time: '10:14',
		status: 'info' as const,
	},
	{
		id: '3',
		title: 'Сборка',
		description: 'На складе №2',
		time: '11:40',
		status: 'warning' as const,
	},
	{
		id: '4',
		title: 'Отменён',
		description: 'По запросу клиента',
		time: '12:05',
		status: 'error' as const,
	},
];

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

export default {
	title: 'altum/Components/Timeline',
	component: Timeline,
	tags: ['autodocs'],
	parameters: componentParameters('История событий и статусов.'),
	argTypes: {
		orientation: {
			control: {
				type: 'select',
				options: ['vertical', 'horizontal'],
			},
		},
		currentId: {
			control: 'text',
			description: 'Id текущего шага',
		},
	},
} satisfies Meta<typeof Timeline>;

export const Playground: Story<TimelineProps> = {
	args: {
		orientation: 'vertical',
		items: ORDER_ITEMS,
	},
	parameters: story('Статусы заказа. Controls: orientation, currentId.'),
};

export const Statuses: Story<TimelineProps> = {
	args: {
		items: [
			{
				id: 'd',
				title: 'Ожидание',
				description: 'Без акцента',
				time: '09:00',
				status: 'default',
			},
			...ORDER_ITEMS,
		],
	},
	parameters: story('Все статусы точки: default / success / info / warning / error.'),
};

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
	parameters: story('`details` раскрываются нативным `<details>` / `<summary>`.'),
};

export const CurrentId: Story<TimelineProps> = {
	args: {
		items: DETAIL_ITEMS,
		currentId: '2',
	},
	parameters: story('`currentId` — визуальный акцент на текущем пункте.'),
};

export const Empty: Story<TimelineProps> = {
	args: {
		items: [],
	},
	parameters: story('Пустой список событий.'),
};

export const OverflowText: Story<TimelineProps> = {
	args: {
		items: [
			{
				id: '1',
				title: 'Клиент запросил перенос доставки на следующий календарный месяц из‑за отсутствия получателя',
				description: 'Комментарий: «Буду в командировке до конца квартала, пожалуйста оставьте заказ на складе партнёра».',
				time: 'вчера, 18:42',
				status: 'warning',
				details: 'Тикет SUP-9182, менеджер: Анна К., склад: Москва-Юг, ячейка B-14.',
			},
		],
	},
	parameters: story('Длинные title / description / time в одном пункте.'),
};

export const Interaction: Story<TimelineProps> = {
	args: {
		items: DETAIL_ITEMS,
	},
	play: async ({canvasElement}) => {
		await playClick(canvasElement, 'summary');
	},
	parameters: story('Play: раскрыть первую секцию details.'),
};

export const UsageExample: Story<TimelineProps> = {
	render: () => (
		<div style={{maxWidth: 440}}>
			<Card
				header={(
					<Stack gap='none'>
						<Title level={4}>
							Заказ #1042
						</Title>
						<Text size='xs' color='muted'>
							История статусов
						</Text>
					</Stack>
				)}
			>
				<Timeline
					items={DETAIL_ITEMS}
					currentId='2'
					defaultExpandedIds={['2']}
				/>
			</Card>
		</div>
	),
	parameters: story('Таймлайн внутри карточки заказа.'),
};
