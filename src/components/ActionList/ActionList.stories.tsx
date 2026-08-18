import type {Meta} from '@storybook/react';
import React, {useMemo, useState} from 'react';
import {ActionList} from './ActionList';
import type {ActionListGroup, ActionListRootProps} from './ActionList.types';
import {componentParameters, story, Story} from '../../storybook/meta';

const GROUPS: ActionListGroup[] = [
	{
		id: 'nav',
		label: 'Навигация',
		items: [
			{
				id: 'inbox',
				label: 'Входящие',
				description: 'Открыть список задач',
				shortcut: 'G I',
				onSelect: () => {},
			},
			{
				id: 'today',
				label: 'Сегодня',
				shortcut: 'G T',
				onSelect: () => {},
			},
		],
	},
	{
		id: 'actions',
		label: 'Действия',
		items: [
			{
				id: 'new',
				label: 'Новая задача',
				keywords: ['create', 'add'],
				shortcut: 'N',
				onSelect: () => {},
			},
			{
				id: 'search',
				label: 'Поиск',
				shortcut: '⌘K',
				onSelect: () => {},
			},
			{
				id: 'disabled',
				label: 'Недоступно',
				disabled: true,
				onSelect: () => {},
			},
		],
	},
];

export default {
	title: 'altum/Components/ActionList',
	component: ActionList,
	tags: ['autodocs'],
	parameters: {
		...componentParameters(
			'Клавиатурный список действий на базе Listbox + SearchField.',
		),
		controls: {exclude: ['groups', 'onAction', 'onQueryChange']},
	},
} satisfies Meta<typeof ActionList>;

export const Playground: Story<ActionListRootProps> = {
	render: function PlaygroundRender() {
		const [last, setLast] = useState('—');
		const groups = useMemo(() => GROUPS.map((group) => ({
			...group,
			items: group.items.map((item) => ({
				...item,
				onSelect: () => setLast(String(item.label)),
			})),
		})), []);

		return (
			<div style={{
				maxWidth: 420,
				border: '1px solid var(--altum-color-dropdown-border)',
				borderRadius: 'var(--altum-g-radius)',
				overflow: 'hidden',
			}}
			>
				<ActionList.Root onAction={(item) => setLast(String(item.label))}>
					<ActionList.Search />
					{groups.map((group) => (
						<ActionList.Group key={group.id} id={group.id}>
							<ActionList.GroupLabel>
								{group.label}
							</ActionList.GroupLabel>
							{group.items.map((item) => <ActionList.Item key={item.id} {...item} />)}
						</ActionList.Group>
					))}
				</ActionList.Root>
				<div style={{
					padding: 'var(--altum-g-space-2) var(--altum-g-space-3)',
					borderTop: '1px solid var(--altum-color-dropdown-border)',
					fontSize: 12,
					color: 'var(--altum-color-muted)',
				}}
				>
					Выбрано:
					{' '}
					{last}
				</div>
			</div>
		);
	},
	parameters: story('SearchField-фильтр; Listbox groups; стрелки / Home / End / Enter.'),
};

export const WithStaticList: Story<ActionListRootProps> = {
	render: function WithoutFilterRender() {
		const [last, setLast] = useState('—');
		const groups = useMemo(() => GROUPS.map((group) => ({
			...group,
			items: group.items.map((item) => ({
				...item,
				onSelect: () => setLast(String(item.label)),
			})),
		})), []);

		return (
			<div style={{
				maxWidth: 420,
				border: '1px solid var(--altum-color-dropdown-border)',
				borderRadius: 'var(--altum-g-radius)',
				overflow: 'hidden',
			}}
			>
				<ActionList.Root onAction={(item) => setLast(String(item.label))}>
					{groups.map((group) => (
						<ActionList.Group key={group.id} id={group.id}>
							<ActionList.GroupLabel>
								{group.label}
							</ActionList.GroupLabel>
							{group.items.map((item) => <ActionList.Item key={item.id} {...item} />)}
						</ActionList.Group>
					))}
				</ActionList.Root>
				<div style={{
					padding: 'var(--altum-g-space-2) var(--altum-g-space-3)',
					borderTop: '1px solid var(--altum-color-dropdown-border)',
					fontSize: 12,
					color: 'var(--altum-color-muted)',
				}}
				>
					Выбрано:
					{' '}
					{last}
				</div>
			</div>
		);
	},
	parameters: story('Без SearchField — только группы и disabled-пункт.'),
};
