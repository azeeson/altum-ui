import type {Meta} from '@storybook/react';
import React, {useCallback, useMemo, useState} from 'react';
import {VirtualList} from '../VirtualList/VirtualList';
import {SwipeToAction} from '../SwipeToAction/SwipeToAction';
import type {SwipeAction} from '../SwipeToAction/SwipeToAction.types';
import {ControlRow, Inline, Split, Stack} from '../Layout/Layout';
import {SearchField} from '../SearchField/SearchField';
import {Chip} from '../Chip/Chip';
import {Checkbox} from '../Checkbox/Checkbox';
import {Button} from '../Button/Button';
import {ButtonIcon} from '../ButtonIcon/ButtonIcon';
import {Text} from '../Text/Text';
import {Title} from '../Title/Title';
import {EmptyState} from '../EmptyState/EmptyState';
import {NotificationContainer} from '../Notification/Notification';
import type {NotificationItem} from '../Notification/Notification';
import {CalendarBoard} from '../CalendarBoard/CalendarBoard';
import type {CalendarBoardTask} from '../CalendarBoard/CalendarBoard.types';
import {Fieldset} from '../Fieldset/Fieldset';
import {FieldLabel} from '../FieldLabel/FieldLabel';
import {Switch} from '../Switch/Switch';
import {Select} from '../Select/Select';
import {SegmentedControl} from '../SegmentedControl/SegmentedControl';
import {TextField} from '../TextField/TextField';
import {SuggestField} from '../SuggestField/SuggestField';
import {Modal} from '../Modal/Modal';
import {Sheet} from '../Sheet/Sheet';
import {CommandPalette} from '../CommandPalette/CommandPalette';
import {ActionList} from '../ActionList';
import type {ActionListGroup} from '../ActionList/ActionList.types';
import {Tabs} from '../Tabs/Tabs';
import {Avatar} from '../Avatar/Avatar';
import {Badge, BadgeCounter} from '../Badge/Badge';
import {addDays, startOfDay, startOfWeek} from '../Calendar/Calendar.utils';
import {IconTrash} from '../../icons/icons/IconTrash';
import {IconCheckmark} from '../../icons/icons/IconCheckmark';
import {IconToDo} from '../../icons/icons/IconToDo';
import {IconClipboard} from '../../icons/icons/IconClipboard';
import {IconPlus} from '../../icons/icons/IconPlus';
import {IconBell} from '../../icons/icons/IconBell';
import {Story} from '../../storybook/meta';
import styles from './Compositions.stories.module.css';

const storyNote = (description: string) => ({
	docs: {
		description: {story: description},
		source: {type: 'code' as const},
	},
});

/**
 * Без autodocs / dynamic source: Storybook иначе сериализует JSX+closures
 * (Tabs items, CommandPalette groups) через formatComplexDataStructure и зависает.
 */
export default {
	title: 'altum/Examples/Compositions',
	parameters: {
		layout: 'padded',
		controls: {disable: true},
		actions: {disable: true},
		docs: {
			disable: true,
			description: {
				component:
					'Сценарии взаимодействия нескольких компонентов: VirtualList + SwipeToAction, CalendarBoard, layout, forms, overlays.',
			},
		},
	},
} satisfies Meta;

/* ---------- общие хелперы ---------- */

type FilterId = 'all' | 'unread' | 'starred';

interface MailItem {
	id: string;
	from: string;
	subject: string;
	preview: string;
	when: string;
	unread: boolean;
	starred: boolean;
}

function buildMail(count: number): MailItem[] {
	const names = [
		'Анна',
		'Игорь',
		'Мария',
		'Олег',
		'Поддержка',
		'Финансы',
		'Дизайн'
	];
	const subjects = [
		'Квартальный отчёт',
		'Ревью макетов',
		'Инвойс #4821',
		'Стендап заметки',
		'Доступ к staging',
		'Отпуск: согласование',
	];
	return Array.from({length: count}, (_, index) => ({
		id: `mail-${index}`,
		from: names[index % names.length]!,
		subject: `${subjects[index % subjects.length]} · ${index + 1}`,
		preview: 'Краткое превью письма — VirtualList рендерит только видимые строки, swipe открывает действия.',
		when: `${(index % 12) + 8}:${String((index * 7) % 60).padStart(2, '0')}`,
		unread: index % 3 !== 0,
		starred: index % 5 === 0,
	}));
}

