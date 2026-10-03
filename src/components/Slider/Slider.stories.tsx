import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {Slider, type RangeValue, type SliderProps} from './Slider';
import {Text} from '../Text/Text';
import {Inline, Stack} from '../Layout';
import {Card} from '../Card/Card';
import {Button} from '../Button/Button';
import {componentParameters, story, Story} from '../../storybook/meta';

export default {
	title: 'altum/Components/Slider',
	component: Slider,
	tags: ['autodocs'],
	parameters: componentParameters(
		'Ползунок: одно значение или диапазон «от–до» (два thumb).',
	),
	argTypes: {
		min: {
			control: 'number',
			description: 'Минимум',
		},
		max: {
			control: 'number',
			description: 'Максимум',
		},
		step: {
			control: 'number',
			description: 'Шаг',
		},
		disabled: {
			control: 'boolean',
		},
		readOnly: {
			control: 'boolean',
		},
		showValues: {
			control: 'boolean',
			description: 'Подписи над ползунками',
		},
		onChange: {
			action: 'change',
		},
	},
} satisfies Meta<typeof Slider>;

export const Playground: Story<SliderProps> = {
	render: function PlaygroundRender(args) {
		const [val, setVal] = useState(35);
		return (
			<div style={{maxWidth: 300}}>
				<Slider
					min={0}
					max={100}
					step={1}
					{...args}
					value={val}
					onChange={setVal}
				/>
			</div>
		);
	},
	args: {
		showValues: true,
		disabled: false,
		readOnly: false,
	},
	parameters: story('Одиночный ползунок. Controls: min/max/step, disabled, readOnly.'),
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
	parameters: story('Диапазон цен (`value: [from, to]`).'),
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
	render: function StatesRender() {
		const [val, setVal] = useState(60);
		return (
			<Stack gap='md' style={{maxWidth: 300}}>
				<Stack gap='xs'>
					<Text size='xs' color='muted'>
						disabled
					</Text>
					<Slider
						value={val}
						onChange={setVal}
						disabled
					/>
				</Stack>
				<Stack gap='xs'>
					<Text size='xs' color='muted'>
						readOnly
					</Text>
					<Slider
						value={35}
						onChange={() => {}}
						readOnly
					/>
				</Stack>
				<Stack gap='xs'>
					<Text size='xs' color='muted'>
						range + disabled
					</Text>
					<Slider
						value={[30, 70]}
						onChange={() => {}}
						disabled
					/>
				</Stack>
			</Stack>
		);
	},
	parameters: story('`disabled` и `readOnly` — без интерактива.'),
};

export const Interaction: Story<SliderProps> = {
	render: function InteractionRender() {
		const [val, setVal] = useState(40);
		return (
			<div style={{maxWidth: 300}}>
				<Slider
					value={val}
					onChange={setVal}
					aria-label='Громкость'
				/>
			</div>
		);
	},
	play: async ({canvasElement}) => {
		const thumb = canvasElement.querySelector('[role="slider"]') as HTMLElement | null;
		thumb?.focus();
		thumb?.dispatchEvent(new KeyboardEvent('keydown', {
			key: 'ArrowRight',
			bubbles: true,
		}));
	},
	parameters: story('Play фокусирует thumb и жмёт ArrowRight.'),
};

export const UsageExample: Story<SliderProps> = {
	render: function UsageExampleRender() {
		const [price, setPrice] = useState<RangeValue>([1500, 7800]);
		return (
			<Card
				style={{maxWidth: 400}}
				header={(
					<Text weight='bold'>
						Фильтр по цене
					</Text>
				)}
			>
				<Stack gap='md'>
					<Slider
						value={price}
						onChange={setPrice}
						min={0}
						max={10000}
						step={100}
					/>
					<Inline gap='sm'>
						<Text size='sm'>
							{price[0]}
							{' '}
							—
							{' '}
							{price[1]}
							{' '}
							₽
						</Text>
						<Button
							size='sm'
							variant='secondary'
							onClick={() => setPrice([0, 10000])}
						>
							Сбросить
						</Button>
					</Inline>
				</Stack>
			</Card>
		);
	},
	parameters: story('Диапазон цен в карточке фильтра с кнопкой сброса.'),
};
