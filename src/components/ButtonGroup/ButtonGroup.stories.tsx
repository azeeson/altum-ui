import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {ButtonGroup, ButtonGroupRootProps} from './ButtonGroup';
import {IconChevronUp} from '../../icons/icons/IconChevronUp';
import {IconChevronDown} from '../../icons/icons/IconChevronDown';
import {IconAlignLeft} from '../../icons/icons/IconAlignLeft';
import {IconAlignCenter} from '../../icons/icons/IconAlignCenter';
import {IconAlignRight} from '../../icons/icons/IconAlignRight';
import {IconMenu} from '../../icons/icons/IconMenu';
import {IconViewList} from '../../icons/icons/IconViewList';
import {Text} from '../Text/Text';
import {Inline, Stack} from '../Layout/Layout';
import {Card} from '../Card/Card';
import {componentParameters, story, Story} from '../../storybook/meta';
import type {ButtonVariant} from '../../base/ButtonBase';

const VARIANTS: ButtonVariant[] = [
	'primary',
	'tinted',
	'secondary',
	'ghost',
	'link',
];

export default {
	title: 'altum/Components/ButtonGroup',
	component: ButtonGroup,
	tags: ['autodocs'],
	parameters: {
		...componentParameters(
			'Составная группа: `mode` `button` / `toggle` / `multi_toggle`. Стили на Root, в `button` выбранность через `active` на Item.',
		),
	},
	argTypes: {
		size: {
			control: {type: 'select'},
			options: ['sm', 'md', 'lg'],
		},
		mode: {
			control: {type: 'select'},
			options: ['button', 'toggle', 'multi_toggle'],
		},
		itemFit: {
			control: {type: 'select'},
			options: ['equal', 'content'],
		},
		variant: {
			control: {type: 'select'},
			options: [...VARIANTS, 'plain'],
		},
		status: {
			control: {type: 'select'},
			options: ['default', 'danger'],
		},
		borderless: {
			control: 'boolean',
		},
		disabled: {
			control: 'boolean',
		},
		readOnly: {
			control: 'boolean',
		},
		width: {
			control: {
				type: 'select',
				options: ['auto', 'full'],
			},
		},
		onChange: {
			action: 'change',
		},
	},
} satisfies Meta<typeof ButtonGroup>;

export const Playground: Story<ButtonGroupRootProps> = {
	render: ({size, variant, status, borderless}) => (
		<ButtonGroup
			size={size}
			variant={variant}
			status={status}
			borderless={borderless}
			aria-label='Навигация'
		>
			<ButtonGroup.Item icon={<IconChevronUp />} aria-label='Вверх' />
			<ButtonGroup.Item icon={<IconChevronDown />} aria-label='Вниз' />
		</ButtonGroup>
	),
	args: {
		size: 'md',
		variant: 'secondary',
		status: 'default',
		borderless: false,
	},
	parameters: story('Иконки без toggle-состояния.'),
};

export const WithLabels: Story<ButtonGroupRootProps> = {
	render: () => (
		<ButtonGroup aria-label='Действия'>
			<ButtonGroup.Item icon={<IconViewList />}>
				Список
			</ButtonGroup.Item>
			<ButtonGroup.Item icon={<IconMenu />}>
				Меню
			</ButtonGroup.Item>
			<ButtonGroup.Item icon={<IconAlignLeft />}>
				Слева
			</ButtonGroup.Item>
		</ButtonGroup>
	),
	parameters: story('Иконка + подпись.'),
};

export const ExclusiveToggle: Story<ButtonGroupRootProps> = {
	render: function ExclusiveToggleRender() {
		const [align, setAlign] = useState('left');

		return (
			<ButtonGroup
				mode='toggle'
				value={align}
				onChange={(next) => {
					if (typeof next === 'string') setAlign(next);
				}}
				aria-label='Выравнивание'
				variant='secondary'
			>
				<ButtonGroup.Item
					value='left'
					icon={<IconAlignLeft />}
					aria-label='Слева'
				/>
				<ButtonGroup.Item
					value='center'
					icon={<IconAlignCenter />}
					aria-label='По центру'
				/>
				<ButtonGroup.Item
					value='right'
					icon={<IconAlignRight />}
					aria-label='Справа'
				/>
			</ButtonGroup>
		);
	},
	parameters: story('`mode="toggle"` — один активный пункт, слайдер как у SegmentedControl.'),
};

