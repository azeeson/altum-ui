import type {Meta, StoryObj} from '@storybook/react';
import React, {useState} from 'react';
import {SortableList, SortableItem} from './SortableList';
import {Button} from '../Button/Button';
import {Item} from '../Item/Item';
import {SwipeToAction} from '../SwipeToAction/SwipeToAction';
import type {SwipeAction} from '../SwipeToAction/SwipeToAction.types';
import {IconBell} from '../../icons/icons/IconBell';
import {IconGear} from '../../icons/icons/IconGear';
import {IconUser} from '../../icons/icons/IconUser';
import {IconTrash} from '../../icons/icons/IconTrash';
import {IconArchive} from '../../icons/icons/IconArchive';
import {IconChecklist} from '../../icons/icons/IconChecklist';
import {componentParameters, story} from '../../storybook/meta';

const meta = {
	title: 'altum/Components/SortableList',
	component: SortableList,
	tags: ['autodocs'],
	parameters: {
		...componentParameters(
			'DnD любой модели `{id}`: `renderItem` / `content`, `variant="plain"` для Item и SwipeToAction; `handleOnly`, Alt+↑/↓.',
		),
		controls: {
			exclude: ['items', 'onOrderChange', 'renderItem'],
		},
	},
	argTypes: {
		items: {
			control: false,
			table: {disable: true}
		},
		onOrderChange: {
			control: false,
			table: {disable: true}
		},
		renderItem: {
			control: false,
			table: {disable: true}
		},
		keyboardReorder: {control: 'boolean'},
		showMoveButtons: {control: 'boolean'},
		handleOnly: {control: 'boolean'},
		variant: {
			control: {
				type: 'select',
				options: ['default', 'plain']
			},
		},
		className: {control: false},
	},
} satisfies Meta<typeof SortableList>;

export default meta;

type Story = StoryObj<typeof SortableList>;

const initialItems: SortableItem[] = [
	{
		id: '1',
		content: 'Настройка уведомлений'
	},
	{
		id: '2',
		content: 'Профиль пользователя'
	},
	{
		id: '3',
		content: 'Безопасность и доступ'
	},
	{
		id: '4',
		content: 'Интеграции'
	},
	{
		id: '5',
		content: 'Экспорт данных'
	},
];

interface SettingsRow {
	id: string;
	title: string;
	description: string;
	icon: React.ReactNode;
}

const settingsRows: SettingsRow[] = [
	{
		id: 'notify',
		title: 'Уведомления',
		description: 'Push и email',
		icon: <IconBell size={20} />,
	},
	{
		id: 'profile',
		title: 'Профиль',
		description: 'Имя и аватар',
		icon: <IconUser size={20} />,
	},
	{
		id: 'security',
		title: 'Безопасность',
		description: 'Пароль и 2FA',
		icon: <IconGear size={20} />,
	},
	{
		id: 'tasks',
		title: 'Задачи',
		description: 'Очередь и приоритет',
		icon: <IconChecklist size={20} />,
	},
];

interface TaskRow {
	id: string;
	title: string;
	description: string;
}

const taskRows: TaskRow[] = [
	{
		id: 't1',
		title: 'Собрать показания',
		description: 'Участок А · сегодня'
	},
	{
		id: 't2',
		title: 'Проверить валидацию',
		description: 'Участок Б · завтра'
	},
	{
		id: 't3',
		title: 'Сформировать отчёт',
		description: 'Ежемесячный'
	},
];

export const Playground: Story = {
	render: function PlaygroundStory(args) {
		const [items, setItems] = useState(initialItems);
		return (
			<div style={{maxWidth: 420}}>
				<SortableList
					{...args}
					items={items}
					onOrderChange={setItems}
				/>
			</div>
		);
	},
	args: {
		handleOnly: true,
		keyboardReorder: true,
		showMoveButtons: false,
		variant: 'default',
	},
	parameters: story('Панель Controls: `handleOnly`, `variant`.'),
};

export const GrabAnywhere: Story = {
	render: function GrabAnywhereStory() {
		const [items, setItems] = useState(initialItems);
		return (
			<div style={{maxWidth: 420}}>
				<SortableList
					items={items}
					onOrderChange={setItems}
					handleOnly={false}
				/>
			</div>
		);
	},
	parameters: story('`handleOnly={false}` — схватить можно за любое место строки.'),
};

