/* eslint-disable @stylistic/indent -- Существующий отступ фикстуры Storybook сохранён для читаемого вложенного JSX. */
import type {Meta} from '@storybook/react';
import React, {useCallback, useMemo, useState} from 'react';
import {Alert} from '../Alert/Alert';
import {Avatar} from '../Avatar/Avatar';
import {Badge} from '../Badge/Badge';
import {BarChart} from '../BarChart/BarChart';
import {Button} from '../Button/Button';
import {ButtonIcon} from '../ButtonIcon/ButtonIcon';
import {Box} from '../Box/Box';
import {CalendarBoard} from '../CalendarBoard/CalendarBoard';
import type {CalendarBoardTask} from '../CalendarBoard/CalendarBoard.types';
import {Chip} from '../Chip/Chip';
import {Card} from '../Card/Card';
import {CommandPalette} from '../CommandPalette/CommandPalette';
import {ConfirmDialog} from '../ConfirmDialog/ConfirmDialog';
import {Menu} from '../Menu/Menu';
import {Table} from '../Table/Table';
import type {Column} from '../Table/Table';
import {DescriptionList} from '../DescriptionList/DescriptionList';
import {DonutChart} from '../DonutChart/DonutChart';
import {Sheet} from '../Sheet/Sheet';
import {EmptyState} from '../EmptyState/EmptyState';
import {Fieldset} from '../Fieldset/Fieldset';
import {FileList} from '../FileList/FileList';
import type {FileListItemProps} from '../FileList/FileList';
import {ImageGallery} from '../ImageGallery/ImageGallery';
import {Inline, Split, Stack} from '../Layout/Layout';
import {Modal} from '../Modal/Modal';
import {NotificationContainer} from '../Notification/Notification';
import type {NotificationItem} from '../Notification/Notification';
import {SearchField} from '../SearchField/SearchField';
import {Select} from '../Select/Select';
import {Sidebar} from '../Sidebar/Sidebar';
import {Spinner} from '../Spinner/Spinner';
import {Text} from '../Text/Text';
import {TextField} from '../TextField/TextField';
import {TextareaField} from '../TextareaField/TextareaField';
import {Timeline} from '../Timeline/Timeline';
import {Title} from '../Title/Title';
import {UploadZone} from '../UploadZone/UploadZone';
import {addDays, startOfDay, startOfWeek} from '../Calendar/Calendar.utils';
import type {ActionListGroup, ActionListItem} from '../ActionList/ActionList.types';
import {IconBell} from '../../icons/icons/IconBell';
import {IconBriefcase} from '../../icons/icons/IconBriefcase';
import {IconCalendar} from '../../icons/icons/IconCalendar';
import {IconChecklist} from '../../icons/icons/IconChecklist';
import {IconFolder} from '../../icons/icons/IconFolder';
import {IconGear} from '../../icons/icons/IconGear';
import {IconGraphLine} from '../../icons/icons/IconGraphLine';
import {IconHome} from '../../icons/icons/IconHome';
import {IconPhoto} from '../../icons/icons/IconPhoto';
import {IconPlus} from '../../icons/icons/IconPlus';
import {IconSearch} from '../../icons/icons/IconSearch';
import {IconUserGroup} from '../../icons/icons/IconUserGroup';
import {demoImage} from '../../storybook/demoImages';
import {Story} from '../../storybook/meta';
import styles from './AppExamples.stories.module.css';

/**
 * Без autodocs: сложные JSX-closures (таблица, Tabs content) вешают source serializer.
 */
export default {
	title: 'altum/Examples/App Examples',
	parameters: {
		layout: 'padded',
		controls: {disable: true},
		actions: {disable: true},
		docs: {
			disable: true,
			description: {
				component:
					'Полноценные демо-приложения на компонентах библиотеки: CRM-консоль и support desk.',
			},
		},
	},
} satisfies Meta;

function DemoHeader({
	crumbs,
	title,
	description,
	actions,
	level = 3,
}: {
	crumbs?: string;
	title: React.ReactNode;
	description?: React.ReactNode;
	actions?: React.ReactNode;
	level?: 1 | 2 | 3 | 4;
}) {
	const heading = (
		<Stack gap='xs'>
			{crumbs ? (
				<Text size='xs' color='muted'>
					{crumbs}
				</Text>
			) : null}
			<Title level={level}>
				{title}
			</Title>
			{description ? (
				<Text size='sm' color='muted'>
					{description}
				</Text>
			) : null}
		</Stack>
	);

	if (!actions) {
		return heading;
	}

	return (
		<Split align='start' gap='md'>
			{heading}
			{actions}
		</Split>
	);
}

/* ---------- хелперы ---------- */

