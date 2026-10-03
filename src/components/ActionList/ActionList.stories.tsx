import type {Meta} from '@storybook/react';
import React, {useMemo, useState} from 'react';
import {ActionList} from './ActionList';
import type {ActionListGroup, ActionListItem, ActionListProps} from './ActionList.types';
import {Box} from '../Box/Box';
import {Inline, Stack} from '../Layout';
import {Kbd} from '../Kbd/Kbd';
import {Text} from '../Text/Text';
import {IconInbox} from '../../icons/icons/IconInbox';
import {IconPlus} from '../../icons/icons/IconPlus';
import {IconSearch} from '../../icons/icons/IconSearch';
import {IconCalendar} from '../../icons/icons/IconCalendar';
import {componentParameters, story, Story} from '../../storybook/meta';
import {playClick, playType} from '../../storybook/play';

const GROUPS: ActionListGroup[] = [
	{
		id: 'nav',
		label: 'Навигация'
	},
	{
		id: 'actions',
		label: 'Действия'
	},
];

const ITEMS: ActionListItem[] = [
	{
		id: 'inbox',
		groupId: 'nav',
		label: 'Входящие',
		description: 'Открыть список задач',
		icon: <IconInbox size={16} />,
		shortcut: 'G I',
	},
	{
		id: 'today',
		groupId: 'nav',
		label: 'Сегодня',
		icon: <IconCalendar size={16} />,
		shortcut: 'G T',
	},
	{
		id: 'new',
		groupId: 'actions',
		label: 'Новая задача',
		keywords: ['create', 'add'],
		icon: <IconPlus size={16} />,
		shortcut: 'N',
	},
	{
		id: 'search',
		groupId: 'actions',
		label: 'Поиск',
		icon: <IconSearch size={16} />,
		shortcut: '⌘K',
	},
	{
		id: 'disabled',
		groupId: 'actions',
		label: 'Недоступно',
		disabled: true,
	},
];

function ListFrame({
	children,
	footer,
}: {
	children: React.ReactNode;
	footer?: React.ReactNode;
}) {
	return (
		<Box
			variant='outlined'
			radius='md'
			style={{
				maxWidth: 420,
				overflow: 'hidden'
			}}
		>
			{children}
			{footer}
		</Box>
	);
}

export default {
	title: 'altum/Components/ActionList',
	component: ActionList,
	tags: ['autodocs'],
	parameters: componentParameters(
		'Клавиатурный список действий на базе Listbox: `items` / `groups`, опциональный фильтр.',
	),
	argTypes: {
		filterable: {
			control: 'boolean',
			description: 'Поле фильтра над списком',
		},
		filterPlaceholder: {
			control: 'text',
			description: 'Placeholder / label поля фильтра',
		},
		emptyText: {
			control: 'text',
			description: 'Текст, если ничего не найдено',
		},
		onAction: {
			action: 'action',
			description: 'Выбор пункта',
		},
		onQueryChange: {
			action: 'queryChange',
		},
		onHighlightChange: {
			action: 'highlightChange',
		},
	},
} satisfies Meta<typeof ActionList>;

export const Playground: Story<ActionListProps> = {
	args: {
		filterable: true,
		filterPlaceholder: 'Фильтр команд',
		emptyText: 'Ничего не найдено',
	},
	render: function PlaygroundRender(args) {
		const [last, setLast] = useState('—');
		const items = useMemo(() => ITEMS.map((item) => ({
			...item,
			onSelect: () => setLast(String(item.label)),
		})), []);

		return (
			<Stack gap='sm'>
				<ListFrame
					footer={(
						<Box
							variant='muted'
							radius='none'
							border={false}
							style={{padding: 'var(--altum-g-space-2)'}}
						>
							<Text size='xs' color='muted'>
								Выбрано:
								{' '}
								{last}
							</Text>
						</Box>
					)}
				>
					<ActionList
						{...args}
						items={items}
						groups={GROUPS}
						onAction={(item) => setLast(String(item.label))}
					/>
				</ListFrame>
			</Stack>
		);
	},
	parameters: story('Фильтр; Listbox groups; стрелки / Home / End / Enter. Controls: filterable, placeholder, emptyText.'),
};

export const WithStaticList: Story<ActionListProps> = {
	render: function WithoutFilterRender() {
		const [last, setLast] = useState('—');
		const items = useMemo(() => ITEMS.map((item) => ({
			...item,
			onSelect: () => setLast(String(item.label)),
		})), []);

		return (
			<ListFrame
				footer={(
					<Box
						variant='muted'
						radius='none'
						border={false}
						style={{padding: 'var(--altum-g-space-2)'}}
					>
						<Text size='xs' color='muted'>
							Выбрано:
							{' '}
							{last}
						</Text>
					</Box>
				)}
			>
				<ActionList
					items={items}
					groups={GROUPS}
					onAction={(item) => setLast(String(item.label))}
				/>
			</ListFrame>
		);
	},
	parameters: story('Без фильтра — только группы и disabled-пункт.'),
};

export const Empty: Story<ActionListProps> = {
	render: () => (
		<ListFrame>
			<ActionList
				items={[]}
				filterable
				emptyText='Команд пока нет'
			/>
		</ListFrame>
	),
	parameters: story('Пустой список + кастомный `emptyText`.'),
};

export const OverflowText: Story<ActionListProps> = {
	render: () => (
		<ListFrame>
			<ActionList
				items={[
					{
						id: 'long',
						label: 'Экспортировать все архивные отчёты за последние 24 месяца с вложениями',
						description: 'Файл может быть больше 500 МБ — загрузка начнётся в фоне и придёт письмом',
						shortcut: '⌘⇧E',
					},
					{
						id: 'short',
						label: 'Копия',
						shortcut: '⌘C',
					},
				]}
			/>
		</ListFrame>
	),
	parameters: story('Длинные label / description / shortcut в узкой панели.'),
};

export const Interaction: Story<ActionListProps> = {
	render: function InteractionRender() {
		const [last, setLast] = useState('—');
		return (
			<Stack gap='sm'>
				<ListFrame>
					<ActionList
						items={ITEMS}
						groups={GROUPS}
						filterable
						filterPlaceholder='Фильтр'
						onAction={(item) => setLast(String(item.label))}
					/>
				</ListFrame>
				<Text
					size='xs'
					color='muted'
					data-testid='action-last'
				>
					Выбрано:
					{' '}
					{last}
				</Text>
			</Stack>
		);
	},
	play: async ({canvasElement}) => {
		await playType(canvasElement, 'поиск', 'input[type="search"]');
		await playClick(canvasElement, '[role="option"]');
	},
	parameters: story('Play: ввод в фильтр и клик по найденному пункту.'),
};

export const UsageExample: Story<ActionListProps> = {
	render: function UsageExampleRender() {
		const [last, setLast] = useState('—');
		return (
			<Stack gap='md' style={{maxWidth: 420}}>
				<Inline gap='sm' align='center'>
					<Text size='sm' weight='medium'>
						Командная палитра
					</Text>
					<Kbd>
						⌘K
					</Kbd>
				</Inline>
				<ListFrame>
					<ActionList
						items={ITEMS}
						groups={GROUPS}
						filterable
						filterPlaceholder='Найти действие'
						onAction={(item) => setLast(String(item.label))}
					/>
				</ListFrame>
				<Text size='xs' color='muted'>
					Последнее действие:
					{' '}
					{last}
				</Text>
			</Stack>
		);
	},
	parameters: story('Список в оболочке панели — как внутри CommandPalette / Dropdown.'),
};
