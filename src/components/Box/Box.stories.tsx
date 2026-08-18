import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {Box, type BoxProps, type BoxVariant, type BoxShadow} from './Box';
import {Text} from '../Text/Text';
import {Stack, Inline} from '../Layout/Layout';
import {Button} from '../Button/Button';
import {ButtonIcon} from '../ButtonIcon/ButtonIcon';
import {ButtonGroup} from '../ButtonGroup/ButtonGroup';
import {SegmentedControl} from '../SegmentedControl/SegmentedControl';
import {TextField} from '../TextField/TextField';
import {TextareaField} from '../TextareaField/TextareaField';
import {NumberField} from '../NumberField/NumberField';
import {Select} from '../Select/Select';
import {Chip} from '../Chip/Chip';
import {Checkbox} from '../Checkbox/Checkbox';
import {RadioGroup} from '../Radio/Radio';
import {Switch} from '../Switch/Switch';
import {PinInput} from '../PinInput/PinInput';
import {Pagination} from '../Pagination/Pagination';
import {Progress} from '../Progress/Progress';
import {Slider, type RangeValue} from '../Slider/Slider';
import {Separator} from '../Separator/Separator';
import {Kbd, KbdGroup} from '../Kbd/Kbd';
import {Tabs} from '../Tabs/Tabs';
import {UploadZone} from '../UploadZone/UploadZone';
import {Skeleton} from '../Skeleton/Skeleton';
import {Badge} from '../Badge/Badge';
import {IconPlus} from '../../icons/icons/IconPlus';
import {componentParameters, story, Story} from '../../storybook/meta';
import {Title} from '../Title/Title';
import {Link} from '../Link/Link';

const ALL_VARIANTS: Array<[BoxVariant, string]> = [
	['outlined', 'sec-bg (по умолчанию: border)'],
	['elevated', 'sec-bg (по умолчанию: shadow sm)'],
	['floating', 'dropdown (по умолчанию: border + shadow md)'],
	['tinted', 'тонированная primary'],
	['secondary', 'заливка secondary'],
	['muted', 'sec-bg-active'],
	['glass', 'blur + полупрозрачность'],
	['overlay', 'overlay-content на scrim'],
	['ghost', 'прозрачный'],
	['plain', 'без chrome'],
];

const ADAPTIVE_VARIANTS: BoxVariant[] = [
	'outlined',
	'elevated',
	'tinted',
	'secondary',
	'muted',
	'glass',
	'overlay',
];

const SEGMENT_OPTIONS = [
	{
		label: 'День',
		value: 'day'
	},
	{
		label: 'Неделя',
		value: 'week'
	},
	{
		label: 'Месяц',
		value: 'month'
	},
];

const SELECT_OPTIONS = [
	{
		label: 'Опция A',
		value: 'a'
	},
	{
		label: 'Опция B',
		value: 'b'
	},
];

const RADIO_OPTIONS = [
	{
		label: 'A',
		value: 'a'
	},
	{
		label: 'B',
		value: 'b'
	},
];

const TAB_ITEMS = [
	{
		id: 'one',
		label: 'Обзор',
		content: <Text size='sm'>
			Контент вкладки «Обзор»
		</Text>
	},
	{
		id: 'two',
		label: 'Настройки',
		content: <Text size='sm'>
			Контент вкладки «Настройки»
		</Text>
	},
	{
		id: 'three',
		label: 'Лог',
		content: <Text size='sm'>
			Контент вкладки «Лог»
		</Text>
	},
];

function SectionLabel({children}: {children: React.ReactNode}) {
	return (
		<Text
			size='xs'
			color='muted'
			style={{
				textTransform: 'uppercase',
				letterSpacing: '0.04em'
			}}
		>
			{children}
		</Text>
	);
}

