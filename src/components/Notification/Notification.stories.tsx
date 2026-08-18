import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {
	Notification,
	NotificationContainer,
	NotificationItem,
	type NotificationPosition,
} from './Notification';
import {NotificationProvider, notify} from './toast';
import {Button} from '../Button/Button';
import {componentParameters, story, Story} from '../../storybook/meta';

const POSITIONS: NotificationPosition[] = [
	'top-left',
	'top-center',
	'top-right',
	'bottom-left',
	'bottom-center',
	'bottom-right',
];

export default {
	title: 'altum/Components/Notification',
	component: Notification,
	tags: ['autodocs'],
	parameters: componentParameters('Стек всплывающих уведомлений с типами, действиями и автоскрытием.'),
	argTypes: {},
} satisfies Meta<typeof Notification>;

export const Playground: Story<Record<string, never>> = {
	render: function PlaygroundRender() {
		const [visible, setVisible] = useState(false);

		const handleSuccess = () => {
			setVisible(true);
		};

		return (
			<>
				<Button variant='primary' onClick={handleSuccess}>
					Показать уведомление
				</Button>
				<Notification.Viewport>
					{visible && (
						<Notification.Root variant='success' onClose={() => setVisible(false)}>
							<Notification.Title>
								Успешная операция
							</Notification.Title>
							<Notification.Description>
								Данные обновлены в базе
							</Notification.Description>
							<Notification.Close />
						</Notification.Root>
					)}
				</Notification.Viewport>
			</>
		);
	},
	parameters: story('Используйте панель Controls для настройки.'),
};

export const WithActions: Story<Record<string, never>> = {
	render: function WithActionsRender() {
		const [visible, setVisible] = useState(false);

		const handleStaticWithActions = () => {
			setVisible(true);
		};

		return (
			<>
				<Button variant='secondary' onClick={handleStaticWithActions}>
					Статичное с кнопками
				</Button>
				<Notification.Viewport position='top-right'>
					{visible && (
						<Notification.Root duration={0} onClose={() => setVisible(false)}>
							<Notification.Title>
								Доступно обновление
							</Notification.Title>
							<Notification.Description>
								Желаете перезагрузить вкладку сейчас?
							</Notification.Description>
							<Notification.Close />
							<Notification.Actions>
								<Button size='sm' onClick={() => setVisible(false)}>
									Обновить
								</Button>
							</Notification.Actions>
						</Notification.Root>
					)}
				</Notification.Viewport>
			</>
		);
	},
	parameters: story('Уведомление с кнопками действий и бесконечным временем показа.'),
};

export const WithUndoCountdown: Story<Record<string, never>> = {
	render: function WithUndoCountdownRender() {
		const [list, setList] = useState<NotificationItem[]>([]);
		const [undone, setUndone] = useState(false);

		const pushUndo = () => {
			const id = Date.now().toString();
			setUndone(false);
			setList((prev) => [
				...prev,
				{
					id,
					title: 'Задача создана',
					description: 'Отменить в течение 5 секунд (⌘Z / Ctrl+Z)',
					variant: 'success',
					duration: 5000,
					progress: true,
					actions: [
						{
							label: 'Отменить',
							variant: 'secondary',
							shortcut: 'mod+z',
							onClick: () => setUndone(true),
						},
					],
				},
			]);
		};

		return (
			<>
				<Button variant='primary' onClick={pushUndo}>
					Создать задачу (toast)
				</Button>
				{undone && (
					<div style={{
						marginTop: 12,
						fontSize: 13,
						color: 'var(--altum-color-status-success)'
					}}
					>
						Создание отменено
					</div>
				)}
				<NotificationContainer
					notifications={list}
					position='top-right'
					onClose={(id) => setList((prev) => prev.filter((item) => item.id !== id))}
				/>
			</>
		);
	},
	parameters: story('Прогресс обратного отсчёта + Отмена: shortcut «mod+z» (любая строка mod|ctrl|meta|alt|shift+key).'),
};

export const ImperativeNotify: Story<Record<string, never>> = {
	render: function ImperativeRender() {
		return (
			<NotificationProvider position='top-right'>
				<div style={{
					display: 'flex',
					gap: 8,
					flexWrap: 'wrap'
				}}
				>
					<Button size='sm' onClick={() => notify.success('Сохранено')}>
						success
					</Button>
					<Button
						size='sm'
						variant='secondary'
						onClick={() => notify.info('Инфо', 'Подробности')}
					>
						info
					</Button>
					<Button
						size='sm'
						variant='primary'
						status='danger'
						onClick={() => notify.error('Ошибка')}
					>
						error
					</Button>
				</div>
			</NotificationProvider>
		);
	},
	parameters: story('Императивный `notify()` через NotificationProvider.'),
};

export const Stacked: Story<Record<string, never>> = {
	render: function StackedRender() {
		const [list, setList] = useState<NotificationItem[]>([]);
		const [position, setPosition] = useState<NotificationPosition>('bottom-right');

		const pushMany = () => {
			const base = Date.now();
			setList([
				{
					id: `${base}-1`,
					title: 'Событие создано',
					description: 'Воскресенье, 3 декабря 2023, 9:00',
					variant: 'info',
					duration: 0,
					actions: [
						{
							label: 'Отменить',
							variant: 'secondary',
							onClick: () => undefined
						}
					],
				},
				{
					id: `${base}-2`,
					title: 'Файл загружен',
					description: 'report-q3.pdf · 2.4 MB',
					variant: 'success',
					duration: 0,
				},
				{
					id: `${base}-3`,
					title: 'Нужно внимание',
					description: 'Проверьте доступ к API',
					variant: 'warning',
					duration: 0,
				},
				{
					id: `${base}-4`,
					title: 'Синхронизация',
					description: 'Фоновый процесс…',
					variant: 'info',
					duration: 0,
				},
			]);
		};

		const pushNew = () => {
			const id = Date.now().toString();
			setList((prev) => [
				...prev,
				{
					id,
					title: 'Новое уведомление',
					description: 'Всегда сверху стопки',
					variant: 'success',
					duration: 0,
				},
			]);
		};

		return (
			<div style={{
				display: 'flex',
				flexDirection: 'column',
				gap: 12
			}}
			>
				<div style={{
					display: 'flex',
					gap: 8,
					flexWrap: 'wrap'
				}}
				>
					<Button variant='primary' onClick={pushMany}>
						Собрать стопку
					</Button>
					<Button variant='secondary' onClick={pushNew}>
						Добавить сверху
					</Button>
					<Button variant='ghost' onClick={() => setList([])}>
						Очистить
					</Button>
				</div>
				<div style={{
					display: 'flex',
					gap: 6,
					flexWrap: 'wrap'
				}}
				>
					{POSITIONS.map((pos) => (
						<Button
							key={pos}
							size='sm'
							variant={position === pos ? 'primary' : 'secondary'}
							onClick={() => setPosition(pos)}
						>
							{pos}
						</Button>
					))}
				</div>
				<NotificationContainer
					notifications={list}
					onClose={(id) => setList((prev) => prev.filter((item) => item.id !== id))}
					stacked
					position={position}
				/>
			</div>
		);
	},
	parameters: story('Стопка с анимацией раскрытия; `position` — угол или центр сверху/снизу.'),
};
