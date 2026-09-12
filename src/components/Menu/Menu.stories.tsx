import type {Meta} from '@storybook/react';
import React, {useMemo, useState} from 'react';
import {Menu, type MenuProps} from './Menu';
import {ButtonIcon} from '../ButtonIcon/ButtonIcon';
import {Button} from '../Button/Button';
import {Card} from '../Card/Card';
import {Inline, Stack} from '../Layout/Layout';
import {Text} from '../Text/Text';
import {IconMenu} from '../../icons/icons/IconMenu';
import type {ActionListGroup, ActionListItem} from '../ActionList/ActionList.types';
import {componentParameters, story, Story} from '../../storybook/meta';

const BASE_GROUPS: ActionListGroup[] = [
	{
		id: 'edit',
		label: 'Правка'
	},
	{
		id: 'share',
		label: 'Поделиться'
	},
];

const BASE_ITEMS: ActionListItem[] = [
	{
		id: 'rename',
		groupId: 'edit',
		label: 'Переименовать',
		shortcut: '↵'
	},
	{
		id: 'duplicate',
		groupId: 'edit',
		label: 'Дублировать',
		shortcut: '⌘D'
	},
	{
		id: 'delete',
		groupId: 'edit',
		label: 'Удалить',
		shortcut: '⌫',
		disabled: false,
	},
	{
		id: 'copy-link',
		groupId: 'share',
		label: 'Копировать ссылку'
	},
	{
		id: 'export',
		groupId: 'share',
		label: 'Экспорт'
	},
];

const FILTERABLE_GROUPS: ActionListGroup[] = [
	{
		id: 'actions',
		label: 'Действия'
	},
];

const FILTERABLE_ITEMS: ActionListItem[] = [
	{
		id: 'inbox',
		groupId: 'actions',
		label: 'Входящие',
		keywords: ['mail', 'email'],
		shortcut: 'G I',
	},
	{
		id: 'today',
		groupId: 'actions',
		label: 'Сегодня',
		keywords: ['calendar', 'day'],
		shortcut: 'G T',
	},
	{
		id: 'search',
		groupId: 'actions',
		label: 'Поиск',
		keywords: ['find', 'query'],
		shortcut: '⌘K',
	},
	{
		id: 'archive',
		groupId: 'actions',
		label: 'Архив',
		keywords: ['storage', 'old'],
	},
	{
		id: 'settings',
		groupId: 'actions',
		label: 'Настройки',
		keywords: ['preferences', 'config'],
	},
];

export default {
	title: 'altum/Components/Menu',
	component: Menu,
	tags: ['autodocs'],
	parameters: componentParameters(
		'Меню действий: клик по триггеру или `trigger="context"` (ПКМ / Shift+F10).',
	),
	argTypes: {
		align: {
			control: {
				type: 'select',
				options: [
					'left',
					'center',
					'right',
					'auto'
				],
			},
			description: 'Выравнивание панели относительно триггера',
		},
		widthMode: {
			control: {
				type: 'select',
				options: ['trigger', 'content', 'trigger-fit'],
			},
		},
		filterable: {
			control: 'boolean',
		},
		filterPlaceholder: {
			control: 'text',
		},
		emptyText: {
			control: 'text',
		},
		onOpenChange: {
			action: 'onOpenChange',
		},
		onAction: {
			action: 'onAction',
		},
	},
} satisfies Meta<typeof Menu>;

export const Playground: Story<MenuProps> = {
	render: function PlaygroundRender(args) {
		const [last, setLast] = useState('—');
		const items = useMemo(() => BASE_ITEMS, []);

		return (
			<Inline gap='md' align='center'>
				<Menu
					trigger={(
						<ButtonIcon
							aria-label='Меню действий'
							icon={<IconMenu size={18} />}
						/>
					)}
					items={items}
					groups={BASE_GROUPS}
					align={args.align}
					widthMode={args.widthMode}
					filterable={args.filterable}
					onAction={(item) => setLast(String(item.label))}
				/>
				<Text size='sm' color='secondary'>
					Выбрано:
					{' '}
					{last}
				</Text>
			</Inline>
		);
	},
	args: {
		align: 'right',
		widthMode: 'content',
		filterable: false,
	},
	parameters: story('Меню по клику на иконку.'),
};

