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

const meta = {
	title: 'altum-ui/Test/VisualOpenStates',
	parameters: {
		layout: 'padded',
		docs: {disable: true},
	},
} satisfies Meta;

export default meta;

type Story = StoryObj;

const noop = () => undefined;

const makeSvgDataUrl = (color: string, label: string) =>
	`data:image/svg+xml,${encodeURIComponent(
		`<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
      <rect width="800" height="600" fill="${color}"/>
      <text x="400" y="300" text-anchor="middle" dominant-baseline="middle" fill="#ffffff" font-family="sans-serif" font-size="32">${label}</text>
    </svg>`,
	)}`;

const LIGHTBOX_IMAGES = [
	{
		src: makeSvgDataUrl('#2563eb', 'Слайд 1'),
		alt: 'Слайд 1',
		thumbnail: makeSvgDataUrl('#2563eb', '1'),
	},
	{
		src: makeSvgDataUrl('#7c3aed', 'Слайд 2'),
		alt: 'Слайд 2',
		thumbnail: makeSvgDataUrl('#7c3aed', '2'),
	},
];

export const ModalOpen: Story = {
	render: () => (
		<Modal
			open
			onClose={noop}
		>
			<Modal.Header>
				<Modal.Title>
					Системное оповещение
				</Modal.Title>
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
			onCancel={noop}
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
			onCancel={noop}
		/>
	),
};

export const SheetSidebarOpen: Story = {
	render: () => (
		<Sheet
			open
			onClose={noop}
			mode='sidebar'
			direction='end'
			width={320}
			backdrop
		>
			<Sheet.Header showClose>
				<Sheet.Title>
					Навигация
				</Sheet.Title>
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
			onClose={noop}
			images={LIGHTBOX_IMAGES}
			index={0}
			onIndexChange={noop}
		/>
	),
};

export const DropdownOpen: Story = {
	render: () => (
		<Dropdown
			open
			onClose={noop}
			widthMode='content'
			mobileTitle='Меню'
		>
			<Dropdown.Trigger asChild>
				<Button variant='primary'>
					Открыто ▼
				</Button>
			</Dropdown.Trigger>
			<Dropdown.Content>
				<div style={{padding: 12}}>
					<Text size='sm'>
						Содержимое выпадающей панели
					</Text>
				</div>
			</Dropdown.Content>
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
				position='top'
				open
				asChild
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
			onClose={noop}
			mode='sheet'
			backdrop={false}
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
				<Sheet.Title>
					Действия
				</Sheet.Title>
			</Sheet.Header>
			<Sheet.Body>
				<Text size='md'>
					Нижняя панель без backdrop. Контент страницы остаётся видимым.
				</Text>
			</Sheet.Body>
		</Sheet>
	),
};