function demoCalendarTasks(anchor = new Date()): CalendarBoardTask[] {
	const weekStart = startOfWeek(anchor, 1);
	return [
		{
			id: 'vacation',
			title: 'Отпуск',
			start: startOfDay(addDays(weekStart, 2)),
			end: startOfDay(addDays(weekStart, 9)),
			allDay: true,
			color: 'var(--altum-color-status-info)',
		},
		{
			id: 'standup',
			title: 'Стендап',
			start: new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() + 1, 9, 0),
			end: new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() + 1, 9, 30),
			color: 'var(--altum-color-status-success)',
		},
		{
			id: 'design',
			title: 'Дизайн-ревью',
			start: new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() + 3, 14, 0),
			end: new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() + 3, 16, 0),
			color: 'var(--altum-color-status-warning)',
		},
	];
}

/* ---------- 1. VirtualList + SwipeToAction ---------- */

export const InboxVirtualSwipe: Story<Record<string, never>> = {
	name: 'Входящие: VirtualList + свайп',
	render: function InboxVirtualSwipeRender() {
		const [items, setItems] = useState(() => buildMail(240));
		const [query, setQuery] = useState('');
		const [filter, setFilter] = useState<FilterId>('all');
		const [toasts, setToasts] = useState<NotificationItem[]>([]);
		const [rangeLabel, setRangeLabel] = useState('—');

		const pushToast = useCallback((title: string, variant: NotificationItem['variant'] = 'info') => {
			const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
			setToasts((prev) => [
				...prev,
				{
					id,
					title,
					variant,
					duration: 2800,
				}
			]);
		}, []);

		const filtered = useMemo(() => {
			const q = query.trim().toLowerCase();
			return items.filter((item) => {
				if (filter === 'unread' && !item.unread) return false;
				if (filter === 'starred' && !item.starred) return false;
				if (!q) return true;
				return (
					item.from.toLowerCase().includes(q)
					|| item.subject.toLowerCase().includes(q)
					|| item.preview.toLowerCase().includes(q)
				);
			});
		}, [filter, items, query]);

		const patch = useCallback((id: string, next: Partial<MailItem>) => {
			setItems((prev) => prev.map((item) => (item.id === id ? {
				...item,
				...next
			} : item)));
		}, []);

		const remove = useCallback((id: string) => {
			setItems((prev) => prev.filter((item) => item.id !== id));
			pushToast('Письмо удалено', 'success');
		}, [pushToast]);

		const handleRangeChange = useCallback((range: {
			start: number;
			end: number;
			count: number
		}) => {
			setRangeLabel(`${range.start + 1}–${range.end + 1} из ${range.count}`);
		}, []);

		return (
			<div className={styles.shell}>
				<header className={styles.header}>
					<Split>
						<div>
							<Title level={3}>
								Входящие
							</Title>
							<p className={styles.subtitle}>
								VirtualList (240 писем) + SwipeToAction на каждой строке. Фильтры — Chip,
								поиск — SearchField, обратная связь — Notification.
							</p>
						</div>
						<Chip
							mode='tag'
							variant='tinted'
							size='sm'
						>
							{filtered.length}
							{' '}
							шт.
						</Chip>
					</Split>

					<ControlRow gap='sm'>
						<Chip
							variant={filter === 'all' ? 'tinted' : 'secondary'}
							active={filter === 'all'}
							onClick={() => setFilter('all')}
						>
							Все
						</Chip>
						<Chip
							variant={filter === 'unread' ? 'tinted' : 'secondary'}
							active={filter === 'unread'}
							onClick={() => setFilter('unread')}
						>
							Непрочитанные
						</Chip>
						<Chip
							variant={filter === 'starred' ? 'tinted' : 'secondary'}
							active={filter === 'starred'}
							onClick={() => setFilter('starred')}
						>
							Избранные
						</Chip>
						<ControlRow.Item grow>
							<SearchField
								label='Поиск писем'
								value={query}
								onChange={(event) => setQuery(event.target.value)}
								width='full'
							/>
						</ControlRow.Item>
					</ControlRow>
				</header>

				{filtered.length === 0 ? (
					<EmptyState
						title='Ничего не найдено'
						description='Смените фильтр или очистите поиск — список виртуализирован, но пустое состояние то же.'
						action={(
							<Button
								variant='tinted'
								onClick={() => {
									setQuery('');
									setFilter('all');
								}}
							>
								Сбросить
							</Button>
						)}
					/>
				) : (
					<>
						<p className={styles.rangeHint}>
							Видимый диапазон:
							{' '}
							{rangeLabel}
						</p>
						<div className={styles.listViewport}>
							<VirtualList
								items={filtered}
								height='100%'
								estimateSize={88}
								gap={8}
								aria-label='Список писем'
								getItemKey={(item) => item.id}
								onRangeChange={handleRangeChange}
								renderItem={({item}) => {
									const leftActions: SwipeAction[] = [
										{
											id: 'read',
											label: item.unread ? 'Прочитано' : 'Непрочит.',
											icon: <IconToDo size={18} />,
											bg: 'var(--altum-color-status-success)',
											onClick: () => {
												patch(item.id, {unread: !item.unread});
												pushToast(item.unread ? 'Отмечено прочитанным' : 'Снова непрочитанное');
											},
										},
										{
											id: 'star',
											label: 'Избр.',
											icon: <IconCheckmark size={18} />,
											bg: 'var(--altum-color-status-warning)',
											onClick: () => {
												patch(item.id, {starred: !item.starred});
												pushToast(item.starred ? 'Убрано из избранного' : 'В избранном');
											},
										},
									];
									const rightActions: SwipeAction[] = [
										{
											id: 'archive',
											label: 'Архив',
											icon: <IconClipboard size={18} />,
											bg: 'var(--altum-color-status-info)',
											onClick: () => {
												remove(item.id);
												pushToast('В архиве', 'info');
											},
										},
										{
											id: 'delete',
											label: 'Удалить',
											icon: <IconTrash size={18} />,
											bg: 'var(--altum-color-status-error)',
											onClick: () => remove(item.id),
										},
									];

									return (
										<SwipeToAction
											leftActions={leftActions}
											rightActions={rightActions.map((action) => (
												action.id === 'delete'
													? {
														...action,
														swipeToTrigger: true
													}
													: action
											))}
										>
											<div className={`${styles.mailRow} ${item.unread ? styles.mailUnread : styles.mailRead}`}>
												<div className={styles.mailTop}>
													<span className={styles.mailFrom}>
														{item.starred ? '★ ' : ''}
														{item.from}
													</span>
													<span className={styles.mailMeta}>
														{item.when}
													</span>
												</div>
												<span className={styles.mailSubject}>
													{item.subject}
												</span>
												<p className={styles.mailPreview}>
													{item.preview}
												</p>
											</div>
										</SwipeToAction>
									);
								}}
							/>
						</div>
					</>
				)}

				<NotificationContainer
					notifications={toasts}
					onClose={(id: string) => setToasts((prev) => prev.filter((item) => item.id !== id))}
				/>
			</div>
		);
	},
	parameters: storyNote(
		'Главный пример: VirtualList + SwipeToAction + ControlRow/Chip/SearchField + EmptyState + Notification.',
	),
};