function SurfaceControls() {
	const [segment, setSegment] = useState('day');
	const [segmentTinted, setSegmentTinted] = useState('day');
	const [segmentGhost, setSegmentGhost] = useState('day');
	const [groupActive, setGroupActive] = useState('left');
	const [groupTinted, setGroupTinted] = useState('a');
	const [text, setText] = useState('');
	const [notes, setNotes] = useState('');
	const [number, setNumber] = useState(1);
	const [select, setSelect] = useState('a');
	const [checked, setChecked] = useState(true);
	const [radio, setRadio] = useState('a');
	const [switched, setSwitched] = useState(false);
	const [pin, setPin] = useState('');
	const [page, setPage] = useState(2);
	const [range, setRange] = useState<RangeValue>([20, 70]);
	const [tab, setTab] = useState('one');
	const [chipActive, setChipActive] = useState(true);
	const radioName = React.useId();

	return (
		<Stack gap='md'>
			<Stack gap='sm'>
				<SectionLabel>
					Типографика
				</SectionLabel>
				<Title level={4}>
					Заголовок секции
				</Title>
				<Text size='sm'>
					Основной текст на этой поверхности
				</Text>
				<Text size='sm' color='secondary'>
					Вторичный поясняющий текст
				</Text>
				<Text size='xs' color='muted'>
					Приглушённые метаданные
				</Text>
				<Inline gap='sm' wrap>
					<Link
						href='#'
						variant='primary'
						size='sm'
					>
						Основная ссылка
					</Link>
					<Link
						href='#'
						variant='secondary'
						size='sm'
					>
						Secondary
					</Link>
					<Link
						href='#'
						variant='muted'
						size='sm'
					>
						Muted
					</Link>
					<Link
						href='#'
						status='danger'
						size='sm'
					>
						Danger
					</Link>
				</Inline>
			</Stack>

			<Stack gap='sm'>
				<SectionLabel>
					Кнопки
				</SectionLabel>
				<Inline gap='sm' wrap>
					<Button variant='primary' size='sm'>
						Primary
					</Button>
					<Button variant='tinted' size='sm'>
						Tinted
					</Button>
					<Button variant='secondary' size='sm'>
						Secondary
					</Button>
					<Button variant='ghost' size='sm'>
						Ghost
					</Button>
					<Button
						variant='secondary'
						status='danger'
						size='sm'
					>
						Опасная sec
					</Button>
					<ButtonIcon
						variant='ghost'
						size='sm'
						icon={<IconPlus />}
						aria-label='Добавить'
					/>
					<ButtonIcon
						variant='secondary'
						size='sm'
						icon={<IconPlus />}
						aria-label='Добавить secondary'
					/>
				</Inline>
			</Stack>

			<Stack gap='sm'>
				<SectionLabel>
					Группа кнопок / сегмент
				</SectionLabel>
				<Inline gap='sm' wrap>
					<ButtonGroup
						variant='secondary'
						size='sm'
						aria-label='Выравнивание'
					>
						<ButtonGroup.Item active={groupActive === 'left'} onClick={() => setGroupActive('left')}>
							Л
						</ButtonGroup.Item>
						<ButtonGroup.Item active={groupActive === 'center'} onClick={() => setGroupActive('center')}>
							Ц
						</ButtonGroup.Item>
						<ButtonGroup.Item active={groupActive === 'right'} onClick={() => setGroupActive('right')}>
							П
						</ButtonGroup.Item>
					</ButtonGroup>
					<ButtonGroup
						variant='tinted'
						size='sm'
						aria-label='Режим'
					>
						<ButtonGroup.Item active={groupTinted === 'a'} onClick={() => setGroupTinted('a')}>
							A
						</ButtonGroup.Item>
						<ButtonGroup.Item active={groupTinted === 'b'} onClick={() => setGroupTinted('b')}>
							B
						</ButtonGroup.Item>
					</ButtonGroup>
				</Inline>
				<Inline gap='sm' wrap>
					<SegmentedControl
						options={SEGMENT_OPTIONS}
						value={segment}
						onChange={setSegment}
						variant='secondary'
						size='sm'
					/>
					<SegmentedControl
						options={SEGMENT_OPTIONS}
						value={segmentTinted}
						onChange={setSegmentTinted}
						variant='tinted'
						size='sm'
					/>
					<SegmentedControl
						options={SEGMENT_OPTIONS}
						value={segmentGhost}
						onChange={setSegmentGhost}
						variant='ghost'
						size='sm'
					/>
				</Inline>
			</Stack>

			<Stack gap='sm'>
				<SectionLabel>
					Поля
				</SectionLabel>
				<Inline gap='sm' wrap>
					<TextField
						label='Имя'
						value={text}
						onChange={(event) => setText(event.target.value)}
						width='sm'
						size='sm'
					/>
					<NumberField
						label='Кол-во'
						value={number}
						onChange={(val) => setNumber(val ?? 0)}
						width='xs'
						size='sm'
					/>
					<Select.Root
						options={SELECT_OPTIONS}
						value={select}
						onChange={(value) => { if (!Array.isArray(value)) setSelect(value); }}
					>
						<Select.Trigger
							label='Выбор'
							width='sm'
							size='sm'
						/>
						<Select.Panel>
							<Select.List />
						</Select.Panel>
					</Select.Root>
				</Inline>
				<TextareaField
					label='Заметки'
					value={notes}
					onChange={(event) => setNotes(event.target.value)}
					width='full'
					size='sm'
					rows={2}
				/>
				<PinInput
					length={4}
					value={pin}
					onChange={setPin}
					aria-label='ПИН'
				/>
			</Stack>

			<Stack gap='sm'>
				<SectionLabel>
					Тогглы / Chip
				</SectionLabel>
				<Inline gap='md' wrap>
					<Checkbox
						label='Чекбокс'
						checked={checked}
						onChange={(event) => setChecked(event.target.checked)}
					/>
					<RadioGroup
						name={radioName}
						options={RADIO_OPTIONS}
						value={radio}
						onChange={setRadio}
						orientation='horizontal'
					/>
					<Switch
						label='Переключатель'
						checked={switched}
						onChange={setSwitched}
						size='sm'
					/>
				</Inline>
				<Inline gap='sm' wrap>
					<Chip
						variant='secondary'
						size='sm'
						active={chipActive}
						onClick={() => setChipActive((v) => !v)}
					>
						Secondary
					</Chip>
					<Chip variant='tinted' size='sm'>
						Tinted
					</Chip>
					<Chip
						mode='tag'
						variant='secondary'
						size='sm'
					>
						Tag
					</Chip>
					<Chip
						mode='tag'
						variant='tinted'
						size='sm'
					>
						Tag тонированный
					</Chip>
					<Badge variant='secondary' label='12' />
				</Inline>
			</Stack>

			<Stack gap='sm'>
				<SectionLabel>
					Панели / прочее
				</SectionLabel>
				<Tabs
					value={tab}
					onChange={setTab}
					variant='pill'
				>
					<Tabs.List>
						{TAB_ITEMS.map((item) => (
							<Tabs.Trigger key={item.id} value={item.id}>
								{item.label}
							</Tabs.Trigger>
						))}
					</Tabs.List>
					{TAB_ITEMS.map((item) => (
						<Tabs.Panel key={item.id} value={item.id}>
							{item.content}
						</Tabs.Panel>
					))}
				</Tabs>
				<Slider
					value={range}
					onChange={setRange}
					min={0}
					max={100}
					step={1}
					aria-label='Диапазон'
				/>
				<Progress
					percentage={45}
					label='Прогресс'
					size='sm'
				/>
				<Inline
					gap='sm'
					wrap
					style={{alignItems: 'center'}}
				>
					<Text size='sm'>
						Горячие клавиши
					</Text>
					<KbdGroup>
						<Kbd>
							⌘
						</Kbd>
						<Kbd>
							K
						</Kbd>
					</KbdGroup>
				</Inline>
				<Separator />
				<Pagination
					currentPage={page}
					totalPages={8}
					onPageChange={setPage}
					aria-label='Страницы демо'
				>
					<Pagination.Controls />
				</Pagination>
				<Skeleton.Card />
				<UploadZone>
					Перетащите файл или нажмите для выбора
				</UploadZone>
			</Stack>
		</Stack>
	);
}

