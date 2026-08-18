import type {Meta} from '@storybook/react';
import React from 'react';
import {Progress, ProgressCircle, ProgressProps} from './Progress';
import {Stack} from '../Layout/Layout';
import {componentParameters, story, Story} from '../../storybook/meta';

export default {
	title: 'altum-ui/Components/Progress',
	component: Progress,
	tags: ['autodocs'],
	parameters: componentParameters(
		'Линейный и круговой прогресс: determinate / indeterminate, label / valueText.',
	),
	argTypes: {
		percentage: {
			control: {
				type: 'range',
				min: 0,
				max: 100,
			},
		},
		indeterminate: {control: 'boolean'},
	},
} satisfies Meta<typeof Progress>;

export const Playground: Story<ProgressProps> = {
	render: (args) => (
		<div style={{maxWidth: 320}}>
			<Progress {...args} />
		</div>
	),
	args: {
		percentage: 65,
		label: 'Загрузка',
	},
	parameters: story('Определённое значение с лейблом и %-valueText.'),
};

export const Indeterminate: Story<ProgressProps> = {
	render: () => (
		<div style={{maxWidth: 320}}>
			<Progress indeterminate label='Синхронизация…' />
		</div>
	),
	parameters: story('Неопределённый прогресс.'),
};

export const Circular: Story<ProgressProps> = {
	render: () => (
		<Stack
			gap='md'
			style={{
				flexDirection: 'row',
				alignItems: 'center'
			}}
		>
			<ProgressCircle percentage={45} label='CPU' />
			<ProgressCircle percentage={85} diameter={70} />
			<ProgressCircle
				indeterminate
				diameter={56}
				label='Ожидание'
				showValueText={false}
			/>
		</Stack>
	),
	parameters: story('ProgressCircle в публичном API.'),
};
