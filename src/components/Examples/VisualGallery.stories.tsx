/**
 * Одностраничная визуальная QA-галерея: матрицы вариантов и композиции.
 * Docs отключены — сериализация autodocs/source в Storybook зависает на больших JSX-деревьях.
 */
import type {Meta} from '@storybook/react';
import React, {useEffect, useRef, useState} from 'react';
import {Alert} from '../Alert/Alert';
import {Accordion} from '../Accordion/Accordion';
import {Avatar} from '../Avatar/Avatar';
import {Badge} from '../Badge/Badge';
import {Box} from '../Box/Box';
import {Bubble} from '../Bubble/Bubble';
import {Button} from '../Button/Button';
import {ButtonGroup} from '../ButtonGroup/ButtonGroup';
import {ButtonIcon} from '../ButtonIcon/ButtonIcon';
import {Card} from '../Card/Card';
import overlayClose from '../../styles/overlayClose.module.css';
import {Checkbox, CheckboxGroup} from '../Checkbox/Checkbox';
import {Chip, ChipGroup} from '../Chip/Chip';
import {ColorSwatchGroup} from '../ColorSwatchGroup/ColorSwatchGroup';
import {ConfirmDialog} from '../ConfirmDialog/ConfirmDialog';
import {DateField} from '../DateField/DateField';
import {DateRangeField} from '../DateRangeField/DateRangeField';
import {DayStripCalendar} from '../DayStripCalendar/DayStripCalendar';
import {DescriptionList} from '../DescriptionList/DescriptionList';
import {EmptyState} from '../EmptyState/EmptyState';
import {Fieldset} from '../Fieldset/Fieldset';
import {FormMessage} from '../FormMessage/FormMessage';
import {ControlRow, Inline, Split, Stack} from '../Layout';
import {Item} from '../Item/Item';
import {Kbd, KbdGroup} from '../Kbd/Kbd';
import {Link} from '../Link/Link';
import {Marker} from '../Marker/Marker';
import {MaskedField} from '../MaskedField/MaskedField';
import {Modal} from '../Modal/Modal';
import {NotificationProvider, notify as pushToast} from '../Notification/toast';
import {NumberField} from '../NumberField/NumberField';
import {Overflow} from '../Overflow/Overflow';
import {Pagination} from '../Pagination/Pagination';
import {PasswordField} from '../PasswordField/PasswordField';
import {PinInput} from '../PinInput/PinInput';
import {Popover} from '../Popover/Popover';
import {Progress, ProgressCircle} from '../Progress/Progress';
import {RadioGroup} from '../Radio/Radio';
import {Rating} from '../Rating/Rating';
import {RelativeTime} from '../RelativeTime/RelativeTime';
import {SearchField} from '../SearchField/SearchField';
import {SegmentedControl} from '../SegmentedControl/SegmentedControl';
import {Select} from '../Select/Select';
import {Separator} from '../Separator/Separator';
import {Sheet} from '../Sheet/Sheet';
import {Skeleton} from '../Skeleton/Skeleton';
import {Slider} from '../Slider/Slider';
import {SortableList} from '../SortableList/SortableList';
import {Spinner} from '../Spinner/Spinner';
import {StatBadge} from '../StatBadge/StatBadge';
import {Steps} from '../Steps/Steps';
import {SuggestField} from '../SuggestField/SuggestField';
import {Switch} from '../Switch/Switch';
import {Tabs} from '../Tabs/Tabs';
import {Text} from '../Text/Text';
import {TextField} from '../TextField/TextField';
import {TextareaField} from '../TextareaField/TextareaField';
import {TimeField} from '../TimeField/TimeField';
import {Timeline} from '../Timeline/Timeline';
import {Title} from '../Title/Title';
import {Tooltip} from '../Tooltip/Tooltip';
import {UploadZone} from '../UploadZone/UploadZone';
import {IconBell} from '../../icons/icons/IconBell';
import {IconCross} from '../../icons/icons/IconCross';
import {IconCheckmark} from '../../icons/icons/IconCheckmark';
import {IconDots3} from '../../icons/icons/IconDots3';
import {IconHome} from '../../icons/icons/IconHome';
import {IconPlus} from '../../icons/icons/IconPlus';
import {IconSearch} from '../../icons/icons/IconSearch';
import {IconTrash} from '../../icons/icons/IconTrash';
import {IconUser} from '../../icons/icons/IconUser';
import {Story} from '../../storybook/meta';
import styles from './VisualGallery.stories.module.css';

/** Стабильные timestamp фикстур (без нечистых Date.now()/new Date() во время render). */
const RELATIVE_TIME_HOUR_AGO = new Date(Date.UTC(2026, 7, 10, 11, 0, 0));
const RELATIVE_TIME_NOW_FIXTURE = new Date(Date.UTC(2026, 7, 10, 12, 0, 0));

const SECTIONS = [
	{
		id: 'type',
		label: 'Типографика'
	},
	{
		id: 'surfaces',
		label: 'Поверхности'
	},
	{
		id: 'buttons',
		label: 'Кнопки'
	},
	{
		id: 'chips-badges',
		label: 'Chip / Badge'
	},
	{
		id: 'forms',
		label: 'Формы'
	},
	{
		id: 'toggles',
		label: 'Тогглы'
	},
	{
		id: 'choosers',
		label: 'Выбор'
	},
	{
		id: 'feedback',
		label: 'Обратная связь'
	},
	{
		id: 'nav',
		label: 'Навигация'
	},
	{
		id: 'data',
		label: 'Данные'
	},
	{
		id: 'lists',
		label: 'Списки / медиа'
	},
	{
		id: 'overlays',
		label: 'Оверлеи'
	},
	{
		id: 'compose',
		label: 'Композиции'
	},
	{
		id: 'coverage',
		label: 'Покрытие'
	},
] as const;

