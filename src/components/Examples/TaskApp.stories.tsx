import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {Inline, Split, Stack} from '../Layout/Layout';
import {Card} from '../Card/Card';
import {Title} from '../Title/Title';
import {Text} from '../Text/Text';
import {SearchField} from '../SearchField/SearchField';
import {ButtonIcon} from '../ButtonIcon/ButtonIcon';
import {Button} from '../Button/Button';
import {Checkbox} from '../Checkbox/Checkbox';
import {Chip} from '../Chip/Chip';
import {StatBadge} from '../StatBadge/StatBadge';
import {EmptyState} from '../EmptyState/EmptyState';
import {ColorSwatchGroup} from '../ColorSwatchGroup/ColorSwatchGroup';
import {ConfirmDialog} from '../ConfirmDialog/ConfirmDialog';
import {Sheet} from '../Sheet/Sheet';
import {Avatar} from '../Avatar/Avatar';
import {Skeleton} from '../Skeleton/Skeleton';
import {IconMenu} from '../../icons/icons/IconMenu';
import {IconPlus} from '../../icons/icons/IconPlus';
import {IconChecklist} from '../../icons/icons/IconChecklist';
import styles from './TaskApp.stories.module.css';
import {componentParameters, story, Story} from '../../storybook/meta';

const LIST_COLORS = [
	'#ef4444',
	'#f97316',
	'#22c55e',
	'#3b82f6',
	'#8b5cf6'
];

interface Task {
	id: number;
	title: string;
	done: boolean;
}

