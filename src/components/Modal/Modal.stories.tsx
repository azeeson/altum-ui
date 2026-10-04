import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {Modal, ModalProps} from './Modal';
import {Button} from '../Button/Button';
import {Text} from '../Text/Text';
import {TextField} from '../TextField/TextField';
import {ControlRow, Stack, Inline} from '../Layout';
import {componentParameters, story, Story} from '../../storybook/meta';

export default {
	title: 'altum/Components/Modal',
	component: Modal,
	tags: ['autodocs'],
	parameters: componentParameters(
		'Модальное окно: корень DialogLayout, шапка — Header внутри Layout. Крестик поверх контента. Header и Footer — sticky.',
	),
	argTypes: {
		open: {control: 'boolean'},
		size: {
			control: 'inline-radio',
			options: ['sm', 'md', 'lg'],
		},
		'aria-label': {control: 'text'},
		onOpenChange: {action: 'onOpenChange'},
	},
} satisfies Meta<typeof Modal>;

export const Playground: Story<ModalProps> = {
	render: function PlaygroundRender() {
		const [isOpen, setIsOpen] = useState(false);
		return (
			<>
				<Button variant='primary' onClick={() => setIsOpen(true)}>
					Показать диалог
				</Button>
				<Modal open={isOpen} onOpenChange={setIsOpen}>
					<Modal.Header>
						<Modal.Header.Title level={3}>
							Системное оповещение
						</Modal.Header.Title>
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
							onClick={() => setIsOpen(false)}
						>
							Закрыть
						</Button>
					</Modal.Footer>
				</Modal>
			</>
		);
	},
	parameters: story('Составной API: `Modal.Header` рендерит `Header` (`Title`, `Subtitle`, `Tabs`).'),
};

export const Sizes: Story<ModalProps> = {
	render: function SizesRender() {
		const [size, setSize] = useState<'sm' | 'md' | 'lg' | null>(null);
		return (
			<>
				<Inline gap='sm'>
					<Button onClick={() => setSize('sm')}>
						sm
					</Button>
					<Button onClick={() => setSize('md')}>
						md
					</Button>
					<Button onClick={() => setSize('lg')}>
						lg
					</Button>
				</Inline>
				<Modal
					open={size != null}
					size={size ?? 'md'}
					onOpenChange={(next) => {
						if (!next) setSize(null);
					}}
				>
					<Modal.Header>
						<Modal.Header.Title level={3}>
							{`Размер ${size ?? 'md'}`}
						</Modal.Header.Title>
					</Modal.Header>
					<Modal.Body>
						<Text size='md'>
							Ширина sm / md / lg. Узкое окно браузера сжимает диалог, оставляя отступ от краёв.
						</Text>
					</Modal.Body>
					<Modal.Footer>
						<Button
							variant='primary'
							size='sm'
							onClick={() => setSize(null)}
						>
							Закрыть
						</Button>
					</Modal.Footer>
				</Modal>
			</>
		);
	},
	parameters: story('`size`: sm 400px, md 500px, lg 600px. Уже окна — с отступом 16px.'),
};

export const WithFooter: Story<ModalProps> = {
	render: function WithFooterRender() {
		const [isOpen, setIsOpen] = useState(false);
		return (
			<>
				<Button variant='primary' onClick={() => setIsOpen(true)}>
					Редактировать профиль
				</Button>
				<Modal open={isOpen} onOpenChange={setIsOpen}>
					<Modal.Header>
						<Modal.Header.Title level={3}>
							Редактировать профиль
						</Modal.Header.Title>
					</Modal.Header>
					<Modal.Body>
						<Text size='md'>
							Кнопки действий размещайте в Modal.Footer.
						</Text>
					</Modal.Body>
					<Modal.Footer>
						<Button
							variant='secondary'
							size='sm'
							onClick={() => setIsOpen(false)}
						>
							Отмена
						</Button>
						<Button
							variant='primary'
							size='sm'
							onClick={() => setIsOpen(false)}
						>
							Сохранить
						</Button>
					</Modal.Footer>
				</Modal>
			</>
		);
	},
	parameters: story('Header + Body + Footer с двумя кнопками.'),
};