const BUTTON_VARIANTS = [
	'primary',
	'tinted',
	'secondary',
	'danger',
	'danger_tinted',
	'ghost',
	'link'
] as const;
const BUTTON_SIZES = ['sm', 'md', 'lg'] as const;
const CHIP_VARIANTS = [
	'primary',
	'tinted',
	'secondary',
	'success',
	'info',
	'warning',
	'error'
] as const;
const CHIP_SIZES = ['sm', 'md', 'lg'] as const;
const BADGE_VARIANTS = [
	'primary',
	'secondary',
	'success',
	'info',
	'warning',
	'error'
] as const;
const PAD_SPACE = {
	xs: 'var(--altum-g-space-1)',
	sm: 'var(--altum-g-space-2)',
	md: 'var(--altum-g-space-3)',
	lg: 'var(--altum-g-space-4)',
	xl: 'var(--altum-g-space-6)',
} as const;

const BOX_VARIANTS = [
	'outlined',
	'elevated',
	'floating',
	'tinted',
	'secondary',
	'muted',
	'ghost',
	'plain',
] as const;
const FIELD_SIZES = ['sm', 'md', 'lg'] as const;
const TEXT_SIZES = [
	'xs',
	'sm',
	'md',
	'lg',
	'xl'
] as const;
const TEXT_COLORS = [
	'primary',
	'secondary',
	'tertiary',
	'muted',
	'info',
	'success',
	'warning',
	'error',
] as const;

const SELECT_OPTIONS = [
	{
		value: 'draft',
		label: 'Черновик'
	},
	{
		value: 'active',
		label: 'Активен'
	},
	{
		value: 'archived',
		label: 'Архив'
	},
];

const SUGGEST_OPTIONS = [
	{
		value: 'moscow',
		label: 'Москва'
	},
	{
		value: 'spb',
		label: 'Санкт-Петербург'
	},
	{
		value: 'kazan',
		label: 'Казань'
	},
	{
		value: 'novosibirsk',
		label: 'Новосибирск'
	},
	{
		value: 'ekaterinburg',
		label: 'Екатеринбург'
	},
];

const SWATCH_COLORS = [
	'#ef4444',
	'#f59e0b',
	'#22c55e',
	'#3b82f6',
	'#8b5cf6',
	'#64748b'
];

const CODE_SNIPPET = `import { Button } from 'altum';

<Button variant="primary">Сохранить</Button>`;

function Section({
	id,
	title,
	hint,
	children,
}: {
	id: string;
	title: string;
	hint: string;
	children: React.ReactNode;
}) {
	return (
		<section
			id={id}
			className={styles.section}
			aria-labelledby={`${id}-title`}
		>
			<div className={styles.sectionHead}>
				<div id={`${id}-title`}>
					<Title level={2}>
						{title}
					</Title>
				</div>
				<p className={styles.caption}>
					{hint}
				</p>
			</div>
			{children}
		</section>
	);
}

function Panel({title, children}: {
	title: string;
	children: React.ReactNode
}) {
	return (
		<div className={styles.panel}>
			<p className={styles.panelTitle}>
				{title}
			</p>
			{children}
		</div>
	);
}

function GallerySelect({
	label,
	value,
	onChange,
	width = 'full',
	size = 'md',
}: {
	label: string;
	value: string;
	onChange: (value: string) => void;
	width?: 'full' | 'md';
	size?: 'sm' | 'md' | 'lg';
}) {
	return (
		<Select
			options={SELECT_OPTIONS}
			value={value}
			onChange={(next) => {
				if (!Array.isArray(next) && next != null) onChange(String(next));
			}}
			label={label}
			width={width}
			size={size}
		/>
	);
}

