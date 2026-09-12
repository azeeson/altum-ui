import type {Meta} from '@storybook/react';
import React from 'react';
import {RelativeTime, RelativeTimeProps} from './RelativeTime';
import {Inline, Stack} from '../Layout/Layout';
import {Text} from '../Text/Text';
import {Item} from '../Item/Item';
import {Card} from '../Card/Card';
import {componentParameters, story, Story} from '../../storybook/meta';

const MINUTE_MS = 60 * 1000;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;
const NOW = Date.now();

const OFFSETS = [
	{
		label: '5 минут назад',
		date: new Date(NOW - 5 * MINUTE_MS)
	},
	{
		label: '2 часа назад',
		date: new Date(NOW - 2 * HOUR_MS)
	},
	{
		label: '3 дня назад',
		date: new Date(NOW - 3 * DAY_MS)
	},
	{
		label: 'через час',
		date: new Date(NOW + HOUR_MS)
	},
];

export default {
	title: 'altum/Components/RelativeTime',
	component: RelativeTime,
	tags: ['autodocs'],
	parameters: componentParameters(
		'Относительное время для лент и таблиц («2 ч назад»).',
	),
	argTypes: {
		date: {
			control: 'date',
			description: 'Дата события (Date | string | number)',
		},
		locale: {
			control: {
				type: 'select',
				options: ['ru-RU', 'en-US', 'de-DE'],
			},
			description: 'Локаль Intl.RelativeTimeFormat',
		},
		updateInterval: {
			control: 'number',
			description: 'Интервал пересчёта (мс). 0 — без автообновления',
		},
		showAbsoluteTitle: {
			control: 'boolean',
			description: 'Абсолютный tooltip (title)',
		},
	},
} satisfies Meta<typeof RelativeTime>;

export const Playground: Story<RelativeTimeProps> = {
	args: {
		date: NOW - 2 * HOUR_MS,
		locale: 'ru-RU',
		updateInterval: 0,
		showAbsoluteTitle: true,
	},
	parameters: story('Controls: дата, локаль, интервал и tooltip.'),
};

export const Offsets: Story<RelativeTimeProps> = {
	render: () => (
		<Stack gap='sm'>
			{OFFSETS.map((item) => (
				<Inline
					key={item.label}
					gap='sm'
					align='center'
				>
					<span style={{minWidth: 140}}>
						<Text size='sm'>
							{item.label}
							:
						</Text>
					</span>
					<RelativeTime date={item.date} updateInterval={0} />
				</Inline>
			))}
		</Stack>
	),
	parameters: story('Минуты, часы, дни и будущее смещение.'),
};

export const Locales: Story<RelativeTimeProps> = {
	render: () => (
		<Stack gap='sm'>
			{(['ru-RU', 'en-US'] as const).map((locale) => (
				<Inline
					key={locale}
					gap='sm'
					align='center'
				>
					<Text size='sm' style={{minWidth: 64}}>
						{locale}
					</Text>
					<RelativeTime
						date={NOW - 2 * HOUR_MS}
						locale={locale}
						updateInterval={0}
					/>
				</Inline>
			))}
		</Stack>
	),
	parameters: story('Одна дата в `ru-RU` и `en-US`.'),
};

export const InvalidDate: Story<RelativeTimeProps> = {
	render: () => (
		<Inline gap='sm' align='center'>
			<Text size='sm'>
				Нет даты:
			</Text>
			<RelativeTime date='not-a-date' updateInterval={0} />
		</Inline>
	),
	parameters: story('Невалидная дата рендерится как «—».'),
};

export const UsageExample: Story<RelativeTimeProps> = {
	render: () => (
		<Card style={{maxWidth: 400}}>
			<Stack gap='sm'>
				<Item
					title='Отчёт сверки'
					description={(
						<Inline gap='xs' align='center'>
							<Text size='sm' color='muted'>
								Обновлено
							</Text>
							<RelativeTime
								date={NOW - 2 * HOUR_MS}
								updateInterval={0}
							/>
						</Inline>
					)}
				/>
				<Item
					title='Комментарий Марии'
					description={(
						<RelativeTime
							date={NOW - 5 * MINUTE_MS}
							updateInterval={0}
						/>
					)}
				/>
			</Stack>
		</Card>
	),
	parameters: story('Относительное время в строках списка внутри карточки.'),
};
