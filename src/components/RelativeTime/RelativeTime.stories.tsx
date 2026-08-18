import type {Meta} from '@storybook/react';
import React from 'react';
import {RelativeTime, RelativeTimeProps} from './RelativeTime';
import {Inline, Stack} from '../Layout/Layout';
import {Text} from '../Text/Text';
import {componentParameters, story, Story} from '../../storybook/meta';

const MINUTE_MS = 60 * 1000;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;

const OFFSETS = [
	{
		label: '5 минут назад',
		date: new Date(Date.now() - 5 * MINUTE_MS)
	},
	{
		label: '2 часа назад',
		date: new Date(Date.now() - 2 * HOUR_MS)
	},
	{
		label: '3 дня назад',
		date: new Date(Date.now() - 3 * DAY_MS)
	},
];

export default {
	title: 'altum-ui/Components/RelativeTime',
	component: RelativeTime,
	tags: ['autodocs'],
	parameters: componentParameters(
		'Относительное время для лент и таблиц («2 ч назад»).',
	),
} satisfies Meta<typeof RelativeTime>;

export const Playground: Story<RelativeTimeProps> = {
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
	parameters: story('Смещения от `Date.now()`: минуты, часы и дни.'),
};

export const WithPrefix: Story<RelativeTimeProps> = {
	render: () => (
		<Inline gap='sm' align='center'>
			<Text size='sm'>
				Обновлено
			</Text>
			<RelativeTime
				date={new Date(Date.now() - 2 * HOUR_MS)}
				updateInterval={0}
			/>
		</Inline>
	),
	parameters: story('Строчный с текстом — типичный паттерн в таблицах.'),
};
