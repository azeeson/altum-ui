import type {Meta} from '@storybook/react';
import React, {useMemo, useState} from 'react';
import {CalendarBoard} from './CalendarBoard';
import type {CalendarBoardTask, CalendarBoardProviderProps} from './CalendarBoard.types';
import {addDays, startOfDay, startOfWeek} from '../Calendar/Calendar.utils';
import {Card} from '../Card/Card';
import {Stack} from '../Layout/Layout';
import {Text} from '../Text/Text';
import {EmptyState} from '../EmptyState/EmptyState';
import {componentParameters, story, Story} from '../../storybook/meta';

const STORY_DATE = startOfDay(new Date(2026, 8, 8));

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

function BoardChrome() {
	return (
		<CalendarBoard.Root>
			<CalendarBoard.Header>
				<CalendarBoard.Nav />
				<CalendarBoard.Title />
				<CalendarBoard.ViewSwitch />
			</CalendarBoard.Header>
			<CalendarBoard.Body />
		</CalendarBoard.Root>
	);
}

export default {
	title: 'altum/Components/CalendarBoard',
	component: CalendarBoard.Provider,
	tags: ['autodocs'],
	parameters: componentParameters(
		'Составная доска: Month / Week / Day / Year. TaskChip тянется по дням/часам; hover подсвечивает все сегменты.',
	),
	argTypes: {
		defaultView: {
			control: {
				type: 'select',
				options: [
					'month',
					'week',
					'day',
					'year',
				],
			},
			description: 'Начальный вид доски',
		},
		weekStartsOn: {
			control: {
				type: 'radio',
				options: [0, 1,],
			},
			description: 'Начало недели: 0 = вс, 1 = пн',
		},
		hourHeight: {
			control: 'number',
			description: 'Высота часа в week/day, px',
		},
		onTaskClick: {
			action: 'taskClick',
			description: 'Колбэк клика по задаче',
		},
		onViewChange: {
			action: 'viewChange',
			description: 'Колбэк смены вида',
		},
	},
} satisfies Meta<typeof CalendarBoard.Provider>;

export const Playground: Story<CalendarBoardProviderProps> = {
	args: {
		defaultView: 'month',
		weekStartsOn: 1,
	},
	render: function PlaygroundRender({defaultView, weekStartsOn}) {
		const [viewDate, setViewDate] = useState(() => STORY_DATE);
		const tasks = useMemo(() => demoTasks(viewDate), [viewDate]);

		return (
			<CalendarBoard.Provider
				key={String(defaultView)}
				tasks={tasks}
				viewDate={viewDate}
				onViewDateChange={setViewDate}
				defaultView={defaultView}
				weekStartsOn={weekStartsOn}
				onTaskClick={(task) => {
					// eslint-disable-next-line no-console -- демо-обработчик в Storybook
					console.log('task', task.id);
				}}
			>
				<BoardChrome />
			</CalendarBoard.Provider>
		);
	},
	parameters: story(
		'Наведите на «Отпуск» в месяце — подсветятся все сегменты через недели. Week/Day — timed-блоки.',
	),
};

