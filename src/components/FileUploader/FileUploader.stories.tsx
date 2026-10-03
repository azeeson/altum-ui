import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {
	FileUploader,
	type FileUploaderFile,
	type FileUploaderProps,
} from './FileUploader';
import {Button} from '../Button/Button';
import {Card} from '../Card/Card';
import {Inline, Stack} from '../Layout';
import {Text} from '../Text/Text';
import {componentParameters, story, Story} from '../../storybook/meta';

const DEMO_FILES: FileUploaderFile[] = [
	{
		id: '1',
		name: 'contract.pdf',
		status: 'idle',
	},
	{
		id: '2',
		name: 'photo.jpg',
		status: 'uploading',
		progress: 62,
	},
	{
		id: '3',
		name: 'report.xlsx',
		status: 'done',
	},
	{
		id: '4',
		name: 'archive.zip',
		status: 'error',
	},
];

export default {
	title: 'altum/Components/FileUploader',
	component: FileUploader,
	tags: ['autodocs'],
	parameters: componentParameters(
		'Зона загрузки + опциональный `FileList`: тонкая композиция `UploadZone` и списка со статусами.',
	),
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
		onFiles: {
			action: 'files',
			description: 'Колбэк выбранных файлов из зоны',
		},
		files: {control: false},
		children: {control: false},
	},
} satisfies Meta<typeof FileUploader>;

export const Playground: Story<FileUploaderProps> = {
	args: {
		multiple: true,
		disabled: false,
		readOnly: false,
	},
	render: (args) => (
		<div style={{maxWidth: 480}}>
			<FileUploader {...args} />
		</div>
	),
	parameters: story('Только зона: список появляется после передачи `files`.'),
};

export const WithFiles: Story<FileUploaderProps> = {
	render: function WithFilesRender() {
		const [files, setFiles] = useState(DEMO_FILES);

		return (
			<div style={{maxWidth: 480}}>
				<FileUploader
					files={files}
					onFiles={(list) => {
						const next = Array.from(list).map((file, index) => ({
							id: `${file.name}-${file.size}-${index}`,
							name: file.name,
							status: 'idle' as const,
						}));
						setFiles((prev) => [...next, ...prev]);
					}}
					onRemove={(id) => {
						setFiles((prev) => prev.filter((row) => row.id !== id));
					}}
					onRetry={(id) => {
						setFiles((prev) => prev.map((row) => (
							row.id === id
								? {
									...row,
									status: 'uploading' as const,
									progress: 0,
								}
								: row
						)));
					}}
				/>
			</div>
		);
	},
	parameters: story('Зона + список: idle / uploading / done / error; remove и retry.'),
};

export const Interactive: Story<FileUploaderProps> = {
	render: function InteractiveRender() {
		const [files, setFiles] = useState<FileUploaderFile[]>([]);

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
					<FileUploader
						files={files}
						onFiles={(list) => {
							const next = Array.from(list).map((file, index) => ({
								id: `${file.name}-${file.size}-${Date.now()}-${index}`,
								name: file.name,
								status: 'uploading' as const,
								progress: 15,
							}));
							setFiles((prev) => [...next, ...prev]);
						}}
						onRemove={(id) => {
							setFiles((prev) => prev.filter((row) => row.id !== id));
						}}
						onRetry={(id) => {
							setFiles((prev) => prev.map((row) => (
								row.id === id
									? {
										...row,
										status: 'uploading' as const,
										progress: 15,
									}
									: row
							)));
						}}
					/>
					<Inline gap='sm'>
						<Button
							variant='secondary'
							size='sm'
							disabled={files.every((file) => file.status !== 'uploading')}
							onClick={() => {
								setFiles((prev) => prev.map((row) => (
									row.status === 'uploading'
										? {
											...row,
											progress: Math.min(100, (row.progress ?? 0) + 25),
											status: (row.progress ?? 0) + 25 >= 100
												? 'done' as const
												: 'uploading' as const,
										}
										: row
								)));
							}}
						>
							+25% прогресса
						</Button>
						<Button
							variant='ghost'
							size='sm'
							disabled={files.length === 0}
							onClick={() => setFiles([])}
						>
							Очистить
						</Button>
					</Inline>
				</Stack>
			</Card>
		);
	},
	parameters: story('Выбор файлов наполняет список; кнопка имитирует прогресс загрузки.'),
};

export const Disabled: Story<FileUploaderProps> = {
	args: {
		disabled: true,
		multiple: true,
		files: DEMO_FILES.slice(0, 2),
	},
	render: (args) => (
		<div style={{maxWidth: 480}}>
			<FileUploader {...args} />
		</div>
	),
	parameters: story('Заблокированная зона: клик и drag-and-drop недоступны.'),
};

export const ReadOnly: Story<FileUploaderProps> = {
	args: {
		readOnly: true,
		multiple: true,
		files: DEMO_FILES.slice(0, 2),
	},
	render: (args) => (
		<div style={{maxWidth: 480}}>
			<FileUploader {...args} />
		</div>
	),
	parameters: story('Только чтение: зона видна, выбор файлов выключен.'),
};

export const CustomTrigger: Story<FileUploaderProps> = {
	render: function CustomTriggerRender() {
		const [files, setFiles] = useState<FileUploaderFile[]>([]);

		return (
			<div style={{maxWidth: 480}}>
				<FileUploader
					files={files}
					onFiles={(list) => {
						const next = Array.from(list).map((file, index) => ({
							id: `${file.name}-${index}-${file.size}`,
							name: file.name,
							status: 'idle' as const,
						}));
						setFiles((prev) => [...next, ...prev]);
					}}
					onRemove={(id) => {
						setFiles((prev) => prev.filter((row) => row.id !== id));
					}}
				>
					{(openFileDialog) => (
						<Inline gap='sm' align='center'>
							<Button
								type='button'
								variant='secondary'
								onClick={openFileDialog}
							>
								Выбрать файлы
							</Button>
							<Text size='sm' color='muted'>
								PDF, изображения или архивы
							</Text>
						</Inline>
					)}
				</FileUploader>
			</div>
		);
	},
	parameters: story('Кастомный триггер через render-prop `children(openFileDialog)`.'),
};