export const Context: Story<MenuProps> = {
	render: function ContextRender() {
		const [last, setLast] = useState('—');

		return (
			<div style={{maxWidth: 360}}>
				<Menu
					trigger='context'
					items={BASE_ITEMS}
					groups={BASE_GROUPS}
					onAction={(item) => setLast(String(item.label))}
				>
					<Card>
						<Text>
							Правый клик по карточке откроет контекстное меню.
						</Text>
						<Text size='sm' color='secondary'>
							Последнее действие:
							{' '}
							{last}
						</Text>
					</Card>
				</Menu>
				<div style={{marginTop: 12}}>
					<Button
						variant='secondary'
						size='sm'
						onClick={() => setLast('—')}
					>
						Сбросить
					</Button>
				</div>
			</div>
		);
	},
	parameters: story('`trigger="context"` — меню у курсора по ПКМ.'),
};

export const ContextFilterable: Story<MenuProps> = {
	render: function FilterableRender() {
		const [last, setLast] = useState('—');

		return (
			<div style={{maxWidth: 360}}>
				<Menu
					trigger='context'
					items={FILTERABLE_ITEMS}
					groups={FILTERABLE_GROUPS}
					filterable
					emptyText='Ничего не найдено'
					onAction={(item) => setLast(String(item.label))}
				>
					<Card>
						<Text>
							Правый клик по этой области откроет контекстное меню.
						</Text>
						<Text size='sm' color='secondary'>
							Выбрано:
							{' '}
							{last}
						</Text>
					</Card>
				</Menu>
			</div>
		);
	},
	parameters: story('`filterable` — поиск по label и keywords в ActionList.'),
};

export const DisabledItem: Story<MenuProps> = {
	render: function DisabledRender() {
		const items = useMemo(() => BASE_ITEMS.map((item) => (
			item.id === 'delete' ? {
				...item,
				disabled: true
			} : item
		)), []);
		return (
			<Menu
				trigger={(
					<ButtonIcon
						aria-label='Меню действий'
						icon={<IconMenu size={18} />}
					/>
				)}
				items={items}
				groups={BASE_GROUPS}
			/>
		);
	},
	parameters: story('Пункт «Удалить» заблокирован.'),
};

export const Empty: Story<MenuProps> = {
	render: () => (
		<Menu
			trigger={(
				<ButtonIcon
					aria-label='Меню действий'
					icon={<IconMenu size={18} />}
				/>
			)}
			items={[]}
			emptyText='Нет действий'
			filterable
		/>
	),
	parameters: story('Пустой список действий.'),
};

export const OverflowLabels: Story<MenuProps> = {
	render: () => (
		<Menu
			trigger={(
				<Button size='sm' variant='secondary'>
					Действия
				</Button>
			)}
			items={[
				{
					id: 'long',
					label: 'Экспортировать ежеквартальный финансовый отчёт с приложениями',
					description: 'PDF, водяной знак, подписи ответственных лиц',
					shortcut: '⌘⇧E',
				}
			]}
		/>
	),
	parameters: story('Длинные label / description в пункте меню.'),
};

export const Interaction: Story<MenuProps> = {
	render: Playground.render,
	args: {
		align: 'right',
	},
	play: async ({canvasElement}) => {
		const trigger = canvasElement.querySelector('button[aria-label="Меню действий"]');
		if (!(trigger instanceof HTMLButtonElement)) {
			throw new Error('Не найден триггер Menu');
		}
		trigger.click();
	},
	parameters: story('Play: открывает меню по клику на иконку.'),
};

export const UsageExample: Story<MenuProps> = {
	render: function UsageExampleRender() {
		const [last, setLast] = useState('—');
		return (
			<Card
				variant='outlined'
				header={(
					<Inline
						gap='sm'
						align='center'
						justify='between'
					>
						<Text weight='bold'>
							Отчёт за май
						</Text>
						<Menu
							trigger={(
								<ButtonIcon
									aria-label='Меню действий'
									icon={<IconMenu size={18} />}
									variant='ghost'
									size='sm'
								/>
							)}
							items={BASE_ITEMS}
							groups={BASE_GROUPS}
							onAction={(item) => setLast(String(item.label))}
						/>
					</Inline>
				)}
				style={{maxWidth: 360}}
			>
				<Stack gap='xs'>
					<Text size='sm'>
						12 страниц, без замечаний.
					</Text>
					<Text size='xs' color='muted'>
						Последнее действие:
						{' '}
						{last}
					</Text>
				</Stack>
			</Card>
		);
	},
	parameters: story('Menu в шапке Card — overflow-действия строки.'),
};