export const FooterAlignment: Story<ModalProps> = {
	render: function FooterAlignmentRender() {
		const [isOpen, setIsOpen] = useState(false);
		return (
			<>
				<Button variant='secondary' onClick={() => setIsOpen(true)}>
					Удалить аккаунт
				</Button>
				<Modal open={isOpen} onOpenChange={setIsOpen}>
					<Modal.Header>
						<Modal.Header.Title level={3}>
							Удалить аккаунт
						</Modal.Header.Title>
					</Modal.Header>
					<Modal.Body>
						<Text size='md'>
							Это действие необратимо и его нельзя отменить.
						</Text>
					</Modal.Body>
					<Modal.Footer align='space-between'>
						<Button
							variant='secondary'
							size='sm'
							onClick={() => setIsOpen(false)}
						>
							Отмена
						</Button>
						<Button
							variant='danger'
							size='sm'
							onClick={() => setIsOpen(false)}
						>
							Удалить
						</Button>
					</Modal.Footer>
				</Modal>
			</>
		);
	},
	parameters: story('Футер с `align="space-between"`.'),
};

export const StickySections: Story<ModalProps> = {
	render: function StickySectionsRender() {
		const [isOpen, setIsOpen] = useState(false);
		return (
			<>
				<Button variant='primary' onClick={() => setIsOpen(true)}>
					Длинный контент
				</Button>
				<Modal open={isOpen} onOpenChange={setIsOpen}>
					<Modal.Header>
						<Modal.Header.Title level={3}>
							Длинный список
						</Modal.Header.Title>
					</Modal.Header>
					<Modal.Body>
						<div style={{
							display: 'flex',
							flexDirection: 'column',
							gap: 'var(--altum-g-space-3)'
						}}
						>
							{Array.from({length: 24}, (_, index) => (
								<Text key={index} size='md'>
									Пункт
									{' '}
									{index + 1}
									{' '}
									— скроллится только Body, Header и Footer остаются на месте.
								</Text>
							))}
						</div>
					</Modal.Body>
					<Modal.Footer>
						<Button
							variant='secondary'
							size='sm'
							onClick={() => setIsOpen(false)}
						>
							Отмена
						</Button>
						<Button
							variant='primary'
							size='sm'
							onClick={() => setIsOpen(false)}
						>
							Готово
						</Button>
					</Modal.Footer>
				</Modal>
			</>
		);
	},
	parameters: story('Sticky Header/Footer при прокрутке длинного Body.'),
};

export const FormFooter: Story<ModalProps> = {
	render: function FormFooterRender() {
		const [isOpen, setIsOpen] = useState(false);
		const [dirty, setDirty] = useState(true);
		const [loading, setLoading] = useState(false);

		const handleSubmit = () => {
			setLoading(true);
			window.setTimeout(() => {
				setLoading(false);
				setDirty(false);
				setIsOpen(false);
			}, 900);
		};

		return (
			<>
				<Button
					variant='primary'
					onClick={() => {
						setDirty(true);
						setIsOpen(true);
					}}
				>
					Редактировать
				</Button>
				<Modal open={isOpen} onOpenChange={setIsOpen}>
					<Modal.Header>
						<Modal.Header.Title level={3}>
							Настройки профиля
						</Modal.Header.Title>
					</Modal.Header>
					<Modal.Body>
						<Text size='md'>
							Измените поля и сохраните. В футере — статус несохранённых изменений.
						</Text>
						<label style={{
							display: 'flex',
							alignItems: 'center',
							gap: 'var(--altum-g-space-2)',
							marginTop: 'var(--altum-g-space-3)',
							fontSize: 13,
						}}
						>
							<input
								type='checkbox'
								checked={dirty}
								onChange={(event) => setDirty(event.target.checked)}
							/>
							Есть несохранённые изменения
						</label>
					</Modal.Body>
					<Modal.Footer>
						<ControlRow justify='between'>
							<Text
								size='sm'
								color='muted'
								role='status'
							>
								{dirty ? 'Есть несохранённые изменения' : 'Все изменения сохранены'}
							</Text>
							<ControlRow>
								<Button
									type='button'
									variant='secondary'
									size='sm'
									onClick={() => setIsOpen(false)}
									disabled={loading}
								>
									Отмена
								</Button>
								<Button
									type='button'
									variant='primary'
									size='sm'
									onClick={handleSubmit}
									disabled={!dirty || loading}
									loading={loading}
								>
									Сохранить
								</Button>
							</ControlRow>
						</ControlRow>
					</Modal.Footer>
				</Modal>
			</>
		);
	},
	parameters: story('Статус и кнопки в `Modal.Footer` через `ControlRow`.'),
};

