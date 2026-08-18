import type {Meta} from '@storybook/react';
import React, {useMemo, useState} from 'react';
import {CommandPalette, CommandPaletteRootProps} from './CommandPalette';
import {ActionList} from '../ActionList/ActionList';
import type {ActionListGroup} from '../ActionList/ActionList.types';
import {Button} from '../Button/Button';
import {componentParameters, story, Story} from '../../storybook/meta';

export default {
	title: 'altum-ui/Components/CommandPalette',
	component: CommandPalette,
	tags: ['autodocs'],
	parameters: {
		...componentParameters(
			'Командная палитра: поиск + группированный ActionList, FocusTrap, Escape.',
		),
		controls: {exclude: ['onClose']},
	},
} satisfies Meta<typeof CommandPalette>;

export const Playground: Story<CommandPaletteRootProps> = {
	render: function PlaygroundRender() {
		const [open, setOpen] = useState(false);
		const [last, setLast] = useState('—');

		const groups: ActionListGroup[] = useMemo(() => [
			{
				id: 'files',
				label: 'Файлы',
				items: [
					{
						id: 'open',
						label: 'Открыть файл',
						shortcut: '⌘O',
						onSelect: () => setLast('Открыть файл'),
					},
					{
						id: 'save',
						label: 'Сохранить',
						shortcut: '⌘S',
						onSelect: () => setLast('Сохранить'),
					},
				],
			},
			{
				id: 'edit',
				label: 'Правка',
				items: [
					{
						id: 'undo',
						label: 'Отменить',
						shortcut: '⌘Z',
						onSelect: () => setLast('Отменить'),
					},
					{
						id: 'find',
						label: 'Найти…',
						keywords: ['search', 'filter'],
						onSelect: () => setLast('Найти'),
					},
				],
			},
		], []);

		return (
			<div style={{
				display: 'flex',
				flexDirection: 'column',
				gap: 'var(--altum-g-space-3)'
			}}
			>
				<Button
					variant='primary'
					size='sm'
					onClick={() => setOpen(true)}
				>
					Открыть палитру
				</Button>
				<div style={{
					fontSize: 13,
					color: 'var(--altum-color-muted)'
				}}
				>
					Последняя команда:
					{' '}
					{last}
				</div>
				<CommandPalette.Root open={open} onClose={() => setOpen(false)}>
					<CommandPalette.Input />
					<CommandPalette.List>
						{groups.map((group) => (
							<ActionList.Group key={group.id} id={group.id}>
								<ActionList.GroupLabel>
									{group.label}
								</ActionList.GroupLabel>
								{group.items.map((item) => <ActionList.Item key={item.id} {...item} />)}
							</ActionList.Group>
						))}
					</CommandPalette.List>
				</CommandPalette.Root>
			</div>
		);
	},
	parameters: story(
		'⌘K-паттерн: один combobox в шапке фильтрует список (без второго Filter…).',
	),
};

export const WithCustomPlaceholder: Story<CommandPaletteRootProps> = {
	render: function CustomPlaceholderRender() {
		const [open, setOpen] = useState(true);
		const groups: ActionListGroup[] = useMemo(() => [
			{
				id: 'nav',
				label: 'Навигация',
				items: [
					{
						id: 'home',
						label: 'Главная',
						onSelect: () => {},
					},
					{
						id: 'settings',
						label: 'Настройки',
						onSelect: () => {},
					},
				],
			},
		], []);

		return (
			<CommandPalette.Root
				open={open}
				onClose={() => setOpen(false)}
				title='Быстрые команды'
			>
				<CommandPalette.Input placeholder='Введите команду или раздел…' />
				<CommandPalette.List>
					{groups.map((group) => (
						<ActionList.Group key={group.id} id={group.id}>
							<ActionList.GroupLabel>
								{group.label}
							</ActionList.GroupLabel>
							{group.items.map((item) => <ActionList.Item key={item.id} {...item} />)}
						</ActionList.Group>
					))}
				</CommandPalette.List>
			</CommandPalette.Root>
		);
	},
	parameters: story('Кастомные `title` и `placeholder`.'),
};
