/* eslint-disable @stylistic/jsx-closing-bracket-location -- Существующее форматирование фикстуры Storybook сохранено для читаемого вложенного JSX. */
import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {Accordion} from '../Accordion/Accordion';
import {Alert} from '../Alert/Alert';
import {ActionList} from '../ActionList/ActionList';
import {AspectRatio} from '../AspectRatio/AspectRatio';
import {Attachment} from '../Attachment/Attachment';
import {Avatar} from '../Avatar/Avatar';
import {Badge} from '../Badge/Badge';
import {BarChart} from '../BarChart/BarChart';
import {Box} from '../Box/Box';
import {Bubble} from '../Bubble/Bubble';
import {Button} from '../Button/Button';
import {ButtonIcon} from '../ButtonIcon/ButtonIcon';
import {Calendar} from '../Calendar/Calendar';
import {Card} from '../Card/Card';
import {Checkbox, CheckboxGroup} from '../Checkbox/Checkbox';
import {Chip} from '../Chip/Chip';
import {Collapse} from '../Collapse/Collapse';
import {ColorSwatchGroup} from '../ColorSwatchGroup/ColorSwatchGroup';
import {CommandPalette} from '../CommandPalette/CommandPalette';
import {ConfirmDialog} from '../ConfirmDialog/ConfirmDialog';
import {DatePicker} from '../DatePicker/DatePicker';
import {DateRangePicker} from '../DateRangePicker/DateRangePicker';
import {DescriptionList} from '../DescriptionList/DescriptionList';
import {DonutChart} from '../DonutChart/DonutChart';
import {DropdownMenu} from '../DropdownMenu/DropdownMenu';
import {Dropdown} from '../Dropdown/Dropdown';
import {EmptyState} from '../EmptyState/EmptyState';
import {FieldLabel} from '../FieldLabel/FieldLabel';
import {Fieldset} from '../Fieldset/Fieldset';
import {FileList, type FileListItemProps} from '../FileList/FileList';
import {FormMessage} from '../FormMessage/FormMessage';
import {Grid} from '../Grid/Grid';
import {ImageGallery} from '../ImageGallery/ImageGallery';
import {ImageLightbox} from '../ImageLightbox/ImageLightbox';
import {Item} from '../Item/Item';
import {Kbd, KbdGroup} from '../Kbd/Kbd';
import {LineChart} from '../LineChart/LineChart';
import {Link} from '../Link/Link';
import {SortableList, type SortableItem} from '../SortableList/SortableList';
import {Inline, Split, Stack} from '../Layout/Layout';
import {Marker} from '../Marker/Marker';
import {MaskedField} from '../MaskedField/MaskedField';
import {Media} from '../Media/Media';
import {Modal} from '../Modal/Modal';
import {NotificationContainer} from '../Notification/Notification';
import type {NotificationItem} from '../Notification/Notification';
import {NumberField} from '../NumberField/NumberField';
import {Pagination} from '../Pagination/Pagination';
import {PasswordField} from '../PasswordField/PasswordField';
import {PinInput} from '../PinInput/PinInput';
import {Popover} from '../Popover/Popover';
import {Progress} from '../Progress/Progress';
import {RadioGroup} from '../Radio/Radio';
import {Slider, type RangeValue} from '../Slider/Slider';
import {Rating} from '../Rating/Rating';
import {RelativeTime} from '../RelativeTime/RelativeTime';
import {ScrollArea} from '../ScrollArea/ScrollArea';
import {SearchField} from '../SearchField/SearchField';
import {SegmentedControl} from '../SegmentedControl/SegmentedControl';
import {Select} from '../Select/Select';
import {Separator} from '../Separator/Separator';
import {Sheet} from '../Sheet/Sheet';
import {Sidebar} from '../Sidebar/Sidebar';
import {Skeleton} from '../Skeleton/Skeleton';
import {Spinner} from '../Spinner/Spinner';
import {StatBadge} from '../StatBadge/StatBadge';
import {Steps} from '../Steps/Steps';
import {Switch} from '../Switch/Switch';
import {Table} from '../Table/Table';
import {Tabs} from '../Tabs/Tabs';
import {Text} from '../Text/Text';
import {TextField} from '../TextField/TextField';
import {TextareaField} from '../TextareaField/TextareaField';
import {TimePicker, TimePickerField} from '../TimePicker/TimePicker';
import {Timeline} from '../Timeline/Timeline';
import {Title} from '../Title/Title';
import {Tooltip} from '../Tooltip/Tooltip';
import {UploadZone} from '../UploadZone/UploadZone';
import {IconDocument} from '../../icons/icons/IconDocument';
import {IconPlus} from '../../icons/icons/IconPlus';
import {componentParameters, story, Story} from '../../storybook/meta';
import styles from './ComponentShowcase.stories.module.css';

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
	filters = [],
	onFilterChange,
	onClear,
}: {
	query?: string;
	onQueryChange?: (query: string) => void;
	filters?: DemoFilterChip[];
	onFilterChange?: (id: string, active: boolean) => void;
	onClear?: () => void;
}) {
	const hasActiveFilters = filters.some((item) => item.active);
	const canClear = onClear && (Boolean(query?.length) || hasActiveFilters);

	return (
		<Stack gap='sm'>
			<SearchField
				label='Поиск'
				placeholder='Фильтр…'
				value={query ?? ''}
				width='full'
				size='sm'
				onChange={(event) => onQueryChange?.(event.target.value)}
				onClear={query ? () => onQueryChange?.('') : undefined}
			/>
			{(filters.length > 0 || canClear) && (
				<Split align='center'>
					{filters.length > 0 && (
						<Inline gap='sm' wrap>
							{filters.map((item) => (
								<Chip
									key={item.id}
									size='sm'
									variant={item.active ? 'tinted' : 'secondary'}
									active={!!item.active}
									onClick={onFilterChange
										? () => onFilterChange(item.id, !item.active)
										: undefined}
								>
									{item.label}
								</Chip>
							))}
						</Inline>
					)}
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
				</Split>
			)}
		</Stack>
	);
}