const TaskAppDemo = () => {
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [listColor, setListColor] = useState(LIST_COLORS[3]);
	const [search, setSearch] = useState('');
	const [tasks, setTasks] = useState<Task[]>([
		{
			id: 1,
			title: 'Проверить pull request',
			done: true
		},
		{
			id: 2,
			title: 'Обновить библиотеку компонентов',
			done: false
		},
		{
			id: 3,
			title: 'Написать примеры Storybook',
			done: false
		},
	]);
	const [sharedUsers, setSharedUsers] = useState(['alex@example.com', 'team@company.com']);

	const filtered = tasks.filter((t) => t.title.toLowerCase().includes(search.toLowerCase()));
	const doneCount = tasks.filter((t) => t.done).length;
	const pendingCount = tasks.filter((t) => !t.done).length;

	const toggleTask = (id: number) => {
		setTasks((prev) => prev.map((t) => (t.id === id ? {
			...t,
			done: !t.done
		} : t)));
	};

	return (
		<div className={styles.app}>
			<header className={styles.header}>
				<Inline align='center' gap='md'>
					<ButtonIcon
						icon={<IconMenu size={20} />}
						aria-label='Открыть меню'
						onClick={() => setDrawerOpen(true)}
					/>
					<Title level={4}>
						Мои задачи
					</Title>
					<Chip as='tag' variant='secondary'>
						Работа
					</Chip>
				</Inline>
				<Inline align='center' gap='sm'>
					<ButtonIcon
						icon={<IconPlus size={20} />}
						aria-label='Добавить задачу'
						variant='primary'
					/>
					<Avatar name='Alex' size={32} />
				</Inline>
			</header>

			<div className={styles.layout}>
				<aside className={styles.sidebar}>
					<SearchField
						label='Поиск задач'
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						width='full'
						size='sm'
					/>
					<div className={styles.colorSection}>
						<Text size='sm'>
							Цвет списка
						</Text>
						<ColorSwatchGroup
							colors={LIST_COLORS}
							value={listColor}
							onChange={setListColor}
							size='sm'
						/>
					</div>
					<Inline gap='sm' style={{marginTop: 16}}>
						<StatBadge
							label='Готово'
							value={doneCount}
							variant='success'
						/>
						<StatBadge label='В ожидании' value={pendingCount} />
					</Inline>
				</aside>

				<main className={styles.main}>
					<Card
						header={(
							<Title level={4}>
								Сегодня
							</Title>
						)}
						actions={(
							<Split align='center'>
								<Text size='sm'>
									{filtered.length}
									{' '}
									задач
								</Text>
								<Button
									variant='secondary'
									status='danger'
									size='sm'
									onClick={() => setDeleteOpen(true)}
								>
									Очистить готовые
								</Button>
							</Split>
						)}
					>
						{loading ? (
							<div className={styles.taskList}>
								{[1, 2, 3].map((i) => (
									<Inline
										key={i}
										align='center'
										gap='md'
									>
										<Skeleton
											circle
											width={20}
											height={20}
										/>
										<Skeleton height={14} />
									</Inline>
								))}
							</div>
						) : filtered.length === 0 ? (
							<EmptyState
								icon={<IconChecklist size={40} />}
								title='Задачи не найдены'
								description={search ? 'Попробуйте другой запрос' : 'Добавьте задачу…'}
								action={(
									<Button size='sm' iconStart={<IconPlus size={14} />}>
										Добавить задачу
									</Button>
								)}
							/>
						) : (
							<div className={styles.taskList}>
								{filtered.map((task) => (
									<label key={task.id} className={styles.taskItem}>
										<Checkbox
											mode='task'
											checked={task.done}
											onChange={() => toggleTask(task.id)}
										/>
										<span className={task.done ? styles.done : ''}>
											{task.title}
										</span>
									</label>
								))}
							</div>
						)}
					</Card>

					<Card
						header={(
							<Title level={4}>
								Общий доступ
							</Title>
						)}
					>
						<Inline gap='sm'>
							{sharedUsers.map((email) => (
								<Chip key={email} onRemove={() => setSharedUsers((u) => u.filter((e) => e !== email))}>
									{email}
								</Chip>
							))}
						</Inline>
					</Card>

					<Card
						header={(
							<Title level={4}>
								Превью календаря
							</Title>
						)}
					>
						<div className={styles.calendarRow}>
							{[
								'Пн',
								'Вт',
								'Ср',
								'Чт',
								'Пт'
							].map((day, i) => (
								<div key={day} className={styles.calendarDay}>
									<Text size='sm'>
										{day}
									</Text>
									{i === 1 && (
										<Chip
											as='tag'
											size='sm'
											variant='info'
										>
											Стендап
										</Chip>
									)}
									{i === 3 && (
										<Chip
											as='tag'
											size='sm'
											variant='error'
										>
											Деплой
										</Chip>
									)}
								</div>
							))}
						</div>
					</Card>
				</main>
			</div>

			<Sheet
				open={drawerOpen}
				onOpenChange={setDrawerOpen}
				mode='sidebar'
				direction='start'
				backdrop
			>
				<Sheet.Header showClose>
					<Sheet.Title>
						Навигация
					</Sheet.Title>
				</Sheet.Header>
				<Sheet.Body>
					<Stack gap='sm'>
						<Button variant='secondary' fullWidth>
							Сегодня
						</Button>
						<Button variant='secondary' fullWidth>
							Предстоящее
						</Button>
						<Button variant='secondary' fullWidth>
							Настройки
						</Button>
					</Stack>
				</Sheet.Body>
			</Sheet>

			<ConfirmDialog
				open={deleteOpen}
				title='Очистить выполненные задачи?'
				message='Все выполненные задачи будут удалены без возможности восстановления.'
				confirmLabel='Очистить'
				status='danger'
				loading={loading}
				onOpenChange={setDeleteOpen}
				onConfirm={() => {
					setLoading(true);
					setTimeout(() => {
						setTasks((prev) => prev.filter((t) => !t.done));
						setLoading(false);
						setDeleteOpen(false);
					}, 800);
				}}
			/>
		</div>
	);
};

export default {
	title: 'altum/Examples/Task App',
	component: TaskAppDemo,
	tags: ['autodocs'],
	parameters: componentParameters('Пример приложения управления задачами на компонентах altum.'),
	argTypes: {},
} satisfies Meta<typeof TaskAppDemo>;

export const Playground: Story<typeof TaskAppDemo> = {
	parameters: story('Полноценный пример task manager с drawer, диалогами и списком задач.'),
};

export const LoadingState: Story<typeof TaskAppDemo> = {
	name: 'Состояние загрузки',
	render: () => (
		<div style={{maxWidth: 400}}>
			<Stack gap='lg'>
				<Skeleton width='50%' height={24} />
				<Skeleton height={40} />
				<Skeleton height={36} />
				<Skeleton height={36} />
				<Skeleton height={36} />
			</Stack>
		</div>
	),
	parameters: story('Состояние загрузки со скелетонами.'),
};
