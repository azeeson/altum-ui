import type {Meta, StoryObj} from '@storybook/react';
import type {FC} from 'react';
import React, {useMemo, useState} from 'react';
import {Text} from '../components/Text/Text';
import {Title} from '../components/Title/Title';
import {SegmentedControl} from '../components/SegmentedControl/SegmentedControl';
import type {IconProps} from '../icons/IconBase';
import * as icons from '../icons/icons';
import {
	componentCatalog,
	componentCatalogBytes,
} from './componentCatalog';
import styles from './AboutComponents.stories.module.css';

const ICONS: Record<string, FC<IconProps>> = {
	Accordion: icons.IconChevronDown,
	ActionList: icons.IconList,
	ActionSheetTrigger: icons.IconDeviceMobile,
	Alert: icons.IconWarning,
	AspectRatio: icons.IconExpand,
	Attachment: icons.IconPaperclip,
	AutocompleteField: icons.IconBox,
	Avatar: icons.IconUser,
	Badge: icons.IconTag,
	BarChart: icons.IconGraphBar,
	Box: icons.IconBox,
	Bubble: icons.IconConversation,
	Button: icons.IconPlus,
	ButtonGroup: icons.IconViewApps,
	ButtonIcon: icons.IconPlus,
	Calendar: icons.IconCalendar,
	CalendarBoard: icons.IconCalendar,
	Card: icons.IconCard,
	Checkbox: icons.IconChecklist,
	Chip: icons.IconTag,
	Collapse: icons.IconChevronUp,
	ColorSwatchGroup: icons.IconBrush,
	CommandPalette: icons.IconSearch,
	ConfirmDialog: icons.IconQuestion,
	Container: icons.IconBrowser,
	DateField: icons.IconCalendar,
	DateRangeField: icons.IconCalendar,
	DayStripCalendar: icons.IconCalendar,
	DescriptionList: icons.IconViewList,
	DialogLayout: icons.IconBrowser,
	DonutChart: icons.IconGraphPie,
	Dropdown: icons.IconChevronDown,
	EmptyState: icons.IconInbox,
	FieldGroup: icons.IconStack,
	FieldLabel: icons.IconArticle,
	Fieldset: icons.IconFolder,
	FileList: icons.IconDocument,
	FileUploader: icons.IconBox,
	FormMessage: icons.IconInformation,
	Gap: icons.IconMove,
	Grid: icons.IconViewThumb,
	ImageCrop: icons.IconCrop,
	ImageGallery: icons.IconPhotoGroup,
	ImageLightbox: icons.IconPhoto,
	Item: icons.IconViewList,
	Kbd: icons.IconCode,
	Layout: icons.IconStack,
	LineChart: icons.IconGraphLine,
	Link: icons.IconLink,
	Listbox: icons.IconViewList,
	LiveRegion: icons.IconBroadcast,
	LocaleProvider: icons.IconWeb,
	Marker: icons.IconFlag,
	MaskedField: icons.IconPencil,
	Media: icons.IconPhoto,
	Menu: icons.IconMenu,
	Modal: icons.IconBrowser,
	MultiSelect: icons.IconBox,
	Notification: icons.IconBell,
	NumberField: icons.IconPlus,
	Overflow: icons.IconDots3,
	Overlay: icons.IconContract2,
	Pagination: icons.IconDirection,
	PasswordField: icons.IconLock,
	PinInput: icons.IconPin,
	Popover: icons.IconConversation,
	PopupSwitch: icons.IconSwap,
	Progress: icons.IconMeter,
	PullToRefresh: icons.IconArrowDown,
	Radio: icons.IconDot,
	Rating: icons.IconStar,
	RelativeTime: icons.IconClock,
	SafeArea: icons.IconDeviceMobile,
	ScrollArea: icons.IconArrowDown,
	SearchField: icons.IconSearch,
	SegmentedControl: icons.IconViewApps,
	Select: icons.IconChevronDown,
	Separator: icons.IconMinus,
	Sheet: icons.IconDeviceMobile,
	Sidebar: icons.IconMenu,
	Skeleton: icons.IconHourglass,
	SkipLink: icons.IconSkip,
	Slider: icons.IconMeter,
	SortableList: icons.IconDragHandle,
	Spinner: icons.IconLoading,
	StatBadge: icons.IconPulse,
	Steps: icons.IconDirection,
	SuggestField: icons.IconSearch,
	SwipeToAction: icons.IconArrowLeft,
	Switch: icons.IconToggles,
	Table: icons.IconViewListLarge,
	Tabs: icons.IconViewApps,
	Text: icons.IconArticle,
	TextField: icons.IconPencil,
	TextareaField: icons.IconDocumentEdit,
	ThemeProvider: icons.IconBrightnessMedium,
	TimeField: icons.IconClock,
	Timeline: icons.IconFeed,
	Title: icons.IconBold,
	Tooltip: icons.IconHelp,
	UploadZone: icons.IconUpload,
	VirtualList: icons.IconViewList,
	VisuallyHidden: icons.IconPreviewOff,
	WheelTimePicker: icons.IconClock,
};