export const WeekView: Story<CalendarBoardProviderProps> = {
	render: function WeekRender() {
		const [viewDate, setViewDate] = useState(() => STORY_DATE);
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

export const DayView: Story<CalendarBoardProviderProps> = {
	render: function DayRender() {
		const [viewDate, setViewDate] = useState(() => STORY_DATE);
		const tasks = useMemo(() => demoTasks(viewDate), [viewDate]);

		return (
			<CalendarBoard.Provider
				tasks={tasks}
				view='day'
				viewDate={viewDate}
				onViewDateChange={setViewDate}
			>
				<CalendarBoard.Root>
					<CalendarBoard.Header>
						<CalendarBoard.Nav />
						<CalendarBoard.Title />
						<CalendarBoard.ViewSwitch />
					</CalendarBoard.Header>
					<CalendarBoard.Day />
				</CalendarBoard.Root>
			</CalendarBoard.Provider>
		);
	},
	parameters: story('День: ось часов и timed-события выбранной даты.'),
};

export const YearView: Story<CalendarBoardProviderProps> = {
	render: function YearRender() {
		const tasks = useMemo(() => demoTasks(STORY_DATE), []);

		return (
			<CalendarBoard.Provider
				tasks={tasks}
				defaultView='year'
				defaultViewDate={STORY_DATE}
			>
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

export const Empty: Story<CalendarBoardProviderProps> = {
	render: () => (
		<Stack gap='md'>
			<CalendarBoard.Provider
				tasks={[]}
				defaultView='month'
				defaultViewDate={STORY_DATE}
			>
				<BoardChrome />
			</CalendarBoard.Provider>
			<EmptyState
				size='sm'
				title='Нет событий'
				description='Добавьте задачу, чтобы она появилась на доске.'
			/>
		</Stack>
	),
	parameters: story('Доска без задач.'),
};

export const OverflowText: Story<CalendarBoardProviderProps> = {
	render: function OverflowRender() {
		const tasks = useMemo((): CalendarBoardTask[] => {
			const weekStart = startOfWeek(STORY_DATE, 1);
			return [
				{
					id: 'long',
					title: 'Очень длинное название события, которое не помещается в ячейку дня',
					start: startOfDay(addDays(weekStart, 1)),
					end: startOfDay(addDays(weekStart, 3)),
					allDay: true,
					color: 'var(--altum-color-status-info)',
				},
			];
		}, []);

		return (
			<CalendarBoard.Provider
				tasks={tasks}
				defaultView='month'
				defaultViewDate={STORY_DATE}
			>
				<BoardChrome />
			</CalendarBoard.Provider>
		);
	},
	parameters: story('Длинный заголовок задачи в ячейке месяца.'),
};

export const CustomTaskRender: Story<CalendarBoardProviderProps> = {
	render: function CustomRender() {
		const tasks = useMemo(() => demoTasks(STORY_DATE), []);

		return (
			<CalendarBoard.Provider
				tasks={tasks}
				defaultView='month'
				defaultViewDate={STORY_DATE}
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

export const Interaction: Story<CalendarBoardProviderProps> = {
	render: function InteractionRender() {
		const [viewDate, setViewDate] = useState(() => STORY_DATE);
		const tasks = useMemo(() => demoTasks(viewDate), [viewDate]);

		return (
			<CalendarBoard.Provider
				tasks={tasks}
				viewDate={viewDate}
				onViewDateChange={setViewDate}
				defaultView='month'
			>
				<BoardChrome />
			</CalendarBoard.Provider>
		);
	},
	play: async ({canvasElement}) => {
		const week = Array.from(canvasElement.querySelectorAll('[role="radio"]'))
			.find((node) => node.textContent?.includes('Неделя'));
		if (week instanceof HTMLElement) week.click();
	},
	parameters: story('Play переключает вид на неделю.'),
};

export const UsageExample: Story<CalendarBoardProviderProps> = {
	render: function UsageExampleRender() {
		const [viewDate, setViewDate] = useState(() => STORY_DATE);
		const [selected, setSelected] = useState('—');
		const tasks = useMemo(() => demoTasks(viewDate), [viewDate]);

		return (
			<Card
				header={(
					<Text weight='bold'>
						Расписание команды
					</Text>
				)}
			>
				<Stack gap='md'>
					<CalendarBoard.Provider
						tasks={tasks}
						viewDate={viewDate}
						onViewDateChange={setViewDate}
						defaultView='week'
						onTaskClick={(task) => setSelected(task.title)}
					>
						<BoardChrome />
					</CalendarBoard.Provider>
					<Text size='sm' color='muted'>
						Выбрано:
						{' '}
						{selected}
					</Text>
				</Stack>
			</Card>
		);
	},
	parameters: story('Доска в карточке: клик по задаче показывает название.'),
};
