import type {Meta} from '@storybook/react';
import React from 'react';
import {Media, MediaProps} from './Media';
import {Card} from '../Card/Card';
import {Grid} from '../Grid/Grid';
import {Stack} from '../Layout/Layout';
import {Text} from '../Text/Text';
import {demoImage, demoThumb} from '../../storybook/demoImages';
import {componentParameters, story, Story} from '../../storybook/meta';

export default {
	title: 'altum/Components/Media',
	component: Media,
	tags: ['autodocs'],
	parameters: componentParameters(
		'Медиа-превью с фиксированным aspect-ratio (img / video).',
	),
	argTypes: {
		src: {
			control: 'text',
			description: 'URL изображения или видео',
		},
		alt: {
			control: 'text',
		},
		fit: {
			control: {
				type: 'select',
				options: ['cover', 'contain']
			},
			description: 'object-fit',
		},
		as: {
			control: {
				type: 'select',
				options: ['img', 'video']
			},
		},
		rounded: {
			control: 'boolean',
			description: 'Скругление рамки',
		},
		ratio: {
			control: 'number',
			description: 'aspect-ratio (ширина / высота)',
		},
		poster: {
			control: 'text',
			description: 'Poster для video',
		},
	},
} satisfies Meta<typeof Media>;

export const Playground: Story<MediaProps> = {
	args: {
		src: demoImage(1),
		alt: 'Превью изображения',
		ratio: 16 / 9,
		fit: 'cover',
		rounded: true,
		as: 'img',
	},
	render: (args) => (
		<div style={{maxWidth: 480}}>
			<Media {...args} />
		</div>
	),
	parameters: story('Изображение из `.storybook/public/images` в рамке 16:9.'),
};

export const FitContain: Story<MediaProps> = {
	render: () => (
		<Stack gap='md' style={{maxWidth: 320}}>
			<Media
				src={demoImage(2)}
				alt='Фото в широкой рамке'
				ratio={16 / 9}
				fit='contain'
			/>
			<Media
				src={demoImage(2)}
				alt='Фото с cover'
				ratio={16 / 9}
				fit='cover'
			/>
		</Stack>
	),
	parameters: story('Сравнение `fit="contain"` и `fit="cover"`.'),
};

export const Ratios: Story<MediaProps> = {
	render: () => (
		<Stack gap='md' style={{maxWidth: 360}}>
			<Media
				src={demoImage(3)}
				alt='16:9'
				ratio={16 / 9}
			/>
			<Media
				src={demoImage(3)}
				alt='1:1'
				ratio={1}
			/>
			<Media
				src={demoImage(3)}
				alt='4:3'
				ratio={4 / 3}
			/>
		</Stack>
	),
	parameters: story('Типовые соотношения сторон.'),
};

export const SquareNoRadius: Story<MediaProps> = {
	render: () => (
		<div style={{maxWidth: 240}}>
			<Media
				src={demoImage(4)}
				alt='Без скругления'
				ratio={1}
				rounded={false}
			/>
		</div>
	),
	parameters: story('`rounded={false}` снимает радиус.'),
};

export const Video: Story<MediaProps> = {
	render: () => (
		<div style={{maxWidth: 480}}>
			<Media
				as='video'
				src='https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4'
				poster={demoThumb(3)}
				alt='Демо-видео'
				ratio={16 / 9}
			/>
		</div>
	),
	parameters: story('Видео с локальным poster; `controls` выключены.'),
};

export const UsageExample: Story<MediaProps> = {
	render: () => (
		<Grid
			columns={{
				xs: 1,
				sm: 2
			}}
			gap='md'
			style={{maxWidth: 560}}
		>
			{[1, 2].map((n) => (
				<Card
					key={n}
					variant='outlined'
					media={(
						<Media
							src={demoImage(n)}
							alt={`Обложка ${n}`}
							ratio={16 / 9}
							rounded={false}
						/>
					)}
					header={(
						<Text weight='bold'>
							Материал
							{' '}
							{n}
						</Text>
					)}
				>
					<Text size='sm' color='secondary'>
						Превью в слоте media карточки.
					</Text>
				</Card>
			))}
		</Grid>
	),
	parameters: story('Media как обложка Card в сетке.'),
};
