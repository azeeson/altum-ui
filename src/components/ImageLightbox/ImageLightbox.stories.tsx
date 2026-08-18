import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {ImageLightbox, ImageLightboxProps} from './ImageLightbox';
import {Button} from '../Button/Button';
import {componentParameters, story, Story} from '../../storybook/meta';

const makeSvgDataUrl = (color: string, label: string) =>
	`data:image/svg+xml,${encodeURIComponent(
		`<svg xmlns="http://www.w3.org/2000/svg" width="1400" height="900" viewBox="0 0 1400 900">
      <rect width="1400" height="900" fill="${color}"/>
      <text x="700" y="450" text-anchor="middle" dominant-baseline="middle" fill="#ffffff" font-family="sans-serif" font-size="48">${label}</text>
    </svg>`,
	)}`;

const DEMO_IMAGES = [
	{
		src: makeSvgDataUrl('#2563eb', 'Горный пейзаж'),
		alt: 'Горный пейзаж',
		thumbnail: makeSvgDataUrl('#2563eb', '1'),
	},
	{
		src: makeSvgDataUrl('#7c3aed', 'Лесная тропа'),
		alt: 'Лесная тропа',
		thumbnail: makeSvgDataUrl('#7c3aed', '2'),
	},
	{
		src: makeSvgDataUrl('#059669', 'Вид на океан'),
		alt: 'Вид на океан',
		thumbnail: makeSvgDataUrl('#059669', '3'),
	},
	{
		src: makeSvgDataUrl('#dc2626', 'Городской горизонт'),
		alt: 'Городской горизонт',
		thumbnail: makeSvgDataUrl('#dc2626', '4'),
	},
];

export default {
	title: 'altum/Components/ImageLightbox',
	component: ImageLightbox,
	tags: ['autodocs'],
	parameters: componentParameters(
		'Полноэкранный просмотр изображений поверх контента. Использует ImageGallery с оверлеем (затемнение + blur).'
	),
} satisfies Meta<typeof ImageLightbox>;

export const Playground: Story<ImageLightboxProps> = {
	render: function PlaygroundRender() {
		const [isOpen, setIsOpen] = useState(false);
		const [index, setIndex] = useState(0);

		return (
			<>
				<Button variant='primary' onClick={() => setIsOpen(true)}>
					Открыть lightbox
				</Button>
				<ImageLightbox
					open={isOpen}
					onClose={() => setIsOpen(false)}
					images={DEMO_IMAGES}
					index={index}
					onIndexChange={setIndex}
				/>
			</>
		);
	},
	parameters: story('Клик по оверлею или Escape закрывает lightbox. Стрелки ← → переключают слайды.'),
};

export const WithThumbnails: Story<ImageLightboxProps> = {
	render: function OpenAtIndexRender() {
		const [isOpen, setIsOpen] = useState(false);
		const [startIndex, setStartIndex] = useState(0);

		return (
			<>
				<div style={{
					display: 'flex',
					gap: 8,
					flexWrap: 'wrap'
				}}
				>
					{DEMO_IMAGES.map((image, i) => (
						<button
							key={image.src}
							type='button'
							onClick={() => {
								setStartIndex(i);
								setIsOpen(true);
							}}
							style={{
								padding: 0,
								border: 'none',
								borderRadius: 8,
								overflow: 'hidden',
								cursor: 'pointer',
							}}
						>
							<img
								src={image.thumbnail}
								alt={image.alt}
								width={120}
								height={90}
								style={{
									display: 'block',
									objectFit: 'cover'
								}}
							/>
						</button>
					))}
				</div>
				<ImageLightbox
					open={isOpen}
					onClose={() => setIsOpen(false)}
					images={DEMO_IMAGES}
					index={startIndex}
					onIndexChange={setStartIndex}
				/>
			</>
		);
	},
	parameters: story('Клик по превью открывает lightbox с нужного слайда.'),
};