/* ---------- 2. CalendarBoard + Sheet + раскладка ---------- */

export const CalendarPlanning: Story<Record<string, never>> = {
	name: 'Планирование в CalendarBoard',
	render: function CalendarPlanningRender() {
		const [viewDate, setViewDate] = useState(() => startOfDay(new Date()));
		const [tasks] = useState(() => demoCalendarTasks());
		const [selectedId, setSelectedId] = useState<string | null>(null);
		const [drawerOpen, setDrawerOpen] = useState(false);

		const selected = tasks.find((task) => task.id === selectedId) ?? null;

		return (
			<div className={styles.shell}>
				<header className={styles.header}>
					<Title level={3}>
						Планирование
					</Title>
					<p className={styles.subtitle}>
						CalendarBoard + ControlRow фильтры + Sheet с деталями задачи. Клик по событию открывает панель.
					</p>
					<ControlRow gap='sm'>
						<Chip variant='tinted' active>
							Моя команда
						</Chip>
						<Chip variant='secondary'>
							Отсутствия
						</Chip>
						<Button
							variant='tinted'
							size='sm'
							iconStart={<IconPlus size={16} />}
						>
							Событие
						</Button>
					</ControlRow>
				</header>

				<div className={styles.splitScreen}>
					<CalendarBoard.Provider
						tasks={tasks}
						viewDate={viewDate}
						onViewDateChange={setViewDate}
						defaultView='week'
						onTaskClick={(task) => {
							setSelectedId(task.id);
							setDrawerOpen(true);
						}}
					>
						<CalendarBoard.Root>
							<CalendarBoard.Header>
								<CalendarBoard.Nav />
								<CalendarBoard.Title />
								<CalendarBoard.ViewSwitch />
							</CalendarBoard.Header>
							<CalendarBoard.Body />
						</CalendarBoard.Root>
					</CalendarBoard.Provider>

					<aside className={styles.panel}>
						<Text size='sm'>
							Ближайшие
						</Text>
						<Stack gap='sm'>
							{tasks.map((task) => (
								<Button
									key={task.id}
									variant={selectedId === task.id ? 'tinted' : 'secondary'}
									fullWidth
									onClick={() => {
										setSelectedId(task.id);
										setDrawerOpen(true);
									}}
								>
									{task.title}
								</Button>
							))}
						</Stack>
					</aside>
				</div>

				<Sheet
					open={drawerOpen}
					onClose={() => setDrawerOpen(false)}
					mode='sidebar'
					direction='end'
					backdrop
				>
					<Sheet.Header showClose>
						<Sheet.Title>
							{selected?.title ?? 'Задача'}
						</Sheet.Title>
					</Sheet.Header>
					<Sheet.Body>
						{selected ? (
							<Stack gap='md'>
								<Chip mode='tag' variant='tinted'>
									{selected.allDay ? 'Весь день' : 'По времени'}
								</Chip>
								<Text size='sm'>
									id:
									{' '}
									{selected.id}
								</Text>
							</Stack>
						) : (
							<EmptyState title='Нет выбора' description='Кликните событие на доске.' />
						)}
					</Sheet.Body>
					{selected ? (
						<Sheet.Footer>
							<Button variant='primary' onClick={() => setDrawerOpen(false)}>
								Закрыть
							</Button>
						</Sheet.Footer>
					) : null}
				</Sheet>
			</div>
		);
	},
	parameters: storyNote('CalendarBoard + Sheet + ControlRow/Chip + боковая панель Stack.'),
};

