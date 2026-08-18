import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {ColorSwatchGroup, ColorSwatchGroupProps} from './ColorSwatchGroup';
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
	title: 'altum-ui/Components/ColorSwatchGroup',
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
				onChange={setColor}
			/>
		);
	},
	args: {
		label: 'Цвет списка',
	},
	parameters: story('Используйте панель Controls для настройки.'),
};

export const Small: Story<ColorSwatchGroupProps> = {
	render: function SmallRender() {
		const [color, setColor] = useState(LIST_COLORS[0]);
		return (
			<ColorSwatchGroup
				colors={LIST_COLORS}
				value={color}
				onChange={setColor}
				size='sm'
			/>
		);
	},
	parameters: story('Компактный размер цветовых образцов.'),
};

export const Sizes: Story<ColorSwatchGroupProps> = {
	render: function SizesRender() {
		const [smColor, setSmColor] = useState(LIST_COLORS[2]);
		const [mdColor, setMdColor] = useState(LIST_COLORS[4]);

		return (
			<div style={{
				display: 'flex',
				flexDirection: 'column',
				gap: 'var(--altum-g-space-4)',
			}}
			>
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
			</div>
		);
	},
	parameters: story('Сравнение размеров `sm` и `md`.'),
};
