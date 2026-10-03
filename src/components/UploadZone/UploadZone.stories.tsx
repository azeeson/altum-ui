import type {Meta} from '@storybook/react';
import React, {useEffect, useState} from 'react';
import {UploadZone, UploadZoneProps} from './UploadZone';
import {TextField} from '../TextField/TextField';
import {Button} from '../Button/Button';
import {Avatar} from '../Avatar/Avatar';
import {Card} from '../Card/Card';
import {FileList} from '../FileList/FileList';
import {Inline, Stack} from '../Layout';
import {Text} from '../Text/Text';
import {Title} from '../Title/Title';
import {componentParameters, story, Story} from '../../storybook/meta';
import {playFocus} from '../../storybook/play';

export default {
	title: 'altum/Components/UploadZone',
	component: UploadZone,
	tags: ['autodocs'],
	parameters: componentParameters('Зона загрузки файлов с drag-and-drop и render-prop для кастомного триггера.'),
	argTypes: {
		multiple: {
			control: 'boolean',
			description: 'Разрешить выбор нескольких файлов',
		},
		disabled: {
			control: 'boolean',
			description: 'Заблокированное состояние',
		},
		readOnly: {
			control: 'boolean',
			description: 'Только чтение: зона не принимает файлы',
		},
		onChange: {
			action: 'change',
			description: 'Колбэк выбранных файлов',
		},
	},
} satisfies Meta<typeof UploadZone>;

export const Playground: Story<UploadZoneProps> = {
	args: {
		multiple: true,
		disabled: false,
		readOnly: false,
	},
	parameters: story('Используйте панель Controls для настройки.'),
};

export const Disabled: Story<UploadZoneProps> = {
	args: {
		disabled: true,
		multiple: true,
	},
	parameters: story('Заблокированная зона: клик и drag-and-drop недоступны.'),
};

export const ReadOnly: Story<UploadZoneProps> = {
	args: {
		readOnly: true,
		multiple: true,
	},
	parameters: story('Только чтение: визуально зона есть, выбор файлов выключен.'),
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
				<form onSubmit={(event) => event.preventDefault()}>
					<Stack gap='md' style={{maxWidth: 400}}>
						<Title level={3}>
							Оформление заказа
						</Title>
						<TextField type='text' label='Ваше имя' />
						<Inline gap='sm'>
							<Button
								type='button'
								variant='secondary'
								onClick={openFileDialog}
							>
								Загрузить акты (.pdf)
							</Button>
							<Button type='submit'>
								Отправить
							</Button>
						</Inline>
					</Stack>
				</form>
			)}
		</UploadZone>
	),
	parameters: story('Кастомная кнопка загрузки внутри формы через render-prop.'),
};

export const AvatarUpload: Story<UploadZoneProps> = {
	render: function AvatarUploadRender() {
		const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
		const [error, setError] = useState<string | null>(null);

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
				setError(null);
				return;
			}
			setError('Выберите изображение (JPEG, PNG, WebP)');
		};

		return (
			<Stack gap='sm'>
				<UploadZone
					onChange={handleFileChange}
					multiple={false}
				>
					{(openFileDialog) => (
						<Inline gap='md' align='center'>
							<Avatar src={avatarUrl || undefined} size={64} />
							<Button
								type='button'
								variant='secondary'
								size='sm'
								onClick={openFileDialog}
							>
								Загрузить фото
							</Button>
						</Inline>
					)}
				</UploadZone>
				{error ? (
					<Text size='sm' color='error'>
						{error}
					</Text>
				) : null}
			</Stack>
		);
	},
	parameters: story('Загрузка аватара с превью через кастомный триггер.'),
};

export const Interaction: Story<UploadZoneProps> = {
	render: () => (
		<UploadZone />
	),
	play: async ({canvasElement}) => {
		await playFocus(canvasElement, 'input[type="file"]');
	},
	parameters: story('Play ставит фокус на скрытый file input.'),
};

export const UsageExample: Story<UploadZoneProps> = {
	render: function UsageExampleRender() {
		const [items, setItems] = useState<Array<{
			id: string;
			name: string;
			size: number;
			status: 'idle';
		}>>([]);

		return (
			<Card
				style={{maxWidth: 480}}
				header={(
					<Text weight='bold'>
						Вложения заявки
					</Text>
				)}
			>
				<Stack gap='md'>
					<UploadZone
						multiple
						onChange={(files) => {
							const next = Array.from(files).map((file, index) => ({
								id: `${file.name}-${index}-${file.size}`,
								name: file.name,
								size: file.size,
								status: 'idle' as const,
							}));
							setItems((prev) => [...next, ...prev]);
						}}
					/>
					{items.length > 0 ? (
						<FileList.Root>
							{items.map((item) => (
								<FileList.Item
									key={item.id}
									{...item}
									onRemove={(id) => {
										setItems((prev) => prev.filter((row) => row.id !== id));
									}}
								/>
							))}
						</FileList.Root>
					) : (
						<Text size='sm' color='muted'>
							Файлы появятся в списке после выбора.
						</Text>
					)}
					<Button
						variant='secondary'
						size='sm'
						disabled={items.length === 0}
						onClick={() => setItems([])}
					>
						Очистить список
					</Button>
				</Stack>
			</Card>
		);
	},
	parameters: story('UploadZone и FileList внутри карточки заявки.'),
};
