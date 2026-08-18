import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {DateRangePicker, DateRangePickerProps, type DateRangeValue} from './DateRangePicker';
import {Text} from '../Text/Text';
import {Stack} from '../Layout/Layout';
import {componentParameters, story, Story} from '../../storybook/meta';

export default {
	title: 'altum/Components/DateRangePicker',
	component: DateRangePicker,
	tags: ['autodocs'],
	parameters: componentParameters(
		'Выбор диапазона дат: поле + календарь в режиме range.',
	),
} satisfies Meta<typeof DateRangePicker>;

export const Playground: Story<DateRangePickerProps> = {
	render: function PlaygroundRender(args) {
		const [range, setRange] = useState<DateRangeValue>({});
		return (
			<Stack gap='md' style={{maxWidth: 360}}>
				<DateRangePicker
					{...args}
					value={range}
					onChange={setRange}
				/>
				<Text size='sm' color='secondary'>
					{range.start?.toLocaleDateString('ru-RU') ?? '—'}
					{' — '}
					{range.end?.toLocaleDateString('ru-RU') ?? '—'}
				</Text>
			</Stack>
		);
	},
	args: {
		label: 'Период отчёта',
		layout: 'single',
	},
	parameters: story('Одно поле диапазона и календарь.'),
};

export const Variants: Story<DateRangePickerProps> = {
	render: function VariantsRender() {
		const [single, setSingle] = useState<DateRangeValue>({});
		const [split, setSplit] = useState<DateRangeValue>({});

		return (
			<Stack gap='lg' style={{maxWidth: 420}}>
				<div>
					<Text size='sm' color='muted'>
						layout=&quot;single&quot;
					</Text>
					<DateRangePicker
						label='Период'
						layout='single'
						value={single}
						onChange={setSingle}
					/>
				</div>
				<div>
					<Text size='sm' color='muted'>
						layout=&quot;split&quot;
					</Text>
					<DateRangePicker
						layout='split'
						value={split}
						onChange={setSplit}
					/>
				</div>
			</Stack>
		);
	},
	parameters: story('Одно поле (`single`) и два поля «С» / «По» (`split`).'),
};
