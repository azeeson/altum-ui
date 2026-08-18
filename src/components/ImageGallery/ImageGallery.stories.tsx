/* eslint-disable @stylistic/jsx-closing-bracket-location -- Существующее форматирование фикстуры Storybook сохранено для читаемого вложенного JSX. */
import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {ImageGallery} from './ImageGallery';
import {componentParameters, story, Story} from '../../storybook/meta';

const DEMO_IMAGES = [
	{
		src: 'https://picsum.photos/seed/gallery1/1200/800',
		alt: 'Горный пейзаж',
		thumbnail: 'https://picsum.photos/seed/gallery1/160/120',
	},
	{
		src: 'https://picsum.photos/seed/gallery2/1200/800',
		alt: 'Лесная тропа',
		thumbnail: 'https://picsum.photos/seed/gallery2/160/120',
	},
	{
		src: 'https://picsum.photos/seed/gallery3/1200/800',
		alt: 'Вид на океан',
		thumbnail: 'https://picsum.photos/seed/gallery3/160/120',
	},
	{
		src: 'https://picsum.photos/seed/gallery4/1200/800',
		alt: 'Городской горизонт',
		thumbnail: 'https://picsum.photos/seed/gallery4/160/120',
	},
	{
		src: 'https://picsum.photos/seed/gallery5/1200/800',
		alt: 'Песчаные дюны',
		thumbnail: 'https://picsum.photos/seed/gallery5/160/120',
	},
];

export default {
	title: 'altum-ui/Components/ImageGallery',
	component: ImageGallery,
	tags: ['autodocs'],
	parameters: componentParameters(
		'Галерея изображений: основное фото по центру, миниатюры снизу, навигация вперёд/назад с плавной анимацией.'
	),
} satisfies Meta<typeof ImageGallery>;

function Gallery({images = DEMO_IMAGES}: {images?: typeof DEMO_IMAGES}) {
	return (
		<ImageGallery images={images} enableKeyboard>
			<ImageGallery.Viewport>
				<ImageGallery.Prev />
				<ImageGallery.Image />
				<ImageGallery.Next />
			</ImageGallery.Viewport>
			<ImageGallery.Thumbnails>
				{images.map((image, index) => <ImageGallery.Thumb key={image.src} index={index} />)}
			</ImageGallery.Thumbnails>
			<ImageGallery.Counter />
			<ImageGallery.Empty />
		</ImageGallery>
	);
}

export const Playground: Story<Record<string, never>> = {
	render: () => <Gallery />,
	parameters: story('Явно скомпонованные изображение, навигация и миниатюры.')
};

export const Controlled: Story<Record<string, never>> = {
	render: function ControlledRender() {
		const [index, setIndex] = useState(0);

		return (
			<div style={{maxWidth: 720}}>
				<ImageGallery
					images={DEMO_IMAGES}
					index={index}
					onIndexChange={setIndex}
					enableKeyboard
				>
					<ImageGallery.Viewport>
						<ImageGallery.Prev />
						<ImageGallery.Image />
						<ImageGallery.Next />
					</ImageGallery.Viewport>
					<ImageGallery.Counter />
				</ImageGallery>
			</div>
		);
	},
	parameters: story('Контролируемый режим через index и onIndexChange.'),
};

export const SingleImage: Story<Record<string, never>> = {
	render: () => (<Gallery images={[
		{
			src: 'https://picsum.photos/seed/single/1200/800',
			alt: 'Одно фото',
			thumbnail: 'https://picsum.photos/seed/single/160/120'
		}
	]}
	/>),
	parameters: story('Композиция для одного изображения.')
};

export const StringUrls: Story<Record<string, never>> = {
	render: () => (<ImageGallery images={['https://picsum.photos/seed/simple1/1000/700', 'https://picsum.photos/seed/simple2/1000/700']}>
		<ImageGallery.Viewport>
			<ImageGallery.Image />
		</ImageGallery.Viewport>
	</ImageGallery>),
	parameters: story('Можно передать массив строк — alt сгенерируется автоматически.')
};
