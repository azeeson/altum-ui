import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {Calendar} from './Calendar';
import {componentParameters, story, Story} from '../../storybook/meta';

export default {
	title: 'altum-ui/Components/Calendar',
	component: Calendar.Root,
	tags: ['autodocs'],
	parameters: componentParameters(
		'Календарь: дни / месяцы / годы. Клик по месяцу или году в заголовке открывает соответствующую сетку.',
	),
	argTypes: {},
} satisfies Meta<typeof Calendar.Root>;

export const Playground: Story<typeof Calendar.Root> = {
	render: function PlaygroundRender() {
		const [date, setDate] = useState<Date>(new Date());
		return (
			<Calendar.Provider value={date} onChange={setDate}>
				<Calendar.Root>
					<Calendar.Header>
						<Calendar.Nav direction='prev' />
						<Calendar.Title />
						<Calendar.Nav direction='next' />
					</Calendar.Header>
					<Calendar.Body />
				</Calendar.Root>
			</Calendar.Provider>
		);
	},
	parameters: story(
		'Кликните название месяца → сетка месяцев (стрелки = год). Клик по году → сетка лет 4×5.',
	),
};

export const Compound: Story<typeof Calendar.Root> = {
	render: function CompoundRender() {
		const [date, setDate] = useState<Date>(new Date());
		return (
			<Calendar.Provider value={date} onChange={setDate}>
				<Calendar.Root>
					<Calendar.Header>
						<Calendar.Nav direction='prev' />
						<Calendar.Title />
						<Calendar.Nav direction='next' />
					</Calendar.Header>
					<Calendar.Body />
				</Calendar.Root>
			</Calendar.Provider>
		);
	},
	parameters: story('Сборка из частей: Header + Body.'),
};

export const GridOnly: Story<typeof Calendar.Root> = {
	render: function GridOnlyRender() {
		const [date, setDate] = useState<Date>(new Date());
		const [viewDate, setViewDate] = useState(new Date());

		return (
			<Calendar.Provider
				value={date}
				onChange={setDate}
				viewDate={viewDate}
				onViewDateChange={setViewDate}
			>
				<div style={{
					display: 'flex',
					flexDirection: 'column',
					gap: 'var(--altum-g-space-3)',
					maxWidth: 280,
				}}
				>
					<div style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
					}}
					>
						<Calendar.Nav direction='prev' />
						<Calendar.Title />
						<Calendar.Nav direction='next' />
					</div>
					<Calendar.Root>
						<Calendar.Body />
					</Calendar.Root>
				</div>
			</Calendar.Provider>
		);
	},
	parameters: story(
		'Навигация и Title вынесены из Root. Body сам переключает дни / месяцы / годы.',
	),
};