export const WithMoveButtons: Story = {
	render: function MoveButtonsStory() {
		const [items, setItems] = useState(initialItems);
		return (
			<div style={{maxWidth: 440}}>
				<SortableList
					items={items}
					onOrderChange={setItems}
					showMoveButtons
					keyboardReorder
				/>
			</div>
		);
	},
	parameters: story('Кнопки вверх/вниз + Alt+стрелки.'),
};

export const WithRowActions: Story = {
	render: function RowActionsStory() {
		const [items, setItems] = useState<SortableItem[]>([
			{
				id: 'a',
				content: (
					<div style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						gap: 12
					}}
					>
						<span>
							Шаг 1 — сбор показаний
						</span>
						<Button
							size='sm'
							variant='secondary'
							onClick={() => alert('Править 1')}
						>
							Править
						</Button>
					</div>
				),
			},
			{
				id: 'b',
				content: (
					<div style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						gap: 12
					}}
					>
						<span>
							Шаг 2 — валидация
						</span>
						<Button
							size='sm'
							variant='secondary'
							onClick={() => alert('Править 2')}
						>
							Править
						</Button>
					</div>
				),
			},
			{
				id: 'c',
				content: (
					<div style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						gap: 12
					}}
					>
						<span>
							Шаг 3 — отчёт
						</span>
						<Button
							size='sm'
							variant='primary'
							status='danger'
							onClick={() => alert('Удалить 3')}
						>
							Удалить
						</Button>
					</div>
				),
			},
		]);

		return (
			<div style={{maxWidth: 520}}>
				<SortableList
					items={items}
					onOrderChange={setItems}
					handleOnly
					showMoveButtons
				/>
			</div>
		);
	},
	parameters: story('handleOnly: drag-handle рядом с кликабельными кнопками в строке.'),
};

export const WithItem: Story = {
	render: function WithItemStory() {
		const [items, setItems] = useState(settingsRows);

		return (
			<div style={{maxWidth: 480}}>
				<SortableList
					variant='plain'
					handleOnly
					items={items}
					onOrderChange={setItems}
					renderItem={(row) => (
						<Item
							interactive
							media={row.icon}
							mediaVariant='icon'
							title={row.title}
							description={row.description}
							actions={(
								<Button size='sm' variant='ghost'>
									Открыть
								</Button>
							)}
						/>
					)}
				/>
			</div>
		);
	},
	parameters: story('Режим `plain`: `variant="plain"` + `renderItem` → SortableList + Item.'),
};

export const WithSwipeToAction: Story = {
	render: function WithSwipeToActionStory() {
		const [items, setItems] = useState(taskRows);

		const remove = (id: string) => {
			setItems((prev) => prev.filter((row) => row.id !== id));
		};

		const archive = (id: string) => {
			setItems((prev) => prev.filter((row) => row.id !== id));
		};

		return (
			<div style={{maxWidth: 480}}>
				<SortableList
					variant='plain'
					handleOnly
					items={items}
					onOrderChange={setItems}
					renderItem={(row) => {
						const rightActions: SwipeAction[] = [
							{
								id: 'archive',
								label: 'Архив',
								icon: <IconArchive size={18} />,
								onClick: () => archive(row.id),
								bg: 'var(--altum-color-brand)',
							},
							{
								id: 'delete',
								label: 'Удалить',
								icon: <IconTrash size={18} />,
								onClick: () => remove(row.id),
								bg: 'var(--altum-color-status-error)',
							},
						];

						return (
							<SwipeToAction
								rightActions={rightActions.map((action) => (
									action.id === 'delete'
										? {
											...action,
											swipeToTrigger: true
										}
										: action
								))}
							>
								<Item
									title={row.title}
									description={row.description}
									actions={(
										<>
											<Button
												size='sm'
												variant='ghost'
												onClick={() => archive(row.id)}
											>
												Архив
											</Button>
											<Button
												size='sm'
												variant='primary'
												status='danger'
												onClick={() => remove(row.id)}
											>
												Удал.
											</Button>
										</>
									)}
								/>
							</SwipeToAction>
						);
					}}
				/>
			</div>
		);
	},
	parameters: story(
		'`variant="plain"` + SwipeToAction + Item: drag за handle, свайп/кнопки — действия.',
	),
};