/* ---------- 3. Настройки + формы раскладки ---------- */

export const SettingsStudio: Story<Record<string, never>> = {
	name: 'Студия настроек',
	render: function SettingsStudioRender() {
		const [density, setDensity] = useState<'default' | 'compact'>('default');
		const [theme, setTheme] = useState('system');
		const [digest, setDigest] = useState(true);
		const [preview, setPreview] = useState(true);
		const [accent, setAccent] = useState('slate');

		return (
			<div className={styles.shell}>
				<header className={styles.header}>
					<Split>
						<div>
							<Title level={3}>
								Студия настроек
							</Title>
							<p className={styles.subtitle}>
								Fieldset + FieldLabel + SegmentedControl tinted + Switch + Select + ControlRow.
							</p>
						</div>
						<SegmentedControl
							aria-label='Плотность'
							size='sm'
							variant='tinted'
							value={density}
							onChange={setDensity}
							options={[
								{
									label: 'Обычная',
									value: 'default'
								},
								{
									label: 'Компактная',
									value: 'compact'
								},
							]}
						/>
					</Split>
				</header>

				<Stack gap='lg'>
					<Fieldset variant='card'>
						<Fieldset.Inner>
							<Fieldset.Legend>
								Внешний вид
							</Fieldset.Legend>
							<Fieldset.Description>
								Тема и акцент интерфейса
							</Fieldset.Description>
							<Fieldset.Hint>
								Токены ThemeProvider подхватят tinted-кнопки автоматически
							</Fieldset.Hint>
							<Fieldset.Content gap={density === 'compact' ? 'var(--altum-g-space-3)' : 'var(--altum-g-space-4)'}>
								<FieldLabel
									label='Тема'
									layout='horizontal'
									justify='between'
									align='center'
								>
									<Select.Root
										options={[
											{
												label: 'Системная',
												value: 'system'
											},
											{
												label: 'Светлая',
												value: 'light'
											},
											{
												label: 'Тёмная',
												value: 'dark'
											},
										]}
										value={theme}
										onChange={(value) => { if (!Array.isArray(value)) setTheme(value); }}
									>
										<Select.Trigger label='Тема' />
										<Select.Panel>
											<Select.List />
										</Select.Panel>
									</Select.Root>
								</FieldLabel>
								<FieldLabel
									label='Акцент'
									layout='horizontal'
									justify='between'
								>
									<SegmentedControl
										aria-label='Акцент'
										size='sm'
										variant='secondary'
										value={accent}
										onChange={setAccent}
										options={[
											{
												label: 'Сланец',
												value: 'slate'
											},
											{
												label: 'Синий',
												value: 'blue'
											},
											{
												label: 'Зелёный',
												value: 'green'
											},
										]}
									/>
								</FieldLabel>
								<FieldLabel
									label='Превью анимаций'
									layout='horizontal'
									justify='between'
									align='center'
								>
									<Switch checked={preview} onChange={setPreview} />
								</FieldLabel>
							</Fieldset.Content>
						</Fieldset.Inner>
					</Fieldset>

					<Fieldset variant='card'>
						<Fieldset.Inner>
							<Fieldset.Legend>
								Уведомления
							</Fieldset.Legend>
							<Fieldset.Description>
								Дайджест и каналы
							</Fieldset.Description>
							<Fieldset.Content gap={density === 'compact' ? 'var(--altum-g-space-3)' : 'var(--altum-g-space-4)'}>
								<FieldLabel
									label='Еженедельный дайджест'
									layout='horizontal'
									justify='between'
									align='center'
								>
									<Switch checked={digest} onChange={setDigest} />
								</FieldLabel>
								<Inline gap='sm'>
									<Chip variant='info' size='sm'>
										Эл. почта
									</Chip>
									<Chip variant='success' size='sm'>
										Пуш
									</Chip>
									<Chip
										mode='tag'
										variant='secondary'
										size='sm'
									>
										Slack позже
									</Chip>
								</Inline>
							</Fieldset.Content>
						</Fieldset.Inner>
						<Fieldset.Footer>
							<ControlRow justify='end'>
								<Button variant='secondary'>
									Отмена
								</Button>
								<Button variant='tinted'>
									Сохранить
								</Button>
							</ControlRow>
						</Fieldset.Footer>
					</Fieldset>
				</Stack>
			</div>
		);
	},
	parameters: storyNote('Fieldset + FieldLabel + Switch/Select/SegmentedControl + подвал ControlRow.'),
};

