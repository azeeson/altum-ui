import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {Attachment, AttachmentProps} from './Attachment';
import {Box} from '../Box/Box';
import {Card} from '../Card/Card';
import {Inline, Stack} from '../Layout';
import {Text} from '../Text/Text';
import {Title} from '../Title/Title';
import {IconDocument} from '../../icons/icons/IconDocument';
import {IconCross} from '../../icons/icons/IconCross';
import {IconDownload} from '../../icons/icons/IconDownload';
import {componentParameters, story, Story} from '../../storybook/meta';
import {playClick} from '../../storybook/play';
import {ButtonIcon} from '../ButtonIcon/ButtonIcon';

function RemoveAction({onClick}: {onClick?: () => void}) {
	return (
		<ButtonIcon
			variant='ghost'
			size='sm'
			aria-label='Удалить'
			icon={<IconCross size={14}/>}
			onClick={onClick}
		/>
	);
}

const attachmentArgs = {
	media: <IconDocument size={20} />,
	title: 'report.pdf',
	description: 'PDF · 2,4 МБ',
} as const;

export default {
	title: 'altum/Components/Attachment',
	component: Attachment,
	tags: ['autodocs'],
	parameters: componentParameters(
		'Карточка файла или изображения: media, метаданные, статус загрузки и действия.',
	),
	argTypes: {
		size: {
			control: {
				type: 'select',
				options: ['md', 'sm', 'xs'],
			},
			description: 'Размер карточки',
		},
		status: {
			control: {
				type: 'select',
				options: [
					'idle',
					'uploading',
					'error',
					'done'
				],
			},
			description: 'Состояние загрузки / ошибки',
		},
		title: {
			control: 'text',
		},
		description: {
			control: 'text',
		},
		onClick: {
			action: 'click',
		},
	},
} satisfies Meta<typeof Attachment>;

export const Playground: Story<AttachmentProps> = {
	args: {
		...attachmentArgs,
		size: 'md',
		status: 'idle',
	},
	render: (args) => (
		<div style={{maxWidth: 320}}>
			<Attachment
				{...args}
				actions={<RemoveAction />}
			/>
		</div>
	),
	parameters: story('Базовый размер md. Controls: size, status, title, description.'),
};

export const Sizes: Story<AttachmentProps> = {
	render: () => (
		<Stack gap='sm' style={{maxWidth: 320}}>
			<Attachment
				size='md'
				{...attachmentArgs}
				actions={<RemoveAction />}
			/>
			<Attachment
				size='sm'
				{...attachmentArgs}
				actions={<RemoveAction />}
			/>
			<Attachment
				size='xs'
				{...attachmentArgs}
				actions={<RemoveAction />}
			/>
		</Stack>
	),
	parameters: story('Размеры md / sm / xs.'),
};

export const Statuses: Story<AttachmentProps> = {
	render: () => (
		<Stack gap='sm' style={{maxWidth: 320}}>
			<Attachment
				status='idle'
				{...attachmentArgs}
				actions={<RemoveAction />}
			/>
			<Attachment
				status='uploading'
				{...attachmentArgs}
				actions={<RemoveAction />}
			/>
			<Attachment
				status='done'
				title='report.pdf'
				description='Загружено'
				media={<IconDocument size={20} />}
			/>
			<Attachment
				status='error'
				title='report.pdf'
				description='Не удалось загрузить'
				media={<IconDocument size={20} />}
				actions={<RemoveAction />}
			/>
		</Stack>
	),
	parameters: story('Все статусы: idle / uploading / done / error.'),
};

export const OverflowText: Story<AttachmentProps> = {
	render: () => (
		<div style={{maxWidth: 280}}>
			<Attachment
				title='очень-длинное-имя-файла-квартальный-отчёт-по-продажам-2026-финальный-v3.pdf'
				description='PDF · 128,4 МБ · из папки «Документы / Финансы / Архив»'
				media={<IconDocument size={20} />}
				actions={<RemoveAction />}
			/>
		</div>
	),
	parameters: story('Длинное имя файла и описание в узкой карточке.'),
};

export const Interaction: Story<AttachmentProps> = {
	render: function InteractionRender() {
		const [removed, setRemoved] = useState(false);
		if (removed) {
			return (
				<Text size='sm' color='muted'>
					Файл удалён
				</Text>
			);
		}
		return (
			<div style={{maxWidth: 320}}>
				<Attachment
					{...attachmentArgs}
					actions={<RemoveAction onClick={() => setRemoved(true)} />}
				/>
			</div>
		);
	},
	play: async ({canvasElement}) => {
		await playClick(canvasElement, 'button[aria-label="Удалить"]');
	},
	parameters: story('Play: клик по действию удаления.'),
};

export const UsageExample: Story<AttachmentProps> = {
	render: () => (
		<div style={{maxWidth: 400}}>
			<Card
				header={(
					<Title level={4}>
						Вложения к задаче
					</Title>
				)}
			>
				<Stack gap='sm'>
					<Attachment
						size='sm'
						status='done'
						title='brief.pdf'
						description='PDF · 420 КБ'
						media={<IconDocument size={18} />}
						actions={(
							<Inline gap='xs'>
								<ButtonIcon
									variant='ghost'
									size='sm'
									aria-label='Скачать'
									icon={<IconDownload size={14}/>}
								/>
								<RemoveAction />
							</Inline>
						)}
					/>
					<Attachment
						size='sm'
						status='uploading'
						title='mockup.png'
						description='PNG · загрузка…'
						media={<IconDocument size={18} />}
					/>
					<Box variant='muted' style={{padding: 'var(--altum-g-space-2)'}}>
						<Text size='xs' color='muted'>
							Можно перетащить ещё файлы в задачу.
						</Text>
					</Box>
				</Stack>
			</Card>
		</div>
	),
	parameters: story('Список вложений в карточке задачи: done, uploading и подсказка.'),
};
