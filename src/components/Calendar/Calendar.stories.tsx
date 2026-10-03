import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {Calendar} from './Calendar';
import type {CalendarProviderProps, DateRangeValue} from './Calendar.types';
import {addDays} from './Calendar.utils';
import {Card} from '../Card/Card';
import {Stack} from '../Layout';
import {Text} from '../Text/Text';
import {Button} from '../Button/Button';
import {componentParameters, story, Story} from '../../storybook/meta';
import {playClick} from '../../storybook/play';

const STORY_DATE = new Date(2026, 8, 8);

function CalendarChrome() {
	return (
		<Calendar.Root>
			<Calendar.Header>
				<Calendar.Nav direction='prev' />
				<Calendar.Title />
				<Calendar.Nav direction='next' />
			</Calendar.Header>
			<Calendar.Body />
		</Calendar.Root>
	);
}

export default {
	title: 'altum/Components/Calendar',
	component: Calendar.Provider,
	tags: ['autodocs'],
	parameters: componentParameters(
		'Календарь: дни / месяцы / годы. Клик по месяцу или году в заголовке открывает соответствующую сетку.',
	),
	argTypes: {
		selectionMode: {
			control: {
				type: 'select',
				options: ['single', 'range',],
			},
			description: 'Режим выбора: одна дата или диапазон',
		},
		onChange: {
			action: 'change',
			description: 'Колбэк выбранной даты или диапазона',
		},
	},
} satisfies Meta<typeof Calendar.Provider>;

export const Playground: Story<CalendarProviderProps> = {
	args: {
		selectionMode: 'single',
	},
	render: function PlaygroundRender({selectionMode}) {
		const [date, setDate] = useState<Date>(STORY_DATE);
		const [range, setRange] = useState<DateRangeValue>({
			start: STORY_DATE,
			end: addDays(STORY_DATE, 3),
		});
		const isRange = selectionMode === 'range';
		return (
			<Calendar.Provider
				selectionMode={selectionMode}
				value={isRange ? range : date}
				onChange={(next) => {
					if (next instanceof Date) setDate(next);
					else setRange(next);
				}}
			>
				<CalendarChrome />
			</Calendar.Provider>
		);
	},
	parameters: story(
		'Кликните название месяца → сетка месяцев (стрелки = год). Клик по году → сетка лет 4×5.',
	),
};

export const Compound: Story<typeof Calendar.Root> = {
	render: function CompoundRender() {
		const [date, setDate] = useState<Date>(STORY_DATE);
		return (
			<Calendar.Provider
				value={date}
				onChange={(next) => {
					if (next instanceof Date) setDate(next);
				}}
			>
				<CalendarChrome />
			</Calendar.Provider>
		);
	},
	parameters: story('Сборка из частей: Header + Body.'),
};

export const GridOnly: Story<typeof Calendar.Root> = {
	render: function GridOnlyRender() {
		const [date, setDate] = useState<Date>(STORY_DATE);
		const [viewDate, setViewDate] = useState(STORY_DATE);

		return (
			<Calendar.Provider
				value={date}
				onChange={(next) => {
					if (next instanceof Date) setDate(next);
				}}
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

export const Range: Story<typeof Calendar.Root> = {
	render: function RangeRender() {
		const [range, setRange] = useState<DateRangeValue>({
			start: STORY_DATE,
			end: addDays(STORY_DATE, 4),
		});

		return (
			<Stack gap='md' style={{maxWidth: 280}}>
				<Calendar.Provider
					selectionMode='range'
					value={range}
					onChange={(next) => {
						if (!(next instanceof Date)) setRange(next);
					}}
				>
					<CalendarChrome />
				</Calendar.Provider>
				<Text size='sm' color='muted'>
					{range.start?.getDate() ?? '—'}
					{' '}
					–
					{' '}
					{range.end?.getDate() ?? '—'}
				</Text>
			</Stack>
		);
	},
	parameters: story('`selectionMode="range"` — выбор интервала дат.'),
};

export const CustomDay: Story<typeof Calendar.Root> = {
	render: function CustomDayRender() {
		const [date, setDate] = useState<Date>(STORY_DATE);
		return (
			<Calendar.Provider
				value={date}
				onChange={(next) => {
					if (next instanceof Date) setDate(next);
				}}
				renderDayCell={({day, isSelected, isToday}) => (
					<span style={{
						fontWeight: isSelected || isToday ? 600 : 400,
						textDecoration: isToday ? 'underline' : undefined,
					}}
					>
						{day}
					</span>
				)}
			>
				<CalendarChrome />
			</Calendar.Provider>
		);
	},
	parameters: story('Кастомная ячейка дня через `renderDayCell`.'),
};

export const Interaction: Story<typeof Calendar.Root> = {
	render: function InteractionRender() {
		const [date, setDate] = useState<Date>(STORY_DATE);
		return (
			<Calendar.Provider
				value={date}
				onChange={(next) => {
					if (next instanceof Date) setDate(next);
				}}
			>
				<CalendarChrome />
			</Calendar.Provider>
		);
	},
	play: async ({canvasElement}) => {
		await playClick(canvasElement, '[aria-label="Следующий месяц"]');
	},
	parameters: story('Play переходит к следующему месяцу.'),
};

export const UsageExample: Story<typeof Calendar.Root> = {
	render: function UsageExampleRender() {
		const [date, setDate] = useState<Date>(STORY_DATE);
		return (
			<Card
				style={{maxWidth: 320}}
				header={(
					<Text weight='bold'>
						Дата отчёта
					</Text>
				)}
			>
				<Stack gap='md'>
					<Calendar.Provider
						value={date}
						onChange={(next) => {
							if (next instanceof Date) setDate(next);
						}}
					>
						<CalendarChrome />
					</Calendar.Provider>
					<Text size='sm'>
						Выбрано:
						{' '}
						{date.toLocaleDateString('ru-RU')}
					</Text>
					<Button size='sm' variant='primary'>
						Применить
					</Button>
				</Stack>
			</Card>
		);
	},
	parameters: story('Календарь в карточке выбора даты отчёта.'),
};