function VisualGalleryDemo() {
	const [segment, setSegment] = useState<string | number>('week');
	const [status, setStatus] = useState('active');
	const [pin, setPin] = useState('12');
	const [password, setPassword] = useState('Secret1!');
	const [rating, setRating] = useState(3);
	const [page, setPage] = useState(2);
	const [tab, setTab] = useState('a');
	const tabsRef = useRef<HTMLDivElement>(null);
	const [modalOpen, setModalOpen] = useState(false);
	const [sheetOpen, setSheetOpen] = useState(false);
	const [date, setDate] = useState<Date | undefined>(new Date());
	const [range, setRange] = useState<{
		start?: Date;
		end?: Date
	}>({
		start: new Date(),
		end: undefined,
	});
	const [time, setTime] = useState('09:30');
	const [notify, setNotify] = useState(true);
	const [digest, setDigest] = useState(false);
	const [role, setRole] = useState('editor');
	const [checks, setChecks] = useState<string[]>(['a']);
	const [masked, setMasked] = useState('9123456789');
	const [search, setSearch] = useState('');
	const [description, setDescription] = useState('Краткое описание задачи…');
	const [qty, setQty] = useState<number | undefined>(4);
	const [suggest, setSuggest] = useState('');
	const [region, setRegion] = useState('moscow');
	const [swatch, setSwatch] = useState(SWATCH_COLORS[3]);
	const [slider, setSlider] = useState(42);
	const [sliderRange, setSliderRange] = useState<[number, number]>([20, 70]);
	const [confirmOpen, setConfirmOpen] = useState(false);
	const [sortableItems, setSortableItems] = useState([
		{
			id: '1',
			content: 'Исследование'
		},
		{
			id: '2',
			content: 'Дизайн'
		},
		{
			id: '3',
			content: 'Разработка'
		},
	]);
	const [activeSection, setActiveSection] = useState<string>(SECTIONS[0].id);

	useEffect(() => {
		const nodes = SECTIONS
			.map((item) => document.getElementById(item.id))
			.filter((node): node is HTMLElement => Boolean(node));
		if (nodes.length === 0) return undefined;

		const observer = new IntersectionObserver(
			(entries) => {
				const visible = entries
					.filter((entry) => entry.isIntersecting)
					.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
				const top = visible[0]?.target.id;
				if (top) setActiveSection(top);
			},
			{
				rootMargin: '-20% 0px -60% 0px',
				threshold: [0.1, 0.35, 0.6]
			},
		);

		nodes.forEach((node) => observer.observe(node));
		return () => observer.disconnect();
	}, []);

	return (
		<NotificationProvider position='bottom-right'>
			<div className={styles.page}>
				<header className={styles.hero}>
					<Title level={1}>
						Визуальная галерея
					</Title>
					<Text
						as='p'
						size='sm'
						color='secondary'
					>
						Одна страница для визуального QA: матрицы вариантов и живые сочетания компонентов.
						Сверяйте light/dark, высоты контролов, focus и плотность.
					</Text>
					<p className={styles.themeNote}>
						Тема: переключатель Storybook globals (light / dark). Проверяйте обе — muted text,
						placeholder и primary fill на sheet особенно чувствительны в dark.
					</p>
					<Text size='xs' color='muted'>
						altum / Примеры / Визуальная галерея
					</Text>
				</header>

				<nav className={styles.toc} aria-label='Разделы галереи'>
					{SECTIONS.map((item) => (
						<a
							key={item.id}
							href={`#${item.id}`}
							aria-current={activeSection === item.id ? 'true' : undefined}
						>
							{item.label}
						</a>
					))}
				</nav>

				<Section
					id='type'
					title='Типографика'
					hint='Title / Text / Link / Kbd / Marker'
				>
					<div className={styles.grid2}>
						<Panel title='Уровни Title'>
							<Stack gap='sm'>
								<Title level={1}>
									Title, уровень 1
								</Title>
								<Title level={2}>
									Title, уровень 2
								</Title>
								<Title level={3}>
									Title, уровень 3
								</Title>
								<Title level={4}>
									Title, уровень 4
								</Title>
							</Stack>
						</Panel>
						<Panel title='Размеры Text × цвета'>
							<div className={styles.col}>
								{TEXT_SIZES.map((size) => (
									<Text key={size} size={size}>
										size=
										{size}
										{' '}
										— основной текст
									</Text>
								))}
								<Separator />
								<div className={styles.row}>
									{TEXT_COLORS.map((color) => (
										<Text
											key={color}
											size='sm'
											color={color}
										>
											{color}
										</Text>
									))}
								</div>
								<div className={styles.row}>
									<Link href='#'>
										Link основная
									</Link>
									<Link href='#' variant='muted'>
										Link приглушённая
									</Link>
									<Link href='#' status='danger'>
										Link опасная
									</Link>
									<RelativeTime date={RELATIVE_TIME_HOUR_AGO} />
								</div>
								<Marker variant='note'>
									Marker note — системная подсказка
								</Marker>
								<KbdGroup>
									<Kbd>
										⌘
									</Kbd>
									<Kbd>
										K
									</Kbd>
									<Kbd symbol>
										↑
									</Kbd>
								</KbdGroup>
								<Separator />
								<Box
									variant='outlined'
									border
									radius='md'
									style={{padding: 'var(--altum-g-space-3)'}}
								>
									<Text size='xs' color='muted'>
										tsx
									</Text>
									<Text
										as='pre'
										size='sm'
										style={{
											margin: 0,
											whiteSpace: 'pre-wrap'
										}}
									>
										{CODE_SNIPPET}
									</Text>
								</Box>
							</div>
						</Panel>
					</div>
				</Section>

				<Section
					id='surfaces'
					title='Поверхности'
					hint='Варианты Box / лестница style padding'
				>
					<div className={styles.grid3}>
						{BOX_VARIANTS.map((variant) => (
							<Box
								key={variant}
								variant={variant}
								border
								style={{padding: 'var(--altum-g-space-3)'}}
							>
								<Stack gap='xs'>
									<Text size='sm' weight='semibold'>
										{variant}
									</Text>
									<Text size='sm' color='muted'>
										padding md
									</Text>
								</Stack>
							</Box>
						))}
					</div>
					<Panel title='Отступы Box (style) xs → xl'>
						<div className={styles.row}>
							{([
								'xs',
								'sm',
								'md',
								'lg',
								'xl'
							] as const).map((pad) => (
								<Box
									key={pad}
									variant='outlined'
									border
									style={{padding: PAD_SPACE[pad]}}
								>
									<Text size='xs'>
										padding
										{' '}
										{pad}
									</Text>
								</Box>
							))}
						</div>
					</Panel>
				</Section>

				<Section
					id='buttons'
					title='Кнопки'
					hint='Button × size × variant; ButtonIcon; отключённые'
				>
					<Panel title='Матрица Button'>
						<div className={styles.matrix}>
							{BUTTON_VARIANTS.map((variant) => (
								<div key={variant} className={styles.matrixRow}>
									<span className={styles.matrixLabel}>
										{variant}
									</span>
									{BUTTON_SIZES.map((size) => (
										<Button
											key={`${variant}-${size}`}
											variant={variant}
											size={size}
										>
											{size}
										</Button>
									))}
								</div>
							))}
							<div className={styles.matrixRow}>
								<span className={styles.matrixLabel}>
									disabled
								</span>
								{BUTTON_VARIANTS.map((variant) => (
									<Button
										key={`dis-${variant}`}
										variant={variant}
										disabled
									>
										{variant}
									</Button>
								))}
							</div>
						</div>
					</Panel>
					<div className={styles.grid2}>
						<Panel title='ButtonIcon'>
							<div className={styles.row}>
								{BUTTON_SIZES.map((size) => (
									<ButtonIcon
										key={size}
										size={size}
										variant='secondary'
										icon={<IconPlus />}
										aria-label={`Добавить ${size}`}
									/>
								))}
								<ButtonIcon
									variant='tinted'
									icon={<IconSearch />}
									aria-label='Поиск'
								/>
								<ButtonIcon
									variant='ghost'
									icon={<IconBell />}
									aria-label='Уведомить'
								/>
								<ButtonIcon
									variant='danger'
									icon={<IconTrash />}
									aria-label='Удалить'
								/>
								<ButtonIcon
									variant='ghost'
									className={overlayClose.close}
									data-shape='circle'
									data-appearance='diskClose'
									icon={<IconCross />}
									aria-label='Закрыть'
								/>
							</div>
						</Panel>
						<Panel title='ButtonGroup'>
							<div className={styles.stackGap}>
								{BUTTON_SIZES.map((size) => (
									<ButtonGroup
										key={size}
										size={size}
										aria-label={`Группа ${size}`}
									>
										<Button>
											Слева
										</Button>
										<Button>
											Центр
										</Button>
										<Button>
											Справа
										</Button>
									</ButtonGroup>
								))}
							</div>
						</Panel>
					</div>
				</Section>

				<Section
					id='chips-badges'
					title='Chip / Badge'
					hint='Все варианты и размеры рядом с Avatar overlay'
				>
					<Panel title='Варианты Chip × размеры (as=chip)'>
						<div className={styles.matrix}>
							{CHIP_VARIANTS.map((variant) => (
								<div key={variant} className={styles.matrixRow}>
									<span className={styles.matrixLabel}>
										{variant}
									</span>
									{CHIP_SIZES.map((size) => (
										<Chip
											key={`${variant}-${size}`}
											variant={variant}
											size={size}
										>
											{size}
										</Chip>
									))}
								</div>
							))}
						</div>
					</Panel>
					<div className={styles.grid2}>
						<Panel title='Chip-тег / с удалением / выбранный'>
							<div className={styles.row}>
								{CHIP_VARIANTS.map((variant) => (
									<Chip
										key={`tag-${variant}`}
										mode='tag'
										variant={variant}
										size='sm'
									>
										{variant}
									</Chip>
								))}
							</div>
							<div className={styles.row}>
								<Chip
									mode='toggle'
									variant='tinted'
									onClick={() => undefined}
								>
									Активный фильтр
								</Chip>
								<Chip onRemove={() => undefined}>
									С удалением
								</Chip>
								<Chip disabled>
									Отключён
								</Chip>
							</div>
							<ChipGroup gap='sm'>
								{[
									'Дизайн',
									'Разработка',
									'QA',
									'Документация',
									'Релиз'
								].map((label) => (
									<Chip
										key={label}
										size='sm'
										variant='secondary'
										mode='tag'
									>
										{label}
									</Chip>
								))}
							</ChipGroup>
						</Panel>
						<Panel title='Badge отдельно + оверлей'>
							<div className={styles.row}>
								{BADGE_VARIANTS.map((variant) => (
									<Badge
										key={variant}
										variant={variant}
										label='3'
										position='standalone'
									/>
								))}
								<Badge
									variant='error'
									dot
									position='standalone'
								/>
								<Badge
									variant='warning'
									size='sm'
									label='9+'
									position='standalone'
								/>
							</div>
							<div className={styles.row}>
								<Badge label='2' variant='error'>
									<Avatar
										name='Anna K'
										size='md'
										status='online'
									/>
								</Badge>
								<Badge label='!' variant='warning'>
									<ButtonIcon
										icon={<IconBell />}
										aria-label='Оповещения'
										variant='secondary'
									/>
								</Badge>
								<Badge
									label='12'
									variant='info'
									size='sm'
								>
									<Button size='sm' variant='secondary'>
										Входящие
									</Button>
								</Badge>
							</div>
						</Panel>
					</div>
				</Section>

				<Section
					id='forms'
					title='Формы'
					hint='Размеры TextField, outside/inline, ошибка/подсказка, PinInput, пикеры'
				>
					<Panel title='Размеры TextField (outside) + ряд Button'>
						<div className={styles.rowStretch}>
							{FIELD_SIZES.map((size) => (
								<div key={size} className={styles.fieldGrow}>
									<TextField
										label={`Подпись ${size}`}
										size={size}
										width='full'
										placeholder='Название задачи'
									/>
								</div>
							))}
							<div className={styles.fieldRowCta}>
								<Button size='md'>
									Сохранить
								</Button>
							</div>
						</div>
						<p className={styles.caption}>
							CTA сдвинут на высоту outside-label — helper оставлен в панели состояний ниже.
						</p>
					</Panel>
					<div className={styles.grid2}>
						<Panel title='Плавающая / ошибка / readOnly / disabled'>
							<div className={styles.stackGap}>
								<TextField
									label='Плавающая inline'
									width='full'
									defaultValue='Значение'
								/>
								<TextField
									label='Эл. почта'
									width='full'
									error='Введите email вида name@company.com'
									defaultValue='bad@'
									description='Будет видно в профиле и уведомлениях'
								/>
								<TextField
									label='Только чтение'
									width='full'
									readOnly
									defaultValue='Нельзя менять'
								/>
								<TextField
									label='Отключено'
									width='full'
									disabled
									defaultValue='Отключено'
								/>
							</div>
						</Panel>
						<Panel title='Password / Number / Masked / Search / ContentField'>
							<div className={styles.stackGap}>
								<PasswordField
									label='Пароль'
									width='full'
									value={password}
									onChange={(event) => setPassword(event.target.value)}
									showStrength
								/>
								<NumberField
									label='Количество'
									width='full'
									value={qty}
									onChange={setQty}
									min={1}
									max={100}
								/>
								<MaskedField
									label='Телефон'
									width='full'
									mask='+7 (999) 999-99-99'
									value={masked}
									onChange={setMasked}
								/>
								<SearchField
									label='Поиск'
									width='full'
									size='md'
									placeholder='Найти задачу…'
									value={search}
									onChange={(event) => setSearch(event.target.value)}
								/>
								<TextareaField
									label='Описание'
									width='full'
									value={description}
									onChange={(event) => setDescription(event.target.value)}
									description='Авто-рост — высота пустого = TextField'
								/>
							</div>
						</Panel>
					</div>
					<div className={styles.grid2}>
						<Panel title='Размеры PinInput'>
							<div className={styles.stackGap}>
								{(['sm', 'md', 'lg'] as const).map((size) => (
									<div key={size} className={styles.col}>
										<span className={styles.caption}>
											size=
											{size}
										</span>
										<PinInput
											length={4}
											size={size}
											value={pin}
											onChange={setPin}
											error={size === 'md' ? 'Неверный код' : undefined}
										/>
									</div>
								))}
							</div>
						</Panel>
						<Panel title='Дата / время / диапазон'>
							<div className={styles.stackGap}>
								<DateField
									label='Дата'
									size='md'
									value={date}
									onChange={setDate}
								/>
								<TimeField
									label='Время'
									size='md'
									value={time}
									onChange={setTime}
								/>
								<DateRangeField
									label='Период'
									layout='split'
									size='md'
									value={range}
									onChange={setRange}
								/>
								<TextareaField
									label='Комментарий'
									width='full'
									minRows={2}
									defaultValue='Многострочное поле рядом с пикерами.'
								/>
							</div>
						</Panel>
					</div>
				</Section>

				<Section
					id='toggles'
					title='Тогглы'
					hint='Checkbox / Radio / Switch + FormMessage'
				>
					<div className={styles.grid3}>
						<Panel title='CheckboxGroup'>
							<div className={styles.stackGap}>
								{(['sm', 'md', 'lg'] as const).map((size) => (
									<CheckboxGroup
										key={size}
										size={size}
										label={`Чекбокс ${size}`}
										options={[
											{
												label: `A (${size})`,
												value: `${size}-a`
											},
											{
												label: `B (${size})`,
												value: `${size}-b`
											},
										]}
										value={checks}
										onChange={setChecks}
									/>
								))}
								<Checkbox
									label='Частичный выбор'
									indeterminate
									checked={false}
									onChange={() => undefined}
								/>
								<FormMessage variant='error'>
									Выберите хотя бы один пункт
								</FormMessage>
							</div>
						</Panel>
						<Panel title='RadioGroup'>
							<RadioGroup
								name='gallery-role'
								label='Роль'
								value={role}
								onChange={setRole}
								options={[
									{
										value: 'viewer',
										label: 'Наблюдатель'
									},
									{
										value: 'editor',
										label: 'Редактор'
									},
									{
										value: 'admin',
										label: 'Админ'
									},
								]}
							/>
						</Panel>
						<Panel title='Switch'>
							<div className={styles.stackGap}>
								{(['sm', 'md', 'lg'] as const).map((size) => (
									<Switch
										key={size}
										size={size}
										label={`Switch ${size}`}
										checked={size === 'md' ? notify : digest}
										onChange={(checked) => {
											if (size === 'md') setNotify(checked);
											else setDigest(checked);
										}}
									/>
								))}
								<Switch
									label='Отключён включённым'
									disabled
									checked
									onChange={() => undefined}
								/>
							</div>
						</Panel>
					</div>
				</Section>

				<Section
					id='choosers'
					title='Выбор'
					hint='Segmented / ButtonGroup / Select / Suggest / Slider / Color / Rating'
				>
					<div className={styles.grid2}>
						<Panel title='Размеры SegmentedControl'>
							<div className={styles.stackGap}>
								{(['sm', 'md', 'lg'] as const).map((size) => (
									<SegmentedControl
										key={size}
										size={size}
										value={segment}
										onChange={setSegment}
										aria-label={`Период ${size}`}
										options={[
											{
												value: 'day',
												label: 'День'
											},
											{
												value: 'week',
												label: 'Неделя'
											},
											{
												value: 'month',
												label: 'Месяц'
											},
										]}
									/>
								))}
							</div>
						</Panel>
						<Panel title='ButtonGroup + Overflow'>
							<div className={styles.stackGap}>
								<ButtonGroup
									size='md'
									width='full'
									variant='secondary'
								>
									<Button>
										Ж
									</Button>
									<Button>
										К
									</Button>
								</ButtonGroup>
								<div className={styles.overflowDemo}>
									<Overflow fit='container' aria-label='Переполнение фильтров'>
										{[
											'Все',
											'Мои',
											'Команда',
											'Срочные',
											'Архив',
											'Шаблоны',
											'Черновики'
										].map(
											(label) => (
												<Chip
													key={label}
													size='sm'
													variant='secondary'
												>
													{label}
												</Chip>
											),
										)}
									</Overflow>
								</div>
								<Rating value={rating} onChange={setRating} />
							</div>
						</Panel>
					</div>
					<div className={styles.grid2}>
						<Panel title='Select / Suggest'>
							<div className={styles.stackGap}>
								<GallerySelect
									label='Статус'
									value={status}
									onChange={setStatus}
								/>
								<SuggestField
									label='Город'
									width='full'
									options={SUGGEST_OPTIONS}
									value={suggest}
									onChange={setSuggest}
									placeholder='Начните вводить…'
								/>
								<Select
									options={SUGGEST_OPTIONS}
									value={region}
									onChange={(next) => {
										if (!Array.isArray(next) && next != null) setRegion(String(next));
									}}
									label='Регион'
									width='full'
									onClear={() => setRegion('')}
								/>
							</div>
						</Panel>
						<Panel title='Slider + ColorSwatch'>
							<div className={styles.stackGap}>
								<Slider
									aria-label='Громкость'
									value={slider}
									onChange={setSlider}
								/>
								<Slider
									aria-label='Диапазон'
									value={sliderRange}
									onChange={setSliderRange}
								/>
								<ColorSwatchGroup
									label='Цвет метки'
									colors={SWATCH_COLORS}
									value={swatch}
									onChange={setSwatch}
								/>
							</div>
						</Panel>
					</div>
				</Section>

				<Section
					id='feedback'
					title='Обратная связь'
					hint='Alert / Progress / Spinner / Skeleton / EmptyState / StatBadge / Notification'
				>
					<div className={styles.stackGap}>
						<Alert variant='info' title='Синхронизация запущена'>
							Обновляем данные в фоне — можно продолжать работу.
						</Alert>
						<Alert variant='success' title='Изменения сохранены'>
							Команда увидит обновления в течение минуты.
						</Alert>
						<Alert variant='warning' title='Срок почти истёк'>
							Дедлайн через 2 часа — проверьте статусы задач.
						</Alert>
						<Alert variant='error' title='Не удалось отправить'>
							Проверьте соединение и повторите попытку.
						</Alert>
					</div>
					<div className={styles.grid3}>
						<Panel title='Progress'>
							<div className={styles.stackGap}>
								<Progress percentage={35} size='sm' />
								<Progress percentage={62} size='md' />
								<Progress percentage={88} size='lg' />
								<div className={styles.row}>
									<ProgressCircle percentage={40} />
									<ProgressCircle percentage={75} />
									<Spinner size='md' />
									<Spinner size='lg' />
								</div>
							</div>
						</Panel>
						<Panel title='Skeleton'>
							<div className={styles.stackGap}>
								<Skeleton variant='text' lines={3} />
								<Inline gap='sm' align='center'>
									<Skeleton variant='avatar' />
									<Skeleton variant='text' lines={2} />
								</Inline>
							</div>
						</Panel>
						<Panel title='EmptyState + StatBadge'>
							<EmptyState
								title='Пока нет записей'
								description='Измените фильтры или создайте первую запись.'
								action={(
									<Button size='sm' prefix={<IconPlus />}>
										Создать
									</Button>
								)}
							/>
							<div className={styles.row}>
								<StatBadge
									label='NPS'
									value='72'
									variant='success'
								/>
								<StatBadge
									label='Отток'
									value='2.1%'
									variant='warning'
								/>
							</div>
							<Button
								size='sm'
								variant='secondary'
								onClick={() => pushToast.success('Сохранено', 'Изменения применены')}
							>
								Показать toast
							</Button>
						</Panel>
					</div>
				</Section>

				<Section
					id='nav'
					title='Навигация'
					hint='Tabs / Steps / Pagination'
				>
					<Panel title='Tabs + бейдж'>
						<Tabs
							rootRef={tabsRef}
							value={tab}
							onChange={setTab}
							items={[
								{
									value: 'a',
									label: 'Обзор',
									badge: 3,
								},
								{
									value: 'b',
									label: 'Детали',
								},
								{
									value: 'c',
									label: 'Активность',
									badgeDot: true,
								},
							]}
						/>
						<Tabs.Panel tabsRef={tabsRef} value='a'>
							<Text size='sm'>
								Контент вкладки «Обзор».
							</Text>
						</Tabs.Panel>
						<Tabs.Panel tabsRef={tabsRef} value='b'>
							<Text size='sm'>
								Контент вкладки «Детали».
							</Text>
						</Tabs.Panel>
						<Tabs.Panel tabsRef={tabsRef} value='c'>
							<Text size='sm'>
								Контент вкладки «Активность».
							</Text>
						</Tabs.Panel>
					</Panel>
					<div className={styles.grid2}>
						<Panel title='Steps'>
							<Steps
								currentStep={1}
								items={[{title: 'Черновик'}, {title: 'Проверка'}, {title: 'Публикация'},]}
							/>
						</Panel>
						<Panel title='Pagination'>
							<Pagination
								currentPage={page}
								totalPages={8}
								onPageChange={setPage}
							>
								<Pagination.Controls />
							</Pagination>
						</Panel>
					</div>
				</Section>

				<Section
					id='data'
					title='Данные'
					hint='Avatar / DescriptionList / Timeline / Bubble / DayStripCalendar'
				>
					<div className={styles.grid2}>
						<Panel title='Размеры Avatar + статус'>
							<div className={styles.row}>
								{([
									'sm',
									'md',
									'lg',
									'xl'
								] as const).map((size) => (
									<Avatar
										key={size}
										name='Alex Ivanov'
										size={size}
										status='online'
									/>
								))}
								<Avatar
									icon={<IconUser />}
									size='md'
									status='busy'
								/>
							</div>
							<DescriptionList
								layout='inline'
								items={[
									{
										label: 'Владелец',
										value: 'Alex Ivanov'
									},
									{
										label: 'Статус',
										value: 'В работе'
									},
									{
										label: 'Обновлено',
										value: <RelativeTime date={RELATIVE_TIME_NOW_FIXTURE} />
									},
								]}
							/>
						</Panel>
						<Panel title='Timeline'>
							<Timeline
								currentId='2'
								items={[
									{
										id: '1',
										title: 'Создано',
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
										time: '—',
										status: 'warning'
									},
								]}
							/>
						</Panel>
					</div>
					<Panel title='Чат Bubble'>
						<div className={styles.chat}>
							<Bubble variant='incoming'>
								Привет! Смотри визуальную галерею — все варианты на одной странице.
							</Bubble>
							<Bubble variant='outgoing' align='end'>
								Отлично, проверю гармонию Field + Button в одной строке.
							</Bubble>
						</div>
					</Panel>
					<Panel title='DayStripCalendar'>
						<DayStripCalendar
							value={date ?? new Date()}
							onChange={(next) => setDate(next)}
						/>
					</Panel>
				</Section>

				<Section
					id='lists'
					title='Списки / медиа'
					hint='Card / Item / Accordion / SortableList / UploadZone'
				>
					<div className={styles.grid2}>
						<Panel title='Card'>
							<Card
								variant='elevated'
								hoverable
								header={(
									<Text weight='semibold'>
										Карточка проекта
									</Text>
								)}
								actions={(
									<>
										<Button size='sm' variant='secondary'>
											Открыть
										</Button>
										<Button size='sm'>
											Править
										</Button>
									</>
								)}
							>
								<Text
									as='p'
									size='sm'
									color='secondary'
								>
									Elevated Card с действиями — типичный блок обзора.
								</Text>
							</Card>
						</Panel>
						<Panel title='Строки Item'>
							<div className={styles.stackGap}>
								<Item
									interactive
									variant='outlined'
									media={<Avatar name='Nina' size='sm' />}
									mediaVariant='avatar'
									title='Nina Petrova'
									description='Дизайнер · онлайн'
									actions={(
										<ButtonIcon
											icon={<IconBell />}
											aria-label='Уведомить'
											size='sm'
											variant='ghost'
										/>
									)}
								/>
								<Item
									interactive
									variant='ghost'
									media={<IconCheckmark />}
									mediaVariant='icon'
									title='Задача закрыта'
									description='2 часа назад'
								/>
							</div>
						</Panel>
					</div>
					<div className={styles.grid2}>
						<Panel title='Accordion'>
							<Accordion variant='bordered' defaultOpenIds={['a']}>
								<Accordion.Item value='a' title='Доставка'>
									<Text size='sm'>
										Бесплатно от 3000 ₽, 1–3 дня по городу.
									</Text>
								</Accordion.Item>
								<Accordion.Item value='b' title='Возврат'>
									<Text size='sm'>
										14 дней с момента получения.
									</Text>
								</Accordion.Item>
							</Accordion>
						</Panel>
						<Panel title='SortableList'>
							<SortableList
								items={sortableItems}
								onOrderChange={setSortableItems}
								handleOnly
							/>
						</Panel>
					</div>
					<Panel title='UploadZone'>
						<UploadZone>
							Перетащите файл сюда или нажмите для выбора
						</UploadZone>
					</Panel>
				</Section>

				<Section
					id='overlays'
					title='Оверлеи'
					hint='Tooltip / Popover / Modal / Sheet / ConfirmDialog'
				>
					<div className={styles.row}>
						<Tooltip content='Подсказка Tooltip'>
							<Button variant='secondary' size='sm'>
								Наведите Tooltip
							</Button>
						</Tooltip>
						<Popover
							trigger={(props, ref) => (
								<Button
									variant='secondary'
									size='sm'
									postfix={<IconDots3 />}
									{...props}
									rootRef={ref}
								>
									Popover
								</Button>
							)}
						>
							<Stack gap='sm'>
								<Text size='sm' weight='semibold'>
									Быстрые действия
								</Text>
								<Button
									size='sm'
									variant='ghost'
									fullWidth
								>
									Дублировать
								</Button>
								<Button
									size='sm'
									variant='danger_tinted'
									fullWidth
								>
									Удалить
								</Button>
							</Stack>
						</Popover>
						<Button size='sm' onClick={() => setModalOpen(true)}>
							Открыть Modal
						</Button>
						<Button
							size='sm'
							variant='secondary'
							onClick={() => setSheetOpen(true)}
						>
							Открыть Sheet
						</Button>
						<Button
							size='sm'
							variant='danger_tinted'
							prefix={<IconTrash />}
							onClick={() => setConfirmOpen(true)}
						>
							Подтвердить
						</Button>
					</div>

					<Modal open={modalOpen} onOpenChange={setModalOpen}>
						<Modal.Header>
							<Title level={3}>
								Modal + форма
							</Title>
						</Modal.Header>
						<Modal.Body>
							<Stack gap='md'>
								<TextField
									label='Название'
									width='full'
								/>
								<GallerySelect
									label='Статус'
									value={status}
									onChange={setStatus}
								/>
							</Stack>
						</Modal.Body>
						<Modal.Footer>
							<ControlRow justify='end'>
								<Button variant='secondary' onClick={() => setModalOpen(false)}>
									Отмена
								</Button>
								<Button onClick={() => setModalOpen(false)}>
									Сохранить
								</Button>
							</ControlRow>
						</Modal.Footer>
					</Modal>

					<Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
						<Sheet.Header>
							<Title level={3}>
								Sheet
							</Title>
						</Sheet.Header>
						<Sheet.Body>
							<Text size='sm' color='secondary'>
								Тот же elevation ladder, что у Modal (`--altum-shadow-dropdown`).
							</Text>
						</Sheet.Body>
						<Sheet.Footer>
							<Button fullWidth onClick={() => setSheetOpen(false)}>
								Закрыть
							</Button>
						</Sheet.Footer>
					</Sheet>

					<ConfirmDialog
						open={confirmOpen}
						title='Удалить запись?'
						message='Действие необратимо — данные нельзя будет восстановить.'
						status='danger'
						onConfirm={() => setConfirmOpen(false)}
						onOpenChange={setConfirmOpen}
					/>
				</Section>

				<Section
					id='compose'
					title='Композиции'
					hint='Типичные связки: тулбар, карточка формы, настройки, панель фильтров'
				>
					<div className={styles.composeCard}>
						<p className={styles.panelTitle}>
							Тулбар
						</p>
						<div className={styles.toolbar}>
							<ButtonIcon
								icon={<IconHome />}
								aria-label='Главная'
								variant='ghost'
								size='sm'
							/>
							<Separator orientation='vertical' />
							<ButtonGroup size='sm' aria-label='Режим вида'>
								<Button>
									Список
								</Button>
								<Button>
									Доска
								</Button>
							</ButtonGroup>
							<SearchField
								size='sm'
								width='md'
								placeholder='Поиск…'
								value={search}
								onChange={(event) => setSearch(event.target.value)}
							/>
							<div className={styles.toolbarSpacer} />
							<Badge label='4' variant='info'>
								<ButtonIcon
									icon={<IconBell />}
									aria-label='Уведомления'
									variant='ghost'
									size='sm'
								/>
							</Badge>
							<Avatar
								name='Alex'
								size='sm'
								status='online'
							/>
							<Button size='sm' prefix={<IconPlus />}>
								Создать
							</Button>
						</div>
					</div>

					<div className={styles.grid2}>
						<div className={styles.composeCard}>
							<p className={styles.panelTitle}>
								Карточка формы
							</p>
							<Fieldset
								variant='card'
								legend='Новая задача'
								description='Поля одной высоты с CTA.'
							>
								<div className={styles.stackGap}>
									<TextField
										label='Заголовок'
										width='full'
									/>
									<div className={styles.rowStretch}>
										<div className={styles.fieldGrow}>
											<GallerySelect
												label='Статус'
												value={status}
												onChange={setStatus}
											/>
										</div>
										<div className={styles.fieldGrow}>
											<DateField
												label='Дедлайн'
												size='md'
												value={date}
												onChange={setDate}
											/>
										</div>
									</div>
									<Split align='center'>
										<CheckboxGroup
											options={[
												{
													label: 'Уведомить команду',
													value: 'notify'
												}
											]}
											value={checks}
											onChange={setChecks}
										/>
										<Inline gap='sm'>
											<Button variant='secondary'>
												Отмена
											</Button>
											<Button prefix={<IconCheckmark />}>
												Сохранить
											</Button>
										</Inline>
									</Split>
								</div>
							</Fieldset>
						</div>

						<div className={styles.composeCard}>
							<p className={styles.panelTitle}>
								Ряд настроек
							</p>
							<div className={styles.stackGap}>
								<Split align='center'>
									<div>
										<Text
											as='p'
											size='sm'
											weight='semibold'
										>
											Почтовый дайджест
										</Text>
										<Text
											as='p'
											size='sm'
											color='muted'
										>
											Ежедневная сводка в 09:00
										</Text>
									</div>
									<Switch
										aria-label='Дайджест'
										checked={digest}
										onChange={setDigest}
									/>
								</Split>
								<Separator />
								<Split align='center'>
									<div>
										<Text
											as='p'
											size='sm'
											weight='semibold'
										>
											Push-уведомления
										</Text>
										<Text
											as='p'
											size='sm'
											color='muted'
										>
											Только важные события
										</Text>
									</div>
									<Switch
										aria-label='Пуш'
										checked={notify}
										onChange={setNotify}
									/>
								</Split>
								<Separator />
								<div className={styles.row}>
									<Chip
										size='sm'
										variant='tinted'
										mode='toggle'
									>
										Продукт
									</Chip>
									<Chip size='sm' variant='secondary'>
										Дизайн
									</Chip>
									<Chip
										size='sm'
										variant='secondary'
										mode='tag'
									>
										v0.5
									</Chip>
									<StatBadge
										label='SUS'
										value='82'
										variant='success'
									/>
								</div>
							</div>
						</div>
					</div>
				</Section>

				<Section
					id='coverage'
					title='Пробелы покрытия'
					hint='Тяжёлые / редкие сценарии — отдельные stories'
				>
					<Panel title='Ещё не в этой галерее'>
						<ul className={styles.coverageList}>
							<li>
								Table / CalendarBoard
							</li>
							<li>
								CommandPalette / Sidebar
							</li>
							<li>
								ImageLightbox / Menu
							</li>
							<li>
								Attachment / FileList / ActionSheetTrigger
							</li>
						</ul>
						<p className={styles.caption}>
							Examples → Compositions / AppExamples закрывают часть сценариев (CalendarBoard,
							CommandPalette, FormHarmony).
						</p>
					</Panel>
				</Section>
			</div>
		</NotificationProvider>
	);
}

export default {
	title: 'altum/Examples/Визуальная галерея',
	parameters: {
		layout: 'fullscreen',
		controls: {disable: true},
		actions: {disable: true},
		docs: {
			disable: true,
			description: {
				component:
					'Одностраничная визуальная галерея: матрицы вариантов и композиции для QA гармонии altum.',
			},
		},
	},
} satisfies Meta;

export const AllComponents: Story<Record<string, never>> = {
	name: 'Все компоненты и сочетания',
	render: () => <VisualGalleryDemo />,
	parameters: {
		docs: {
			disable: true,
			description: {
				story:
					'Максимум компонентов и сочетаний на одной странице: кнопки, формы, выборщики, обратная связь, списки, оверлеи, тулбар/форма/настройки.',
			},
		},
	},
};