function formatSize(bytes: number) {
	return `${(bytes / 1024).toFixed(1)} КБ`;
}

type SortKey = 'name' | 'bytes';
type SortDir = 'asc' | 'desc';

function ComponentsPage() {
	const [sortKey, setSortKey] = useState<SortKey>('name');
	const [sortDir, setSortDir] = useState<SortDir>('asc');

	const items = useMemo(() => {
		const factor = sortDir === 'asc' ? 1 : -1;
		return [...componentCatalog].sort((a, b) => {
			const byName = a.name.localeCompare(b.name, 'en');
			const byBytes = a.bytes - b.bytes || byName;
			return (sortKey === 'name' ? byName : byBytes) * factor;
		});
	}, [sortDir, sortKey]);

	const directionOptions = sortKey === 'name'
		? [
			{
				label: 'А–Я',
				value: 'asc' as const
			},
			{
				label: 'Я–А',
				value: 'desc' as const
			},
		]
		: [
			{
				label: 'Меньше',
				value: 'asc' as const
			},
			{
				label: 'Больше',
				value: 'desc' as const
			},
		];

	return (
		<div className={styles.page}>
			<header className={styles.lead}>
				<Title level={1}>
					Компоненты
				</Title>
				<Text
					as='p'
					size='lg'
					weight='medium'
				>
					{componentCatalog.length}
					{' компонентов · '}
					{formatSize(componentCatalogBytes)}
					{' собственного кода'}
				</Text>
				<Text
					as='p'
					size='sm'
					color='secondary'
				>
					Размер — минифицированные файлы самой папки: код и её CSS.
				</Text>
				<Text
					as='p'
					size='sm'
					color='secondary'
				>
					Stories и импорты из других папок не входят, сумма не считает общее дважды.
				</Text>
			</header>
			<div className={styles.toolbar}>
				<SegmentedControl
					size='sm'
					width='auto'
					itemFit='content'
					aria-label='Поле сортировки'
					options={[
						{
							label: 'Алфавит',
							value: 'name'
						},
						{
							label: 'Размер',
							value: 'bytes'
						},
					]}
					value={sortKey}
					onChange={setSortKey}
				/>
				<SegmentedControl
					size='sm'
					width='auto'
					itemFit='content'
					aria-label='Порядок сортировки'
					options={directionOptions}
					value={sortDir}
					onChange={setSortDir}
				/>
			</div>
			<ul className={styles.list}>
				{items.map((item) => {
					const Icon = ICONS[item.name] ?? icons.IconBox;

					return (
						<li
							key={item.name}
							className={styles.row}
						>
							<span
								className={styles.icon}
								aria-hidden
							>
								<Icon size={18} />
							</span>
							<span className={styles.copy}>
								<Text weight='medium'>
									{item.name}
								</Text>
								<Text
									size='sm'
									color='secondary'
								>
									{item.description}
								</Text>
							</span>
							<Text
								className={styles.size}
								size='sm'
								color='secondary'
							>
								{formatSize(item.bytes)}
							</Text>
						</li>
					);
				})}
			</ul>
		</div>
	);
}

const meta = {
	title: 'altum/About',
	parameters: {
		layout: 'fullscreen',
		controls: {disable: true},
	},
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Components: Story = {
	name: 'Компоненты',
	render: () => <ComponentsPage />,
};
