import type {Meta} from '@storybook/react';
import React, {useMemo, useState} from 'react';
import {CommandPalette, type CommandPaletteProps} from './CommandPalette';
import type {ActionListGroup, ActionListItem} from '../ActionList/ActionList.types';
import {Button} from '../Button/Button';
import {Kbd, KbdGroup} from '../Kbd/Kbd';
import {Inline, Stack} from '../Layout';
import {Text} from '../Text/Text';
import {componentParameters, story, Story} from '../../storybook/meta';

const GROUPS: ActionListGroup[] = [
	{
		id: 'files',
		label: 'Файлы'
	},
	{
		id: 'edit',
		label: 'Правка'
	},
];

export default {
	title: 'altum/Components/CommandPalette',
	component: CommandPalette,
	tags: ['autodocs'],
	parameters: {
		...componentParameters(
			'Командная палитра: SearchField + Listbox. Закрытие — Escape у dialog.',
		),
		controls: {exclude: ['items', 'groups']},
	},
	argTypes: {
		open: {
			control: 'boolean',
			description: 'Открыта ли палитра',
		},
		title: {
			control: 'text',
			description: 'Заголовок диалога',
		},
		placeholder: {
			control: 'text',
			description: 'Плейсхолдер фильтра',
		},
		emptyText: {
			control: 'text',
			description: 'Текст пустого результата',
		},
		onOpenChange: {
			action: 'onOpenChange',
		},
		onAction: {
			action: 'onAction',
		},
	},
} satisfies Meta<typeof CommandPalette>;

function PaletteDemo({
	title,
	placeholder,
	emptyText,
	footer,
	disabledFind = false,
}: Pick<CommandPaletteProps, 'title' | 'placeholder' | 'emptyText' | 'footer'> & {
	disabledFind?: boolean;
}) {
	const [open, setOpen] = useState(false);
	const [last, setLast] = useState('—');
	const items: ActionListItem[] = useMemo(() => [
		{
			id: 'open',
			groupId: 'files',
			label: 'Открыть файл',
			shortcut: '⌘O',
			onSelect: () => setLast('Открыть файл'),
		},
		{
			id: 'save',
			groupId: 'files',
			label: 'Сохранить',
			shortcut: '⌘S',
			onSelect: () => setLast('Сохранить'),
		},
		{
			id: 'undo',
			groupId: 'edit',
			label: 'Отменить',
			shortcut: '⌘Z',
			onSelect: () => setLast('Отменить'),
		},
		{
			id: 'find',
			groupId: 'edit',
			label: 'Найти…',
			keywords: ['search', 'filter'],
			disabled: disabledFind,
			onSelect: () => setLast('Найти'),
		},
	], [disabledFind]);

	return (
		<Stack gap='sm'>
			<Button
				variant='primary'
				size='sm'
				onClick={() => setOpen(true)}
			>
				Открыть палитру
			</Button>
			<Text size='sm' color='muted'>
				Последняя команда:
				{' '}
				{last}
			</Text>
			<CommandPalette
				open={open}
				onOpenChange={setOpen}
				items={items}
				groups={GROUPS}
				title={title}
				placeholder={placeholder}
				emptyText={emptyText}
				footer={footer}
				onAction={(item) => setLast(String(item.label))}
			/>
		</Stack>
	);
}

export const Playground: Story<CommandPaletteProps> = {
	render: function PlaygroundRender(args) {
		return (
			<PaletteDemo
				title={args.title}
				placeholder={args.placeholder}
				emptyText={args.emptyText}
			/>
		);
	},
	args: {
		title: 'Команды',
		placeholder: 'Искать команду…',
		emptyText: 'Ничего не найдено',
	},
	parameters: story(
		'⌘K-паттерн: один combobox в шапке фильтрует список.',
	),
};

export const WithCustomPlaceholder: Story<CommandPaletteProps> = {
	render: function CustomPlaceholderRender() {
		const [open, setOpen] = useState(true);
		const groups: ActionListGroup[] = useMemo(() => [
			{
				id: 'nav',
				label: 'Навигация'
			},
		], []);
		const items: ActionListItem[] = useMemo(() => [
			{
				id: 'home',
				groupId: 'nav',
				label: 'Главная',
				onSelect: () => {},
			},
			{
				id: 'settings',
				groupId: 'nav',
				label: 'Настройки',
				onSelect: () => {},
			},
		], []);

		return (
			<CommandPalette
				open={open}
				onOpenChange={setOpen}
				title='Быстрые команды'
				placeholder='Введите команду или раздел…'
				items={items}
				groups={groups}
			/>
		);
	},
	parameters: story('Кастомные `title` и `placeholder`.'),
};

export const Empty: Story<CommandPaletteProps> = {
	render: function EmptyRender() {
		const [open, setOpen] = useState(true);
		return (
			<CommandPalette
				open={open}
				onOpenChange={setOpen}
				items={[]}
				emptyText='Нет доступных команд'
			/>
		);
	},
	parameters: story('Пустой список команд.'),
};

export const DisabledItem: Story<CommandPaletteProps> = {
	render: () => <PaletteDemo disabledFind />,
	parameters: story('Пункт «Найти…» заблокирован.'),
};

export const OverflowLabels: Story<CommandPaletteProps> = {
	render: function OverflowRender() {
		const [open, setOpen] = useState(true);
		return (
			<CommandPalette
				open={open}
				onOpenChange={setOpen}
				groups={[
					{
						id: 'docs',
						label: 'Документы с очень длинным названием раздела'
					}
				]}
				items={[
					{
						id: 'long',
						groupId: 'docs',
						label: 'Экспортировать ежеквартальный финансовый отчёт в PDF с водяным знаком',
						description: 'Включает приложения, таблицы и подписи ответственных лиц',
						shortcut: '⌘⇧E',
					}
				]}
			/>
		);
	},
	parameters: story('Длинные label / description в строке команды.'),
};

export const Interaction: Story<CommandPaletteProps> = {
	render: () => <PaletteDemo />,
	play: async ({canvasElement}) => {
		const button = canvasElement.querySelector('button');
		if (!(button instanceof HTMLButtonElement)) {
			throw new Error('Не найдена кнопка открытия палитры');
		}
		button.click();
	},
	parameters: story('Play: открывает палитру по клику.'),
};

export const UsageExample: Story<CommandPaletteProps> = {
	render: function UsageExampleRender() {
		return (
			<Stack gap='md'>
				<Inline gap='sm' align='center'>
					<Text size='sm'>
						Быстрые действия
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
				<PaletteDemo
					footer={(
						<Text
							size='xs'
							color='muted'
							style={{
								padding: 'var(--altum-g-space-2) var(--altum-g-space-3)'
							}}
						>
							Enter — выполнить, Esc — закрыть
						</Text>
					)}
				/>
			</Stack>
		);
	},
	parameters: story('Палитра рядом с подсказкой горячих клавиш и футером.'),
};
