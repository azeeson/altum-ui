import type {Meta} from '@storybook/react';
import React from 'react';
import {AspectRatio, AspectRatioProps} from './AspectRatio';
import {Text} from '../Text/Text';
import {componentParameters, story, Story} from '../../storybook/meta';

const placeholder: React.CSSProperties = {
	display: 'grid',
	placeItems: 'center',
	height: '100%',
	background: 'var(--altum-color-option-hover)',
};

export default {
	title: 'altum/Components/AspectRatio',
	component: AspectRatio,
	tags: ['autodocs'],
	parameters: componentParameters(
		'Обёртка с фиксированным `aspect-ratio` (16:9 / 1:1 без магии в CSS).',
	),
} satisfies Meta<typeof AspectRatio>;

export const Playground: Story<AspectRatioProps> = {
	render: (args) => (
		<div style={{maxWidth: 480}}>
			<AspectRatio {...args}>
				<div style={placeholder}>
					<Text size='sm'>
						16:9
					</Text>
				</div>
			</AspectRatio>
		</div>
	),
	args: {
		ratio: 16 / 9,
	},
	parameters: story('Стандартное соотношение 16:9.'),
};

export const Square: Story<AspectRatioProps> = {
	render: () => (
		<div style={{maxWidth: 240}}>
			<AspectRatio ratio={1}>
				<div style={placeholder}>
					<Text size='sm'>
						1:1
					</Text>
				</div>
			</AspectRatio>
		</div>
	),
	parameters: story('Квадратное превью (`ratio={1}`).'),
};

export const Portrait: Story<AspectRatioProps> = {
	render: () => (
		<div style={{maxWidth: 200}}>
			<AspectRatio ratio={3 / 4}>
				<div style={placeholder}>
					<Text size='sm'>
						3:4
					</Text>
				</div>
			</AspectRatio>
		</div>
	),
	parameters: story('Портретное соотношение 3:4.'),
};
