import type {Meta, StoryObj} from '@storybook/react';
import React from 'react';
import {Modal} from '../components/Modal/Modal';
import {ConfirmDialog} from '../components/ConfirmDialog/ConfirmDialog';
import {Sheet} from '../components/Sheet/Sheet';
import {ImageLightbox} from '../components/ImageLightbox/ImageLightbox';
import {Dropdown} from '../components/Dropdown/Dropdown';
import {Tooltip} from '../components/Tooltip/Tooltip';
import {Button} from '../components/Button/Button';
import {ButtonIcon} from '../components/ButtonIcon/ButtonIcon';
import {Text} from '../components/Text/Text';
import {Title} from '../components/Title/Title';
import {demoGalleryItem} from '../storybook/demoImages';

const meta = {
	title: 'altum/Test/VisualOpenStates',
	parameters: {
		layout: 'padded',
		docs: {disable: true},
	},
} satisfies Meta;

export default meta;

type Story = StoryObj;

const noop = () => undefined;

const LIGHTBOX_IMAGES = [demoGalleryItem(1, 'Слайд 1'), demoGalleryItem(2, 'Слайд 2')];

export const ModalOpen: Story = {
	render: () => (
		<Modal
			open
			onOpenChange={noop}
		>
			<Modal.Header>
				<Title level={3}>
					Системное оповещение
				</Title>
			</Modal.Header>
			<Modal.Body>
				<Text size='md'>
					Драйвер устройства успешно инициализирован в системе.
				</Text>
			</Modal.Body>
			<Modal.Footer>
				<Button
					variant='primary'
					size='sm'
					onClick={noop}
				>
					Закрыть
				</Button>
			</Modal.Footer>
		</Modal>
	),
};

export const ConfirmDialogDestructiveOpen: Story = {
	render: () => (
		<ConfirmDialog
			open
			title='Удалить список?'
			message='Это действие нельзя отменить. Все задачи в списке будут удалены безвозвратно.'
			confirmLabel='Удалить'
			cancelLabel='Отмена'
			status='danger'
			onConfirm={noop}
			onOpenChange={noop}
		/>
	),
};

export const ConfirmDialogDefaultOpen: Story = {
	render: () => (
		<ConfirmDialog
			open
			title='Несохранённые изменения'
			message='У вас есть несохранённые изменения. Точно уйти?'
			confirmLabel='Уйти'
			cancelLabel='Остаться'
			status='default'
			onConfirm={noop}
			onOpenChange={noop}
		/>
	),
};

export const SheetSidebarOpen: Story = {
	render: () => (
		<Sheet
			open
			onOpenChange={noop}
			mode='sidebar'
			direction='end'
			width={320}
		>
			<Sheet.Header showClose>
				<Title level={3}>
					Навигация
				</Title>
			</Sheet.Header>
			<Sheet.Body>
				<ul style={{
					margin: 0,
					paddingLeft: 'var(--altum-g-space-5)',
					display: 'flex',
					flexDirection: 'column',
					gap: 'var(--altum-g-space-2)',
				}}
				>
					<li>
						Дашборд
					</li>
					<li>
						Проекты
					</li>
					<li>
						Настройки
					</li>
				</ul>
			</Sheet.Body>
		</Sheet>
	),
};

export const ImageLightboxOpen: Story = {
	render: () => (
		<ImageLightbox
			open
			onOpenChange={noop}
			images={LIGHTBOX_IMAGES}
			index={0}
			onIndexChange={noop}
		/>
	),
};

export const DropdownOpen: Story = {
	render: () => (
		<Dropdown
			defaultOpen
			onOpenChange={noop}
			widthMode='content'
			mobileTitle='Меню'
			trigger={(
				<Button variant='primary'>
					Открыто ▼
				</Button>
			)}
		>
			<div style={{padding: 12}}>
				<Text size='sm'>
					Содержимое выпадающей панели
				</Text>
			</div>
		</Dropdown>
	),
};

export const TooltipVisible: Story = {
	render: () => (
		<div style={{
			display: 'flex',
			justifyContent: 'center',
			padding: 48
		}}
		>
			<Tooltip
				content='Полезная подсказка сверху'
				side='top'
				open
			>
				<Button variant='secondary'>
					Наведи на меня
				</Button>
			</Tooltip>
		</div>
	),
};

export const SheetOpen: Story = {
	render: () => (
		<Sheet
			open
			onOpenChange={noop}
			mode='sheet'
		>
			<Sheet.Header
				leftControls={(
					<Button
						variant='secondary'
						size='sm'
						onClick={noop}
					>
						Назад
					</Button>
				)}
				rightControls={(
					<ButtonIcon
						variant='ghost'
						size='sm'
						aria-label='Закрыть'
						onClick={noop}
					>
						✕
					</ButtonIcon>
				)}
			>
				<Title level={3}>
					Действия
				</Title>
			</Sheet.Header>
			<Sheet.Body>
				<Text size='md'>
					Нижняя панель. Контент страницы остаётся видимым.
				</Text>
			</Sheet.Body>
		</Sheet>
	),
};
