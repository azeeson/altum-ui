import type {Meta} from '@storybook/react';
import React, {useMemo, useState} from 'react';
import {CalendarBoard} from './CalendarBoard';
import type {CalendarBoardTask, CalendarBoardProviderProps} from './CalendarBoard.types';
import {addDays, startOfDay, startOfWeek} from '../Calendar/Calendar.utils';
import {componentParameters, story, Story} from '../../storybook/meta';
import {Text} from '../Text/Text';

function demoTasks(anchor: Date): CalendarBoardTask[] {
	const weekStart = startOfWeek(anchor, 1);
	return [
		{
			id: 'vacation',
			title: 'Отпуск',
			start: startOfDay(addDays(weekStart, 2)),
			end: startOfDay(addDays(weekStart, 9)),
			allDay: true,
			color: 'var(--altum-color-status-info)',
		},
		{
			id: 'standup',
			title: 'Стендап',
			start: new Date(
				weekStart.getFullYear(),
				weekStart.getMonth(),
				weekStart.getDate() + 1,
				9,
				0,
			),
			end: new Date(
				weekStart.getFullYear(),
				weekStart.getMonth(),
				weekStart.getDate() + 1,
				9,
				30,
			),
			color: 'var(--altum-color-status-success)',
		},
		{
			id: 'design',
			title: 'Дизайн-ревью',
			start: new Date(
				weekStart.getFullYear(),
				weekStart.getMonth(),
				weekStart.getDate() + 3,
				14,
				0,
			),
			end: new Date(
				weekStart.getFullYear(),
				weekStart.getMonth(),
				weekStart.getDate() + 3,
				16,
				0,
			),
			color: 'var(--altum-color-status-warning)',
		},
		{
			id: 'ship',
			title: 'Релиз',
			start: startOfDay(addDays(weekStart, 4)),
			end: startOfDay(addDays(weekStart, 5)),
			allDay: true,
			color: 'var(--altum-color-status-error)',
		},
	];
}

export default {
	title: 'altum/Components/CalendarBoard',
	component: CalendarBoard.Provider,
	tags: ['autodocs'],
	parameters: componentParameters(
		'Составная доска: Month / Week / Day / Year. TaskChip тянется по дням/часам; hover подсвечивает все сегменты.',
	),
} satisfies Meta<typeof CalendarBoard.Provider>;

export const Playground: Story<CalendarBoardProviderProps> = {
	render: function PlaygroundRender() {
		const [viewDate, setViewDate] = useState(() => startOfDay(new Date()));
		const tasks = useMemo(() => demoTasks(viewDate), [viewDate]);

		return (
			<CalendarBoard.Provider
				tasks={tasks}
				viewDate={viewDate}
				onViewDateChange={setViewDate}
				defaultView='month'
				onTaskClick={(task) => {
					// eslint-disable-next-line no-console -- демо-обработчик в Storybook
					console.log('task', task.id);
				}}
			>
				<CalendarBoard.Root>
					<CalendarBoard.Header>
						<CalendarBoard.Nav />
						<CalendarBoard.Title />
						<CalendarBoard.ViewSwitch />
					</CalendarBoard.Header>
					<CalendarBoard.Body />
				</CalendarBoard.Root>
			</CalendarBoard.Provider>
		);
	},
	parameters: story(
		'Наведите на «Отпуск» в месяце — подсветятся все сегменты через недели. Week/Day — timed-блоки.',
	),
};

export const WeekView: Story<CalendarBoardProviderProps> = {
	render: function WeekRender() {
		const [viewDate, setViewDate] = useState(() => startOfDay(new Date()));
		const tasks = useMemo(() => demoTasks(viewDate), [viewDate]);

		return (
			<CalendarBoard.Provider
				tasks={tasks}
				view='week'
				viewDate={viewDate}
				onViewDateChange={setViewDate}
			>
				<CalendarBoard.Root>
					<CalendarBoard.Header>
						<CalendarBoard.Nav />
						<CalendarBoard.Title />
						<CalendarBoard.ViewSwitch />
					</CalendarBoard.Header>
					<CalendarBoard.Week />
				</CalendarBoard.Root>
			</CalendarBoard.Provider>
		);
	},
	parameters: story('Неделя: колонки дней + часы, all-day bars и timed TaskChip.'),
};

export const YearView: Story<CalendarBoardProviderProps> = {
	render: function YearRender() {
		const tasks = useMemo(() => demoTasks(new Date()), []);

		return (
			<CalendarBoard.Provider tasks={tasks} defaultView='year'>
				<CalendarBoard.Root>
					<CalendarBoard.Header>
						<CalendarBoard.Nav />
						<CalendarBoard.Title />
						<CalendarBoard.ViewSwitch />
					</CalendarBoard.Header>
					<CalendarBoard.Year />
					<Text size='sm'>
						Клик по месяцу открывает Month.
					</Text>
				</CalendarBoard.Root>
			</CalendarBoard.Provider>
		);
	},
	parameters: story('Год: сетка месяцев, дни с задачами подсвечены tinted.'),
};

export const CustomTaskRender: Story<CalendarBoardProviderProps> = {
	render: function CustomRender() {
		const tasks = useMemo(() => demoTasks(new Date()), []);

		return (
			<CalendarBoard.Provider
				tasks={tasks}
				defaultView='month'
				renderTask={({task, highlighted, layout, onMouseEnter, onMouseLeave, onClick}) => (
					<button
						type='button'
						onClick={onClick}
						onMouseEnter={onMouseEnter}
						onMouseLeave={onMouseLeave}
						style={{
							width: '100%',
							height: layout === 'timed' ? '100%' : undefined,
							border: 'none',
							borderRadius: 4,
							padding: '2px 6px',
							cursor: 'pointer',
							background: highlighted
								? 'color-mix(in srgb, var(--altum-color-brand) 35%, transparent)'
								: 'color-mix(in srgb, var(--altum-color-brand) 16%, transparent)',
							color: 'var(--altum-color-brand-tint-text)',
							fontWeight: 600,
							fontSize: 11,
							textAlign: 'left',
						}}
					>
						{task.title}
						{highlighted ? ' ●' : ''}
					</button>
				)}
			>
				<CalendarBoard.Root>
					<CalendarBoard.Header>
						<CalendarBoard.Title />
						<CalendarBoard.ViewSwitch />
					</CalendarBoard.Header>
					<CalendarBoard.Body />
				</CalendarBoard.Root>
			</CalendarBoard.Provider>
		);
	},
	parameters: story('Кастомный renderTask: общий hover по id через hover-store (без перерисовки ячеек).'),
};
