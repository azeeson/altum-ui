import type {Meta} from '@storybook/react';
import React from 'react';
import {Skeleton, SkeletonProps} from './Skeleton';
import {Stack, Inline} from '../Layout/Layout';
import {componentParameters, story, Story} from '../../storybook/meta';

export default {
	title: 'altum/Components/Skeleton',
	component: Skeleton,
	tags: ['autodocs'],
	parameters: componentParameters(
		'Плейсхолдеры загрузки: Skeleton + пресеты Text / Avatar / Card / Table.',
	),
} satisfies Meta<typeof Skeleton>;

export const Playground: Story<SkeletonProps> = {
	args: {
		width: 200,
		height: 16,
	},
	parameters: story('Базовый блок.'),
};

export const Presets: Story<SkeletonProps> = {
	render: () => (
		<Stack gap='lg' style={{maxWidth: 480}}>
			<Skeleton.Text lines={3} />
			<div style={{
				display: 'flex',
				gap: 12,
				alignItems: 'center'
			}}
			>
				<Skeleton.Avatar />
				<Skeleton.Text lines={2} width='70%' />
			</div>
			<Skeleton.Card />
			<Skeleton.Table rows={4} columns={3} />
		</Stack>
	),
	parameters: story('Пресеты составного API.'),
};

export const Shapes: Story<SkeletonProps> = {
	render: () => (
		<Inline
			gap='md'
			align='center'
			wrap
		>
			<Skeleton
				circle
				width={48}
				height={48}
			/>
			<Skeleton width={120} height={16} />
			<Skeleton width={80} height={80} />
		</Inline>
	),
	parameters: story('Круг (`circle`), строка и блок произвольного размера.'),
};
