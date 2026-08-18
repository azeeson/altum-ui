/* eslint-disable @stylistic/jsx-closing-bracket-location -- Существующее форматирование фикстуры Storybook сохранено для читаемого вложенного JSX. */
import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {ImageGallery} from './ImageGallery';
import {demoGalleryItem, demoImage} from '../../storybook/demoImages';
import {componentParameters, story, Story} from '../../storybook/meta';

const DEMO_IMAGES = [
	demoGalleryItem(1, 'Горный пейзаж'),
	demoGalleryItem(2, 'Лесная тропа'),
	demoGalleryItem(3, 'Вид на океан'),
	demoGalleryItem(4, 'Городской горизонт'),
	demoGalleryItem(5, 'Песчаные дюны'),
];

export default {
	title: 'altum/Components/ImageGallery',
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
	render: () => <Gallery images={[demoGalleryItem(8, 'Одно фото')]} />,
	parameters: story('Композиция для одного изображения.')
};

export const StringUrls: Story<Record<string, never>> = {
	render: () => (<ImageGallery images={[demoImage(6), demoImage(7)]}>
		<ImageGallery.Viewport>
			<ImageGallery.Image />
		</ImageGallery.Viewport>
	</ImageGallery>),
	parameters: story('Можно передать массив строк — alt сгенерируется автоматически.')
};
