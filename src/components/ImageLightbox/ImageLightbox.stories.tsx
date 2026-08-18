import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {ImageLightbox, ImageLightboxProps} from './ImageLightbox';
import {Button} from '../Button/Button';
import {demoGalleryItem} from '../../storybook/demoImages';
import {componentParameters, story, Story} from '../../storybook/meta';

const DEMO_IMAGES = [
	demoGalleryItem(1, 'Горный пейзаж'),
	demoGalleryItem(2, 'Лесная тропа'),
	demoGalleryItem(3, 'Вид на океан'),
	demoGalleryItem(4, 'Городской горизонт'),
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