export default {
	title: 'altum/Components/Box',
	component: Box,
	tags: ['autodocs'],
	parameters: componentParameters(
		'Примитив поверхности: `variant` + chrome. Адаптивные варианты переопределяют element CSS-переменные (`--altum-field-*`, `--altum-color-button-*`, …) для потомков.',
	),
	argTypes: {
		variant: {
			control: 'select',
			options: ALL_VARIANTS.map(([v]) => v),
		},
		border: {
			control: 'boolean',
		},
		borderStyle: {
			control: 'select',
			options: ['solid', 'dashed'],
		},
		shadow: {
			control: 'select',
			options: [
				'none',
				'sm',
				'md',
				'lg'
			] satisfies BoxShadow[],
		},
		padding: {
			control: 'select',
			options: [
				'none',
				'xs',
				'sm',
				'md',
				'lg'
			],
		},
		radius: {
			control: 'select',
			options: [
				'none',
				'sm',
				'md',
				'lg'
			],
		},
	},
} satisfies Meta<typeof Box>;

export const Playground: Story<BoxProps> = {
	args: {
		variant: 'outlined',
		border: true,
		shadow: 'none',
		padding: 'md',
		radius: 'md',
		children: 'Содержимое Box',
	},
	render: (args) => (
		<div style={{maxWidth: 320}}>
			<Box {...args}>
				<Text size='sm'>
					{args.children}
				</Text>
			</Box>
		</div>
	),
	parameters: story('Controls: вариант, рамка, тень, внутренние отступы, радиус.'),
};

