import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {WheelTimePicker, type TimeValue, type WheelTimePickerProps} from './WheelTimePicker';
import {Card} from '../Card/Card';
import {Button} from '../Button/Button';
import {Inline, Stack} from '../Layout';
import {Text} from '../Text/Text';
import {componentParameters, story, Story} from '../../storybook/meta';

const formatTime = (value: TimeValue) => {
	const hours = value.hours < 10 ? `0${value.hours}` : `${value.hours}`;
	const minutes = value.minutes < 10 ? `0${value.minutes}` : `${value.minutes}`;
	return `${hours}:${minutes}`;
};

export default {
	title: 'altum/Components/WheelTimePicker',
	component: WheelTimePicker,
	tags: ['autodocs'],
	parameters: componentParameters(
		'Попап времени из двух барабанов: часы 00–23 и минуты 00–59.',
	),
	argTypes: {
		value: {control: false},
		onChange: {action: 'onChange'},
		active: {control: 'boolean'},
	},
} satisfies Meta<typeof WheelTimePicker>;

export const Playground: Story<WheelTimePickerProps> = {
	render: function PlaygroundRender(args) {
		const [val, setVal] = useState<TimeValue | null>({
			hours: 14,
			minutes: 30
		});
		return (
			<Stack gap='sm'>
				<WheelTimePicker
					{...args}
					value={val}
					onChange={(next) => {
						args.onChange?.(next);
						setVal(next);
					}}
				/>
				<Text size='sm' color='muted'>
					{val ? formatTime(val) : '—'}
				</Text>
			</Stack>
		);
	},
	args: {
		active: true,
	},
	parameters: story('Клик по числу или прокрутка колонки сразу меняют значение.'),
};

export const EmptyValue: Story<WheelTimePickerProps> = {
	render: function EmptyValueRender() {
		const [val, setVal] = useState<TimeValue | null>(null);
		return (
			<Stack gap='sm'>
				<WheelTimePicker value={val} onChange={setVal} />
				<Text size='sm' color='muted'>
					{val ? formatTime(val) : 'null → визуально 00:00'}
				</Text>
			</Stack>
		);
	},
	parameters: story('Пустое значение: барабаны на `00:00`. Первый выбор отдаёт полное время.'),
};

export const ExternalSync: Story<WheelTimePickerProps> = {
	render: function ExternalSyncRender() {
		const [val, setVal] = useState<TimeValue | null>({
			hours: 9,
			minutes: 15
		});
		return (
			<Stack gap='sm'>
				<WheelTimePicker value={val} onChange={setVal} />
				<Inline gap='sm'>
					<Button
						size='sm'
						onClick={() => setVal({
							hours: 14,
							minutes: 30
						})}
					>
						14:30
					</Button>
					<Button
						size='sm'
						onClick={() => setVal({
							hours: 0,
							minutes: 0
						})}
					>
						00:00
					</Button>
					<Button
						size='sm'
						onClick={() => setVal({
							hours: 23,
							minutes: 59
						})}
					>
						23:59
					</Button>
					<Button
						size='sm'
						variant='ghost'
						onClick={() => setVal(null)}
					>
						null
					</Button>
				</Inline>
			</Stack>
		);
	},
	parameters: story('Смена `value` снаружи прокручивает оба барабана без smooth.'),
};

export const NarrowCard: Story<WheelTimePickerProps> = {
	render: function NarrowCardRender() {
		const [val, setVal] = useState<TimeValue | null>({
			hours: 18,
			minutes: 5
		});
		return (
			<Card style={{width: 220}}>
				<WheelTimePicker value={val} onChange={setVal} />
			</Card>
		);
	},
	parameters: story('На карточке ~220px без горизонтального скролла.'),
};
