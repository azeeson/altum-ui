import type {Meta} from '@storybook/react';
import React, {useEffect, useState} from 'react';
import {UploadZone, UploadZoneProps} from './UploadZone';
import {TextField} from '../TextField/TextField';
import {Button} from '../Button/Button';
import {Avatar} from '../Avatar/Avatar';
import {IconPencil} from '../../icons/icons/IconPencil';
import styles from './UploadZone.stories.module.css';
import {componentParameters, story, Story} from '../../storybook/meta';

export default {
	title: 'altum-ui/Components/UploadZone',
	component: UploadZone,
	tags: ['autodocs'],
	parameters: componentParameters('Зона загрузки файлов с drag-and-drop и render-prop для кастомного триггера.'),
	argTypes: {
		multiple: {
			control: 'boolean',
			description: 'Разрешить выбор нескольких файлов'
		},
	},
} satisfies Meta<typeof UploadZone>;

export const Playground: Story<UploadZoneProps> = {
	render: () => (
		<UploadZone
			onChange={(files) => {
				// eslint-disable-next-line no-console -- демо-обработчик в Storybook
				console.log('Файлы:', files);
			}}
		/>
	),
	parameters: story('Используйте панель Controls для настройки.'),
};

export const CustomTrigger: Story<UploadZoneProps> = {
	render: () => (
		<UploadZone
			onChange={(files) => {
				// eslint-disable-next-line no-console -- демо-обработчик в Storybook
				console.log(files);
			}}
		>
			{(openFileDialog) => (
				<form className='my-form' onSubmit={(e) => e.preventDefault()}>
					<h3>
						Оформление заказа
					</h3>
					<TextField type='text' label='Ваше имя' />
					<Button type='button' onClick={openFileDialog}>
						Загрузить акты (.pdf)
					</Button>
					<Button type='submit'>
						Отправить
					</Button>
				</form>
			)}
		</UploadZone>
	),
	parameters: story('Кастомная кнопка загрузки внутри формы через render-prop.'),
};

export const AvatarUpload: Story<UploadZoneProps> = {
	render: function AvatarUploadRender() {
		const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

		useEffect(() => {
			return () => {
				if (avatarUrl) URL.revokeObjectURL(avatarUrl);
			};
		}, [avatarUrl]);

		const handleFileChange = (files: FileList) => {
			const file = files[0];
			if (file && file.type.startsWith('image/')) {
				if (avatarUrl) URL.revokeObjectURL(avatarUrl);
				setAvatarUrl(URL.createObjectURL(file));
			} else {
				alert('Пожалуйста, выберите изображение (JPEG, PNG, WebP)');
			}
		};

		return (
			<>
				<UploadZone
					onChange={handleFileChange}
					multiple={false}
					className={styles.avatarZone}
				>
					{(openFileDialog) => (
						<div className={styles.avatarContainer} onClick={openFileDialog}>
							{avatarUrl ? (
								<img
									src={avatarUrl}
									alt='Аватар'
									className={styles.avatarImage}
								/>
							) : (
								<div className={styles.avatarPlaceholder}>
									<svg
										width='40'
										height='40'
										viewBox='0 0 24 24'
										fill='none'
										stroke='currentColor'
										strokeWidth='1.5'
									>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											d='M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z'
										/>
									</svg>
								</div>
							)}
							<div className={styles.editBadge} title='Изменить фото'>
								<svg
									width='14'
									height='14'
									viewBox='0 0 24 24'
									fill='none'
									stroke='currentColor'
									strokeWidth='2'
								>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										d='M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z'
									/>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										d='M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z'
									/>
								</svg>
							</div>
						</div>
					)}
				</UploadZone>
				<UploadZone onChange={handleFileChange} multiple={false}>
					{(openFileDialog) => (
						<button className={styles.uploadAvatarButton} onClick={openFileDialog}>
							<Avatar src={avatarUrl || undefined} size={64} />
							<button className={styles.cameraButton}>
								<IconPencil className={styles.cameraIcon} />
							</button>
						</button>
					)}
				</UploadZone>
			</>
		);
	},
	parameters: story('Загрузка аватара с превью и кастомным триггером.'),
};
