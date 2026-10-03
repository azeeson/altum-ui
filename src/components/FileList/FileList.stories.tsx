import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {FileList, type FileListItemProps} from './FileList';
import {Stack} from '../Layout';
import {Card} from '../Card/Card';
import {Text} from '../Text/Text';
import {Button} from '../Button/Button';
import {UploadZone} from '../UploadZone/UploadZone';
import {EmptyState} from '../EmptyState/EmptyState';
import {componentParameters, story, Story} from '../../storybook/meta';

const STATUS_ITEMS: FileListItemProps[] = [
	{
		id: '1',
		name: 'contract.pdf',
		size: 245_760,
		status: 'idle',
	},
	{
		id: '2',
		name: 'photo.jpg',
		size: 1_048_576,
		status: 'uploading',
		progress: 62,
	},
	{
		id: '3',
		name: 'report.xlsx',
		size: 89_000,
		status: 'done',
	},
	{
		id: '4',
		name: 'archive.zip',
		size: 5_242_880,
		status: 'error',
		error: 'Превышен лимит 5 MB',
	},
];

export default {
	title: 'altum/Components/FileList',
	component: FileList,
	tags: ['autodocs'],
	parameters: componentParameters(
		'Список загрузок на базе `Item`: статусы, progress, retry / remove.',
	),
} satisfies Meta<typeof FileList>;

export const Playground: Story<Record<string, never>> = {
	render: function PlaygroundRender() {
		const [items, setItems] = useState(STATUS_ITEMS);

		return (
			<div style={{maxWidth: 480}}>
				<FileList.Root>
					{items.map((item) => (
						<FileList.Item
							key={item.id}
							{...item}
							attachmentSize='sm'
							onRemove={(id) => {
								setItems((prev) => prev.filter((row) => row.id !== id));
							}}
							onRetry={(id) => {
								setItems((prev) => prev.map((row) => (
									row.id === id
										? {
											...row,
											status: 'uploading' as const,
											progress: 0,
											error: undefined,
										}
										: row
								)));
							}}
						/>
					))}
				</FileList.Root>
			</div>
		);
	},
	parameters: story('Строки — `Item` (media / title / actions) + Progress при uploading.'),
};

export const SingleItem: Story<Record<string, never>> = {
	render: function SingleItemRender() {
		const [progress, setProgress] = useState(35);

		return (
			<Stack gap='md' style={{maxWidth: 480}}>
				<FileList.Root>
					<FileList.Item
						id='upload-1'
						name='presentation.pdf'
						size={2_097_152}
						status='uploading'
						progress={progress}
						onRemove={() => window.alert('Удалить')}
					/>
				</FileList.Root>
				<button
					type='button'
					onClick={() => setProgress((value) => Math.min(100, value + 15))}
				>
					+15% прогресса
				</button>
			</Stack>
		);
	},
	parameters: story('Одиночная строка собирается через `FileList.Root` и `FileList.Item`.'),
};

export const Statuses: Story<Record<string, never>> = {
	render: () => (
		<div style={{maxWidth: 480}}>
			<FileList.Root>
				{STATUS_ITEMS.map((item) => (
					<FileList.Item
						key={item.id}
						{...item}
						attachmentSize='sm'
						onRemove={() => {}}
						onRetry={() => {}}
					/>
				))}
			</FileList.Root>
		</div>
	),
	parameters: story('Все статусы: idle, uploading, done, error.'),
};

export const Sizes: Story<Record<string, never>> = {
	render: () => (
		<Stack gap='lg' style={{maxWidth: 480}}>
			{(['xs', 'sm', 'md'] as const).map((size) => (
				<Stack key={size} gap='xs'>
					<Text size='sm' color='muted'>
						attachmentSize=
						{size}
					</Text>
					<FileList.Root>
						<FileList.Item
							id={`size-${size}`}
							name='brief.pdf'
							size={128_000}
							status='idle'
							attachmentSize={size}
							onRemove={() => {}}
						/>
					</FileList.Root>
				</Stack>
			))}
		</Stack>
	),
	parameters: story('Размеры превью: xs / sm / md.'),
};

export const Empty: Story<Record<string, never>> = {
	render: () => (
		<div style={{maxWidth: 480}}>
			<EmptyState
				title='Файлов нет'
				description='Перетащите документы в зону загрузки или выберите с диска.'
			/>
			<FileList.Root>
				{[]}
			</FileList.Root>
		</div>
	),
	parameters: story('Пустой список рядом с EmptyState.'),
};

export const OverflowText: Story<Record<string, never>> = {
	render: () => (
		<div style={{maxWidth: 320}}>
			<FileList.Root>
				<FileList.Item
					id='long'
					name='очень-длинное-имя-договора-поставки-оборудования-и-сопутствующих-услуг-версия-финальная-signed.pdf'
					size={12_582_912}
					status='error'
					error='Имя файла слишком длинное и не помещается в строку метаданных'
					onRemove={() => {}}
					onRetry={() => {}}
				/>
			</FileList.Root>
		</div>
	),
	parameters: story('Длинное имя файла и текст ошибки в узкой колонке.'),
};

export const UsageExample: Story<Record<string, never>> = {
	render: function UsageExampleRender() {
		const [items, setItems] = useState<FileListItemProps[]>(STATUS_ITEMS.slice(0, 2));

		return (
			<Card
				variant='outlined'
				header={(
					<Text weight='bold'>
						Вложения заявки
					</Text>
				)}
				style={{maxWidth: 480}}
			>
				<Stack gap='md'>
					<UploadZone
						multiple
						onChange={(files) => {
							const next = Array.from(files).map((file, index) => ({
								id: `${file.name}-${index}`,
								name: file.name,
								size: file.size,
								status: 'idle' as const,
							}));
							setItems((prev) => [...next, ...prev]);
						}}
					>
						Перетащите файлы или нажмите, чтобы выбрать
					</UploadZone>
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
					<Button
						variant='secondary'
						size='sm'
						onClick={() => setItems([])}
					>
						Очистить список
					</Button>
				</Stack>
			</Card>
		);
	},
	parameters: story('UploadZone + FileList внутри карточки заявки.'),
};

export const Interaction: Story<Record<string, never>> = {
	render: function InteractionRender() {
		const [items, setItems] = useState(STATUS_ITEMS);

		return (
			<div style={{maxWidth: 480}}>
				<FileList.Root>
					{items.map((item) => (
						<FileList.Item
							key={item.id}
							{...item}
							onRemove={(id) => {
								setItems((prev) => prev.filter((row) => row.id !== id));
							}}
							onRetry={(id) => {
								setItems((prev) => prev.map((row) => (
									row.id === id
										? {
											...row,
											status: 'uploading' as const,
											progress: 10,
											error: undefined,
										}
										: row
								)));
							}}
						/>
					))}
				</FileList.Root>
			</div>
		);
	},
	play: async ({canvasElement}) => {
		const retry = canvasElement.querySelector('button[aria-label="Повторить"]');
		if (retry instanceof HTMLButtonElement) retry.click();
		const remove = canvasElement.querySelector('button[aria-label="Удалить"]');
		if (remove instanceof HTMLButtonElement) remove.click();
	},
	parameters: story('Play: retry ошибки и удаление первой строки.'),
};
