import type {Meta} from '@storybook/react';
import React, {useMemo, useState} from 'react';
import {ContextMenu, ContextMenuProps} from './ContextMenu';
import {Card} from '../Card/Card';
import {Text} from '../Text/Text';
import {Button} from '../Button/Button';
import type {ActionListGroup} from '../ActionList/ActionList.types';
import {componentParameters, story, Story} from '../../storybook/meta';

const BASE_GROUPS: ActionListGroup[] = [
	{
		id: 'edit',
		label: 'Правка',
		items: [
			{
				id: 'rename',
				label: 'Переименовать',
				shortcut: '↵'
			},
			{
				id: 'duplicate',
				label: 'Дублировать',
				shortcut: '⌘D'
			},
			{
				id: 'delete',
				label: 'Удалить',
				shortcut: '⌫'
			},
		],
	},
	{
		id: 'share',
		label: 'Поделиться',
		items: [
			{
				id: 'copy-link',
				label: 'Копировать ссылку'
			},
			{
				id: 'export',
				label: 'Экспорт'
			},
		],
	},
];

const FILTERABLE_GROUPS: ActionListGroup[] = [
	{
		id: 'actions',
		label: 'Действия',
		items: [
			{
				id: 'inbox',
				label: 'Входящие',
				keywords: ['mail', 'email'],
				shortcut: 'G I',
			},
			{
				id: 'today',
				label: 'Сегодня',
				keywords: ['calendar', 'day'],
				shortcut: 'G T',
			},
			{
				id: 'search',
				label: 'Поиск',
				keywords: ['find', 'query'],
				shortcut: '⌘K',
			},
			{
				id: 'archive',
				label: 'Архив',
				keywords: ['storage', 'old'],
			},
			{
				id: 'settings',
				label: 'Настройки',
				keywords: ['preferences', 'config'],
			},
		],
	},
];

export default {
	title: 'altum-ui/Components/ContextMenu',
	component: ContextMenu,
	tags: ['autodocs'],
	parameters: componentParameters(
		'Контекстное меню по правому клику: ActionList в портале у курсора.',
	),
} satisfies Meta<typeof ContextMenu>;

export const Playground: Story<ContextMenuProps> = {
	render: function PlaygroundRender() {
		const [last, setLast] = useState('—');
		const groups = useMemo(() => BASE_GROUPS, []);

		return (
			<div style={{maxWidth: 360}}>
				<ContextMenu
					groups={groups}
					onAction={(item) => setLast(String(item.label))}
				>
					<Card>
						<Text>
							Правый клик по этой области откроет контекстное меню.
						</Text>
						<Text size='sm' color='secondary'>
							Последнее действие:
							{' '}
							{last}
						</Text>
					</Card>
				</ContextMenu>
				<div style={{marginTop: 'var(--altum-g-space-3)'}}>
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
	parameters: story('ПКМ по поверхности — меню у курсора.'),
};

export const WithFilterable: Story<ContextMenuProps> = {
	render: function FilterableRender() {
		const [last, setLast] = useState('—');

		return (
			<div style={{maxWidth: 360}}>
				<ContextMenu
					groups={FILTERABLE_GROUPS}
					filterable
					emptyText='Ничего не найдено'
					onAction={(item) => setLast(String(item.label))}
				>
					<Card>
						<Text>
							ПКМ и начните ввод в SearchField — список фильтруется.
						</Text>
						<Text size='sm' color='secondary'>
							Выбрано:
							{' '}
							{last}
						</Text>
					</Card>
				</ContextMenu>
			</div>
		);
	},
	parameters: story('`filterable` — поиск по label и keywords в ActionList.'),
};
