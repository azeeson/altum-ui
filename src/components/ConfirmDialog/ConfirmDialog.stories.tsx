import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {ConfirmDialog, ConfirmDialogProps} from './ConfirmDialog';
import {Button} from '../Button/Button';
import {Text} from '../Text/Text';
import {Card} from '../Card/Card';
import {Stack, Inline} from '../Layout';
import {componentParameters, story, Story} from '../../storybook/meta';

export default {
	title: 'altum/Components/ConfirmDialog',
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
		loading: {
			control: 'boolean',
		},
		onConfirm: {action: 'onConfirm'},
		onOpenChange: {action: 'onOpenChange'},
	},
} satisfies Meta<typeof ConfirmDialog>;

export const Playground: Story<ConfirmDialogProps> = {
	render: function PlaygroundRender(args) {
		const [isOpen, setIsOpen] = useState(false);
		return (
			<>
				<Button
					variant='danger'
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
					onOpenChange={setIsOpen}
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
		loading: false,
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
					onOpenChange={setIsOpen}
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
					variant='danger'
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
					onOpenChange={setDestructiveOpen}
				/>
				<ConfirmDialog
					open={defaultOpen}
					title='Продолжить?'
					message='Действие изменит настройки приложения.'
					confirmLabel='Продолжить'
					cancelLabel='Отмена'
					status='default'
					onConfirm={() => setDefaultOpen(false)}
					onOpenChange={setDefaultOpen}
				/>
			</div>
		);
	},
	parameters: story('`status`: destructive и default.'),
};

export const Loading: Story<ConfirmDialogProps> = {
	render: () => (
		<ConfirmDialog
			open
			title='Удаление…'
			message='Идёт удаление списка. Не закрывайте вкладку.'
			confirmLabel='Удалить'
			cancelLabel='Отмена'
			status='danger'
			loading
			onConfirm={() => undefined}
			onOpenChange={() => undefined}
		/>
	),
	parameters: story('`loading` блокирует кнопки и закрытие на время запроса.'),
};

export const SecondaryAction: Story<ConfirmDialogProps> = {
	render: function SecondaryActionRender() {
		const [open, setOpen] = useState(true);
		return (
			<ConfirmDialog
				open={open}
				title='Удалить файл?'
				message='Можно отправить в архив вместо безвозвратного удаления.'
				confirmLabel='Удалить'
				cancelLabel='Отмена'
				status='danger'
				secondaryAction={{
					label: 'В архив',
					onClick: () => setOpen(false),
				}}
				onConfirm={() => setOpen(false)}
				onOpenChange={setOpen}
			/>
		);
	},
	parameters: story('Дополнительное действие слева в футере.'),
};

export const OverflowText: Story<ConfirmDialogProps> = {
	render: () => (
		<ConfirmDialog
			open
			title='Удалить очень длинный производственный регламент и все связанные черновики?'
			message='Это действие нельзя отменить. Будут удалены все версии документа, комментарии согласующих, вложения и история изменений за последние несколько лет. Экспортируйте архив, если данные ещё нужны.'
			confirmLabel='Удалить безвозвратно'
			cancelLabel='Оставить как есть'
			status='danger'
			onConfirm={() => undefined}
			onOpenChange={() => undefined}
		/>
	),
	parameters: story('Длинный заголовок и сообщение в диалоге.'),
};

export const UsageExample: Story<ConfirmDialogProps> = {
	render: function UsageExampleRender() {
		const [open, setOpen] = useState(false);
		const [deleted, setDeleted] = useState(false);

		return (
			<Card
				variant='outlined'
				header={(
					<Text weight='bold'>
						Список «Входящие»
					</Text>
				)}
				style={{maxWidth: 360}}
			>
				<Stack gap='md'>
					<Text size='sm'>
						{deleted ? 'Список удалён.' : '12 задач, последнее обновление — сегодня.'}
					</Text>
					<Inline gap='sm'>
						<Button
							variant='danger'
							disabled={deleted}
							onClick={() => setOpen(true)}
						>
							Удалить список
						</Button>
					</Inline>
				</Stack>
				<ConfirmDialog
					open={open}
					title='Удалить список?'
					message='Все задачи в списке будут удалены безвозвратно.'
					confirmLabel='Удалить'
					cancelLabel='Отмена'
					status='danger'
					onConfirm={() => {
						setDeleted(true);
						setOpen(false);
					}}
					onOpenChange={setOpen}
				/>
			</Card>
		);
	},
	parameters: story('Подтверждение удаления из карточки списка.'),
};

export const Interaction: Story<ConfirmDialogProps> = {
	render: function InteractionRender() {
		const [open, setOpen] = useState(false);
		return (
			<>
				<Button
					variant='danger'
					onClick={() => setOpen(true)}
				>
					Удалить список
				</Button>
				<ConfirmDialog
					open={open}
					title='Удалить список?'
					message='Это действие нельзя отменить.'
					confirmLabel='Удалить'
					cancelLabel='Отмена'
					status='danger'
					onConfirm={() => setOpen(false)}
					onOpenChange={setOpen}
				/>
			</>
		);
	},
	play: async ({canvasElement}) => {
		const trigger = canvasElement.querySelector('button');
		trigger?.click();
	},
	parameters: story('Play: открытие диалога с триггера.'),
};
