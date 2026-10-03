import type {Meta} from '@storybook/react';
import React from 'react';
import {Skeleton, SkeletonProps} from './Skeleton';
import {Card} from '../Card/Card';
import {Inline, Stack} from '../Layout';
import {Text} from '../Text/Text';
import {Title} from '../Title/Title';
import {componentParameters, story, Story} from '../../storybook/meta';

export default {
	title: 'altum/Components/Skeleton',
	component: Skeleton,
	tags: ['autodocs'],
	parameters: componentParameters(
		'Плейсхолдеры загрузки: блок и пресеты text / avatar / card / table.',
	),
	argTypes: {
		variant: {
			control: {
				type: 'select',
				options: [
					'block',
					'text',
					'avatar',
					'card',
					'table'
				],
			},
		},
		circle: {control: 'boolean'},
		lines: {control: 'number'},
		rows: {control: 'number'},
		columns: {control: 'number'},
		avatar: {control: 'boolean'},
		width: {control: 'text'},
		height: {control: 'text'},
		size: {control: 'number'},
	},
} satisfies Meta<typeof Skeleton>;

export const Playground: Story<SkeletonProps> = {
	args: {
		variant: 'block',
		width: 200,
		height: 16,
		circle: false,
	},
	parameters: story('Базовый блок. Controls: variant, размеры, lines / rows / columns.'),
};

export const Presets: Story<SkeletonProps> = {
	render: () => (
		<Stack gap='lg' style={{maxWidth: 480}}>
			<Skeleton variant='text' lines={3} />
			<Inline gap='sm' align='center'>
				<Skeleton variant='avatar' />
				<Skeleton
					variant='text'
					lines={2}
					width='70%'
				/>
			</Inline>
			<Skeleton variant='card' />
			<Skeleton
				variant='table'
				rows={4}
				columns={3}
			/>
		</Stack>
	),
	parameters: story('Пресеты `variant`.'),
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

export const TextLines: Story<SkeletonProps> = {
	render: () => (
		<Stack gap='md' style={{maxWidth: 360}}>
			<Skeleton variant='text' lines={1} />
			<Skeleton variant='text' lines={3} />
			<Skeleton
				variant='text'
				lines={5}
				lastWidth='40%'
			/>
		</Stack>
	),
	parameters: story('Разное число строк и `lastWidth` у последней.'),
};

export const CardWithoutAvatar: Story<SkeletonProps> = {
	render: () => (
		<div style={{maxWidth: 360}}>
			<Skeleton
				variant='card'
				avatar={false}
				lines={4}
			/>
		</div>
	),
	parameters: story('Пресет card без круглого аватара.'),
};

export const UsageExample: Story<SkeletonProps> = {
	render: () => (
		<div style={{maxWidth: 400}}>
			<Card
				header={(
					<Title level={4}>
						Команда
					</Title>
				)}
			>
				<Stack gap='md'>
					<Text size='xs' color='muted'>
						Загрузка списка участников
					</Text>
					{Array.from({length: 3}, (_, index) => (
						<Inline
							key={index}
							gap='sm'
							align='center'
						>
							<Skeleton variant='avatar' size={40} />
							<Skeleton
								variant='text'
								lines={2}
								width='70%'
							/>
						</Inline>
					))}
				</Stack>
			</Card>
		</div>
	),
	parameters: story('Карточка списка: аватар + две строки текста на время загрузки.'),
};