export const ToggleToolbar: Story<ButtonGroupRootProps> = {
	render: function ToggleToolbarRender() {
		const [marks, setMarks] = useState<string[]>(['italic']);

		return (
			<ButtonGroup
				aria-label='Форматирование'
				variant='secondary'
				mode='multi_toggle'
				value={marks}
				onChange={(next) => setMarks(Array.isArray(next) ? next : [next])}
			>
				<ButtonGroup.Item value='bold' aria-label='Жирный'>
					Ж
				</ButtonGroup.Item>
				<ButtonGroup.Item value='italic' aria-label='Курсив'>
					К
				</ButtonGroup.Item>
			</ButtonGroup>
		);
	},
	parameters: story('`mode="multi_toggle"` — несколько активных пунктов, `aria-pressed`.'),
};

const FIT_OPTIONS = [
	{
		label: '1-й',
		value: '1',
	},
	{
		label: '5-й',
		value: '5',
	},
	{
		label: 'Последний',
		value: 'last',
	},
];

export const ItemFitContent: Story<ButtonGroupRootProps> = {
	render: function ItemFitContentRender() {
		const [equal, setEqual] = useState('5');
		const [content, setContent] = useState('5');

		return (
			<Stack gap='md' style={{maxWidth: 560}}>
				<div>
					<Text size='sm'>
						itemFit=&quot;equal&quot;
					</Text>
					<ButtonGroup
						mode='toggle'
						width='full'
						itemFit='equal'
						value={equal}
						onChange={(next) => {
							if (typeof next === 'string') setEqual(next);
						}}
						aria-label='Equal'
					>
						{FIT_OPTIONS.map((option) => (
							<ButtonGroup.Item key={option.value} value={option.value}>
								{option.label}
							</ButtonGroup.Item>
						))}
					</ButtonGroup>
				</div>
				<div>
					<Text size='sm'>
						itemFit=&quot;content&quot;
					</Text>
					<ButtonGroup
						mode='toggle'
						width='full'
						itemFit='content'
						value={content}
						onChange={(next) => {
							if (typeof next === 'string') setContent(next);
						}}
						aria-label='Content'
					>
						{FIT_OPTIONS.map((option) => (
							<ButtonGroup.Item key={option.value} value={option.value}>
								{option.label}
							</ButtonGroup.Item>
						))}
					</ButtonGroup>
				</div>
			</Stack>
		);
	},
	parameters: story('`itemFit`: равные доли vs ширина от контента, трек на 100%.'),
};

export const AllVariants: Story<ButtonGroupRootProps> = {
	render: () => (
		<Stack gap='md'>
			{VARIANTS.map((variant) => (
				<div key={variant}>
					<Text size='sm'>
						{variant}
					</Text>
					<ButtonGroup
						variant={variant}
						aria-label={variant}
						size='md'
					>
						<ButtonGroup.Item active>
							One
						</ButtonGroup.Item>
						<ButtonGroup.Item>
							Two
						</ButtonGroup.Item>
						<ButtonGroup.Item>
							Three
						</ButtonGroup.Item>
					</ButtonGroup>
				</div>
			))}
		</Stack>
	),
	parameters: story('Все варианты заливки; первый сегмент с `active`.'),
};

export const Borderless: Story<ButtonGroupRootProps> = {
	render: () => (
		<Stack gap='md'>
			{(['secondary', 'ghost', 'tinted'] as const).map((variant) => (
				<div key={variant}>
					<Text size='sm'>
						{variant}
						{' '}
						+ borderless
					</Text>
					<ButtonGroup
						variant={variant}
						borderless
						aria-label={variant}
					>
						<ButtonGroup.Item active>
							A
						</ButtonGroup.Item>
						<ButtonGroup.Item>
							B
						</ButtonGroup.Item>
						<ButtonGroup.Item>
							C
						</ButtonGroup.Item>
					</ButtonGroup>
				</div>
			))}
		</Stack>
	),
	parameters: story('`borderless` снимает рамку трека (ортогонально `variant`).'),
};

