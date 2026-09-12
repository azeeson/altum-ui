import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {ImageGallery, type ImageGalleryProps} from './ImageGallery';
import {Card} from '../Card/Card';
import {Stack} from '../Layout/Layout';
import {Text} from '../Text/Text';
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
		'Галерея изображений: основное фото по центру, стрелки поверх кадра (появляются при наведении), миниатюры снизу, смена слайда с fade.',
	),
	argTypes: {
		chrome: {
			control: {
				type: 'radio',
				options: ['default', 'none'],
			},
			description: 'default — стрелки, миниатюры, счётчик',
		},
		showNav: {
			control: 'boolean',
		},
		showThumbnails: {
			control: 'boolean',
		},
		showCounter: {
			control: 'boolean',
		},
		enableKeyboard: {
			control: 'boolean',
		},
		defaultIndex: {
			control: 'number',
		},
		onIndexChange: {
			action: 'onIndexChange',
		},
	},
} satisfies Meta<typeof ImageGallery>;

function Gallery({
	images = DEMO_IMAGES,
	...rest
}: Partial<ImageGalleryProps> & {images?: typeof DEMO_IMAGES}) {
	return (
		<ImageGallery
			images={images}
			{...rest}
		/>
	);
}

export const Playground: Story<ImageGalleryProps> = {
	render: (args) => (
		<Gallery
			chrome={args.chrome}
			showNav={args.showNav}
			showThumbnails={args.showThumbnails}
			showCounter={args.showCounter}
			enableKeyboard={args.enableKeyboard}
		/>
	),
	args: {
		chrome: 'default',
		enableKeyboard: true,
	},
	parameters: story('Дефолтный chrome: кадр, стрелки, миниатюры, счётчик.'),
};

export const Controlled: Story<ImageGalleryProps> = {
	render: function ControlledRender() {
		const [index, setIndex] = useState(0);

		return (
			<div style={{maxWidth: 720}}>
				<ImageGallery
					images={DEMO_IMAGES}
					index={index}
					onIndexChange={setIndex}
					enableKeyboard
					showThumbnails={false}
				/>
			</div>
		);
	},
	parameters: story('Контролируемый режим через index и onIndexChange.'),
};

export const SingleImage: Story<ImageGalleryProps> = {
	render: () => <Gallery images={[demoGalleryItem(8, 'Одно фото')]} />,
	parameters: story('Одно изображение — без стрелок и миниатюр.'),
};

export const StringUrls: Story<ImageGalleryProps> = {
	render: () => (
		<ImageGallery
			images={[demoImage(6), demoImage(7)]}
			chrome='none'
		/>
	),
	parameters: story('Массив строк — alt сгенерируется автоматически. `chrome="none"` — только кадр.'),
};

export const Empty: Story<ImageGalleryProps> = {
	render: () => (
		<div style={{maxWidth: 480}}>
			<ImageGallery images={[]} />
		</div>
	),
	parameters: story('Пустой массив — текст «Нет изображений».'),
};

export const NavOnly: Story<ImageGalleryProps> = {
	render: () => (
		<Gallery
			showThumbnails={false}
			showCounter={false}
		/>
	),
	parameters: story('Только стрелки поверх кадра.'),
};

export const Interaction: Story<ImageGalleryProps> = {
	render: () => (
		<div style={{maxWidth: 720}}>
			<Gallery />
		</div>
	),
	play: async ({canvasElement}) => {
		const next = canvasElement.querySelector('button[aria-label="Следующее изображение"]');
		if (!(next instanceof HTMLButtonElement)) {
			throw new Error('Не найдена кнопка следующего кадра');
		}
		next.click();
	},
	parameters: story('Play: клик по стрелке «следующее».'),
};

export const UsageExample: Story<ImageGalleryProps> = {
	render: () => (
		<Card
			variant='outlined'
			header={(
				<Text weight='bold'>
					Фото объекта
				</Text>
			)}
			style={{maxWidth: 560}}
		>
			<Stack gap='sm'>
				<ImageGallery images={DEMO_IMAGES.slice(0, 3)} />
				<Text size='sm' color='secondary'>
					Стрелки поверх кадра, миниатюры снизу.
				</Text>
			</Stack>
		</Card>
	),
	parameters: story('Галерея внутри Card.'),
};
