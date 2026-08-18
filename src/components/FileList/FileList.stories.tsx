/* eslint-disable @stylistic/indent, @stylistic/jsx-closing-bracket-location -- Существующее форматирование фикстуры Storybook сохранено для читаемого вложенного JSX. */
import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {FileList, type FileListItemProps} from './FileList';
import {Stack} from '../Layout/Layout';
import {componentParameters, story, Story} from '../../storybook/meta';

const STATUS_ITEMS: FileListItemProps[] = [
	{
		id: '1',
		name: 'contract.pdf',
		size: 245_760,
		status: 'idle'
	},
	{
		id: '2',
		name: 'photo.jpg',
		size: 1_048_576,
		status: 'uploading',
		progress: 62
	},
	{
		id: '3',
		name: 'report.xlsx',
		size: 89_000,
		status: 'done'
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
	title: 'altum-ui/Components/FileList',
	component: FileList,
	tags: ['autodocs'],
	parameters: componentParameters(
		'Список загрузок на базе `Attachment`: статусы, progress, retry / remove.',
	),
} satisfies Meta<typeof FileList>;

export const Playground: Story<Record<string, never>> = {
	render: function PlaygroundRender() {
		const [items, setItems] = useState(STATUS_ITEMS);

		return (
			<div style={{maxWidth: 480}}>
				<FileList.Root>
					{items.map((item) => (<FileList.Item
						key={item.id}
						{...item}
						attachmentSize='sm'
						onRemove={(id) => {
							setItems((prev) => prev.filter((item) => item.id !== id));
						}}
						onRetry={(id) => {
							setItems((prev) => prev.map((item) => (
								item.id === id
									? {
										...item,
										status: 'uploading' as const,
										progress: 0,
										error: undefined
									}
									: item
							)));
						}}
					                      />))}
				</FileList.Root>
			</div>
		);
	},
	parameters: story('Строки — `Attachment` (media / title / actions) + Progress при uploading.'),
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
				{STATUS_ITEMS.map((item) => (<FileList.Item
					key={item.id}
					{...item}
					attachmentSize='sm'
					onRemove={() => {}}
					onRetry={() => {}}
				/>))}
			</FileList.Root>
		</div>
	),
	parameters: story('Все статусы: idle, uploading, done, error.'),
};
