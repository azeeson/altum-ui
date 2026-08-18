import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {ImageCrop, ImageCropProps, ImageCropResult} from './ImageCrop';
import {UploadZone} from '../UploadZone/UploadZone';
import {Avatar} from '../Avatar/Avatar';
import {Button} from '../Button/Button';
import {componentParameters, story, Story} from '../../storybook/meta';

export default {
	title: 'altum/Components/ImageCrop',
	component: ImageCrop,
	tags: ['autodocs'],
	parameters: componentParameters(
		'Обрезка изображения в lightbox: круг/квадрат, pan и масштаб за углы. Обычно открывается после UploadZone.',
	),
	argTypes: {
		shape: {
			control: {type: 'select'},
			options: ['circle', 'square'],
		},
	},
} satisfies Meta<typeof ImageCrop>;

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
					onClose={() => setOpen(false)}
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
					onClose={() => setOpen(false)}
					onCrop={(result) => setPreview(result.dataUrl)}
				/>
			</div>
		);
	},
	parameters: story('Квадратная рамка обрезки.'),
};
