import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {
	DayStripCalendar,
	DayStripCalendarProps,
} from './DayStripCalendar';
import {Card} from '../Card/Card';
import {Stack} from '../Layout';
import {Text} from '../Text/Text';
import {Button} from '../Button/Button';
import {componentParameters, story, Story} from '../../storybook/meta';
import {playClick} from '../../storybook/play';
import {formatMonthYear, isSameDay} from '../Calendar/Calendar.utils';
import {useLocale} from '../../locales/localeContext';
import {ruSlice as ru_calendar} from '../../locales/slices/calendar.ru';

const localeFallback = {
	calendar: ru_calendar,
};




const STORY_DATE = new Date(2026, 8, 8);

export default {
	title: 'altum/Components/DayStripCalendar',
	component: DayStripCalendar,
	tags: ['autodocs'],
	parameters: {
		...componentParameters(
			'Горизонтальная полоса дней (недельный chrome): prev/next, выбор дня, today.',
		),
		controls: {
			exclude: [
				'value',
				'onChange',
				'viewDate',
				'onViewDateChange',
				'renderDay',
			],
		},
	},
	argTypes: {
		daysCount: {
			control: {
				type: 'number',
				min: 3,
				max: 14,
			},
			description: 'Сколько дней показывать',
		},
		weekStartsOn: {
			control: {
				type: 'radio',
				options: [0, 1,],
			},
			description: 'Начало недели: 0 = вс, 1 = пн',
		},
		showHeader: {
			control: 'boolean',
			description: 'Заголовок месяца/года над полосой',
		},
		showNav: {
			control: 'boolean',
			description: 'Кнопки prev / next',
		},
		onChange: {
			action: 'change',
			description: 'Колбэк выбранной даты',
		},
	},
} satisfies Meta<typeof DayStripCalendar>;

export const Playground: Story<DayStripCalendarProps> = {
	render: function PlaygroundRender(args) {
		const [value, setValue] = useState(STORY_DATE);
		const {messages} = useLocale(localeFallback);

		return (
			<div style={{
				display: 'flex',
				flexDirection: 'column',
				gap: 'var(--altum-g-space-3)',
			}}
			>
				<DayStripCalendar
					{...args}
					value={value}
					onChange={setValue}
				/>
				<Text size='sm' color='secondary'>
					Выбрано:
					{' '}
					{formatMonthYear(value, messages.calendar.months)}
					,
					{' '}
					{value.getDate()}
				</Text>
			</div>
		);
	},
	args: {
		daysCount: 7,
		weekStartsOn: 1,
		showHeader: true,
		showNav: true,
	},
	parameters: story('Стрелки ←/→ и prev/next выбирают соседний день; за краем полосы окно сдвигается на daysCount / 2.'),
};

export const FiveDays: Story<DayStripCalendarProps> = {
	render: function FiveDaysRender() {
		const [value, setValue] = useState(STORY_DATE);
		return (
			<DayStripCalendar
				value={value}
				onChange={setValue}
				daysCount={5}
				showHeader
			/>
		);
	},
	parameters: story('`daysCount={5}` — укороченная полоса.'),
};

export const SundayStart: Story<DayStripCalendarProps> = {
	render: function SundayStartRender() {
		const [value, setValue] = useState(STORY_DATE);
		return (
			<DayStripCalendar
				value={value}
				onChange={setValue}
				weekStartsOn={0}
			/>
		);
	},
	parameters: story('`weekStartsOn={0}` — неделя с воскресенья.'),
};

export const WithoutChrome: Story<DayStripCalendarProps> = {
	render: function WithoutChromeRender() {
		const [value, setValue] = useState(STORY_DATE);
		return (
			<DayStripCalendar
				value={value}
				onChange={setValue}
				showHeader={false}
				showNav={false}
			/>
		);
	},
	parameters: story('Только полоса дней: без заголовка и стрелок.'),
};

export const CustomDay: Story<DayStripCalendarProps> = {
	render: function CustomDayRender() {
		const [value, setValue] = useState(STORY_DATE);
		const markers = [STORY_DATE, new Date(STORY_DATE.getTime() + 2 * 86400000),];

		return (
			<DayStripCalendar
				value={value}
				onChange={setValue}
				renderDay={({date, dayOfMonth, weekdayLabel, isSelected}) => (
					<>
						<span style={{
							fontSize: 11,
							opacity: 0.75,
							fontWeight: 600,
						}}
						>
							{weekdayLabel}
						</span>
						<span style={{
							fontWeight: 600,
							fontVariantNumeric: 'tabular-nums',
						}}
						>
							{dayOfMonth}
						</span>
						<span
							aria-hidden
							style={{
								width: 6,
								height: 6,
								borderRadius: '50%',
								background: markers.some((marker) => isSameDay(marker, date))
									? (isSelected ? 'currentColor' : 'var(--altum-color-brand)')
									: 'transparent',
								marginTop: 2,
							}}
						/>
					</>
				)}
			/>
		);
	},
	parameters: story('`renderDay` — кастомная ячейка (точки-маркеры).'),
};

export const Interaction: Story<DayStripCalendarProps> = {
	render: function InteractionRender() {
		const [value, setValue] = useState(STORY_DATE);
		const {messages} = useLocale(localeFallback);
		return (
			<Stack gap='sm'>
				<DayStripCalendar
					value={value}
					onChange={setValue}
				/>
				<Text size='sm' color='secondary'>
					Выбрано:
					{' '}
					{formatMonthYear(value, messages.calendar.months)}
					,
					{' '}
					{value.getDate()}
				</Text>
			</Stack>
		);
	},
	play: async ({canvasElement}) => {
		await playClick(canvasElement, '[aria-label="Следующий день"]');
	},
	parameters: story('Play выбирает следующий день.'),
};

export const UsageExample: Story<DayStripCalendarProps> = {
	render: function UsageExampleRender() {
		const [value, setValue] = useState(STORY_DATE);
		const {messages} = useLocale(localeFallback);
		return (
			<Card
				style={{maxWidth: 480}}
				header={(
					<Text weight='bold'>
						Слоты на день
					</Text>
				)}
			>
				<Stack gap='md'>
					<DayStripCalendar
						value={value}
						onChange={setValue}
					/>
					<Text size='sm'>
						{formatMonthYear(value, messages.calendar.months)}
						,
						{' '}
						{value.getDate()}
					</Text>
					<Button size='sm' variant='primary'>
						Записать на эту дату
					</Button>
				</Stack>
			</Card>
		);
	},
	parameters: story('Полоса дней в карточке записи на приём.'),
};
