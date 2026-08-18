import type {Meta} from '@storybook/react';
import React, {useMemo, useState} from 'react';
import {Avatar} from '../Avatar/Avatar';
import {Badge} from '../Badge/Badge';
import {Button} from '../Button/Button';
import {ButtonIcon} from '../ButtonIcon/ButtonIcon';
import {Card} from '../Card/Card';
import {ConfirmDialog} from '../ConfirmDialog/ConfirmDialog';
import {DatePicker} from '../DatePicker/DatePicker';
import {Sheet} from '../Sheet/Sheet';
import {Inline, Split} from '../Layout/Layout';
import {LineChart} from '../LineChart/LineChart';
import {Modal} from '../Modal/Modal';
import {NotificationContainer} from '../Notification/Notification';
import type {NotificationItem} from '../Notification/Notification';
import {NumberField} from '../NumberField/NumberField';
import {Pagination} from '../Pagination/Pagination';
import {SearchField} from '../SearchField/SearchField';
import {SegmentedControl} from '../SegmentedControl/SegmentedControl';
import {Select} from '../Select/Select';
import {Sidebar} from '../Sidebar/Sidebar';
import {Separator} from '../Separator/Separator';
import {StatBadge} from '../StatBadge/StatBadge';
import {Table} from '../Table/Table';
import {Chip} from '../Chip/Chip';
import {Text} from '../Text/Text';
import {TextField} from '../TextField/TextField';
import {TimePickerField} from '../TimePicker/TimePicker';
import {Title} from '../Title/Title';
import {Tooltip} from '../Tooltip/Tooltip';
import {IconPlus} from '../../icons/icons/IconPlus';
import {componentParameters, story, Story} from '../../storybook/meta';
import styles from './WaterMeterAdmin.stories.module.css';

type MeterStatus = 'active' | 'warning' | 'offline';

interface WaterMeter {
	id: string;
	serialNumber: string;
	address: string;
	apartment: string;
	building: string;
	lastReading: number;
	previousReading: number;
	status: MeterStatus;
	lastCheckDate: Date;
}

const BUILDINGS = [
	{
		label: 'Все дома',
		value: 'all'
	},
	{
		label: 'ул. Ленина, 12',
		value: 'lenina-12'
	},
	{
		label: 'пр. Мира, 5',
		value: 'mira-5'
	},
	{
		label: 'ул. Садовая, 8',
		value: 'sadovaya-8'
	},
];

const INITIAL_METERS: WaterMeter[] = [
	{
		id: '1',
		serialNumber: 'WM-10482',
		address: 'ул. Ленина, 12',
		apartment: 'кв. 45',
		building: 'lenina-12',
		lastReading: 1284.6,
		previousReading: 1271.2,
		status: 'active',
		lastCheckDate: new Date(2026, 5, 28),
	},
	{
		id: '2',
		serialNumber: 'WM-20931',
		address: 'ул. Ленина, 12',
		apartment: 'кв. 12',
		building: 'lenina-12',
		lastReading: 892.1,
		previousReading: 880.0,
		status: 'warning',
		lastCheckDate: new Date(2026, 5, 15),
	},
	{
		id: '3',
		serialNumber: 'WM-33017',
		address: 'пр. Мира, 5',
		apartment: 'кв. 7',
		building: 'mira-5',
		lastReading: 2105.3,
		previousReading: 2098.8,
		status: 'active',
		lastCheckDate: new Date(2026, 6, 1),
	},
	{
		id: '4',
		serialNumber: 'WM-44102',
		address: 'ул. Садовая, 8',
		apartment: 'кв. 22',
		building: 'sadovaya-8',
		lastReading: 456.0,
		previousReading: 456.0,
		status: 'offline',
		lastCheckDate: new Date(2026, 3, 10),
	},
	{
		id: '5',
		serialNumber: 'WM-55289',
		address: 'пр. Мира, 5',
		apartment: 'кв. 31',
		building: 'mira-5',
		lastReading: 1678.4,
		previousReading: 1665.9,
		status: 'active',
		lastCheckDate: new Date(2026, 6, 2),
	},
	{
		id: '6',
		serialNumber: 'WM-66340',
		address: 'ул. Садовая, 8',
		apartment: 'кв. 3',
		building: 'sadovaya-8',
		lastReading: 312.7,
		previousReading: 298.1,
		status: 'warning',
		lastCheckDate: new Date(2026, 5, 20),
	},
];

