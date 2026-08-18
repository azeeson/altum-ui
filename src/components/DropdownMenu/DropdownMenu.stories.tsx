import type {Meta} from '@storybook/react';
import React, {useMemo, useState} from 'react';
import {DropdownMenu, DropdownMenuProps} from './DropdownMenu';
import {ContextMenu} from '../ContextMenu/ContextMenu';
import {ButtonIcon} from '../ButtonIcon/ButtonIcon';
import {Button} from '../Button/Button';
import {Card} from '../Card/Card';
import {Text} from '../Text/Text';
import {IconMenu} from '../../icons/icons/IconMenu';
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

export default {
	title: 'altum-ui/Components/DropdownMenu',
	component: DropdownMenu,
	tags: ['autodocs'],
	parameters: componentParameters(
		'Готовое меню: Dropdown + ActionList. ContextMenu — по правому клику.',
	),
} satisfies Meta<typeof DropdownMenu>;

export const Playground: Story<DropdownMenuProps> = {
	render: function PlaygroundRender() {
		const [last, setLast] = useState('—');
		const groups = useMemo(() => BASE_GROUPS, []);

		return (
			<div style={{
				display: 'flex',
				alignItems: 'center',
				gap: 16
			}}
			>
				<DropdownMenu
					trigger={(
						<ButtonIcon
							aria-label='Меню действий'
							icon={<IconMenu size={18} />}
						/>
					)}
					groups={groups}
					onAction={(item) => setLast(String(item.label))}
				/>
				<Text size='sm' color='secondary'>
					Выбрано:
					{' '}
					{last}
				</Text>
			</div>
		);
	},
	parameters: story('Меню по клику на ⋯.'),
};

export const WithContextMenu: Story<DropdownMenuProps> = {
	render: function ContextMenuRender() {
		const [last, setLast] = useState('—');

		return (
			<div style={{maxWidth: 360}}>
				<ContextMenu
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
				</ContextMenu>
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
	parameters: story('ContextMenu по ПКМ.'),
};
