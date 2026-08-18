import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {Modal, ModalProps} from './Modal';
import {Button} from '../Button/Button';
import {Text} from '../Text/Text';
import {componentParameters, story, Story} from '../../storybook/meta';

export default {
	title: 'altum/Components/Modal',
	component: Modal,
	tags: ['autodocs'],
	parameters: componentParameters(
		'Модальное окно (составное): Header / Title / Close / Body / Footer. Header и Footer — sticky.',
	),
} satisfies Meta<typeof Modal>;

export const Playground: Story<ModalProps> = {
	render: function PlaygroundRender() {
		const [isOpen, setIsOpen] = useState(false);
		return (
			<>
				<Button variant='primary' onClick={() => setIsOpen(true)}>
					Показать диалог
				</Button>
				<Modal open={isOpen} onClose={() => setIsOpen(false)}>
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
							onClick={() => setIsOpen(false)}
						>
							Закрыть
						</Button>
					</Modal.Footer>
				</Modal>
			</>
		);
	},
	parameters: story('Составной API: Modal + Header/Title/Body/Footer.'),
};

export const WithFooter: Story<ModalProps> = {
	render: function WithFooterRender() {
		const [isOpen, setIsOpen] = useState(false);
		return (
			<>
				<Button variant='primary' onClick={() => setIsOpen(true)}>
					Редактировать профиль
				</Button>
				<Modal open={isOpen} onClose={() => setIsOpen(false)}>
					<Modal.Header>
						<Modal.Title>
							Редактировать профиль
						</Modal.Title>
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
				<Modal open={isOpen} onClose={() => setIsOpen(false)}>
					<Modal.Header>
						<Modal.Title>
							Удалить аккаунт
						</Modal.Title>
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
							variant='primary'
							status='danger'
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
				<Modal open={isOpen} onClose={() => setIsOpen(false)}>
					<Modal.Header>
						<Modal.Title>
							Длинный список
						</Modal.Title>
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
				<Modal open={isOpen} onClose={() => setIsOpen(false)}>
					<Modal.Header>
						<Modal.Title>
							Настройки профиля
						</Modal.Title>
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
					<Modal.FormFooter
						message={dirty ? 'Есть несохранённые изменения' : 'Все изменения сохранены'}
					>
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
					</Modal.FormFooter>
				</Modal>
			</>
		);
	},
	parameters: story('`Modal.FormFooter`: message слева, кнопки передаются children.'),
};