/* ---------- 4. Форма в Modal + семейство CustomSelect ---------- */

export const FormComposerModal: Story<Record<string, never>> = {
	name: 'Форма в модалке',
	render: function FormComposerRender() {
		const [open, setOpen] = useState(false);
		const [title, setTitle] = useState('');
		const [city, setCity] = useState('');
		const [labels, setLabels] = useState<string[]>(['design']);
		const [assignee, setAssignee] = useState('');

		return (
			<div className={styles.shell}>
				<p className={styles.subtitle}>
					Канон: actions в Modal.FormFooter снаружи Body (sticky, не скроллятся с контентом).
					Stack/ControlRow + TextField + SuggestField + CustomSelect.
				</p>
				<Button variant='primary' onClick={() => setOpen(true)}>
					Открыть форму
				</Button>

				<Modal open={open} onClose={() => setOpen(false)}>
					<Modal.Header>
						<Modal.Title>
							Новая задача
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Stack gap='md'>
							<TextField
								label='Название'
								value={title}
								onChange={(event) => setTitle(event.target.value)}
								width='full'
							/>
							<ControlRow gap='sm' align='end'>
								<ControlRow.Item grow>
									<SuggestField
										label='Исполнитель'
										options={[
											{
												label: 'Анна К.',
												value: 'anna'
											},
											{
												label: 'Игорь П.',
												value: 'igor'
											},
											{
												label: 'Мария С.',
												value: 'maria'
											},
										]}
										value={assignee}
										onChange={setAssignee}
										width='full'
									/>
								</ControlRow.Item>
								<BadgeCounter counter={assignee ? 1 : 0}>
									<Avatar name={assignee || '?'} size='md' />
								</BadgeCounter>
							</ControlRow>
							<Select.Root
								options={[
									{
										label: 'Москва',
										value: 'msk'
									},
									{
										label: 'Казань',
										value: 'kzn'
									},
									{
										label: 'СПб',
										value: 'spb'
									},
								]}
								value={city}
								onChange={(value) => { if (!Array.isArray(value)) setCity(value); }}
							>
								<Select.Trigger label='Город офиса' width='full' />
								<Select.Panel>
									<Select.Filter />
									<Select.List />
								</Select.Panel>
							</Select.Root>
							<Select.Root
								selectionMode='multiple'
								options={[
									{
										label: 'Дизайн',
										value: 'design'
									},
									{
										label: 'Бэкенд',
										value: 'backend'
									},
									{
										label: 'Мобайл',
										value: 'mobile'
									},
									{
										label: 'QA',
										value: 'qa'
									},
								]}
								value={labels}
								onChange={(value) => { if (Array.isArray(value)) setLabels(value); }}
							>
								<Select.Trigger label='Метки' width='full'>
									<Select.Chips />
								</Select.Trigger>
								<Select.Panel>
									<Select.List />
								</Select.Panel>
							</Select.Root>
						</Stack>
					</Modal.Body>
					<Modal.FormFooter
						message={title ? undefined : 'Заполните название'}
					>
						<Button
							type='button'
							variant='secondary'
							size='sm'
							onClick={() => setOpen(false)}
						>
							Отмена
						</Button>
						<Button
							type='button'
							variant='primary'
							size='sm'
							onClick={() => setOpen(false)}
						>
							Создать
						</Button>
					</Modal.FormFooter>
				</Modal>
			</div>
		);
	},
	parameters: storyNote('Составная форма в Modal: SuggestField, Select, Avatar/Badge.'),
};

