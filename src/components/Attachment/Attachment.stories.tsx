import type {Meta} from '@storybook/react';
import React from 'react';
import {Attachment, AttachmentProps} from './Attachment';
import {IconDocument} from '../../icons/icons/IconDocument';
import {IconCross} from '../../icons/icons/IconCross';
import {componentParameters, story, Story} from '../../storybook/meta';

const attachmentContent = (
	<>
		<Attachment.Media>
			<IconDocument size={20} />
		</Attachment.Media>
		<Attachment.Content>
			<Attachment.Title>
				report.pdf
			</Attachment.Title>
			<Attachment.Description>
				PDF · 2,4 МБ
			</Attachment.Description>
		</Attachment.Content>
		<Attachment.Actions>
			<Attachment.Action aria-label='Удалить'>
				<IconCross size={14} />
			</Attachment.Action>
		</Attachment.Actions>
	</>
);

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
	},
} satisfies Meta<typeof Attachment>;

export const Default: Story<AttachmentProps> = {
	render: () => (
		<div style={{maxWidth: 320}}>
			<Attachment>
				{attachmentContent}
			</Attachment>
		</div>
	),
	parameters: story('Базовый размер md.'),
};

export const Small: Story<AttachmentProps> = {
	render: () => (
		<div style={{maxWidth: 280}}>
			<Attachment size='sm'>
				{attachmentContent}
			</Attachment>
		</div>
	),
	parameters: story('Компактный размер sm.'),
};

export const ExtraSmall: Story<AttachmentProps> = {
	render: () => (
		<div style={{maxWidth: 240}}>
			<Attachment size='xs'>
				{attachmentContent}
			</Attachment>
		</div>
	),
	parameters: story('Минимальный размер xs.'),
};

export const Uploading: Story<AttachmentProps> = {
	render: () => (
		<div style={{maxWidth: 320}}>
			<Attachment status='uploading'>
				{attachmentContent}
			</Attachment>
		</div>
	),
	parameters: story('Состояние uploading — спиннер поверх media.'),
};