export const Variants: Story<BoxProps> = {
	render: () => (
		<Stack gap='md' style={{maxWidth: 360}}>
			{ALL_VARIANTS.map(([variant, label]) => (
				<Box
					key={variant}
					variant={variant}
					padding='md'
				>
					<Text size='sm' weight='bold'>
						{variant}
					</Text>
					<Text size='xs'>
						{label}
					</Text>
				</Box>
			))}
		</Stack>
	),
	parameters: story('Заливки с дефолтным chrome по variant.'),
};

export const BorderAndShadow: Story<BoxProps> = {
	render: () => (
		<Stack gap='md' style={{maxWidth: 420}}>
			<Text size='sm' weight='bold'>
				Одна заливка (`tinted`), разный chrome
			</Text>
			<Inline gap='md' wrap>
				<Box
					variant='tinted'
					border={false}
					shadow='none'
					padding='md'
				>
					без рамки / тени
				</Box>
				<Box
					variant='tinted'
					border
					shadow='none'
					padding='md'
				>
					только рамка
				</Box>
				<Box
					variant='tinted'
					border={false}
					shadow='sm'
					padding='md'
				>
					только shadow sm
				</Box>
				<Box
					variant='tinted'
					border
					shadow='md'
					padding='md'
				>
					рамка + md
				</Box>
				<Box
					variant='tinted'
					border
					shadow='lg'
					padding='md'
				>
					рамка + lg
				</Box>
			</Inline>
			<Text size='sm' weight='bold'>
				Уровни тени (`outlined`)
			</Text>
			<Inline gap='md' wrap>
				{([
					'none',
					'sm',
					'md',
					'lg'
				] as const).map((shadow) => (
					<Box
						key={shadow}
						variant='outlined'
						border
						shadow={shadow}
						padding='md'
					>
						shadow=
						{shadow}
					</Box>
				))}
			</Inline>
		</Stack>
	),
	parameters: story('`border` и `shadow` независимы от `variant`.'),
};

