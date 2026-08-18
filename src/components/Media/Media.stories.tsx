import type {Meta} from '@storybook/react';
import React from 'react';
import {Media, MediaProps} from './Media';
import {Stack} from '../Layout/Layout';
import {componentParameters, story, Story} from '../../storybook/meta';

const landscapeSvg = 'data:image/svg+xml,' + encodeURIComponent(
	'<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360">'
	+ '<rect width="640" height="360" fill="#4a90d9"/>'
	+ '<text x="320" y="190" text-anchor="middle" fill="white" font-size="28" font-family="sans-serif">Превью</text>'
	+ '</svg>',
);

const containSvg = 'data:image/svg+xml,' + encodeURIComponent(
	'<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">'
	+ '<rect width="200" height="200" fill="#e67e22"/>'
	+ '<circle cx="100" cy="100" r="60" fill="#f1c40f"/>'
	+ '</svg>',
);

const posterSvg = 'data:image/svg+xml,' + encodeURIComponent(
	'<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360">'
	+ '<rect width="640" height="360" fill="#2c3e50"/>'
	+ '<polygon points="280,140 280,220 360,180" fill="white"/>'
	+ '</svg>',
);

export default {
	title: 'altum-ui/Components/Media',
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
		src: landscapeSvg,
		alt: 'Превью изображения',
		ratio: 16 / 9,
	},
	render: (args) => (
		<div style={{maxWidth: 480}}>
			<Media {...args} />
		</div>
	),
	parameters: story('Изображение через SVG data URL в рамке 16:9.'),
};

export const FitContain: Story<MediaProps> = {
	render: () => (
		<Stack gap='md' style={{maxWidth: 320}}>
			<Media
				src={containSvg}
				alt='Квадрат в широкой рамке'
				ratio={16 / 9}
				fit='contain'
			/>
			<Media
				src={containSvg}
				alt='Квадрат с cover'
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
				poster={posterSvg}
				alt='Демо-видео'
				ratio={16 / 9}
			/>
		</div>
	),
	parameters: story('Видео с poster (SVG data URL); `controls` выключены.'),
};
