import type {Meta} from '@storybook/react';
import React from 'react';
import {Media, MediaProps} from './Media';
import {Stack} from '../Layout/Layout';
import {demoImage, demoThumb} from '../../storybook/demoImages';
import {componentParameters, story, Story} from '../../storybook/meta';

export default {
	title: 'altum/Components/Media',
	component: Media,
	tags: ['autodocs'],
	parameters: componentParameters(
		'Медиа-превью с `AspectRatio` (img / video).',
	),
	argTypes: {
		fit: {
			control: {
				type: 'select',
				options: ['cover', 'contain']
			},
		},
		as: {
			control: {
				type: 'select',
				options: ['img', 'video']
			},
		},
	},
} satisfies Meta<typeof Media>;

export const Playground: Story<MediaProps> = {
	args: {
		src: demoImage(1),
		alt: 'Превью изображения',
		ratio: 16 / 9,
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
