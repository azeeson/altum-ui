import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {ImageCrop, ImageCropProps, ImageCropResult} from './ImageCrop';
import {UploadZone} from '../UploadZone/UploadZone';
import {Avatar} from '../Avatar/Avatar';
import {Button} from '../Button/Button';
import {Card} from '../Card/Card';
import {Inline, Stack} from '../Layout/Layout';
import {Text} from '../Text/Text';
import {demoImage} from '../../storybook/demoImages';
import {componentParameters, story, Story} from '../../storybook/meta';

export default {
	title: 'altum/Components/ImageCrop',
	component: ImageCrop,
	tags: ['autodocs'],
	parameters: componentParameters(
		'Обрезка изображения в lightbox: круг/квадрат, pan и масштаб за углы изображения. Обычно открывается после UploadZone.',
	),
	argTypes: {
		shape: {
			control: {
				type: 'select',
				options: ['circle', 'square'],
			},
			description: 'Форма рамки обрезки',
		},
		title: {
			control: 'text',
		},
		confirmLabel: {
			control: 'text',
		},
		cancelLabel: {
			control: 'text',
		},
		cropSize: {
			control: 'number',
			description: 'Размер рамки на экране (px)',
		},
		outputSize: {
			control: 'number',
			description: 'Размер выходного файла (px)',
		},
		onOpenChange: {
			action: 'onOpenChange',
		},
		onCrop: {
			action: 'onCrop',
		},
	},
} satisfies Meta<typeof ImageCrop>;

export const Playground: Story<ImageCropProps> = {
	render: function PlaygroundRender(args) {
		const [open, setOpen] = useState(false);
		const [preview, setPreview] = useState<string | null>(null);
		return (
			<Stack gap='md' style={{maxWidth: 360}}>
				<Button
					variant='primary'
					size='sm'
					onClick={() => setOpen(true)}
				>
					Обрезать демо-фото
				</Button>
				{preview && (
					<Avatar src={preview} size={64} />
				)}
				<ImageCrop
					{...args}
					open={open}
					src={demoImage(1)}
					onOpenChange={setOpen}
					onCrop={(result: ImageCropResult) => setPreview(result.dataUrl)}
				/>
			</Stack>
		);
	},
	args: {
		shape: 'circle',
		title: 'Фото профиля',
		cropSize: 280,
		outputSize: 512,
	},
	parameters: story('Открывает ImageCrop с локальным `src` без UploadZone.'),
};

export const WithUploadZone: Story<ImageCropProps> = {
	render: function WithUploadZoneRender(args) {
		const [file, setFile] = useState<File | null>(null);
		const [open, setOpen] = useState(false);
		const [preview, setPreview] = useState<string | null>(null);

		return (
			<div style={{
				display: 'flex',
				flexDirection: 'column',
				gap: 'var(--altum-g-space-4)',
				maxWidth: 360
			}}
			>
				<UploadZone
					multiple={false}
					onChange={(files) => {
						const next = files[0];
						if (!next?.type.startsWith('image/')) return;
						setFile(next);
						setOpen(true);
					}}
				/>

				{preview && (
					<div style={{
						display: 'flex',
						alignItems: 'center',
						gap: 'var(--altum-g-space-3)'
					}}
					>
						<Avatar src={preview} size={64} />
						<Button
							variant='secondary'
							size='sm'
							onClick={() => {
								setPreview(null);
								setFile(null);
							}}
						>
							Сбросить
						</Button>
					</div>
				)}

				<ImageCrop
					{...args}
					open={open}
					file={file}
					onOpenChange={setOpen}
					onCrop={(result: ImageCropResult) => {
						setPreview(result.dataUrl);
					}}
				/>
			</div>
		);
	},
	args: {
		shape: 'circle',
		title: 'Фото профиля',
	},
	parameters: story('Выберите изображение в UploadZone — откроется ImageCrop.'),
};

export const Square: Story<ImageCropProps> = {
	render: function SquareRender() {
		const [file, setFile] = useState<File | null>(null);
		const [open, setOpen] = useState(false);
		const [preview, setPreview] = useState<string | null>(null);

		return (
			<div style={{
				display: 'flex',
				flexDirection: 'column',
				gap: 'var(--altum-g-space-4)',
				maxWidth: 360
			}}
			>
				<UploadZone
					multiple={false}
					onChange={(files) => {
						const next = files[0];
						if (!next?.type.startsWith('image/')) return;
						setFile(next);
						setOpen(true);
					}}
				>
					{(openDialog) => (
						<Button
							type='button'
							variant='secondary'
							onClick={openDialog}
						>
							Загрузить обложку
						</Button>
					)}
				</UploadZone>

				{preview && (
					<img
						src={preview}
						alt='Обложка'
						style={{
							width: 160,
							height: 160,
							objectFit: 'cover',
							borderRadius: 'var(--altum-g-radius)',
							border: '1px solid var(--altum-color-border)',
						}}
					/>
				)}

				<ImageCrop
					open={open}
					file={file}
					shape='square'
					title='Обложка'
					onOpenChange={setOpen}
					onCrop={(result) => setPreview(result.dataUrl)}
				/>
			</div>
		);
	},
	parameters: story('Квадратная рамка обрезки.'),
};

export const LoadError: Story<ImageCropProps> = {
	render: function ErrorRender() {
		const [open, setOpen] = useState(false);
		return (
			<Stack gap='sm'>
				<Button
					variant='secondary'
					size='sm'
					onClick={() => setOpen(true)}
				>
					Открыть с битым src
				</Button>
				<ImageCrop
					open={open}
					onOpenChange={setOpen}
					src='/images/missing-file.jpeg'
					title='Ошибка загрузки'
				/>
			</Stack>
		);
	},
	parameters: story('Состояние ошибки, если изображение не загрузилось.'),
};

export const Interaction: Story<ImageCropProps> = {
	render: Playground.render,
	args: {
		shape: 'circle',
		title: 'Фото профиля',
	},
	play: async ({canvasElement}) => {
		const button = canvasElement.querySelector('button');
		if (!(button instanceof HTMLButtonElement)) {
			throw new Error('Не найдена кнопка открытия ImageCrop');
		}
		button.click();
	},
	parameters: story('Play: открывает диалог обрезки с демо-фото.'),
};

export const UsageExample: Story<ImageCropProps> = {
	render: function UsageExampleRender() {
		const [open, setOpen] = useState(false);
		const [preview, setPreview] = useState<string | null>(null);
		return (
			<Card
				variant='outlined'
				header={(
					<Text weight='bold'>
						Профиль
					</Text>
				)}
				style={{maxWidth: 360}}
			>
				<Inline gap='md' align='center'>
					<Avatar
						src={preview ?? undefined}
						name='Анна Иванова'
						size={64}
					/>
					<Stack gap='xs'>
						<Text size='sm'>
							Фото профиля
						</Text>
						<Button
							size='sm'
							variant='secondary'
							onClick={() => setOpen(true)}
						>
							Изменить
						</Button>
					</Stack>
				</Inline>
				<ImageCrop
					open={open}
					onOpenChange={setOpen}
					src={demoImage(2)}
					shape='circle'
					title='Фото профиля'
					onCrop={(result) => setPreview(result.dataUrl)}
				/>
			</Card>
		);
	},
	parameters: story('Avatar + ImageCrop как смена фото профиля.'),
};