export const Sizes: Story<ButtonGroupRootProps> = {
	render: () => (
		<Stack gap='md' align='start'>
			{(['sm', 'md', 'lg'] as const).map((size) => (
				<div key={size}>
					<Text size='sm'>
						size=
						{size}
					</Text>
					<ButtonGroup
						size={size}
						variant='secondary'
						aria-label={size}
					>
						<ButtonGroup.Item active>
							One
						</ButtonGroup.Item>
						<ButtonGroup.Item>
							Two
						</ButtonGroup.Item>
						<ButtonGroup.Item icon={<IconMenu />} aria-label='Меню' />
					</ButtonGroup>
				</div>
			))}
		</Stack>
	),
	parameters: story('Размеры `sm` / `md` / `lg`.'),
};

export const Disabled: Story<ButtonGroupRootProps> = {
	render: () => (
		<ButtonGroup
			disabled
			aria-label='Заблокировано'
			variant='secondary'
		>
			<ButtonGroup.Item active>
				One
			</ButtonGroup.Item>
			<ButtonGroup.Item>
				Two
			</ButtonGroup.Item>
			<ButtonGroup.Item>
				Three
			</ButtonGroup.Item>
		</ButtonGroup>
	),
	parameters: story('`disabled` на корне блокирует все пункты.'),
};

export const Danger: Story<ButtonGroupRootProps> = {
	render: () => (
		<ButtonGroup
			status='danger'
			variant='secondary'
			aria-label='Опасные действия'
		>
			<ButtonGroup.Item>
				Удалить
			</ButtonGroup.Item>
			<ButtonGroup.Item>
				Архив
			</ButtonGroup.Item>
		</ButtonGroup>
	),
	parameters: story('`status="danger"` на треке группы.'),
};

export const Interaction: Story<ButtonGroupRootProps> = {
	render: function InteractionRender() {
		const [align, setAlign] = useState('left');
		return (
			<Stack gap='sm'>
				<ButtonGroup
					mode='toggle'
					value={align}
					onChange={(next) => {
						if (typeof next === 'string') setAlign(next);
					}}
					aria-label='Выравнивание'
				>
					<ButtonGroup.Item
						value='left'
						icon={<IconAlignLeft />}
						aria-label='Слева'
					/>
					<ButtonGroup.Item
						value='center'
						icon={<IconAlignCenter />}
						aria-label='По центру'
					/>
					<ButtonGroup.Item
						value='right'
						icon={<IconAlignRight />}
						aria-label='Справа'
					/>
				</ButtonGroup>
				<Text size='sm' color='muted'>
					{align}
				</Text>
			</Stack>
		);
	},
	play: async ({canvasElement}) => {
		const center = canvasElement.querySelector('[aria-label="По центру"]') as HTMLButtonElement | null;
		center?.click();
		center?.focus();
	},
	parameters: story('Play выбирает выравнивание по центру.'),
};

export const UsageExample: Story<ButtonGroupRootProps> = {
	render: function UsageExampleRender() {
		const [view, setView] = useState('list');
		return (
			<Card
				style={{maxWidth: 420}}
				header={(
					<Inline
						gap='sm'
						style={{
							width: '100%',
							justifyContent: 'space-between'
						}}
					>
						<Text weight='bold'>
							Документы
						</Text>
						<ButtonGroup
							mode='toggle'
							size='sm'
							value={view}
							onChange={(next) => {
								if (typeof next === 'string') setView(next);
							}}
							aria-label='Вид'
						>
							<ButtonGroup.Item
								value='list'
								icon={<IconViewList />}
								aria-label='Список'
							/>
							<ButtonGroup.Item
								value='menu'
								icon={<IconMenu />}
								aria-label='Сетка'
							/>
						</ButtonGroup>
					</Inline>
				)}
			>
				<Text size='sm'>
					Режим:
					{' '}
					{view === 'list' ? 'список' : 'сетка'}
				</Text>
			</Card>
		);
	},
	parameters: story('Переключатель вида в шапке карточки.'),
};