/* ---------- 5. Палитра команд + рабочее пространство вкладок ---------- */

export const CommandWorkspace: Story<Record<string, never>> = {
	name: 'Рабочее пространство с палитрой команд',
	render: function CommandWorkspaceRender() {
		const [paletteOpen, setPaletteOpen] = useState(false);
		const [tab, setTab] = useState('inbox');
		const [todos, setTodos] = useState([
			{
				id: '1',
				title: 'Проверить InboxVirtualSwipe',
				done: false
			},
			{
				id: '2',
				title: 'Свести CalendarBoard с Sheet',
				done: true
			},
			{
				id: '3',
				title: 'Документировать композиции',
				done: false
			},
		]);
		const [lastCommand, setLastCommand] = useState('—');

		const groups: ActionListGroup[] = useMemo(() => [
			{
				id: 'nav',
				label: 'Навигация',
				items: [
					{
						id: 'go-inbox',
						label: 'Перейти во Входящие',
						shortcut: 'G I',
						onSelect: () => {
							setTab('inbox');
							setLastCommand('inbox');
						},
					},
					{
						id: 'go-tasks',
						label: 'Перейти к задачам',
						shortcut: 'G T',
						onSelect: () => {
							setTab('tasks');
							setLastCommand('tasks');
						},
					},
				],
			},
			{
				id: 'actions',
				label: 'Действия',
				items: [
					{
						id: 'add',
						label: 'Добавить задачу',
						onSelect: () => {
							setTodos((prev) => [
								...prev,
								{
									id: String(Date.now()),
									title: 'Новая из CommandPalette',
									done: false,
								},
							]);
							setTab('tasks');
							setLastCommand('add-task');
						},
					},
				],
			},
		], []);

		return (
			<div className={styles.shell}>
				<header className={styles.header}>
					<Split>
						<div>
							<Title level={3}>
								Рабочее пространство команд
							</Title>
							<p className={styles.subtitle}>
								Tabs + CommandPalette + Checkbox. Откройте палитру кнопкой или представьте ⌘K.
							</p>
						</div>
						<Inline gap='sm'>
							<Badge label={2}>
								<ButtonIcon
									aria-label='Уведомления'
									icon={<IconBell size={18} />}
								/>
							</Badge>
							<Button variant='tinted' onClick={() => setPaletteOpen(true)}>
								Палитра команд
							</Button>
						</Inline>
					</Split>
					<Chip
						mode='tag'
						variant='secondary'
						size='sm'
					>
						Последняя команда:
						{' '}
						{lastCommand}
					</Chip>
				</header>

				<Tabs
					variant='pill'
					value={tab}
					onChange={setTab}
				>
					<Tabs.List>
						<Tabs.Trigger value='inbox'>
							Обзор
						</Tabs.Trigger>
						<Tabs.Trigger value='tasks'>
							Задачи (
							{todos.filter((item) => !item.done).length}
							)
						</Tabs.Trigger>
					</Tabs.List>
					<Tabs.Panel value='inbox'>
						<div className={styles.panel}>
							<Text size='sm'>
								Здесь мог бы быть InboxVirtualSwipe. Палитра переключает табы
								и добавляет задачи.
							</Text>
							<Button variant='secondary' onClick={() => setPaletteOpen(true)}>
								Открыть ⌘K
							</Button>
						</div>
					</Tabs.Panel>
					<Tabs.Panel value='tasks'>
						<Stack gap='sm'>
							{todos.map((todo) => (
								<div key={todo.id} className={`${styles.panel} ${styles.taskItem}`}>
									<Checkbox
										mode='task'
										checked={todo.done}
										onChange={(event) => {
											const done = event.target.checked;
											setTodos((prev) => prev.map((item) => (
												item.id === todo.id ? {
													...item,
													done
												} : item
											)));
										}}
										aria-label={todo.title}
									/>
									<span className={styles.taskTitle}>
										{todo.title}
									</span>
									{todo.done && (
										<Chip
											mode='tag'
											variant='success'
											size='sm'
										>
											done
										</Chip>
									)}
								</div>
							))}
						</Stack>
					</Tabs.Panel>
				</Tabs>

				<CommandPalette.Root open={paletteOpen} onClose={() => setPaletteOpen(false)}>
					<CommandPalette.Input placeholder='Команда или переход…' />
					<CommandPalette.List>
						{groups.map((group) => (
							<ActionList.Group key={group.id} id={group.id}>
								<ActionList.GroupLabel>
									{group.label}
								</ActionList.GroupLabel>
								{group.items.map((item) => <ActionList.Item key={item.id} {...item} />)}
							</ActionList.Group>
						))}
					</CommandPalette.List>
				</CommandPalette.Root>
			</div>
		);
	},
	parameters: storyNote('Tabs (pill) + CommandPalette/ActionList + Checkbox + Badge/ButtonIcon — палитра команд и вкладки.'),
};

