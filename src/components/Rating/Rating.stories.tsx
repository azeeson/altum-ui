import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {Rating, RatingProps} from './Rating';
import {Stack} from '../Layout/Layout';
import {Text} from '../Text/Text';
import {componentParameters, story, Story} from '../../storybook/meta';

export default {
	title: 'altum/Components/Rating',
	component: Rating,
	tags: ['autodocs'],
	parameters: componentParameters(
		'Оценка звёздами для отзывов и рейтингов.',
	),
	argTypes: {
		size: {
			control: {
				type: 'select',
				options: ['sm', 'md', 'lg']
			},
		},
	},
} satisfies Meta<typeof Rating>;

export const Playground: Story<RatingProps> = {
	render: function PlaygroundRender() {
		const [value, setValue] = useState(3);

		return (
			<Stack gap='sm'>
				<Rating value={value} onChange={setValue} />
				<Text size='sm'>
					Выбрано:
					{' '}
					{value}
					{' '}
					из 5
				</Text>
			</Stack>
		);
	},
	parameters: story('Контролируемый рейтинг с повторным кликом для сброса.'),
};

export const Sizes: Story<RatingProps> = {
	render: () => (
		<Stack gap='md'>
			<Rating size='sm' defaultValue={4} />
			<Rating size='md' defaultValue={4} />
			<Rating size='lg' defaultValue={4} />
		</Stack>
	),
	parameters: story('Размеры звёзд: `sm`, `md`, `lg`.'),
};

export const ReadOnly: Story<RatingProps> = {
	render: () => (
		<Rating value={4} readOnly />
	),
	parameters: story('Только отображение без взаимодействия.'),
};

export const Disabled: Story<RatingProps> = {
	render: () => (
		<Rating value={2} disabled />
	),
	parameters: story('Недоступное состояние.'),
};
