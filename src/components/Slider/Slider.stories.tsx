import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {Slider, type RangeValue, type SliderProps} from './Slider';
import {Text} from '../Text/Text';
import {Stack} from '../Layout/Layout';
import {componentParameters, story, Story} from '../../storybook/meta';

export default {
	title: 'altum/Components/Slider',
	component: Slider,
	tags: ['autodocs'],
	parameters: componentParameters(
		'Ползунок: одно значение или диапазон «от–до» (два thumb).',
	),
	argTypes: {
		value: {
			control: {
				type: 'range',
				min: 0,
				max: 100,
			},
			description: 'Текущее значение (number) или диапазон ([from, to])',
		},
	},
} satisfies Meta<typeof Slider>;

export const Playground: Story<SliderProps> = {
	render: function PlaygroundRender() {
		const [val, setVal] = useState(35);
		return (
			<div style={{maxWidth: '300px'}}>
				<Slider value={val} onChange={setVal} />
			</div>
		);
	},
	parameters: story('Одиночный ползунок. Используйте Controls для настройки.'),
};

export const Range: Story<SliderProps> = {
	render: function RangeRender() {
		const [range, setRange] = useState<RangeValue>([200, 800]);

		return (
			<Stack gap='sm' style={{maxWidth: 400}}>
				<Slider
					value={range}
					onChange={setRange}
					min={0}
					max={1000}
					step={10}
				/>
				<Text size='sm'>
					От
					{' '}
					{range[0]}
					{' '}
					до
					{' '}
					{range[1]}
					{' '}
					₽
				</Text>
			</Stack>
		);
	},
	parameters: story('Диапазон цен с подписями над ползунками (`value: [from, to]`).'),
};

export const RangeWithoutValues: Story<SliderProps> = {
	render: function WithoutValuesRender() {
		const [range, setRange] = useState<RangeValue>([20, 80]);

		return (
			<div style={{maxWidth: 400}}>
				<Slider
					value={range}
					onChange={setRange}
					showValues={false}
				/>
			</div>
		);
	},
	parameters: story('Диапазон без тултипов (`showValues={false}`).'),
};

export const States: Story<SliderProps> = {
	render: function DisabledAndReadOnlyRender() {
		const [val, setVal] = useState(60);
		return (
			<div style={{
				display: 'flex',
				flexDirection: 'column',
				gap: 'var(--altum-g-space-4)',
				maxWidth: 300,
			}}
			>
				<Slider
					value={val}
					onChange={setVal}
					disabled
				/>
				<Slider
					value={35}
					onChange={() => {}}
					readOnly
				/>
				<Slider
					value={[30, 70]}
					onChange={() => {}}
					disabled
				/>
			</div>
		);
	},
	parameters: story('`disabled` и `readOnly` — без интерактива (single и range).'),
};