function useToasts() {
	const [toasts, setToasts] = useState<NotificationItem[]>([]);
	const push = useCallback((title: string, variant: NotificationItem['variant'] = 'info') => {
		const id = `t-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
		setToasts((prev) => [
			...prev,
			{
				id,
				title,
				variant,
				duration: 2600
			}
		]);
	}, []);
	const dismiss = useCallback((id: string) => {
		setToasts((prev) => prev.filter((item) => item.id !== id));
	}, []);
	return {
		toasts,
		push,
		dismiss
	};
}

interface DemoFilterChip {
	id: string;
	label: React.ReactNode;
	active?: boolean;
}

function DemoKpiCard({
	label,
	value,
	delta,
	deltaColor = 'success',
	description,
}: {
	label: React.ReactNode;
	value: React.ReactNode;
	delta?: React.ReactNode;
	deltaColor?: 'success' | 'error' | 'muted';
	description?: React.ReactNode;
}) {
	return (
		<Card>
			<Stack gap='xs'>
				<Text size='xs' color='muted'>
					{label}
				</Text>
				<Title level={3}>
					{value}
				</Title>
				{delta != null && (
					<Text size='sm' color={deltaColor}>
						{delta}
					</Text>
				)}
				{description != null && (
					<Text size='xs' color='muted'>
						{description}
					</Text>
				)}
			</Stack>
		</Card>
	);
}

function DemoFilterBar({
	query,
	onQueryChange,
	searchPlaceholder,
	filters = [],
	onFilterChange,
	onClear,
	end,
}: {
	query?: string;
	onQueryChange?: (query: string) => void;
	searchPlaceholder?: string;
	filters?: DemoFilterChip[];
	onFilterChange?: (id: string, active: boolean) => void;
	onClear?: () => void;
	end?: React.ReactNode;
}) {
	const hasActiveFilters = filters.some((item) => item.active);
	const canClear = onClear && (Boolean(query?.length) || hasActiveFilters);

	return (
		<Stack gap='sm'>
			<SearchField
				label='Поиск'
				placeholder={searchPlaceholder}
				value={query ?? ''}
				width='full'
				size='sm'
				onChange={(event) => onQueryChange?.(event.target.value)}
				onClear={query ? () => onQueryChange?.('') : undefined}
			/>
			{(filters.length > 0 || canClear || end != null) && (
				<Split align='center'>
					{filters.length > 0 && (
						<Inline gap='sm' wrap>
							{filters.map((item) => (
								<Chip
									key={item.id}
									size='sm'
									variant={item.active ? 'tinted' : 'secondary'}
									as={item.active ? 'toggle' : 'chip'}
									onClick={onFilterChange
										? () => onFilterChange(item.id, !item.active)
										: undefined}
								>
									{item.label}
								</Chip>
							))}
						</Inline>
					)}
					<Inline gap='sm' align='center'>
						{canClear && (
							<Button
								type='button'
								variant='ghost'
								size='sm'
								onClick={onClear}
							>
								Сбросить
							</Button>
						)}
						{end}
					</Inline>
				</Split>
			)}
		</Stack>
	);
}

type DealStatus = 'new' | 'negotiation' | 'won' | 'lost';

interface Deal {
	id: string;
	company: string;
	owner: string;
	amount: number;
	status: DealStatus;
	stage: string;
	updated: string;
}

const INITIAL_DEALS: Deal[] = [
	{
		id: 'd1',
		company: 'Nord Logistics',
		owner: 'Анна К.',
		amount: 420000,
		status: 'negotiation',
		stage: 'КП',
		updated: 'сегодня'
	},
	{
		id: 'd2',
		company: 'Atlas Soft',
		owner: 'Игорь М.',
		amount: 180000,
		status: 'new',
		stage: 'Лид',
		updated: 'вчера'
	},
	{
		id: 'd3',
		company: 'Green Farms',
		owner: 'Мария П.',
		amount: 960000,
		status: 'won',
		stage: 'Договор',
		updated: '2 дн.'
	},
	{
		id: 'd4',
		company: 'Pulse Media',
		owner: 'Анна К.',
		amount: 75000,
		status: 'lost',
		stage: 'Отказ',
		updated: '3 дн.'
	},
	{
		id: 'd5',
		company: 'Orbit Bank',
		owner: 'Олег В.',
		amount: 1250000,
		status: 'negotiation',
		stage: 'Пилот',
		updated: 'сегодня'
	},
	{
		id: 'd6',
		company: 'City Clinic',
		owner: 'Игорь М.',
		amount: 310000,
		status: 'new',
		stage: 'Демо',
		updated: '4 дн.'
	},
];

const STATUS_TAG: Record<DealStatus, {
	label: string;
	variant: 'primary' | 'secondary' | 'success' | 'warning' | 'error'
}> = {
	new: {
		label: 'Новая',
		variant: 'secondary'
	},
	negotiation: {
		label: 'Переговоры',
		variant: 'warning'
	},
	won: {
		label: 'Выиграна',
		variant: 'success'
	},
	lost: {
		label: 'Проиграна',
		variant: 'error'
	},
};

function formatRub(value: number) {
	return new Intl.NumberFormat('ru-RU', {
		style: 'currency',
		currency: 'RUB',
		maximumFractionDigits: 0,
	}).format(value);
}

/* ---------- 1. CRM продаж ---------- */

export const SalesCrmConsole: Story<Record<string, never>> = {
	name: 'Консоль Sales CRM',
	render: function SalesCrmConsoleRender() {
		const {toasts, push, dismiss} = useToasts();
		const [nav, setNav] = useState('dashboard');
		const [deals, setDeals] = useState(INITIAL_DEALS);
		const [query, setQuery] = useState('');
		const [filters, setFilters] = useState([
			{
				id: 'open',
				label: 'Открытые',
				active: true
			},
			{
				id: 'mine',
				label: 'Мои',
				active: false
			},
			{
				id: 'won',
				label: 'Выигранные',
				active: false
			},
		]);
		const [page, setPage] = useState(1);
		const [selected, setSelected] = useState<Deal | null>(null);
		const [createOpen, setCreateOpen] = useState(false);
		const [paletteOpen, setPaletteOpen] = useState(false);
		const [deleteOpen, setDeleteOpen] = useState(false);
		const [draft, setDraft] = useState({
			company: '',
			amount: '',
			owner: 'Анна К.'
		});

		const filtered = useMemo(() => {
			const q = query.trim().toLowerCase();
			const openOnly = filters.find((f) => f.id === 'open')?.active;
			const mineOnly = filters.find((f) => f.id === 'mine')?.active;
			const wonOnly = filters.find((f) => f.id === 'won')?.active;
			return deals.filter((deal) => {
				if (openOnly && (deal.status === 'won' || deal.status === 'lost')) return false;
				if (mineOnly && deal.owner !== 'Анна К.') return false;
				if (wonOnly && deal.status !== 'won') return false;
				if (!q) return true;
				return deal.company.toLowerCase().includes(q) || deal.owner.toLowerCase().includes(q);
			});
		}, [deals, filters, query]);

		const pageSize = 5;
		const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
		const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);

		const columns: Column<Deal>[] = [
			{
				key: 'company',
				header: 'Компания',
				render: (row) => (
					<button
						type='button'
						onClick={() => setSelected(row)}
						style={{
							all: 'unset',
							cursor: 'pointer'
						}}
					>
						<Stack gap='xs'>
							<strong>
								{row.company}
							</strong>
							<Text size='xs' color='muted'>
								{row.stage}
							</Text>
						</Stack>
					</button>
				),
			},
			{
				key: 'owner',
				header: 'Владелец',
				render: (row) => row.owner
			},
			{
				key: 'amount',
				header: 'Сумма',
				render: (row) => formatRub(row.amount),
			},
			{
				key: 'status',
				header: 'Статус',
				render: (row) => (
					<Chip
						as='tag'
						size='sm'
						variant={STATUS_TAG[row.status].variant}
					>
						{STATUS_TAG[row.status].label}
					</Chip>
				),
			},
			{
				key: 'updated',
				header: 'Обновлено',
				render: (row) => row.updated
			},
		];

		const pipelineSum = deals
			.filter((d) => d.status === 'new' || d.status === 'negotiation')
			.reduce((sum, d) => sum + d.amount, 0);

		const commandGroups: ActionListGroup[] = [
			{
				id: 'nav',
				label: 'Навигация'
			},
			{
				id: 'actions',
				label: 'Действия'
			},
		];
		const commandItems: ActionListItem[] = [
			{
				id: 'go-dash',
				groupId: 'nav',
				label: 'Дашборд',
				onSelect: () => { setNav('dashboard'); setPaletteOpen(false); }
			},
			{
				id: 'go-deals',
				groupId: 'nav',
				label: 'Сделки',
				onSelect: () => { setNav('deals'); setPaletteOpen(false); }
			},
			{
				id: 'go-clients',
				groupId: 'nav',
				label: 'Клиенты',
				onSelect: () => { setNav('clients'); setPaletteOpen(false); }
			},
			{
				id: 'new-deal',
				groupId: 'actions',
				label: 'Новая сделка',
				onSelect: () => { setCreateOpen(true); setPaletteOpen(false); }
			},
		];

		return (
			<div className={styles.appShell}>
				<div className={styles.sidebarSlot}>
					<Sidebar
						value={nav}
						onChange={setNav}
					>
						<Sidebar.Header>
							<Sidebar.Title>
								Altum CRM
							</Sidebar.Title>
							<Sidebar.Collapse />
						</Sidebar.Header>
						<Sidebar.Content>
							<Sidebar.Group>
								<Sidebar.GroupLabel>
									Продажи
								</Sidebar.GroupLabel>
								<Sidebar.Item value='dashboard' icon={<IconHome size={16} />}>
									Дашборд
								</Sidebar.Item>
								<Sidebar.Item
									value='deals'
									icon={<IconBriefcase size={16} />}
									badge={deals.length}
								>
									Сделки
								</Sidebar.Item>
								<Sidebar.Item value='clients' icon={<IconUserGroup size={16} />}>
									Клиенты
								</Sidebar.Item>
							</Sidebar.Group>
							<Sidebar.Group>
								<Sidebar.GroupLabel>
									Операции
								</Sidebar.GroupLabel>
								<Sidebar.Item
									value='reports'
									icon={<IconGraphLine size={16} />}
									disabled
								>
									Отчёты
								</Sidebar.Item>
								<Sidebar.Item value='settings' icon={<IconGear size={16} />}>
									Настройки
								</Sidebar.Item>
							</Sidebar.Group>
						</Sidebar.Content>
						<Sidebar.Footer>
							<div className={styles.footerSlot}>
								<Inline gap='sm' align='center'>
									<Avatar name='Анна К.' size={28} />
									<Stack gap='none'>
										<Text size='sm'>
											Анна К.
										</Text>
										<Text size='xs' color='muted'>
											Лид продаж
										</Text>
									</Stack>
								</Inline>
							</div>
						</Sidebar.Footer>
					</Sidebar>
				</div>

				<div className={styles.main}>
					<div className={styles.pageChrome}>
						<DemoHeader
							crumbs={`CRM / ${nav === 'dashboard' ? 'Дашборд' : nav === 'deals' ? 'Сделки' : 'Раздел'}`}
							title={nav === 'dashboard' ? 'Дашборд продаж' : nav === 'deals' ? 'Сделки' : nav === 'clients' ? 'Клиенты' : 'Настройки'}
							description='Sidebar + карточки KPI + Table + SearchField/Chip + Modal/Sheet + CommandPalette'
							actions={(
								<Inline gap='sm'>
									<ButtonIcon
										variant='ghost'
										aria-label='Команды'
										icon={<IconSearch size={18} />}
										onClick={() => setPaletteOpen(true)}
									/>
									<ButtonIcon
										variant='ghost'
										aria-label='Уведомления'
										icon={<IconBell size={18} />}
									/>
									<Button
										variant='primary'
										size='sm'
										iconStart={<IconPlus size={16} />}
										onClick={() => setCreateOpen(true)}
									>
										Сделка
									</Button>
								</Inline>
							)}
						/>
					</div>

					<div className={styles.content}>
						{nav === 'dashboard' && (
							<>
								<Alert
									variant='info'
									size='sm'
									title='Квартал Q3'
								>
									Воронка
									{' '}
									{formatRub(pipelineSum)}
									{' '}
									· цели обновлены по региону «Центр».
								</Alert>
								<div className={styles.metrics}>
									<DemoKpiCard
										label='Выручка'
										value='₽2.4M'
										delta='+12%'
										description='30 дней'
									/>
									<DemoKpiCard
										label='Доля побед'
										value='34%'
										delta='+3 п.п.'
									/>
									<DemoKpiCard
										label='Сделок в работе'
										value={String(deals.filter((d) => d.status === 'negotiation').length)}
										delta='−1'
										deltaColor='error'
									/>
									<DemoKpiCard
										label='Средний чек'
										value='₽410K'
										delta='+8%'
									/>
								</div>
								<div className={styles.charts}>
									<div className={styles.panel}>
										<p className={styles.panelTitle}>
											Динамика сделок
										</p>
										<BarChart
											height={200}
											categories={[
												'Янв',
												'Фев',
												'Мар',
												'Апр',
												'Май',
												'Июн'
											]}
											datasets={[
												{
													name: 'Новые',
													data: [
														8,
														12,
														9,
														14,
														11,
														16
													]
												},
												{
													name: 'Выигранные',
													data: [
														3,
														5,
														4,
														7,
														6,
														8
													]
												},
											]}
										/>
									</div>
									<div className={styles.panel}>
										<p className={styles.panelTitle}>
											Статусы
										</p>
										<DonutChart
											size={140}
											centerValue={deals.length}
											centerLabel='всего'
											segments={[
												{
													label: 'Новые',
													value: deals.filter((d) => d.status === 'new').length
												},
												{
													label: 'Переговоры',
													value: deals.filter((d) => d.status === 'negotiation').length
												},
												{
													label: 'Выигранные',
													value: deals.filter((d) => d.status === 'won').length
												},
												{
													label: 'Проигранные',
													value: deals.filter((d) => d.status === 'lost').length
												},
											]}
										/>
									</div>
								</div>
								<div className={styles.panel}>
									<Split align='center'>
										<p className={styles.panelTitle}>
											Недавние сделки
										</p>
										<Button
											variant='ghost'
											size='sm'
											onClick={() => setNav('deals')}
										>
											Все
										</Button>
									</Split>
									<Table
										columns={columns}
										data={deals.slice(0, 4)}
										rowKey={(row) => row.id}
										density='compact'
									/>
								</div>
							</>
						)}

						{nav === 'deals' && (
							<>
								<DemoFilterBar
									query={query}
									onQueryChange={(value) => { setQuery(value); setPage(1); }}
									searchPlaceholder='Компания или владелец…'
									filters={filters}
									onFilterChange={(id, active) => {
										setFilters((prev) => prev.map((item) => (item.id === id ? {
											...item,
											active
										} : item)));
										setPage(1);
									}}
									onClear={() => {
										setQuery('');
										setFilters((prev) => prev.map((item) => ({
											...item,
											active: item.id === 'open'
										})));
										setPage(1);
									}}
									end={(
										<Select
											options={[
												{
													label: 'По сумме',
													value: 'amount'
												},
												{
													label: 'По дате',
													value: 'date'
												},
											]}
											value='amount'
											onChange={() => undefined}
											label='Сортировка'
											size='sm'
											width='md'
										/>
									)}
								/>
								<Table
									columns={columns}
									data={pageRows}
									rowKey={(row) => row.id}
									density='compact'
									rowActions={(row) => [
										{
											id: 'open',
											label: 'Открыть',
											onSelect: () => setSelected(row)
										},
										{
											id: 'won',
											label: 'Отметить выигранной',
											onSelect: () => {
												setDeals((prev) => prev.map((d) => (d.id === row.id ? {
													...d,
													status: 'won' as const
												} : d)));
												push('Сделка выиграна', 'success');
											}
										},
										{
											id: 'del',
											label: 'Удалить',
											onSelect: () => {
												setSelected(row);
												setDeleteOpen(true);
											}
										},
									]}
									empty={{
										title: 'Нет сделок',
										description: 'Снимите фильтры или создайте новую сделку.',
										action: (
											<Button size='sm' onClick={() => setCreateOpen(true)}>
												Создать
											</Button>
										),
									}}
									footer={{
										page,
										totalPages,
										totalItems: filtered.length,
										pageSize,
										onPageChange: setPage,
									}}
								/>
							</>
						)}

						{nav === 'clients' && (
							<div className={styles.panel}>
								<Alert
									variant='warning'
									size='sm'
									title='Черновик раздела'
								>
									Здесь обычно карточки аккаунтов: DescriptionList + Tabs + Timeline.
								</Alert>
								<DescriptionList
									items={[
										{
											label: 'Аккаунтов',
											value: '128'
										},
										{
											label: 'Совпадение ICP',
											value: '62%'
										},
										{
											label: 'Ответы SLA',
											value: '4.2 ч'
										},
									]}
								/>
							</div>
						)}

						{(nav === 'settings' || nav === 'reports') && (
							<div className={styles.panel}>
								<Text size='sm' color='muted'>
									Раздел-заглушка для навигации Sidebar.
								</Text>
							</div>
						)}
					</div>
				</div>

				<Sheet
					open={!!selected && !deleteOpen}
					onOpenChange={(open) => { if (!open) setSelected(null); }}
					mode='sidebar'
					direction='end'
					backdrop
				>
					{selected?.company ? (
						<Sheet.Header showClose>
							<Sheet.Title>
								{selected.company}
							</Sheet.Title>
						</Sheet.Header>
					) : null}
					{selected && (
						<Sheet.Body>
							<div className={styles.detailStack}>
								<Inline gap='sm'>
									<Chip
										as='tag'
										size='sm'
										variant={STATUS_TAG[selected.status].variant}
									>
										{STATUS_TAG[selected.status].label}
									</Chip>
									<Chip size='sm'>
										{selected.stage}
									</Chip>
								</Inline>
								<DescriptionList
									items={[
										{
											label: 'Сумма',
											value: formatRub(selected.amount)
										},
										{
											label: 'Владелец',
											value: selected.owner
										},
										{
											label: 'Обновлено',
											value: selected.updated
										},
									]}
								/>
								<Fieldset variant='plain' legend='История'>
									<Timeline
										items={[
											{
												id: '1',
												title: 'Сделка создана',
												time: '10:00',
												status: 'success'
											},
											{
												id: '2',
												title: 'Отправлено КП',
												time: '12:40',
												status: 'info'
											},
											{
												id: '3',
												title: 'Созвон с ЛПР',
												time: 'вчера'
											},
										]}
									/>
								</Fieldset>
								<Inline gap='sm'>
									<Button
										variant='primary'
										size='sm'
										onClick={() => push('Напоминание запланировано', 'success')}
									>
										Напоминание
									</Button>
									<Button
										variant='secondary'
										size='sm'
										onClick={() => setSelected(null)}
									>
										Закрыть
									</Button>
								</Inline>
							</div>
						</Sheet.Body>
					)}
				</Sheet>

				<Modal open={createOpen} onOpenChange={setCreateOpen}>
					<Modal.Header>
						<Modal.Title>
							Новая сделка
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Stack gap='md'>
							<TextField
								label='Компания'
								value={draft.company}
								onChange={(e) => setDraft((prev) => ({
									...prev,
									company: e.target.value
								}))}
								width='full'
							/>
							<TextField
								label='Сумма, ₽'
								value={draft.amount}
								onChange={(e) => setDraft((prev) => ({
									...prev,
									amount: e.target.value
								}))}
								width='full'
							/>
							<Select
								value={draft.owner}
								onChange={(value) => setDraft((prev) => ({
									...prev,
									owner: String(value)
								}))}
								options={[
									{
										label: 'Анна К.',
										value: 'Анна К.'
									},
									{
										label: 'Игорь М.',
										value: 'Игорь М.'
									},
									{
										label: 'Мария П.',
										value: 'Мария П.'
									},
								]}
								label='Владелец'
							/>
						</Stack>
					</Modal.Body>
					<Modal.Footer>
						<Button variant='secondary' onClick={() => setCreateOpen(false)}>
							Отмена
						</Button>
						<Button
							variant='primary'
							onClick={() => {
								if (!draft.company.trim()) {
									push('Укажите компанию', 'warning');
									return;
								}
								const amount = Number(draft.amount) || 0;
								setDeals((prev) => [
									{
										id: `d-${Date.now()}`,
										company: draft.company.trim(),
										owner: draft.owner,
										amount,
										status: 'new',
										stage: 'Лид',
										updated: 'сейчас',
									},
									...prev,
								]);
								setDraft({
									company: '',
									amount: '',
									owner: 'Анна К.'
								});
								setCreateOpen(false);
								setNav('deals');
								push('Сделка создана', 'success');
							}}
						>
							Создать
						</Button>
					</Modal.Footer>
				</Modal>

				<ConfirmDialog
					open={deleteOpen}
					title='Удалить сделку?'
					message={selected ? `«${selected.company}» будет удалена из воронки.` : ''}
					confirmLabel='Удалить'
					status='danger'
					onOpenChange={setDeleteOpen}
					onConfirm={() => {
						if (selected) {
							setDeals((prev) => prev.filter((d) => d.id !== selected.id));
							push('Сделка удалена', 'success');
						}
						setDeleteOpen(false);
						setSelected(null);
					}}
				/>

				<CommandPalette
					open={paletteOpen}
					onOpenChange={setPaletteOpen}
					placeholder='Перейти или создать…'
					items={commandItems}
					groups={commandGroups}
				/>

				<NotificationContainer notifications={toasts} onClose={dismiss} />
			</div>
		);
	},
};

/* ---------- 2. Служба поддержки ---------- */

interface Ticket {
	id: string;
	subject: string;
	customer: string;
	priority: 'low' | 'normal' | 'high';
	status: 'open' | 'pending' | 'resolved';
	preview: string;
	when: string;
}

interface ChatMessage {
	id: string;
	author: string;
	body: string;
	agent?: boolean;
}

const TICKET_STATUS_LABEL: Record<Ticket['status'], string> = {
	open: 'Открыт',
	pending: 'В ожидании',
	resolved: 'Решён',
};

const TICKET_PRIORITY_LABEL: Record<Ticket['priority'], string> = {
	low: 'Низкий',
	normal: 'Обычный',
	high: 'Высокий',
};

const TICKETS: Ticket[] = [
	{
		id: 't1',
		subject: 'Не приходит OTP',
		customer: 'Елена С.',
		priority: 'high',
		status: 'open',
		preview: 'Код не доходит на +7…',
		when: '2 мин'
	},
	{
		id: 't2',
		subject: 'Смена тарифа',
		customer: 'ООО Вектор',
		priority: 'normal',
		status: 'pending',
		preview: 'Нужен Pro с июля…',
		when: '18 мин'
	},
	{
		id: 't3',
		subject: 'Экспорт CSV',
		customer: 'Павел Р.',
		priority: 'low',
		status: 'open',
		preview: 'В отчёте ломается кодировка…',
		when: '1 ч'
	},
	{
		id: 't4',
		subject: 'API 429',
		customer: 'DevOps Atlas',
		priority: 'high',
		status: 'open',
		preview: 'Лимит rate на /v2/events',
		when: '3 ч'
	},
	{
		id: 't5',
		subject: 'Счёт повторно',
		customer: 'Finance Green',
		priority: 'normal',
		status: 'resolved',
		preview: 'Дубль инвойса #9041',
		when: 'вчера'
	},
];

const INITIAL_THREAD: Record<string, ChatMessage[]> = {
	t1: [
		{
			id: 'm1',
			author: 'Елена С.',
			body: 'Здравствуйте! Не приходит код из SMS уже час.'
		},
		{
			id: 'm2',
			author: 'Вы',
			body: 'Проверяю доставку OTP по номеру. Уточните оператора?',
			agent: true
		},
		{
			id: 'm3',
			author: 'Елена С.',
			body: 'МТС, Москва. Пробовала перезапрос — тоже тишина.'
		},
	],
	t2: [
		{
			id: 'm1',
			author: 'ООО Вектор',
			body: 'Хотим перейти на Pro с 1 июля, нужна смета.'
		},
	],
	t3: [
		{
			id: 'm1',
			author: 'Павел Р.',
			body: 'CSV открывается кракозябрами в Excel.'
		},
	],
	t4: [
		{
			id: 'm1',
			author: 'DevOps Atlas',
			body: 'Ловим 429 на /v2/events после релиза.'
		},
		{
			id: 'm2',
			author: 'Вы',
			body: 'Смотрю квоту и ключи идемпотентности.',
			agent: true
		},
	],
	t5: [
		{
			id: 'm1',
			author: 'Finance Green',
			body: 'Пришёл повторный счёт.'
		},
		{
			id: 'm2',
			author: 'Вы',
			body: 'Отменил дубль, актуальный — #9040.',
			agent: true
		},
	],
};

export const SupportDeskApp: Story<Record<string, never>> = {
	name: 'Служба поддержки',
	render: function SupportDeskAppRender() {
		const {toasts, push, dismiss} = useToasts();
		const [tickets] = useState(TICKETS);
		const [activeId, setActiveId] = useState('t1');
		const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'pending'>('all');
		const [threads, setThreads] = useState(INITIAL_THREAD);
		const [draft, setDraft] = useState('');
		const [typing, setTyping] = useState(false);
		const [detailOpen, setDetailOpen] = useState(false);

		const active = tickets.find((t) => t.id === activeId) ?? tickets[0]!;
		const messages = threads[active.id] ?? [];

		const visible = tickets.filter((t) => {
			if (statusFilter === 'all') return true;
			return t.status === statusFilter;
		});

		const send = () => {
			const text = draft.trim();
			if (!text) return;
			setThreads((prev) => ({
				...prev,
				[active.id]: [
					...(prev[active.id] ?? []),
					{
						id: `m-${Date.now()}`,
						author: 'Вы',
						body: text,
						agent: true
					},
				],
			}));
			setDraft('');
			setTyping(true);
			window.setTimeout(() => {
				setTyping(false);
				push('Клиент получил ответ', 'success');
			}, 1200);
		};

		return (
			<div className={styles.splitApp}>
				<Box variant='outlined' padding='sm'>
					<Split align='center'>
						<Inline gap='sm' align='center'>
							<strong>
								Служба поддержки
							</strong>
							<Chip
								as='tag'
								size='sm'
								variant='tinted'
							>
								{visible.length}
								{' '}
								тикетов
							</Chip>
						</Inline>
						<Inline gap='sm'>
							<Chip
								size='sm'
								variant={statusFilter === 'all' ? 'primary' : 'secondary'}
								onClick={() => setStatusFilter('all')}
							>
								Все
							</Chip>
							<Chip
								size='sm'
								variant={statusFilter === 'open' ? 'primary' : 'secondary'}
								onClick={() => setStatusFilter('open')}
							>
								Открытые
							</Chip>
							<Chip
								size='sm'
								variant={statusFilter === 'pending' ? 'primary' : 'secondary'}
								onClick={() => setStatusFilter('pending')}
							>
								В ожидании
							</Chip>
							<Button
								size='sm'
								variant='secondary'
								onClick={() => setDetailOpen(true)}
							>
								Карточка
							</Button>
						</Inline>
					</Split>
				</Box>

				<div className={styles.splitBody}>
					<div className={styles.ticketList}>
								<div className={styles.ticketListHeader}>
									<Text size='sm' color='muted'>
										Список тикетов + Sheet
									</Text>
								</div>
								<div className={styles.ticketScroll}>
									{visible.map((ticket) => (
										<button
											key={ticket.id}
											type='button'
											className={[styles.ticketRow, ticket.id === active.id ? styles.ticketRowActive : '',].filter(Boolean).join(' ')}
											onClick={() => setActiveId(ticket.id)}
										>
											<div className={styles.ticketTop}>
												<span className={styles.ticketSubject}>
													{ticket.subject}
												</span>
												<span className={styles.ticketMeta}>
													{ticket.when}
												</span>
											</div>
											<Inline gap='sm' align='center'>
												<Avatar name={ticket.customer} size={22} />
												<Text size='xs' color='muted'>
													{ticket.customer}
												</Text>
												{ticket.priority === 'high' && (
													<Badge size='sm' variant='error'>
														!
													</Badge>
												)}
												<Chip
													as='tag'
													size='sm'
													variant={ticket.status === 'resolved' ? 'success' : 'secondary'}
												>
													{TICKET_STATUS_LABEL[ticket.status]}
												</Chip>
											</Inline>
											<Text size='xs' color='muted'>
												{ticket.preview}
											</Text>
										</button>
									))}
								</div>
							</div>
							<div className={styles.chatPane}>
								<div className={styles.chatHeader}>
									<Inline gap='sm' align='center'>
										<Avatar name={active.customer} size={32} />
										<Stack gap='none'>
											<Text size='sm'>
												{active.subject}
											</Text>
											<Text size='xs' color='muted'>
												{active.customer}
											</Text>
										</Stack>
									</Inline>
									<Inline gap='sm'>
										<Chip
											as='tag'
											size='sm'
											variant={active.priority === 'high' ? 'error' : 'secondary'}
										>
											{TICKET_PRIORITY_LABEL[active.priority]}
										</Chip>
										<ButtonIcon
											variant='ghost'
											size='sm'
											aria-label='Чеклист'
											icon={<IconChecklist size={16} />}
											onClick={() => push('Чеклист открыт', 'info')}
										/>
									</Inline>
								</div>

								<div className={styles.chatMessages}>
									{messages.map((msg) => (
										<div
											key={msg.id}
											className={[styles.message, msg.agent ? styles.messageAgent : ''].filter(Boolean).join(' ')}
										>
											<span className={styles.messageAuthor}>
												{msg.author}
											</span>
											<p className={styles.messageBody}>
												{msg.body}
											</p>
										</div>
									))}
									{typing && (
										<div className={styles.message}>
											<span className={styles.messageAuthor}>
												Клиент
											</span>
											<Spinner variant='typing' aria-label='Печатает' />
										</div>
									)}
								</div>

								<div className={styles.composerWrap}>
									<Stack gap='sm'>
										<TextareaField
											label='Ответ'
											value={draft}
											onChange={(event) => setDraft(event.target.value)}
											placeholder='Ответить клиенту…'
											width='full'
											rows={3}
										/>
										<Button
											variant='primary'
											size='sm'
											onClick={send}
											disabled={!draft.trim()}
										>
											Отправить
										</Button>
									</Stack>
								</div>
							</div>
				</div>

				<Sheet
					open={detailOpen}
					onOpenChange={setDetailOpen}
					mode='sidebar'
					direction='end'
					backdrop
				>
					<Sheet.Header showClose>
						<Sheet.Title>
							Тикет
						</Sheet.Title>
					</Sheet.Header>
					<Sheet.Body>
						<div className={styles.detailStack}>
							<DescriptionList
								items={[
									{
										label: 'Тема',
										value: active.subject
									},
									{
										label: 'Клиент',
										value: active.customer
									},
									{
										label: 'Приоритет',
										value: TICKET_PRIORITY_LABEL[active.priority]
									},
									{
										label: 'Статус',
										value: TICKET_STATUS_LABEL[active.status]
									},
								]}
							/>
							<Fieldset variant='card' legend='Заметка агента'>
								<TextareaField
									label='Внутренняя заметка'
									defaultValue='Проверить SMS-провайдер и blacklist.'
									width='full'
								/>
							</Fieldset>
							<Timeline
								items={[
									{
										id: '1',
										title: 'Создан',
										time: '09:12',
										status: 'success'
									},
									{
										id: '2',
										title: 'Назначен на вас',
										time: '09:14',
										status: 'info'
									},
									{
										id: '3',
										title: 'Первый ответ',
										time: '09:20'
									},
								]}
							/>
						</div>
					</Sheet.Body>
				</Sheet>

				<NotificationContainer notifications={toasts} onClose={dismiss} />
			</div>
		);
	},
};

/* ---------- 3. Студия проектов (календарь + тулбар) ---------- */

function studioTasks(anchor = new Date()): CalendarBoardTask[] {
	const weekStart = startOfWeek(anchor, 1);
	return [
		{
			id: 'kickoff',
			title: 'Кикофф спринта 24',
			start: new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() + 1, 10, 0),
			end: new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() + 1, 11, 0),
			color: 'var(--altum-color-status-info)',
		},
		{
			id: 'design',
			title: 'Дизайн-критика',
			start: new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() + 2, 14, 0),
			end: new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() + 2, 15, 30),
			color: 'var(--altum-color-status-warning)',
		},
		{
			id: 'release',
			title: 'Заморозка релиза',
			start: startOfDay(addDays(weekStart, 4)),
			end: startOfDay(addDays(weekStart, 5)),
			allDay: true,
			color: 'var(--altum-color-status-success)',
		},
	];
}

export const ProjectStudioApp: Story<Record<string, never>> = {
	name: 'Студия проекта',
	render: function ProjectStudioAppRender() {
		const {toasts, push, dismiss} = useToasts();
		const [viewDate, setViewDate] = useState(() => startOfDay(new Date()));
		const [tasks] = useState(() => studioTasks());
		const [chips, setChips] = useState([
			{
				id: 'mine',
				label: 'Мои',
				active: true
			},
			{
				id: 'team',
				label: 'Команда',
				active: true
			},
			{
				id: 'blocked',
				label: 'Заблокировано',
				active: false
			},
		]);
		const [selected, setSelected] = useState<CalendarBoardTask | null>(null);
		const [drawerOpen, setDrawerOpen] = useState(false);
		const [section, setSection] = useState('calendar');

		return (
			<div className={styles.studioShell}>
				<div className={styles.menubarRow}>
					<Inline
						gap='sm'
						align='center'
						wrap
					>
						<Button
							size='sm'
							variant='ghost'
							onClick={() => push('Проект создан', 'success')}
						>
							Новый проект
						</Button>
						<Button
							size='sm'
							variant='ghost'
							onClick={() => push('ICS скачан', 'info')}
						>
							Экспорт ICS
						</Button>
						<Button
							size='sm'
							variant={section === 'calendar' ? 'tinted' : 'ghost'}
							onClick={() => setSection('calendar')}
						>
							Календарь
						</Button>
						<Button
							size='sm'
							variant={section === 'tasks' ? 'tinted' : 'ghost'}
							onClick={() => setSection('tasks')}
						>
							Список задач
						</Button>
						<Button
							size='sm'
							variant='ghost'
							onClick={() => push('Документация', 'info')}
						>
							Документация
						</Button>
					</Inline>
				</div>

				<div className={styles.studioBody}>
					<aside className={styles.studioNav}>
						<Inline gap='sm' align='center'>
							<IconCalendar size={18} />
							<strong>
								Студия
							</strong>
						</Inline>
						<Stack gap='xs'>
							{[
								{
									id: 'calendar',
									label: 'Календарь'
								},
								{
									id: 'tasks',
									label: 'Задачи'
								},
								{
									id: 'people',
									label: 'Люди'
								},
							].map((item) => (
								<Button
									key={item.id}
									size='sm'
									variant={section === item.id ? 'tinted' : 'ghost'}
									fullWidth
									onClick={() => setSection(item.id)}
								>
									{item.label}
								</Button>
							))}
						</Stack>
						<Alert
							variant='info'
							size='sm'
							title='Спринт 24'
						>
							Заморозка в четверг · Toolbar + CalendarBoard + Chip-фильтры
						</Alert>
					</aside>

					<div className={styles.studioMain}>
						<DemoHeader
							level={4}
							title={section === 'calendar' ? 'Календарь команды' : section === 'tasks' ? 'Бэклог' : 'Люди'}
							actions={(
								<Button
									size='sm'
									variant='primary'
									iconStart={<IconPlus size={16} />}
									onClick={() => push('Событие', 'success')}
								>
									Событие
								</Button>
							)}
						/>

						<Inline gap='sm' wrap>
							{chips.map((chip) => (
								<Chip
									key={chip.id}
									size='sm'
									variant={chip.active ? 'tinted' : 'secondary'}
									as={chip.active ? 'toggle' : 'chip'}
									onClick={() => {
										setChips((prev) => prev.map((c) => (c.id === chip.id ? {
											...c,
											active: !c.active
										} : c)));
									}}
								>
									{chip.label}
								</Chip>
							))}
						</Inline>

						{section === 'calendar' && (
							<div className={styles.calendarHost}>
								<CalendarBoard.Provider
									tasks={tasks}
									viewDate={viewDate}
									onViewDateChange={setViewDate}
									defaultView='week'
									onTaskClick={(task) => {
										setSelected(task);
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
							</div>
						)}

						{section === 'tasks' && (
							<Stack gap='sm'>
								{tasks.map((task) => (
									<Menu
										trigger='context'
										key={task.id}
										items={[
											{
												id: 'open',
												label: 'Открыть',
												onSelect: () => { setSelected(task); setDrawerOpen(true); }
											},
											{
												id: 'done',
												label: 'Готово',
												onSelect: () => push(`${task.title} · готово`, 'success')
											},
										]}
									>
										<div className={styles.panel} style={{padding: 'var(--altum-g-space-3)'}}>
											<Split align='center'>
												<Text size='sm'>
													{task.title}
												</Text>
												<Chip
													as='tag'
													size='sm'
													variant='secondary'
												>
													ПКМ
												</Chip>
											</Split>
										</div>
									</Menu>
								))}
							</Stack>
						)}

						{section === 'people' && (
							<div className={styles.panel}>
								<EmptyState title='Люди' description='Здесь обычно список людей и Avatar stack.' />
							</div>
						)}
					</div>
				</div>

				<Sheet
					open={drawerOpen}
					onOpenChange={setDrawerOpen}
					mode='sidebar'
					direction='end'
					backdrop
				>
					<Sheet.Header showClose>
						<Sheet.Title>
							{selected?.title ?? 'Событие'}
						</Sheet.Title>
					</Sheet.Header>
					{selected ? (
						<Sheet.Body>
							<div className={styles.detailStack}>
								<Chip
									as='tag'
									size='sm'
									variant='tinted'
								>
									{selected.allDay ? 'Весь день' : 'По времени'}
								</Chip>
								<DescriptionList
									items={[
										{
											label: 'ID',
											value: selected.id
										},
										{
											label: 'Старт',
											value: selected.start.toLocaleString('ru-RU')
										},
									]}
								/>
								<Timeline
									items={[
										{
											id: '1',
											title: 'Создано',
											time: 'пн',
											status: 'success'
										},
										{
											id: '2',
											title: 'Напоминание',
											time: 'за 1 ч',
											status: 'info'
										},
									]}
								/>
							</div>
						</Sheet.Body>
					) : null}
				</Sheet>

				<NotificationContainer notifications={toasts} onClose={dismiss} />
			</div>
		);
	},
};

/* ---------- 4. Медиатека ---------- */

const FOLDER_OPTIONS = [
	{
value: 'brand',
label: 'Бренд'
},
	{
value: 'logos',
label: 'Логотипы',
parent: 'brand'
},
	{
value: 'photos',
label: 'Фото',
parent: 'brand'
},
	{
value: 'product',
label: 'Продукт'
},
	{
value: 'ui',
label: 'Скриншоты UI',
parent: 'product'
},
	{
value: 'video',
label: 'Кадры видео',
parent: 'product'
},
];

const DEMO_ASSETS = [
	{
		id: 'a1',
		name: 'hero-light.png',
		folder: 'photos'
	},
	{
		id: 'a2',
		name: 'mark.svg',
		folder: 'logos'
	},
	{
		id: 'a3',
		name: 'dashboard.png',
		folder: 'ui'
	},
	{
		id: 'a4',
		name: 'onboarding-1.png',
		folder: 'ui'
	},
	{
		id: 'a5',
		name: 'team.jpg',
		folder: 'photos'
	},
	{
		id: 'a6',
		name: 'wordmark.svg',
		folder: 'logos'
	},
];

export const MediaLibraryApp: Story<Record<string, never>> = {
	name: 'Медиатека',
	render: function MediaLibraryAppRender() {
		const {toasts, push, dismiss} = useToasts();
		const [folder, setFolder] = useState('photos');
		const [query, setQuery] = useState('');
		const [uploads, setUploads] = useState<FileListItemProps[]>([
			{
				id: 'u1',
				name: 'brief.pdf',
				size: '240 KB',
				status: 'done'
			},
			{
				id: 'u2',
				name: 'raw.zip',
				size: '12 MB',
				status: 'uploading',
				progress: 62
			},
		]);
		const [preview, setPreview] = useState(false);

		const assets = DEMO_ASSETS.filter((asset) => {
			if (folder === 'brand') return ['logos', 'photos'].includes(asset.folder);
			if (folder === 'product') return ['ui', 'video'].includes(asset.folder);
			if (!query.trim()) return asset.folder === folder;
			return asset.folder === folder && asset.name.toLowerCase().includes(query.toLowerCase());
		}).filter((asset) => {
			if (!query.trim()) return true;
			return asset.name.toLowerCase().includes(query.toLowerCase());
		});

		return (
			<div className={styles.mediaShell}>
				<div className={styles.pageChrome}>
					<DemoHeader
						title='Медиатека'
						description='Select + UploadZone/FileList + Menu + ImageGallery'
						actions={(
							<Button
								size='sm'
								variant='secondary'
								onClick={() => setPreview(true)}
							>
								Галерея
							</Button>
						)}
					/>
				</div>

				<div className={styles.mediaSplit}>
							<div className={styles.folderPane}>
								<Select
									options={FOLDER_OPTIONS}
									value={folder}
									onChange={(id) => {
										if (!Array.isArray(id)) setFolder(id);
									}}
									label='Папка'
									width='full'
								/>
								<UploadZone
									onChange={(files) => {
										const next = Array.from(files).map((file, index) => ({
											id: `up-${Date.now()}-${index}`,
											name: file.name,
											size: `${Math.max(1, Math.round(file.size / 1024))} KB`,
											status: 'uploading' as const,
											progress: 30,
										}));
										setUploads((prev) => [...next, ...prev]);
										push(`Загрузка: ${files.length}`, 'info');
									}}
								>
									Перетащите файлы или выберите
								</UploadZone>
								<FileList.Root>
									{uploads.map((item) => (<FileList.Item
										key={item.id}
										{...item}
										onRemove={(id) => setUploads((prev) => prev.filter((item) => item.id !== id))}
										onRetry={(id) => {
											setUploads((prev) => prev.map((item) => (
												item.id === id ? {
													...item,
													status: 'uploading',
													progress: 10,
													error: undefined
												} : item
											)));
											push('Повтор', 'info');
										}}
									                        />))}
								</FileList.Root>
							</div>
							<div className={styles.assetsPane}>
								<DemoFilterBar
									query={query}
									onQueryChange={setQuery}
									searchPlaceholder='Имя файла…'
									onClear={() => setQuery('')}
									end={(
										<Inline gap='sm' align='center'>
											<IconFolder size={16} />
											<Chip
												as='tag'
												size='sm'
												variant='tinted'
											>
												{FOLDER_OPTIONS.find((item) => item.value === folder)?.label ?? folder}
											</Chip>
										</Inline>
									)}
								/>
								{assets.length === 0 ? (
									<EmptyState title='Пусто' description='Смените папку или загрузите файлы.' />
								) : (
									<div className={styles.assetGrid}>
										{assets.map((asset) => (
											<Menu
												trigger='context'
												key={asset.id}
												items={[
													{
														id: 'open',
														label: 'Открыть',
														onSelect: () => setPreview(true)
													},
													{
														id: 'rename',
														label: 'Переименовать',
														onSelect: () => push(asset.name, 'info')
													},
													{
														id: 'del',
														label: 'Удалить',
														onSelect: () => push('Удалено', 'warning')
													},
												]}
											>
												<div className={styles.assetTile}>
													<div className={styles.assetThumb}>
														<IconPhoto size={20} />
													</div>
													<Text size='xs'>
														{asset.name}
													</Text>
												</div>
											</Menu>
										))}
									</div>
								)}
							</div>
				</div>

				<Modal open={preview} onOpenChange={setPreview}>
					<Modal.Header>
						<Modal.Title>
							Превью
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<ImageGallery
							images={[demoImage(1), demoImage(2), demoImage(3)]}
							showThumbnails={false}
						/>
					</Modal.Body>
				</Modal>

				<NotificationContainer notifications={toasts} onClose={dismiss} />
			</div>
		);
	},
};
