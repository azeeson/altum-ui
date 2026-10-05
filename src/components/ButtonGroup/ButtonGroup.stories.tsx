import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {Button} from '../Button/Button';
import {ButtonGroup, ButtonGroupRootProps} from './ButtonGroup';
import {IconChevronUp} from '../../icons/icons/IconChevronUp';
import {IconChevronDown} from '../../icons/icons/IconChevronDown';
import {IconAlignLeft} from '../../icons/icons/IconAlignLeft';
import {IconAlignCenter} from '../../icons/icons/IconAlignCenter';
import {IconAlignRight} from '../../icons/icons/IconAlignRight';
import {IconMenu} from '../../icons/icons/IconMenu';
import {IconViewList} from '../../icons/icons/IconViewList';
import {Text} from '../Text/Text';
import {Inline, Stack} from '../Layout';
import {Card} from '../Card/Card';
import {componentParameters, story, Story} from '../../storybook/meta';

const VARIANTS = [
	'primary',
	'tinted',
	'secondary',
	'danger',
	'danger_tinted',
	'ghost',
] as const;

export default {
	title: 'altum/Components/ButtonGroup',
	component: ButtonGroup,
	tags: ['autodocs'],
	parameters: {
		...componentParameters(
			'Коробка для независимых кнопок: внутрь кладётся `Button`. Склейка и `orientation`. Варианты как у `Button`, кроме `link`. Нажатый пункт — `active` на кнопке.',
		),
	},
	argTypes: {
		size: {
			control: {type: 'select'},
			options: ['sm', 'md', 'lg'],
		},
		orientation: {
			control: {type: 'select'},
			options: ['horizontal', 'vertical'],
		},
		itemFit: {
			control: {type: 'select'},
			options: ['equal', 'content'],
		},
		variant: {
			control: {type: 'select'},
			options: [...VARIANTS],
		},
		disabled: {
			control: 'boolean',
		},
		width: {
			control: {
				type: 'select',
				options: ['auto', 'full'],
			},
		},
	},
} satisfies Meta<typeof ButtonGroup>;

export const Playground: Story<ButtonGroupRootProps> = {
	render: ({size, variant, orientation}) => (
		<ButtonGroup
			size={size}
			variant={variant}
			orientation={orientation}
			aria-label='Навигация'
		>
			<Button prefix={<IconChevronUp />} aria-label='Вверх' />
			<Button prefix={<IconChevronDown />} aria-label='Вниз' />
		</ButtonGroup>
	),
	args: {
		size: 'md',
		variant: 'secondary',
		orientation: 'horizontal',
	},
	parameters: story('Иконки без состояния выбора.'),
};

export const WithLabels: Story<ButtonGroupRootProps> = {
	render: () => (
		<ButtonGroup aria-label='Действия'>
			<Button prefix={<IconViewList />}>
				Список
			</Button>
			<Button prefix={<IconMenu />}>
				Меню
			</Button>
			<Button prefix={<IconAlignLeft />}>
				Слева
			</Button>
		</ButtonGroup>
	),
	parameters: story('Иконка + подпись.'),
};

export const Orientation: Story<ButtonGroupRootProps> = {
	render: () => (
		<Inline gap='lg' align='start'>
			<ButtonGroup aria-label='Ряд' orientation='horizontal'>
				<Button prefix={<IconAlignLeft />} aria-label='Слева' />
				<Button prefix={<IconAlignCenter />} aria-label='По центру' />
				<Button prefix={<IconAlignRight />} aria-label='Справа' />
			</ButtonGroup>
			<ButtonGroup aria-label='Колонка' orientation='vertical'>
				<Button prefix={<IconAlignLeft />} aria-label='Слева' />
				<Button prefix={<IconAlignCenter />} aria-label='По центру' />
				<Button prefix={<IconAlignRight />} aria-label='Справа' />
			</ButtonGroup>
		</Inline>
	),
	parameters: story('`orientation`: ряд и колонка. Кнопки друг друга не выбирают.'),
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
	render: () => (
		<Stack gap='md' style={{maxWidth: 560}}>
			<div>
				<Text size='sm'>
					itemFit=&quot;equal&quot;
				</Text>
				<ButtonGroup
					width='full'
					itemFit='equal'
					aria-label='Equal'
				>
					{FIT_OPTIONS.map((option) => (
						<Button key={option.value}>
							{option.label}
						</Button>
					))}
				</ButtonGroup>
			</div>
			<div>
				<Text size='sm'>
					itemFit=&quot;content&quot;
				</Text>
				<ButtonGroup
					width='full'
					itemFit='content'
					aria-label='Content'
				>
					{FIT_OPTIONS.map((option) => (
						<Button key={option.value}>
							{option.label}
						</Button>
					))}
				</ButtonGroup>
			</div>
		</Stack>
	),
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
						<Button>
							One
						</Button>
						<Button>
							Two
						</Button>
						<Button>
							Three
						</Button>
					</ButtonGroup>
				</div>
			))}
		</Stack>
	),
	parameters: story('Все варианты заливки трека.'),
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
						<Button>
							One
						</Button>
						<Button>
							Two
						</Button>
						<Button prefix={<IconMenu />} aria-label='Меню' />
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
			<Button>
				One
			</Button>
			<Button>
				Two
			</Button>
			<Button>
				Three
			</Button>
		</ButtonGroup>
	),
	parameters: story('`disabled` на корне блокирует все пункты.'),
};

export const Danger: Story<ButtonGroupRootProps> = {
	render: () => (
		<Stack gap='md'>
			<ButtonGroup
				variant='danger'
				aria-label='Опасные действия'
			>
				<Button>
					Удалить
				</Button>
				<Button>
					Архив
				</Button>
			</ButtonGroup>
			<ButtonGroup
				variant='danger_tinted'
				aria-label='Опасные действия, приглушённо'
			>
				<Button>
					Удалить
				</Button>
				<Button>
					Архив
				</Button>
			</ButtonGroup>
		</Stack>
	),
	parameters: story('`variant="danger"` и `danger_tinted`.'),
};

export const Interaction: Story<ButtonGroupRootProps> = {
	render: function InteractionRender() {
		const [pressed, setPressed] = useState('left');
		return (
			<Stack gap='sm'>
				<ButtonGroup aria-label='Выравнивание'>
					<Button
						prefix={<IconAlignLeft />}
						aria-label='Слева'
						active={pressed === 'left'}
						onClick={() => setPressed('left')}
					/>
					<Button
						prefix={<IconAlignCenter />}
						aria-label='По центру'
						active={pressed === 'center'}
						onClick={() => setPressed('center')}
					/>
					<Button
						prefix={<IconAlignRight />}
						aria-label='Справа'
						active={pressed === 'right'}
						onClick={() => setPressed('right')}
					/>
				</ButtonGroup>
				<Text size='sm' color='muted'>
					{pressed}
				</Text>
			</Stack>
		);
	},
	play: async ({canvasElement}) => {
		const center = canvasElement.querySelector('[aria-label="По центру"]') as HTMLButtonElement | null;
		center?.click();
		center?.focus();
	},
	parameters: story('Play жмёт «По центру». Нажатая кнопка — `active`, подпись снаружи.'),
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
						<ButtonGroup size='sm' aria-label='Вид'>
							<Button
								prefix={<IconViewList />}
								aria-label='Список'
								active={view === 'list'}
								onClick={() => setView('list')}
							/>
							<Button
								prefix={<IconMenu />}
								aria-label='Сетка'
								active={view === 'menu'}
								onClick={() => setView('menu')}
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
	parameters: story('Кнопки вида в шапке карточки. Нажатая — `active`.'),
};
