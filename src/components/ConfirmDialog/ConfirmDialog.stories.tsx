import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {ConfirmDialog, ConfirmDialogProps} from './ConfirmDialog';
import {Button} from '../Button/Button';
import {componentParameters, story, Story} from '../../storybook/meta';

export default {
	title: 'altum-ui/Components/ConfirmDialog',
	component: ConfirmDialog,
	tags: ['autodocs'],
	parameters: componentParameters('Диалог подтверждения для деструктивных и критичных действий.'),
	argTypes: {
		title: {
			control: 'text',
			description: 'Заголовок диалога'
		},
		message: {
			control: 'text',
			description: 'Текст сообщения'
		},
		status: {
			control: {
				type: 'select',
				options: ['default', 'danger']
			},
			description: 'Семантика опасности',
		},
		confirmLabel: {
			control: 'text',
			description: 'Текст кнопки подтверждения'
		},
		cancelLabel: {
			control: 'text',
			description: 'Текст кнопки отмены'
		},
	},
} satisfies Meta<typeof ConfirmDialog>;

export const Playground: Story<ConfirmDialogProps> = {
	render: function PlaygroundRender(args) {
		const [isOpen, setIsOpen] = useState(false);
		return (
			<>
				<Button
					variant='primary'
					status='danger'
					onClick={() => setIsOpen(true)}
				>
					Удалить список
				</Button>
				<ConfirmDialog
					{...args}
					open={isOpen}
					title={args.title ?? 'Удалить список?'}
					message={args.message ?? 'Это действие нельзя отменить.'}
					confirmLabel={args.confirmLabel ?? 'Удалить'}
					cancelLabel={args.cancelLabel ?? 'Отмена'}
					status={args.status ?? 'danger'}
					onConfirm={() => setIsOpen(false)}
					onCancel={() => setIsOpen(false)}
				/>
			</>
		);
	},
	args: {
		title: 'Удалить список?',
		message: 'Это действие нельзя отменить. Все задачи в списке будут удалены безвозвратно.',
		confirmLabel: 'Удалить',
		cancelLabel: 'Отмена',
		status: 'danger',
	},
	parameters: story('Используйте панель Controls для настройки.'),
};

export const UnsavedChanges: Story<ConfirmDialogProps> = {
	render: function UnsavedChangesRender() {
		const [isOpen, setIsOpen] = useState(false);
		return (
			<>
				<Button variant='secondary' onClick={() => setIsOpen(true)}>
					Уйти со страницы
				</Button>
				<ConfirmDialog
					open={isOpen}
					title='Несохранённые изменения'
					message='У вас есть несохранённые изменения. Точно уйти?'
					confirmLabel='Уйти'
					cancelLabel='Остаться'
					status='default'
					onConfirm={() => setIsOpen(false)}
					onCancel={() => setIsOpen(false)}
				/>
			</>
		);
	},
	parameters: story('Диалог подтверждения при несохранённых изменениях.'),
};

export const Variants: Story<ConfirmDialogProps> = {
	render: function VariantsRender() {
		const [destructiveOpen, setDestructiveOpen] = useState(false);
		const [defaultOpen, setDefaultOpen] = useState(false);

		return (
			<div style={{
				display: 'flex',
				gap: 12,
				flexWrap: 'wrap',
			}}
			>
				<Button
					variant='primary'
					status='danger'
					onClick={() => setDestructiveOpen(true)}
				>
					Опасное
				</Button>
				<Button variant='secondary' onClick={() => setDefaultOpen(true)}>
					Обычное
				</Button>
				<ConfirmDialog
					open={destructiveOpen}
					title='Удалить проект?'
					message='Все данные будут удалены без возможности восстановления.'
					confirmLabel='Удалить'
					cancelLabel='Отмена'
					status='danger'
					onConfirm={() => setDestructiveOpen(false)}
					onCancel={() => setDestructiveOpen(false)}
				/>
				<ConfirmDialog
					open={defaultOpen}
					title='Продолжить?'
					message='Действие изменит настройки приложения.'
					confirmLabel='Продолжить'
					cancelLabel='Отмена'
					status='default'
					onConfirm={() => setDefaultOpen(false)}
					onCancel={() => setDefaultOpen(false)}
				/>
			</div>
		);
	},
	parameters: story('`status`: destructive и default.'),
};