const STATUS_LABEL: Record<MeterStatus, string> = {
	active: 'Активен',
	warning: 'Требует проверки',
	offline: 'Не на связи',
};

const formatDate = (date: Date) => date.toLocaleDateString('ru-RU');

const WaterMeterAdminDemo = () => {
	const [navId, setNavId] = useState('meters');
	const [meters, setMeters] = useState(INITIAL_METERS);
	const [search, setSearch] = useState('');
	const [building, setBuilding] = useState('all');
	const [statusFilter, setStatusFilter] = useState<'all' | MeterStatus>('all');
	const [page, setPage] = useState(1);
	const [selectedKeys, setSelectedKeys] = useState<Set<string | number>>(new Set());
	const [detailMeter, setDetailMeter] = useState<WaterMeter | null>(null);
	const [readingModalOpen, setReadingModalOpen] = useState(false);
	const [deleteTarget, setDeleteTarget] = useState<WaterMeter | null>(null);
	const [notifications, setNotifications] = useState<NotificationItem[]>([]);
	const [readingForm, setReadingForm] = useState({
		serial: '',
		value: 0,
		date: new Date(),
		time: '10:00',
	});

	const pageSize = 4;

	const filtered = useMemo(() => {
		return meters.filter((meter) => {
			const q = search.trim().toLowerCase();
			const matchesSearch = !q
				|| meter.serialNumber.toLowerCase().includes(q)
				|| meter.address.toLowerCase().includes(q)
				|| meter.apartment.toLowerCase().includes(q);
			const matchesBuilding = building === 'all' || meter.building === building;
			const matchesStatus = statusFilter === 'all' || meter.status === statusFilter;
			return matchesSearch && matchesBuilding && matchesStatus;
		});
	}, [
		building,
		meters,
		search,
		statusFilter
	]);

	const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
	const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

	const stats = useMemo(() => {
		const consumption = meters.reduce((sum, m) => sum + Math.max(0, m.lastReading - m.previousReading), 0);
		return {
			total: meters.length,
			active: meters.filter((m) => m.status === 'active').length,
			warnings: meters.filter((m) => m.status === 'warning').length,
			consumption: consumption.toFixed(1),
		};
	}, [meters]);

	const notify = (title: string, variant: NotificationItem['variant'] = 'success') => {
		const id = String(Date.now());
		setNotifications((prev) => [
			...prev,
			{
				id,
				title,
				variant,
				duration: 3500
			}
		]);
	};

	const openReadingModal = (meter?: WaterMeter) => {
		if (meter) {
			setReadingForm({
				serial: meter.serialNumber,
				value: meter.lastReading,
				date: new Date(),
				time: '10:00',
			});
		} else {
			setReadingForm({
				serial: '',
				value: 0,
				date: new Date(),
				time: '10:00',
			});
		}
		setReadingModalOpen(true);
	};

	const saveReading = () => {
		if (!readingForm.serial.trim()) return;

		setMeters((prev) => {
			const existing = prev.find((m) => m.serialNumber === readingForm.serial);
			if (existing) {
				return prev.map((m) => (
					m.serialNumber === readingForm.serial
						? {
							...m,
							previousReading: m.lastReading,
							lastReading: readingForm.value,
							lastCheckDate: readingForm.date,
							status: 'active' as MeterStatus,
						}
						: m
				));
			}

			return [
				...prev,
				{
					id: String(Date.now()),
					serialNumber: readingForm.serial,
					address: 'Новый адрес',
					apartment: 'кв. —',
					building: 'lenina-12',
					lastReading: readingForm.value,
					previousReading: 0,
					status: 'active' as MeterStatus,
					lastCheckDate: readingForm.date,
				},
			];
		});

		setReadingModalOpen(false);
		notify('Показания сохранены');
	};

	const confirmDelete = () => {
		if (!deleteTarget) return;
		setMeters((prev) => prev.filter((m) => m.id !== deleteTarget.id));
		setSelectedKeys((keys) => {
			const next = new Set(keys);
			next.delete(deleteTarget.id);
			return next;
		});
		if (detailMeter?.id === deleteTarget.id) setDetailMeter(null);
		setDeleteTarget(null);
		notify('Счётчик удалён', 'info');
	};

	const chartData = detailMeter
		? {
			categories: [
				'Янв',
				'Фев',
				'Мар',
				'Апр',
				'Май',
				'Июн'
			],
			values: [
				detailMeter.previousReading - 18,
				detailMeter.previousReading - 14,
				detailMeter.previousReading - 10,
				detailMeter.previousReading - 6,
				detailMeter.previousReading - 2,
				detailMeter.lastReading,
			],
		}
		: null;

	return (
		<div className={styles.app}>
			<div className={styles.sidebarWrap}>
				<Sidebar
					value={navId}
					onChange={setNavId}
				>
					<Sidebar.Header>
						<Sidebar.Title>
							Водоканал
						</Sidebar.Title>
						<Sidebar.Collapse />
					</Sidebar.Header>
					<Sidebar.Content>
						<Sidebar.Item value='dashboard' icon='📊'>
							Дашборд
						</Sidebar.Item>
						<Sidebar.Item value='meters' icon='💧'>
							Счётчики
						</Sidebar.Item>
						<Sidebar.Item value='readings' icon='📝'>
							Показания
						</Sidebar.Item>
						<Sidebar.Item value='reports' icon='📈'>
							Отчёты
						</Sidebar.Item>
						<Sidebar.Item value='settings' icon='⚙️'>
							Настройки
						</Sidebar.Item>
					</Sidebar.Content>
				</Sidebar>
			</div>

			<div className={styles.main}>
				<header className={styles.header}>
					<Split
						align='center'
						gap='md'
					>
						<div>
							<Text size='xs' color='muted'>
								Админка / Счётчики воды
							</Text>
							<Separator
								start={8}
								end={8}
								decorative
							/>
							<Title level={4}>
								Управление счётчиками воды
							</Title>
						</div>
						<Inline align='center' gap='sm'>
							<Badge label={stats.warnings} dot={stats.warnings === 0}>
								<Button variant='secondary' size='sm'>
									Уведомления
								</Button>
							</Badge>
							<Tooltip content='Добавить показания' asChild>
								<ButtonIcon
									icon={<IconPlus size={18} />}
									aria-label='Добавить показания'
									variant='primary'
									onClick={() => openReadingModal()}
								/>
							</Tooltip>
							<Avatar name='Оператор' size={36} />
						</Inline>
					</Split>
				</header>

				<div className={styles.toolbar}>
					<div className={styles.statsRow}>
						<StatBadge label='Всего' value={stats.total} />
						<StatBadge
							label='Активны'
							value={stats.active}
							variant='success'
							size='sm'
						/>
						<StatBadge
							label='Проверка'
							value={stats.warnings}
							variant='warning'
							size='sm'
						/>
						<StatBadge
							label='м³ за период'
							value={stats.consumption}
							variant='default'
							size='sm'
						/>
					</div>
				</div>

				<div className={styles.content}>
					<div className={styles.filters}>
						<div className={styles.filterField}>
							<SearchField
								label='Поиск'
								value={search}
								onChange={(e) => {
									setSearch(e.target.value);
									setPage(1);
								}}
								size='sm'
							/>
						</div>
						<div className={styles.filterField}>
							<Select.Root
								options={BUILDINGS}
								value={building}
								onChange={(val) => {
									if (Array.isArray(val)) return;
									setBuilding(val);
									setPage(1);
								}}
							>
								<Select.Trigger label='Дом' />
								<Select.Panel>
									<Select.Filter />
									<Select.List />
								</Select.Panel>
							</Select.Root>
						</div>
						<SegmentedControl
							options={[
								{
									label: 'Все',
									value: 'all'
								},
								{
									label: 'Активные',
									value: 'active'
								},
								{
									label: 'Проверка',
									value: 'warning'
								},
								{
									label: 'Офлайн',
									value: 'offline'
								},
							]}
							value={statusFilter}
							onChange={(val) => {
								setStatusFilter(val as typeof statusFilter);
								setPage(1);
							}}
							size='sm'
						/>
					</div>

					<Card className={styles.tableCard}>
						<Card.Header>
							<Split align='center'>
								<Title level={4}>
									Реестр счётчиков
								</Title>
								<Chip mode='tag' variant='secondary'>
									{filtered.length}
									{' '}
									шт.
								</Chip>
							</Split>
						</Card.Header>
						<Card.Body>
							<Table.Root aria-label='Таблица счётчиков воды'>
								<Table.Content
									columns={[
										{
											key: 'serialNumber',
											header: 'Серийный №',
											sortable: true
										},
										{
											key: 'address',
											header: 'Адрес',
											sortable: true
										},
										{
											key: 'apartment',
											header: 'Квартира'
										},
										{
											key: 'lastReading',
											header: 'Показание, м³',
											sortable: true,
											render: (row) => row.lastReading.toFixed(1),
										},
										{
											key: 'delta',
											header: 'Расход',
											render: (row) => (
												<Text size='sm'>
													+
													{(row.lastReading - row.previousReading).toFixed(1)}
												</Text>
											),
										},
										{
											key: 'status',
											header: 'Статус',
											render: (row) => (
												<Chip mode='tag' variant={row.status === 'active' ? 'primary' : 'secondary'}>
													{STATUS_LABEL[row.status]}
												</Chip>
											),
										},
										{
											key: 'lastCheckDate',
											header: 'Проверка',
											render: (row) => formatDate(row.lastCheckDate),
										},
										{
											key: 'actions',
											header: '',
											render: (row) => (
												<Inline gap='xs'>
													<Button
														size='sm'
														variant='secondary'
														onClick={() => setDetailMeter(row)}
													>
														Детали
													</Button>
													<Button
														size='sm'
														variant='secondary'
														status='danger'
														onClick={() => setDeleteTarget(row)}
													>
														Удалить
													</Button>
												</Inline>
											),
										},
									]}
									data={pageItems}
									rowKey={(row) => row.id}
									selectedKeys={selectedKeys}
									onSelectionChange={setSelectedKeys}
								/>
							</Table.Root>
						</Card.Body>
						<Card.Actions>
							<Split
								align='center'
								gap='sm'
							>
								<Text size='sm' color='muted'>
									Выбрано:
									{' '}
									{selectedKeys.size}
								</Text>
								<Pagination
									currentPage={Math.min(page, totalPages)}
									totalPages={totalPages}
									onPageChange={setPage}
								>
									<Pagination.Controls />
								</Pagination>
							</Split>
						</Card.Actions>
					</Card>
				</div>
			</div>

			<Sheet
				open={!!detailMeter}
				onClose={() => setDetailMeter(null)}
				mode='sidebar'
				direction='end'
				width={420}
				backdrop
			>
				<Sheet.Header showClose>
					<Sheet.Title>
						{detailMeter ? detailMeter.serialNumber : 'Счётчик'}
					</Sheet.Title>
				</Sheet.Header>
				{detailMeter && (
					<Sheet.Body>
						<div className={styles.drawerBody}>
							<div className={styles.metaGrid}>
								<div className={styles.metaItem}>
									<Text size='sm' color='muted'>
										Адрес
									</Text>
									<Text>
										{detailMeter.address}
									</Text>
								</div>
								<div className={styles.metaItem}>
									<Text size='sm' color='muted'>
										Квартира
									</Text>
									<Text>
										{detailMeter.apartment}
									</Text>
								</div>
								<div className={styles.metaItem}>
									<Text size='sm' color='muted'>
										Текущее показание
									</Text>
									<Text>
										{detailMeter.lastReading.toFixed(1)}
										{' '}
										м³
									</Text>
								</div>
								<div className={styles.metaItem}>
									<Text size='sm' color='muted'>
										Последняя проверка
									</Text>
									<Text>
										{formatDate(detailMeter.lastCheckDate)}
									</Text>
								</div>
							</div>

							<Title level={4}>
								Динамика потребления
							</Title>
							<div className={styles.chartSection}>
								{chartData && (
									<LineChart
										categories={chartData.categories}
										datasets={[
											{
												name: 'м³',
												color: '#3b82f6',
												data: chartData.values
											}
										]}
										height={220}
									/>
								)}
							</div>

							<Inline gap='sm'>
								<Button fullWidth onClick={() => openReadingModal(detailMeter)}>
									Внести показания
								</Button>
								<Button
									variant='secondary'
									fullWidth
									onClick={() => setDetailMeter(null)}
								>
									Закрыть
								</Button>
							</Inline>
						</div>
					</Sheet.Body>
				)}
			</Sheet>

			<Modal
				open={readingModalOpen}
				onClose={() => setReadingModalOpen(false)}
			>
				<Modal.Header>
					<Modal.Title>
						Внесение показаний
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<div className={styles.modalForm}>
						<TextField
							label='Серийный номер'
							value={readingForm.serial}
							onChange={(e) => setReadingForm((f) => ({
								...f,
								serial: e.target.value
							}))}
						/>
						<NumberField
							label='Показание, м³'
							value={readingForm.value}
							min={0}
							step={0.1}
							onChange={(val) => setReadingForm((f) => ({
								...f,
								value: val ?? 0
							}))}
						/>
						<DatePicker
							label='Дата снятия'
							value={readingForm.date}
							onChange={(date) => {
								if (!date) return;
								setReadingForm((f) => ({
									...f,
									date,
								}));
							}}
						/>
						<TimePickerField
							label='Время'
							value={readingForm.time}
							onChange={(time) => setReadingForm((f) => ({
								...f,
								time
							}))}
						/>
					</div>
				</Modal.Body>
				<Modal.Footer>
					<Inline gap='sm'>
						<Button variant='secondary' onClick={() => setReadingModalOpen(false)}>
							Отмена
						</Button>
						<Button onClick={saveReading}>
							Сохранить
						</Button>
					</Inline>
				</Modal.Footer>
			</Modal>

			<ConfirmDialog
				open={!!deleteTarget}
				title='Удалить счётчик?'
				message={deleteTarget ? `Счётчик ${deleteTarget.serialNumber} будет удалён из реестра.` : ''}
				confirmLabel='Удалить'
				status='danger'
				onCancel={() => setDeleteTarget(null)}
				onConfirm={confirmDelete}
			/>

			<NotificationContainer
				notifications={notifications}
				onClose={(id) => setNotifications((n) => n.filter((item) => item.id !== id))}
			/>
		</div>
	);
};

export default {
	title: 'altum/Examples/Water Meter Admin',
	component: WaterMeterAdminDemo,
	tags: ['autodocs'],
	parameters: componentParameters(
		'Админ-панель для управления счётчиками воды: реестр, фильтры, показания, аналитика и уведомления.',
	),
	argTypes: {},
} satisfies Meta<typeof WaterMeterAdminDemo>;

export const Playground: Story<typeof WaterMeterAdminDemo> = {
	parameters: story('Полноценный пример админки ЖКХ с таблицей счётчиков, drawer деталей и внесением показаний.'),
};
