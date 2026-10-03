import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {ImageLightbox, ImageLightboxProps} from './ImageLightbox';
import {Button} from '../Button/Button';
import {Card} from '../Card/Card';
import {Inline, Stack} from '../Layout';
import {Media} from '../Media/Media';
import {Text} from '../Text/Text';
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
		'Полноэкранный просмотр поверх backdrop: фото с тенью, без рамки.',
	),
	argTypes: {
		open: {
			control: 'boolean',
		},
		defaultIndex: {
			control: 'number',
		},
		onOpenChange: {
			action: 'onOpenChange',
		},
		onIndexChange: {
			action: 'onIndexChange',
		},
	},
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
					onOpenChange={setIsOpen}
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
					onOpenChange={setIsOpen}
					images={DEMO_IMAGES}
					index={startIndex}
					onIndexChange={setStartIndex}
				/>
			</>
		);
	},
	parameters: story('Клик по превью открывает lightbox с нужного слайда.'),
};

export const Empty: Story<ImageLightboxProps> = {
	render: function EmptyRender() {
		const [isOpen, setIsOpen] = useState(false);
		return (
			<>
				<Button
					variant='secondary'
					onClick={() => setIsOpen(true)}
				>
					Открыть пустой lightbox
				</Button>
				<ImageLightbox
					open={isOpen}
					onOpenChange={setIsOpen}
					images={[]}
				/>
			</>
		);
	},
	parameters: story('Пустой массив изображений внутри lightbox.'),
};

export const SingleImage: Story<ImageLightboxProps> = {
	render: function SingleRender() {
		const [isOpen, setIsOpen] = useState(false);
		return (
			<>
				<Button onClick={() => setIsOpen(true)}>
					Открыть одно фото
				</Button>
				<ImageLightbox
					open={isOpen}
					onOpenChange={setIsOpen}
					images={[DEMO_IMAGES[0]]}
				/>
			</>
		);
	},
	parameters: story('Один кадр — без стрелок галереи.'),
};

export const Interaction: Story<ImageLightboxProps> = {
	render: Playground.render,
	play: async ({canvasElement}) => {
		const button = canvasElement.querySelector('button');
		if (!(button instanceof HTMLButtonElement)) {
			throw new Error('Не найдена кнопка открытия lightbox');
		}
		button.click();
	},
	parameters: story('Play: открывает lightbox.'),
};

export const UsageExample: Story<ImageLightboxProps> = {
	render: function UsageExampleRender() {
		const [isOpen, setIsOpen] = useState(false);
		const [index, setIndex] = useState(0);
		return (
			<Card
				variant='outlined'
				header={(
					<Text weight='bold'>
						Галерея объекта
					</Text>
				)}
				style={{maxWidth: 480}}
			>
				<Stack gap='sm'>
					<Inline gap='sm' wrap>
						{DEMO_IMAGES.map((image, i) => (
							<button
								key={image.src}
								type='button'
								onClick={() => {
									setIndex(i);
									setIsOpen(true);
								}}
								style={{
									padding: 0,
									border: 'none',
									background: 'none',
									cursor: 'pointer',
									width: 96,
								}}
							>
								<Media
									src={image.thumbnail ?? image.src}
									alt={image.alt}
									ratio={4 / 3}
								/>
							</button>
						))}
					</Inline>
					<Text size='sm' color='secondary'>
						Клик по превью открывает полноэкранный просмотр.
					</Text>
				</Stack>
				<ImageLightbox
					open={isOpen}
					onOpenChange={setIsOpen}
					images={DEMO_IMAGES}
					index={index}
					onIndexChange={setIndex}
				/>
			</Card>
		);
	},
	parameters: story('Сетка Media-превью + ImageLightbox.'),
};