/**
 * Визуальный QA: ряд формы / тулбар / Modal+Select — высоты и кегль на одном baseline.
 */
export const FormHarmony: Story<Record<string, never>> = {
	name: 'Гармония формы (ряд / тулбар / модалка)',
	render: function FormHarmonyRender() {
		const [query, setQuery] = useState('');
		const [status, setStatus] = useState('open');
		const [seg, setSeg] = useState('day');
		const [modalOpen, setModalOpen] = useState(false);
		const [name, setName] = useState('');
		const [role, setRole] = useState('editor');

		return (
			<div className={styles.shell}>
				<header className={styles.header}>
					<Title>
						Гармония формы
					</Title>
					<p className={styles.subtitle}>
						Button + Field + Select + Segmented на одном `--altum-control-height-*`; helperText под полем.
					</p>
				</header>

				<section className={styles.panel} aria-label='Тулбар'>
					<Text
						as='p'
						size='sm'
						weight='semibold'
					>
						Тулбар (labelPlacement none)
					</Text>
					<ControlRow
						gap='sm'
						align='end'
						className={styles.harmonyRow}
					>
						<TextField
							label='Поиск'
							labelPlacement='none'
							placeholder='Фильтр…'
							value={query}
							onChange={(event) => setQuery(event.target.value)}
							onClear={() => setQuery('')}
							width='md'
							size='md'
						/>
						<Select.Root
							options={[
								{
									value: 'open',
									label: 'Открыт'
								},
								{
									value: 'done',
									label: 'Готово'
								},
							]}
							value={status}
							onChange={(value) => { if (!Array.isArray(value)) setStatus(value); }}
						>
							<Select.Trigger
								label='Статус'
								labelPlacement='none'
								placeholder='Статус'
								width='sm'
								size='md'
							/>
							<Select.Panel>
								<Select.List />
							</Select.Panel>
						</Select.Root>
						<SegmentedControl
							value={seg}
							onChange={setSeg}
							size='md'
							options={[
								{
									value: 'day',
									label: 'День'
								},
								{
									value: 'week',
									label: 'Неделя'
								},
							]}
						/>
						<Button size='md'>
							Применить
						</Button>
						<ButtonIcon
							size='md'
							variant='secondary'
							aria-label='Добавить'
							icon={<IconPlus />}
						/>
					</ControlRow>
				</section>

				<section className={styles.panel} aria-label='Ряд формы'>
					<Text
						as='p'
						size='sm'
						weight='semibold'
					>
						Ряд формы (outside + helperText)
					</Text>
					<Stack gap='md'>
						<TextField
							label='Эл. почта'
							labelPlacement='outside'
							helperText='Рабочий адрес для уведомлений'
							placeholder='name@company.com'
							width='full'
							size='md'
						/>
						<ControlRow
							gap='sm'
							align='end'
							className={styles.harmonyRow}
						>
							<TextField
								label='Имя'
								labelPlacement='outside'
								width='md'
								size='md'
							/>
							<Select.Root
								options={[
									{
										value: 'editor',
										label: 'Редактор'
									},
									{
										value: 'admin',
										label: 'Админ'
									},
								]}
								value={role}
								onChange={(value) => { if (!Array.isArray(value)) setRole(value); }}
							>
								<Select.Trigger
									label='Роль'
									labelPlacement='outside'
									width='md'
									size='md'
								/>
								<Select.Panel>
									<Select.List />
								</Select.Panel>
							</Select.Root>
							<Button size='md'>
								Сохранить
							</Button>
						</ControlRow>
						<Inline gap='md'>
							<Chip
								size='sm'
								mode='tag'
								variant='info'
							>
								sm тег
							</Chip>
							<Chip
								size='sm'
								mode='tag'
								variant='success'
								onRemove={() => undefined}
							>
								sm
							</Chip>
							<Chip
								size='md'
								active
								onClick={() => undefined}
							>
								md чип
							</Chip>
							<Chip size='lg' disabled>
								lg отключён
							</Chip>
						</Inline>
					</Stack>
				</section>

				<section className={styles.panel}>
					<Button onClick={() => setModalOpen(true)}>
						Открыть Modal + Select
					</Button>
					<Modal open={modalOpen} onClose={() => setModalOpen(false)}>
						<Modal.Header>
							<Modal.Title>
								Новый участник
							</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							<Stack gap='md'>
								<TextField
									label='Имя'
									labelPlacement='outside'
									value={name}
									onChange={(event) => setName(event.target.value)}
									helperText='Отображается в списке команды'
									width='full'
								/>
								<Select.Root
									options={[
										{
											value: 'editor',
											label: 'Редактор'
										},
										{
											value: 'admin',
											label: 'Админ'
										},
										{
											value: 'viewer',
											label: 'Наблюдатель'
										},
									]}
									value={role}
									onChange={(value) => { if (!Array.isArray(value)) setRole(value); }}
								>
									<Select.Trigger
										label='Роль'
										labelPlacement='outside'
										width='full'
									/>
									<Select.Panel>
										<Select.List />
									</Select.Panel>
								</Select.Root>
							</Stack>
						</Modal.Body>
						<Modal.FormFooter>
							<Button
								type='button'
								variant='secondary'
								size='md'
								onClick={() => setModalOpen(false)}
							>
								Отмена
							</Button>
							<Button
								type='button'
								variant='primary'
								size='md'
								onClick={() => setModalOpen(false)}
							>
								Добавить
							</Button>
						</Modal.FormFooter>
					</Modal>
				</section>
			</div>
		);
	},
	parameters: storyNote(
		'Визуальный QA light/dark: высоты Button/Field/Select/Segmented; размеры Chip; Modal+Select z/focus.',
	),
};