export const Opened: Story<ModalProps> = {
	render: () => (
		<Modal open onOpenChange={() => undefined}>
			<Modal.Header>
				<Modal.Header.Title level={3}>
					Системное оповещение
				</Modal.Header.Title>
			</Modal.Header>
			<Modal.Body>
				<Text size='md'>
					Драйвер устройства успешно инициализирован в системе.
				</Text>
			</Modal.Body>
			<Modal.Footer>
				<Button variant='primary' size='sm'>
					Закрыть
				</Button>
			</Modal.Footer>
		</Modal>
	),
	parameters: story('Открытая модалка для визуальной регрессии chrome.'),
};

export const OverflowText: Story<ModalProps> = {
	render: () => (
		<Modal open onOpenChange={() => undefined}>
			<Modal.Header>
				<Modal.Header.Title level={3}>
					Очень длинный заголовок модального окна про уточнение юридических условий обработки данных
				</Modal.Header.Title>
			</Modal.Header>
			<Modal.Body>
				<Text size='md'>
					Текст, который проверяет перенос в теле диалога без горизонтального скролла всей модалки.
				</Text>
			</Modal.Body>
			<Modal.Footer>
				<Button variant='primary' size='sm'>
					Понятно
				</Button>
			</Modal.Footer>
		</Modal>
	),
	parameters: story('Длинный заголовок в шапке модалки.'),
};

export const UsageExample: Story<ModalProps> = {
	render: function UsageExampleRender() {
		const [open, setOpen] = useState(false);
		const [name, setName] = useState('Мария Иванова');

		return (
			<>
				<Button variant='primary' onClick={() => setOpen(true)}>
					Редактировать имя
				</Button>
				<Modal open={open} onOpenChange={setOpen}>
					<Modal.Header>
						<Modal.Header.Title level={3}>
							Профиль
						</Modal.Header.Title>
					</Modal.Header>
					<Modal.Body>
						<Stack gap='md'>
							<TextField
								label='ФИО'
								value={name}
								onChange={(event) => setName(event.target.value)}
								width='full'
							/>
							<Text size='sm' color='muted'>
								Имя отображается в шапке кабинета и в уведомлениях.
							</Text>
						</Stack>
					</Modal.Body>
					<Modal.Footer>
						<Inline gap='sm'>
							<Button
								variant='secondary'
								size='sm'
								onClick={() => setOpen(false)}
							>
								Отмена
							</Button>
							<Button
								variant='primary'
								size='sm'
								onClick={() => setOpen(false)}
							>
								Сохранить
							</Button>
						</Inline>
					</Modal.Footer>
				</Modal>
			</>
		);
	},
	parameters: story('Форма редактирования профиля внутри модалки.'),
};

export const Interaction: Story<ModalProps> = {
	render: function InteractionRender() {
		const [open, setOpen] = useState(false);
		return (
			<>
				<Button variant='primary' onClick={() => setOpen(true)}>
					Показать диалог
				</Button>
				<Modal open={open} onOpenChange={setOpen}>
					<Modal.Header>
						<Modal.Header.Title level={3}>
							Системное оповещение
						</Modal.Header.Title>
					</Modal.Header>
					<Modal.Body>
						<Text size='md'>
							Диалог открыт сценарием play.
						</Text>
					</Modal.Body>
					<Modal.Footer>
						<Button
							variant='primary'
							size='sm'
							onClick={() => setOpen(false)}
						>
							Закрыть
						</Button>
					</Modal.Footer>
				</Modal>
			</>
		);
	},
	play: async ({canvasElement}) => {
		const trigger = canvasElement.querySelector('button');
		trigger?.click();
	},
	parameters: story('Play: открытие модалки по клику на триггер.'),
};
