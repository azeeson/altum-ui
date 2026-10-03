import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {ColorSwatchGroup, ColorSwatchGroupProps} from './ColorSwatchGroup';
import {Stack} from '../Layout';
import {Text} from '../Text/Text';
import {Card} from '../Card/Card';
import {Button} from '../Button/Button';
import {componentParameters, story, Story} from '../../storybook/meta';

const LIST_COLORS = [
	'#ef4444',
	'#f97316',
	'#eab308',
	'#22c55e',
	'#3b82f6',
	'#8b5cf6',
	'#ec4899'
];

export default {
	title: 'altum/Components/ColorSwatchGroup',
	component: ColorSwatchGroup,
	tags: ['autodocs'],
	parameters: componentParameters('Группа цветовых образцов для выбора одного цвета из палитры.'),
	argTypes: {
		label: {
			control: 'text',
			description: 'Метка группы'
		},
		size: {
			control: {
				type: 'select',
				options: ['sm', 'md']
			},
			description: 'Размер образцов',
		},
		disabled: {
			control: 'boolean',
		},
		readOnly: {
			control: 'boolean',
		},
		onChange: {
			action: 'change',
		},
	},
} satisfies Meta<typeof ColorSwatchGroup>;

export const Playground: Story<ColorSwatchGroupProps> = {
	render: function PlaygroundRender(args) {
		const [color, setColor] = useState(LIST_COLORS[4]);
		return (
			<ColorSwatchGroup
				{...args}
				colors={LIST_COLORS}
				value={color}
				onChange={(next) => {
					setColor(next);
					args.onChange?.(next);
				}}
			/>
		);
	},
	args: {
		label: 'Цвет списка',
		size: 'md',
		disabled: false,
		readOnly: false,
	},
	parameters: story('Используйте панель Controls для настройки.'),
};

export const Sizes: Story<ColorSwatchGroupProps> = {
	render: function SizesRender() {
		const [smColor, setSmColor] = useState(LIST_COLORS[2]);
		const [mdColor, setMdColor] = useState(LIST_COLORS[4]);

		return (
			<Stack gap='md'>
				<ColorSwatchGroup
					label='sm'
					colors={LIST_COLORS}
					value={smColor}
					onChange={setSmColor}
					size='sm'
				/>
				<ColorSwatchGroup
					label='md (по умолчанию)'
					colors={LIST_COLORS}
					value={mdColor}
					onChange={setMdColor}
					size='md'
				/>
			</Stack>
		);
	},
	parameters: story('Сравнение размеров `sm` и `md`.'),
};

export const States: Story<ColorSwatchGroupProps> = {
	render: () => (
		<Stack gap='md'>
			<ColorSwatchGroup
				label='disabled'
				colors={LIST_COLORS}
				value={LIST_COLORS[4]}
				onChange={() => {}}
				disabled
			/>
			<ColorSwatchGroup
				label='readOnly'
				colors={LIST_COLORS}
				value={LIST_COLORS[1]}
				onChange={() => {}}
				readOnly
			/>
		</Stack>
	),
	parameters: story('`disabled` и `readOnly`.'),
};

export const Empty: Story<ColorSwatchGroupProps> = {
	render: () => (
		<ColorSwatchGroup
			label='Пустая палитра'
			colors={[]}
			onChange={() => {}}
		/>
	),
	parameters: story('Пустой массив `colors`.'),
};

export const Interaction: Story<ColorSwatchGroupProps> = {
	render: function InteractionRender() {
		const [color, setColor] = useState(LIST_COLORS[0]);
		return (
			<Stack gap='sm'>
				<ColorSwatchGroup
					label='Палитра'
					colors={LIST_COLORS}
					value={color}
					onChange={setColor}
				/>
				<Text size='sm' color='muted'>
					{color}
				</Text>
			</Stack>
		);
	},
	play: async ({canvasElement}) => {
		const swatch = canvasElement.querySelector(`[aria-label="${LIST_COLORS[4]}"]`) as HTMLButtonElement | null;
		swatch?.click();
		swatch?.focus();
	},
	parameters: story('Play выбирает синий образец.'),
};

export const UsageExample: Story<ColorSwatchGroupProps> = {
	render: function UsageExampleRender() {
		const [color, setColor] = useState(LIST_COLORS[4]);
		return (
			<Card
				style={{maxWidth: 360}}
				header={(
					<Text weight='bold'>
						Цвет метки
					</Text>
				)}
			>
				<Stack gap='md'>
					<ColorSwatchGroup
						colors={LIST_COLORS}
						value={color}
						onChange={setColor}
						size='sm'
					/>
					<Button
						size='sm'
						variant='secondary'
						onClick={() => setColor(LIST_COLORS[4])}
					>
						Сбросить
					</Button>
				</Stack>
			</Card>
		);
	},
	parameters: story('Выбор цвета метки в карточке настроек.'),
};