const SWATCH_COLORS = [
	'#64748b',
	'#3b82f6',
	'#22c55e',
	'#f59e0b',
	'#ef4444',
];

const TABLE_ROWS = [
	{
		id: '1',
		name: 'Альфа',
		role: 'Админ',
		status: 'Активен'
	},
	{
		id: '2',
		name: 'Бета',
		role: 'Редактор',
		status: 'В ожидании'
	},
];

const COMMAND_GROUPS = [
	{
		id: 'nav',
		label: 'Навигация',
		items: [
			{
				id: 'forms',
				label: 'Формы'
			},
			{
				id: 'data',
				label: 'Данные'
			},
			{
				id: 'feedback',
				label: 'Состояния'
			},
		],
	},
];

const ComponentShowcaseDemo = () => {
	const [activeTab, setActiveTab] = useState('layout');
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [modalOpen, setModalOpen] = useState(false);
	const [sheetOpen, setSheetOpen] = useState(false);
	const [confirmOpen, setConfirmOpen] = useState(false);
	const [lightboxOpen, setLightboxOpen] = useState(false);
	const [paletteOpen, setPaletteOpen] = useState(false);
	const [collapseOpen, setCollapseOpen] = useState(true);
	const [notifications, setNotifications] = useState<NotificationItem[]>([]);
	const [selectedKeys, setSelectedKeys] = useState<Set<string | number>>(new Set());
	const [page, setPage] = useState(1);
	const [segment, setSegment] = useState('all');
	const [color, setColor] = useState(SWATCH_COLORS[0]);
	const [checkboxes, setCheckboxes] = useState(['a']);
	const [radio, setRadio] = useState('one');
	const [switchOn, setSwitchOn] = useState(true);
	const [slider, setSlider] = useState(40);
	const [range, setRange] = useState<RangeValue>([200, 800]);
	const [rating, setRating] = useState(4);
	const [pin, setPin] = useState('');
	const [password, setPassword] = useState('');
	const [taskDone, setTaskDone] = useState(false);
	const [alertVisible, setAlertVisible] = useState(true);
	const [listItems, setListItems] = useState<SortableItem[]>([
		{
			id: '1',
			content: 'Первый элемент списка'
		},
		{
			id: '2',
			content: 'Второй элемент списка'
		},
		{
			id: '3',
			content: 'Третий элемент списка'
		},
	]);
	const [calendarDate, setCalendarDate] = useState(new Date());
	const [pickerDate, setPickerDate] = useState<Date | undefined>(new Date());
	const [dateRange, setDateRange] = useState<{
		start?: Date;
		end?: Date
	}>({});
	const [time, setTime] = useState('09:30');
	const [selectVal, setSelectVal] = useState('opt1');
	const [sidebarId, setSidebarId] = useState('forms');
	const [showSkeleton, setShowSkeleton] = useState(false);
	const [filterQuery, setFilterQuery] = useState('');
	const [filters, setFilters] = useState<DemoFilterChip[]>([
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
			id: 'arch',
			label: 'Архив',
			active: false
		},
	]);
	const [composerText, setComposerText] = useState('');
	const [files, setFiles] = useState<FileListItemProps[]>([
		{
			id: '1',
			name: 'brief.pdf',
			size: 120_000,
			status: 'done'
		},
		{
			id: '2',
			name: 'cover.png',
			size: 48_000,
			progress: 62,
			status: 'uploading'
		},
	]);

	const pushNotification = (variant: NotificationItem['variant'] = 'info') => {
		const id = String(Date.now());
		setNotifications((prev) => [
			...prev,
			{
				id,
				variant,
				title: variant === 'success' ? 'Сохранено' : 'Демо-уведомление',
				description: 'Пример NotificationContainer',
				duration: 4000,
			},
		]);
	};

	const tabItems = [
		{
			id: 'layout',
			label: 'Макет',
			content: (
				<div className={styles.section}>
					<Box variant='outlined' padding='sm'>
						<Split align='center'>
							<Inline gap='sm'>
								<Button size='sm'>
									Создать
								</Button>
								<Button variant='secondary' size='sm'>
									Импорт
								</Button>
							</Inline>
							<Button variant='ghost' size='sm'>
								Ещё
							</Button>
						</Split>
					</Box>
					<div className={styles.grid3}>
						<DemoKpiCard
							label='Выручка'
							value='₽1.2M'
							delta='+8.4%'
							description='30 дней'
						/>
						<DemoKpiCard
							label='Заказы'
							value='428'
							delta='-2.1%'
							deltaColor='error'
						/>
						<DemoKpiCard
							label='NPS'
							value='72'
							delta='+1.0'
						/>
					</div>
					<Inline gap='lg'>
						<Card>
							<Card.Header>
								<Title level={4}>
									Flex + Grid
								</Title>
							</Card.Header>
							<Card.Body>
								<Grid columns={3} gap={12}>
									<div className={styles.panel}>
										A
									</div>
									<div className={styles.panel}>
										B
									</div>
									<div className={styles.panel}>
										C
									</div>
								</Grid>
								<Separator />
								<Split align='center'>
									<Text size='sm'>
										Separator выше
									</Text>
									<Link href='#'>
										Link
									</Link>
								</Split>
							</Card.Body>
						</Card>
						<Card>
							<Card.Header>
								<Title level={4}>
									Sidebar
								</Title>
							</Card.Header>
							<Card.Body>
								<div className={styles.sidebarPreview}>
									<Sidebar
										value={sidebarId}
										onChange={setSidebarId}
									>
										<Sidebar.Header>
											<Sidebar.Title>
												altum-ui
											</Sidebar.Title>
											<Sidebar.Collapse />
										</Sidebar.Header>
										<Sidebar.Content>
											<Sidebar.Item value='forms' icon='📝'>
												Формы
											</Sidebar.Item>
											<Sidebar.Item value='data' icon='📊'>
												Данные
											</Sidebar.Item>
										</Sidebar.Content>
									</Sidebar>
								</div>
							</Card.Body>
						</Card>
					</Inline>
					<div className={styles.grid2}>
						<AspectRatio ratio={16 / 9}>
							<div
								className={styles.panel}
								style={{
									height: '100%',
									display: 'grid',
									placeItems: 'center',
								}}
							>
								16:9 AspectRatio
							</div>
						</AspectRatio>
						<ScrollArea maxHeight={120}>
							{Array.from({length: 12}, (_, i) => (
								<div key={i} style={{padding: '4px 8px'}}>
									Строка
									{' '}
									{i + 1}
								</div>
							))}
						</ScrollArea>
					</div>
					<Accordion>
						<Accordion.Item value='acc1'>
							<Accordion.Trigger>
								Accordion
							</Accordion.Trigger>
							<Accordion.Content>
								<Text>
									Раскрывающийся блок с Collapse внутри.
								</Text>
							</Accordion.Content>
						</Accordion.Item>
					</Accordion>
					<Button
						variant='secondary'
						size='sm'
						onClick={() => setCollapseOpen(!collapseOpen)}
					>
						Переключить Collapse
					</Button>
					<Collapse open={collapseOpen}>
						<div className={styles.panel}>
							<Text>
								Отдельный компонент Collapse
							</Text>
						</div>
					</Collapse>
				</div>
			),
		},
		{
			id: 'forms',
			label: 'Формы',
			content: (
				<div className={styles.section}>
					<div className={styles.grid2}>
						<TextField label='TextField' />
						<TextareaField label='TextareaField' />
						<SearchField
							label='SearchField'
							value=''
							onChange={() => undefined}
						/>
						<NumberField
							label='NumberField'
							value={12}
							min={0}
							max={100}
						/>
						<MaskedField
							label='MaskedField'
							mask='99.99.9999'
							value=''
							onChange={() => undefined}
						/>
						<PasswordField
							label='PasswordField'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							showStrength
						/>
						<Select.Root
							options={[
								{
									label: 'Опция 1',
									value: 'opt1'
								},
								{
									label: 'Опция 2',
									value: 'opt2'
								},
							]}
							value={selectVal}
							onChange={(value) => { if (!Array.isArray(value)) setSelectVal(value); }}
						>
							<Select.Trigger label='Select' />
							<Select.Panel>
								<Select.Filter />
								<Select.List />
							</Select.Panel>
						</Select.Root>
						<DatePicker
							label='DatePicker'
							value={pickerDate}
							onChange={setPickerDate}
						/>
						<DateRangePicker
							label='DateRangePicker'
							value={dateRange}
							onChange={setDateRange}
						/>
						<TimePickerField
							label='TimePickerField'
							value={time}
							onChange={setTime}
						/>
					</div>
					<Fieldset variant='card'>
						<Fieldset.Inner>
							<Fieldset.Legend>
								Код и оценка
							</Fieldset.Legend>
							<Fieldset.Description>
								PinInput + Rating
							</Fieldset.Description>
							<Fieldset.Content>
								<Stack gap='md'>
									<PinInput
										length={4}
										value={pin}
										onChange={setPin}
									/>
									<Rating value={rating} onChange={setRating} />
									<FormMessage variant='hint'>
										Подсказка FormMessage / FieldError
									</FormMessage>
								</Stack>
							</Fieldset.Content>
						</Fieldset.Inner>
					</Fieldset>
					<CheckboxGroup
						label='CheckboxGroup'
						options={[
							{
								label: 'A',
								value: 'a'
							},
							{
								label: 'B',
								value: 'b'
							},
						]}
						value={checkboxes}
						onChange={setCheckboxes}
						orientation='horizontal'
					/>
					<RadioGroup
						name='demo-radio'
						label='RadioGroup'
						options={[
							{
								label: 'Один',
								value: 'one'
							},
							{
								label: 'Два',
								value: 'two'
							},
						]}
						value={radio}
						onChange={setRadio}
						orientation='horizontal'
					/>
					<Inline
						gap='xl'
						align='center'
					>
						<Switch
							label='Switch'
							checked={switchOn}
							onChange={setSwitchOn}
						/>
						<Slider value={slider} onChange={setSlider} />
						<div style={{
							minWidth: 200,
							flex: 1
						}}
						>
							<Text size='sm' color='secondary'>
								Диапазон Slider:
								{' '}
								{range[0]}
								–
								{range[1]}
							</Text>
							<Slider
								value={range}
								onChange={setRange}
								min={0}
								max={1000}
								step={10}
							/>
						</div>
						<ColorSwatchGroup
							colors={SWATCH_COLORS}
							value={color}
							onChange={setColor}
							label='ColorSwatchGroup'
						/>
					</Inline>
					<FieldLabel
						label='Уведомления'
						layout='horizontal'
						justify='between'
						align='center'
					>
						<Switch checked={switchOn} onChange={setSwitchOn} />
					</FieldLabel>
					<UploadZone>
						{(open) => (
							<Stack
								gap='sm'
								align='center'
							>
								<Text size='sm'>
									UploadZone — перетащите файлы
								</Text>
								<Button
									variant='secondary'
									size='sm'
									onClick={open}
								>
									Выбрать файл
								</Button>
							</Stack>
						)}
					</UploadZone>
				</div>
			),
		},
		{
			id: 'actions',
			label: 'Действия',
			content: (
				<div className={styles.section}>
					<Inline gap='sm'>
						<Button variant='primary'>
							Основная
						</Button>
						<Button variant='tinted'>
							Тонированная
						</Button>
						<Button variant='secondary'>
							Вторичная
						</Button>
						<Button variant='primary' status='danger'>
							Опасная
						</Button>
						<Button variant='secondary' status='danger'>
							Опасная втор.
						</Button>
						<Button loading>
							Загрузка
						</Button>
						<ButtonIcon
							icon={<IconPlus size={18} />}
							aria-label='Добавить'
							variant='primary'
						/>
					</Inline>
					<Inline gap='sm' wrap>
						<KbdGroup>
							<Kbd>
								⌘
							</Kbd>
							<Kbd>
								K
							</Kbd>
						</KbdGroup>
						<Text size='sm' color='secondary'>
							Палитра команд
						</Text>
					</Inline>
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
								label: 'Архив',
								value: 'archive'
							},
						]}
						value={segment}
						onChange={setSegment}
						variant='tinted'
					/>
					<Inline
						gap='sm'
						align='center'
					>
						<Dropdown>
							<Dropdown.Trigger asChild>
								<Button variant='secondary'>
									Dropdown
								</Button>
							</Dropdown.Trigger>
							<Dropdown.Content>
								<Stack
									gap='xs'
									style={{padding: 8}}
								>
									<Button variant='secondary' size='sm'>
										Пункт 1
									</Button>
									<Button variant='secondary' size='sm'>
										Пункт 2
									</Button>
								</Stack>
							</Dropdown.Content>
						</Dropdown>
						<DropdownMenu
							trigger={(
								<Button variant='secondary' size='sm'>
									DropdownMenu
								</Button>
							)}
							groups={[
								{
									id: 'g',
									label: '',
									items: [
										{
											id: 'edit',
											label: 'Редактировать'
										},
										{
											id: 'delete',
											label: 'Удалить'
										},
									],
								}
							]}
						/>
						<Popover>
							<Popover.Trigger asChild>
								<Button variant='secondary' size='sm'>
									Popover
								</Button>
							</Popover.Trigger>
							<Popover.Content>
								<Text size='sm'>
									Контент Popover
								</Text>
							</Popover.Content>
						</Popover>
					</Inline>
					<Inline gap='sm'>
						<Button size='sm' onClick={() => setModalOpen(true)}>
							Modal
						</Button>
						<Button
							size='sm'
							variant='secondary'
							onClick={() => setSidebarOpen(true)}
						>
							Боковая Sheet
						</Button>
						<Button
							size='sm'
							variant='secondary'
							onClick={() => setSheetOpen(true)}
						>
							Sheet
						</Button>
						<Button
							size='sm'
							variant='secondary'
							onClick={() => setConfirmOpen(true)}
						>
							ConfirmDialog
						</Button>
						<Button
							size='sm'
							variant='secondary'
							onClick={() => pushNotification('success')}
						>
							Notification
						</Button>
						<Button
							size='sm'
							variant='secondary'
							onClick={() => setLightboxOpen(true)}
						>
							ImageLightbox
						</Button>
						<Button
							size='sm'
							variant='tinted'
							onClick={() => setPaletteOpen(true)}
						>
							CommandPalette
						</Button>
					</Inline>
					<Inline gap='md' align='center'>
						<Checkbox
							mode='task'
							checked={taskDone}
							aria-label='Задача'
							onChange={(e) => setTaskDone(e.target.checked)}
						/>
						<Text>
							Checkbox mode=«task»
						</Text>
					</Inline>
				</div>
			),
		},
		{
			id: 'data',
			label: 'Данные',
			content: (
				<div className={styles.section}>
					<DemoFilterBar
						query={filterQuery}
						onQueryChange={setFilterQuery}
						filters={filters}
						onFilterChange={(id, active) => {
							setFilters((prev) => prev.map((f) => (f.id === id ? {
								...f,
								active
							} : f)));
						}}
						onClear={() => {
							setFilterQuery('');
							setFilters((prev) => prev.map((f) => ({
								...f,
								active: false
							})));
						}}
					/>
					<Inline gap='sm'>
						<StatBadge label='По умолч.' value={42} />
						<StatBadge
							label='Успех'
							value={12}
							variant='success'
							size='sm'
						/>
						<StatBadge
							label='Внимание'
							value={3}
							variant='warning'
							size='sm'
						/>
						<StatBadge
							label='Опасность'
							value={1}
							variant='error'
							size='sm'
						/>
					</Inline>
					<Inline
						gap='sm'
						align='center'
					>
						<Badge label={5}>
							<Button variant='secondary' size='sm'>
								Badge
							</Button>
						</Badge>
						<Chip mode='tag' size='sm'>
							Тег
						</Chip>
						<Chip active onClick={() => undefined}>
							Chip
						</Chip>
						<Chip
							mode='tag'
							variant='success'
							size='sm'
						>
							mode=tag
						</Chip>
						<Avatar name='Набор UI' size='md' />
						<Text size='sm' color='secondary'>
							Обновлено
							{' '}
							<RelativeTime date={1_700_000_000_000 - 1000 * 60 * 95} />
						</Text>
					</Inline>
					<Item>
						<Item.Media variant='icon'>
							<IconDocument size={18} />
						</Item.Media>
						<Item.Content>
							<Item.Title>
								Составной Item
							</Item.Title>
							<Item.Description>
								Медиа / Заголовок / Описание / Действия
							</Item.Description>
						</Item.Content>
						<Item.Actions>
							<Button size='sm' variant='secondary'>
								Открыть
							</Button>
						</Item.Actions>
					</Item>
					<DescriptionList
						layout='inline'
						items={[
							{
								label: 'Эл. почта',
								value: 'alex@altum.dev'
							},
							{
								label: 'Роль',
								value: 'Админ'
							},
							{
								label: 'План',
								value: 'Pro'
							},
						]}
					/>
					<Table.Root>
						<Table.Content
							columns={[
								{
									key: 'name',
									header: 'Имя',
									sortable: true
								},
								{
									key: 'role',
									header: 'Роль'
								},
								{
									key: 'status',
									header: 'Статус'
								},
							]}
							data={TABLE_ROWS}
							rowKey={(r) => r.id}
							selectedKeys={selectedKeys}
							onSelectionChange={setSelectedKeys}
						/>
					</Table.Root>
					<Pagination
						currentPage={page}
						totalPages={5}
						onPageChange={setPage}
					>
						<Pagination.Controls />
					</Pagination>
					<SortableList
						items={listItems}
						onOrderChange={setListItems}
					/>
					<FileList.Root>
						{files.map((item) => (<FileList.Item
							key={item.id}
							{...item}
							onRemove={(id) => setFiles((prev) => prev.filter((f) => f.id !== id))}
							onRetry={(id) => setFiles((prev) => prev.map((f) => (
								f.id === id ? {
									...f,
									status: 'uploading',
									progress: 10,
									error: undefined
								} : f
							)))}
						/>))}
					</FileList.Root>
					<div className={styles.grid2}>
						<div className={styles.chartWrap}>
							<LineChart
								categories={[
									'Пн',
									'Вт',
									'Ср',
									'Чт',
									'Пт'
								]}
								datasets={[
									{
										name: 'A',
										color: '#64748b',
										data: [
											12,
											19,
											14,
											22,
											18
										]
									},
									{
										name: 'B',
										color: '#3b82f6',
										data: [
											8,
											11,
											16,
											13,
											20
										]
									},
								]}
								height={200}
							/>
						</div>
						<div className={styles.chartWrap}>
							<BarChart
								height={200}
								categories={[
									'Пн',
									'Вт',
									'Ср',
									'Чт',
									'Пт'
								]}
								datasets={[
									{
										name: 'Заказы',
										data: [
											12,
											18,
											9,
											22,
											15
										]
									}
								]}
							/>
						</div>
					</div>
					<DonutChart
						segments={[
							{
								label: 'Готово',
								value: 42
							},
							{
								label: 'В работе',
								value: 18
							},
							{
								label: 'Новые',
								value: 9
							},
						]}
						centerValue='69'
						centerLabel='задач'
					/>
					<Box
						variant='outlined'
						border
						padding='md'
						radius='md'>
						<Text size='xs' color='muted'>
							bash
						</Text>
						<Text
							as='pre'
							size='sm'
							style={{
								margin: 0,
								whiteSpace: 'pre-wrap'
							}}>
							{'npm i altum-ui\nnpx storybook'}
						</Text>
					</Box>
				</div>
			),
		},
		{
			id: 'feedback',
			label: 'Состояния',
			content: (
				<div className={styles.section}>
					{alertVisible && (
						<Alert variant='warning'>
							<Alert.Icon />
							<Alert.Body>
								<Alert.Title>
									Alert
								</Alert.Title>
								<Alert.Content>
									Inline status-блок (бывший Callout).
								</Alert.Content>
							</Alert.Body>
							<Alert.Close onClose={() => setAlertVisible(false)} />
						</Alert>
					)}
					<Steps
						currentStep={1}
						items={[{title: 'Шаг 1'}, {title: 'Шаг 2'}, {title: 'Шаг 3'},]}
					/>
					<Timeline
						currentId='2'
						items={[
							{
								id: '1',
								title: 'Создан',
								time: '09:00',
								status: 'success'
							},
							{
								id: '2',
								title: 'В работе',
								time: '11:20',
								status: 'info'
							},
							{
								id: '3',
								title: 'Ревью',
								time: '—'
							},
						]}
					/>
					<Progress percentage={65} />
					<Inline
						gap='lg'
						align='center'
					>
						<Spinner size={24} />
						<Spinner variant='typing' label='Печатает…' />
						<Button
							size='sm'
							variant='secondary'
							onClick={() => {
								setShowSkeleton(true);
								window.setTimeout(() => setShowSkeleton(false), 1500);
							}}
						>
							Показать Skeleton
						</Button>
					</Inline>
					{showSkeleton ? (
						<Stack gap='sm'>
							<Skeleton.Text lines={2} />
							<Skeleton.Avatar />
							<Skeleton.Card />
						</Stack>
					) : (
						<EmptyState
							title='Пусто'
							description='Нет данных для отображения'
							action={(
								<Button size='sm'>
									Добавить
								</Button>
							)}
						/>
					)}
					<Tooltip content='Tooltip подсказка' asChild>
						<Button variant='secondary' size='sm'>
							Наведите
						</Button>
					</Tooltip>
				</div>
			),
		},
		{
			id: 'chat',
			label: 'Чат / AI',
			content: (
				<div className={styles.section}>
					<Stack gap='md' style={{maxWidth: 480}}>
						<Bubble variant='incoming'>
							Привет! Чем помочь?
						</Bubble>
						<Bubble variant='outgoing' align='end'>
							Нужен краткий статус по релизу
						</Bubble>
						<Spinner
							variant='typing'
							size='sm'
							label='Ассистент печатает'
						/>
						<Marker variant='note'>
							<Marker.Content>
								Marker: системная заметка
							</Marker.Content>
						</Marker>
						<Attachment size='sm' status='done'>
							<Attachment.Media>
								<IconDocument size={18} />
							</Attachment.Media>
							<Attachment.Content>
								<Attachment.Title>
									spec.pdf
								</Attachment.Title>
								<Attachment.Description>
									124 KB
								</Attachment.Description>
							</Attachment.Content>
						</Attachment>
						<TextareaField
							label='Сообщение'
							value={composerText}
							onChange={(event) => setComposerText(event.target.value)}
							placeholder='Сообщение…'
							width='full'
							rows={3}
						/>
						<Button
							variant='primary'
							size='sm'
							onClick={() => setComposerText('')}
							disabled={!composerText.trim()}
						>
							Отправить
						</Button>
					</Stack>
				</div>
			),
		},
		{
			id: 'media',
			label: 'Медиа и календарь',
			content: (
				<div className={styles.section}>
					<div className={styles.grid2}>
						<Calendar.Provider value={calendarDate} onChange={setCalendarDate}>
							<Calendar.Root>
								<Calendar.Header>
									<Calendar.Nav direction='prev' />
									<Calendar.Title />
									<Calendar.Nav direction='next' />
								</Calendar.Header>
								<Calendar.Body />
							</Calendar.Root>
						</Calendar.Provider>
						<div>
							<Text size='sm' color='secondary'>
								Выбрано:
								{' '}
								{calendarDate.toLocaleDateString('ru-RU')}
							</Text>
							{color && (
								<Chip
									mode='tag'
									size='sm'
									variant='info'
								>
									Событие
								</Chip>
							)}
							<Separator start='md' end='md' />
							<Media
								src='https://picsum.photos/seed/altum-media/640/360'
								alt='Превью'
								ratio={16 / 9}
							/>
						</div>
					</div>
					<div className={styles.galleryWrap}>
						<ImageGallery images={['https://picsum.photos/seed/altum1/400/240', 'https://picsum.photos/seed/altum2/400/240',]}>
							<ImageGallery.Viewport>
								<ImageGallery.Prev />
								<ImageGallery.Image />
								<ImageGallery.Next />
							</ImageGallery.Viewport>
							<ImageGallery.Thumbnails>
								<ImageGallery.Thumb index={0} />
								<ImageGallery.Thumb index={1} />
							</ImageGallery.Thumbnails>
						</ImageGallery>
					</div>
					<TimePicker value={time} onChange={setTime} />
				</div>
			),
		},
	];

	return (
		<div className={styles.shell}>
			<DemoHeader
				crumbs='Примеры / Витрина компонентов'
				title='Витрина компонентов'
				description='Витрина компонентов altum-ui, включая недавние добавления'
				actions={(
					<Button
						size='sm'
						variant='tinted'
						onClick={() => setPaletteOpen(true)}
					>
						⌘K
					</Button>
				)}
			/>

			<div style={{padding: '0 var(--altum-g-space-5) var(--altum-g-space-5)'}}>
				<Tabs
					value={activeTab}
					onChange={setActiveTab}
					variant='pill'
				>
					<Tabs.List>
						{tabItems.map((item) => (
							<Tabs.Trigger key={item.id} value={item.id}>
								{item.label}
							</Tabs.Trigger>
						))}
					</Tabs.List>
					{tabItems.map((item) => (
						<Tabs.Panel key={item.id} value={item.id}>
							{item.content}
						</Tabs.Panel>
					))}
				</Tabs>
			</div>

			<Sheet
				open={sidebarOpen}
				onClose={() => setSidebarOpen(false)}
				mode='sidebar'
				direction='start'
				backdrop
			>
				<Sheet.Header showClose>
					<Sheet.Title>
						Боковая Sheet
					</Sheet.Title>
				</Sheet.Header>
				<Sheet.Body>
					<Text>
						Пример боковой панели
					</Text>
				</Sheet.Body>
			</Sheet>

			<Sheet
				open={sheetOpen}
				onClose={() => setSheetOpen(false)}
				mode='sheet'
				showHandle
			>
				<Sheet.Header>
					<Sheet.Title>
						Sheet
					</Sheet.Title>
				</Sheet.Header>
				<Sheet.Body>
					<Text>
						Универсальная панель (sheet / sidebar)
					</Text>
				</Sheet.Body>
			</Sheet>

			<Modal
				open={modalOpen}
				onClose={() => setModalOpen(false)}
			>
				<Modal.Header>
					<Modal.Title>
						Modal
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Text>
						Содержимое модального окна
					</Text>
				</Modal.Body>
				<Modal.Footer>
					<Inline gap='sm'>
						<Button variant='secondary' onClick={() => setModalOpen(false)}>
							Отмена
						</Button>
						<Button onClick={() => setModalOpen(false)}>
							ОК
						</Button>
					</Inline>
				</Modal.Footer>
			</Modal>

			<ConfirmDialog
				open={confirmOpen}
				title='Подтвердить действие?'
				message='Это демонстрация ConfirmDialog'
				confirmLabel='Да'
				onCancel={() => setConfirmOpen(false)}
				onConfirm={() => setConfirmOpen(false)}
			/>

			<CommandPalette.Root open={paletteOpen} onClose={() => setPaletteOpen(false)}>
				<CommandPalette.Input />
				<CommandPalette.List>
					{COMMAND_GROUPS.map((group) => (
						<ActionList.Group key={group.id} id={group.id}>
							<ActionList.GroupLabel>
								{group.label}
							</ActionList.GroupLabel>
							{group.items.map((item) => <ActionList.Item key={item.id} {...item} />)}
						</ActionList.Group>
					))}
				</CommandPalette.List>
			</CommandPalette.Root>

			<ImageLightbox
				open={lightboxOpen}
				onClose={() => setLightboxOpen(false)}
				images={['https://picsum.photos/seed/altum3/800/500']}
			/>

			<NotificationContainer
				notifications={notifications}
				onClose={(id) => setNotifications((n) => n.filter((item) => item.id !== id))}
			/>
		</div>
	);
};

export default {
	title: 'altum-ui/Examples/Component Showcase',
	component: ComponentShowcaseDemo,
	tags: ['autodocs'],
	parameters: componentParameters(
		'Витрина компонентов altum-ui: макет, формы, действия, данные, состояния, чат/AI, медиа.',
	),
	argTypes: {},
} satisfies Meta<typeof ComponentShowcaseDemo>;

export const Playground: Story<Record<string, never>> = {
	parameters: story('Полная витрина: макет, формы, действия, данные, состояния, чат/AI, медиа.'),
};
