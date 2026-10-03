import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {
	Notification,
	NotificationContainer,
	NotificationItem,
	type NotificationPosition,
	type NotificationProps,
} from './Notification';
import {NotificationProvider, notify} from './toast';
import {Button} from '../Button/Button';
import {Text} from '../Text/Text';
import {Stack, Inline} from '../Layout';
import {componentParameters, story, Story} from '../../storybook/meta';

/** Карточки разной высоты: одна строка, короткое описание, кнопка, длинный текст. */
const STACK_HEIGHTS: Array<Omit<NotificationItem, 'id' | 'duration'>> = [
	{
		title: 'Сохранено',
		variant: 'success',
	},
	{
		title: 'Файл загружен',
		description: 'report-q3.pdf · 2.4 MB',
		variant: 'info',
	},
	{
		title: 'Нужно внимание',
		description: 'Проверьте доступ к API и срок действия ключа.',
		variant: 'warning',
		actions: [
			{
				label: 'Открыть',
				variant: 'secondary',
				onClick: () => undefined,
			},
		],
	},
	{
		title: 'Не удалось синхронизировать очень длинное название производственного регламента',
		description: 'Проверьте подключение к сети, права доступа к архиву и повторите попытку через несколько минут. Черновик сохранён локально и не потеряется.',
		variant: 'error',
		actions: [
			{
				label: 'Повторить',
				onClick: () => undefined,
			},
			{
				label: 'Отмена',
				variant: 'secondary',
				onClick: () => undefined,
			},
		],
	},
];

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
	argTypes: {
		variant: {
			control: 'select',
			options: [
				'info',
				'success',
				'warning',
				'error'
			],
		},
		title: {control: 'text'},
		description: {control: 'text'},
		duration: {control: 'number'},
		progress: {control: 'boolean'},
		pauseOnHover: {control: 'boolean'},
		onClose: {action: 'onClose'},
	},
} satisfies Meta<typeof Notification>;

export const Playground: Story<NotificationProps> = {
	render: function PlaygroundRender() {
		const [visible, setVisible] = useState(false);

		return (
			<>
				<Button variant='primary' onClick={() => setVisible(true)}>
					Показать уведомление
				</Button>
				<Notification.Viewport>
					{visible && (
						<Notification
							variant='success'
							title='Успешная операция'
							description='Данные обновлены в базе'
							onClose={() => setVisible(false)}
						/>
					)}
				</Notification.Viewport>
			</>
		);
	},
	parameters: story('Декларативный toast: `title` / `description`.'),
};

export const Variants: Story<NotificationProps> = {
	render: () => (
		<Stack gap='sm' style={{maxWidth: 360}}>
			<Notification
				duration={0}
				variant='info'
				title='Информация'
				description='Нейтральный статус без автоскрытия.'
			/>
			<Notification
				duration={0}
				variant='success'
				title='Готово'
				description='Изменения сохранены.'
			/>
			<Notification
				duration={0}
				variant='warning'
				title='Внимание'
				description='Проверьте доступ к API.'
			/>
			<Notification
				duration={0}
				variant='error'
				title='Ошибка'
				description='Не удалось отправить форму.'
			/>
		</Stack>
	),
	parameters: story('Все варианты: info / success / warning / error.'),
};

export const WithActions: Story<Record<string, never>> = {
	render: function WithActionsRender() {
		const [visible, setVisible] = useState(false);

		return (
			<>
				<Button variant='secondary' onClick={() => setVisible(true)}>
					Статичное с кнопками
				</Button>
				<Notification.Viewport position='top-right'>
					{visible && (
						<Notification
							duration={0}
							title='Доступно обновление'
							description='Желаете перезагрузить вкладку сейчас?'
							onClose={() => setVisible(false)}
							actions={[
								{
									label: 'Обновить',
									onClick: () => setVisible(false),
								},
							]}
						/>
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
						variant='danger'
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
		const [position, setPosition] = useState<NotificationPosition>('top-right');

		const pushMany = () => {
			const base = Date.now();
			setList(STACK_HEIGHTS.map((item, index) => ({
				...item,
				id: `${base}-${index}`,
				duration: 0,
			})));
		};

		const pushNew = () => {
			setList((prev) => {
				const item = STACK_HEIGHTS[prev.length % STACK_HEIGHTS.length];
				return [
					...prev,
					{
						...item,
						id: Date.now().toString(),
						duration: 0,
					},
				];
			});
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
	parameters: story('Стопка карточек разной высоты; `position` — угол или центр сверху/снизу.'),
};

export const OverflowText: Story<NotificationProps> = {
	render: () => (
		<div style={{maxWidth: 360}}>
			<Notification
				duration={0}
				variant='warning'
				title='Не удалось синхронизировать очень длинное название производственного регламента'
				description='Проверьте подключение к сети, права доступа к архиву и повторите попытку через несколько минут — черновик сохранён локально.'
			/>
		</div>
	),
	parameters: story('Длинные title и description в карточке toast.'),
};

export const UsageExample: Story<Record<string, never>> = {
	render: function UsageExampleRender() {
		const [list, setList] = useState<NotificationItem[]>([]);

		return (
			<Stack gap='md'>
				<Text size='sm'>
					Сохраните черновик — справа появится toast с отменой.
				</Text>
				<Inline gap='sm'>
					<Button
						variant='primary'
						onClick={() => {
							const id = Date.now().toString();
							setList((prev) => [
								{
									id,
									title: 'Черновик сохранён',
									description: 'Можно отменить в течение 4 секунд',
									variant: 'success',
									duration: 4000,
									progress: true,
									actions: [
										{
											label: 'Отменить',
											variant: 'secondary',
											onClick: () => undefined,
										},
									],
								},
								...prev,
							]);
						}}
					>
						Сохранить черновик
					</Button>
				</Inline>
				<NotificationContainer
					notifications={list}
					position='bottom-right'
					onClose={(id) => setList((prev) => prev.filter((item) => item.id !== id))}
				/>
			</Stack>
		);
	},
	parameters: story('Кнопка в контенте страницы и toast с обратным отсчётом.'),
};

export const Interaction: Story<NotificationProps> = {
	render: function InteractionRender() {
		const [visible, setVisible] = useState(false);
		return (
			<>
				<Button variant='primary' onClick={() => setVisible(true)}>
					Показать уведомление
				</Button>
				<Notification.Viewport>
					{visible && (
						<Notification
							duration={0}
							variant='success'
							title='Успешная операция'
							description='Данные обновлены в базе'
							onClose={() => setVisible(false)}
						/>
					)}
				</Notification.Viewport>
			</>
		);
	},
	play: async ({canvasElement}) => {
		const trigger = canvasElement.querySelector('button');
		trigger?.click();
	},
	parameters: story('Play: показ toast по клику.'),
};
