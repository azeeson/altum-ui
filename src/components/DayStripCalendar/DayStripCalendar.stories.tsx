import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {
	DayStripCalendar,
	DayStripCalendarProps,
} from './DayStripCalendar';
import {Text} from '../Text/Text';
import {componentParameters, story, Story} from '../../storybook/meta';
import {formatMonthYear, isSameDay} from '../Calendar/Calendar.utils';
import {useLocale} from '../LocaleProvider/LocaleProvider';

export default {
	title: 'altum-ui/Components/DayStripCalendar',
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
				'renderDay'
			]
		},
	},
} satisfies Meta<typeof DayStripCalendar>;

export const Playground: Story<DayStripCalendarProps> = {
	render: function PlaygroundRender(args) {
		const [value, setValue] = useState(new Date());
		const {messages} = useLocale();

		return (
			<div style={{
				display: 'flex',
				flexDirection: 'column',
				gap: 'var(--altum-g-space-3)',
				maxWidth: 520,
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
	parameters: story('Стрелки ←/→, Home/End; prev/next сдвигают окно на daysCount.'),
};

export const FiveDays: Story<DayStripCalendarProps> = {
	render: function FiveDaysRender() {
		const [value, setValue] = useState(new Date());
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

export const CustomDay: Story<DayStripCalendarProps> = {
	render: function CustomDayRender() {
		const [value, setValue] = useState(new Date());
		const markers = [new Date(), new Date(Date.now() + 2 * 86400000),];

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