export const Glass: Story<BoxProps> = {
	render: () => (
		<div
			style={{
				maxWidth: 420,
				padding: 32,
				borderRadius: 12,
				background:
					'linear-gradient(135deg, var(--altum-color-brand) 0%, var(--altum-color-status-info) 50%, var(--altum-color-surface-hover) 100%)',
			}}
		>
			<Stack gap='md'>
				<Box
					variant='glass'
					border
					shadow='sm'
					padding='lg'
					radius='lg'
				>
					<Text size='sm' weight='bold'>
						glass + border + sm
					</Text>
				</Box>
				<Box
					variant='glass'
					border={false}
					shadow='lg'
					padding='lg'
					radius='lg'
				>
					<Text size='sm' weight='bold'>
						glass без рамки + lg
					</Text>
				</Box>
			</Stack>
		</div>
	),
	parameters: story('`glass` + произвольный border/shadow.'),
};

export const PaddingAndRadius: Story<BoxProps> = {
	render: () => (
		<Inline gap='md' wrap>
			<Box
				variant='outlined'
				border
				padding='xs'
				radius='none'
			>
				xs / none
			</Box>
			<Box
				variant='outlined'
				border
				padding='sm'
				radius='sm'
			>
				sm / sm
			</Box>
			<Box
				variant='outlined'
				border
				padding='md'
				radius='md'
			>
				md / md
			</Box>
			<Box
				variant='outlined'
				border
				padding='lg'
				radius='lg'
			>
				lg / lg
			</Box>
		</Inline>
	),
	parameters: story('Комбинации padding и radius.'),
};

export const DashedBorder: Story<BoxProps> = {
	render: () => (
		<Stack gap='md' style={{maxWidth: 360}}>
			<Box
				variant='ghost'
				border
				borderStyle='dashed'
				padding='md'
			>
				ghost + dashed
			</Box>
			<Box
				variant='muted'
				border
				borderStyle='dashed'
				padding='md'
			>
				muted + dashed
			</Box>
		</Stack>
	),
	parameters: story('`borderStyle="dashed"` для empty / drop zones.'),
};

export const SurfaceAdaptation: Story<BoxProps> = {
	render: () => (
		<Stack gap='lg' style={{maxWidth: 720}}>
			<Text size='sm'>
				Адаптивные варианты Box переопределяют element CSS-переменные
				{' '}
				<code>
					--altum-field-*
				</code>
				,
				{' '}
				<code>
					--altum-color-button-*
				</code>
				,
				{' '}
				<code>
					--altum-type-*
				</code>
				,
				{' '}
				<code>
					--altum-color-link-*
				</code>
				и др. — контролы и типографика наследуют цвета через каскад.
			</Text>
			<Stack gap='sm'>
				<Text size='sm' weight='bold'>
					Без Box
				</Text>
				<SurfaceControls />
			</Stack>
			{ADAPTIVE_VARIANTS.map((variant) => {
				const box = (
					<Box
						variant={variant}
						padding='md'
						border
					>
						<Stack gap='sm'>
							<Text size='sm' weight='bold'>
								Box
								{' '}
								{variant}
							</Text>
							<SurfaceControls />
						</Stack>
					</Box>
				);
				if (variant === 'overlay') {
					return (
						<div
							key={variant}
							style={{
								padding: 16,
								borderRadius: 12,
								background: 'linear-gradient(135deg, #0f172a, #334155)',
							}}
						>
							{box}
						</div>
					);
				}
				return (
					<React.Fragment key={variant}>
						{box}
					</React.Fragment>
				);
			})}
		</Stack>
	),
	parameters: story(
		'Эталон вне Box + адаптация на outlined / elevated / tinted / secondary / muted / glass / overlay: typography (Title / Text / Link), buttons, fields, toggles, panels.',
	),
};

