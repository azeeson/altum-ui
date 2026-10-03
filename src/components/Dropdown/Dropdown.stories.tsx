import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {Dropdown, type DropdownProps} from './Dropdown';
import {Button} from '../Button/Button';
import {Text} from '../Text/Text';
import {Stack} from '../Layout';
import {ActionList} from '../ActionList/ActionList';
import type {ActionListItem} from '../ActionList/ActionList.types';
import {componentParameters, story, Story} from '../../storybook/meta';

const MENU_ITEMS: ActionListItem[] = [
	{
		id: 'open',
		label: 'Открыть',
		shortcut: '↵',
	},
	{
		id: 'rename',
		label: 'Переименовать',
	},
	{
		id: 'delete',
		label: 'Удалить',
		shortcut: '⌫',
	},
];

export default {
	title: 'altum/Components/Dropdown',
	component: Dropdown,
	tags: ['autodocs'],
	parameters: {
		...componentParameters('Список или меню у кнопки. Выбор пункта закрывает панель. На экранах ≤768px — Sheet.'),
		controls: {
			exclude: [
				'children',
				'trigger',
				'onOpenChange',
				'boxProps'
			],
		},
	},
	argTypes: {
		widthMode: {
			control: 'select',
			options: ['content', 'trigger', 'trigger-fit'],
		},
		align: {
			control: 'select',
			options: [
				'auto',
				'start',
				'center',
				'end'
			],
		},
		triggerMode: {
			control: 'select',
			options: ['toggle', 'combobox'],
		},
		popupRole: {
			control: 'select',
			options: [
				'none',
				'menu',
				'listbox',
				'dialog'
			],
		},
		panelScroll: {
			control: 'select',
			options: ['overlay', 'content'],
		},
		mobileTitle: {control: 'text'},
		onOpenChange: {action: 'onOpenChange'},
	},
} satisfies Meta<typeof Dropdown>;

export const Playground: Story<DropdownProps> = {
	render: (args) => (
		<Dropdown
			widthMode={args.widthMode ?? 'content'}
			align={args.align}
			triggerMode={args.triggerMode}
			popupRole={args.popupRole}
			panelScroll={args.panelScroll}
			mobileTitle={args.mobileTitle ?? 'Меню'}
			trigger={(props, ref) => (
				<Button
					variant='primary'
					{...props}
					rootRef={ref}
				>
					Открыть ▼
				</Button>
			)}
		>
			<div style={{padding: '12px'}}>
				<Text size='sm'>
					Содержимое выпадающей панели
				</Text>
			</div>
		</Dropdown>
	),
	args: {
		widthMode: 'content',
		align: 'auto',
		triggerMode: 'toggle',
		popupRole: 'none',
		mobileTitle: 'Меню',
	},
	parameters: story('Используйте панель Controls для настройки.'),
};

export const WithWidthModes: Story<DropdownProps> = {
	render: () => (
		<Stack gap='xl' style={{maxWidth: 400}}>
			<div>
				<Text weight='bold'>
					Ширина по контенту (widthMode=&quot;content&quot;)
				</Text>
				<Dropdown
					widthMode='content'
					trigger={(props, ref) => (
						<Button
							variant='primary'
							{...props}
							rootRef={ref}
						>
							Узкая кнопка и широкий контент ▼
						</Button>
					)}
				>
					<div style={{padding: '12px'}}>
						<Text size='sm' weight='medium'>
							Очень широкий контент, который шире самой кнопки!
						</Text>
					</div>
				</Dropdown>
			</div>
			<div>
				<Text weight='bold'>
					Ширина по триггеру (widthMode=&quot;trigger&quot;)
				</Text>
				<Dropdown
					widthMode='trigger'
					trigger={(props, ref) => (
						<Button
							variant='secondary'
							{...props}
							rootRef={ref}
						>
							Широкий элемент-триггер ▼
						</Button>
					)}
				>
					<div style={{padding: '12px'}}>
						<Text size='sm'>
							Опция А
						</Text>
					</div>
				</Dropdown>
			</div>
		</Stack>
	),
	parameters: story('Сравнение режимов ширины выпадающей панели.'),
};

export const Alignments: Story<DropdownProps> = {
	render: () => (
		<Stack gap='md' align='start'>
			{(['left', 'center', 'right'] as const).map((align) => (
				<Dropdown
					key={align}
					align={align}
					widthMode='content'
					trigger={(props, ref) => (
						<Button
							variant='secondary'
							{...props}
							rootRef={ref}
						>
							align=
							{align}
						</Button>
					)}
				>
					<div style={{
						padding: 12,
						minWidth: 180
					}}
					>
						<Text size='sm'>
							Панель
							{' '}
							{align}
						</Text>
					</div>
				</Dropdown>
			))}
		</Stack>
	),
	parameters: story('Выравнивание панели: left / center / right.'),
};

export const Opened: Story<DropdownProps> = {
	render: () => (
		<Dropdown
			defaultOpen
			widthMode='content'
			mobileTitle='Меню'
			trigger={(props, ref) => (
				<Button
					variant='primary'
					{...props}
					rootRef={ref}
				>
					Панель открыта
				</Button>
			)}
		>
			<div style={{padding: 12}}>
				<Text size='sm'>
					Состояние open для визуальной регрессии.
				</Text>
			</div>
		</Dropdown>
	),
	parameters: story('`defaultOpen` — панель сразу видна.'),
};

export const Disabled: Story<DropdownProps> = {
	render: () => (
		<Dropdown
			trigger={(props, ref) => (
				<Button
					variant='secondary'
					{...props}
					rootRef={ref}
					disabled
				>
					Недоступно
				</Button>
			)}
		>
			<div style={{padding: 12}}>
				<Text size='sm'>
					Панель не откроется
				</Text>
			</div>
		</Dropdown>
	),
	parameters: story('Заблокированный триггер не открывает панель.'),
};

export const OverflowText: Story<DropdownProps> = {
	render: () => (
		<Dropdown
			widthMode='trigger'
			trigger={(props, ref) => (
				<Button
					variant='secondary'
					{...props}
					rootRef={ref}
				>
					Короткий триггер
				</Button>
			)}
		>
			<div style={{padding: 12}}>
				<Text size='sm'>
					Очень длинное содержимое выпадающей панели которое шире кнопки
					и проверяет перенос текста внутри панели.
				</Text>
			</div>
		</Dropdown>
	),
	parameters: story('Длинный текст в панели с widthMode=trigger.'),
};

export const UsageExample: Story<DropdownProps> = {
	render: function UsageExampleRender() {
		const [last, setLast] = useState('—');
		return (
			<Stack gap='sm' align='start'>
				<Dropdown
					popupRole='menu'
					widthMode='content'
					mobileTitle='Действия'
					trigger={(props, ref) => (
						<Button
							variant='secondary'
							{...props}
							rootRef={ref}
						>
							Действия
						</Button>
					)}
				>
					<ActionList
						items={MENU_ITEMS}
						onAction={(item) => setLast(String(item.label))}
					/>
				</Dropdown>
				<Text size='sm' color='muted'>
					Выбрано:
					{' '}
					{last}
				</Text>
			</Stack>
		);
	},
	parameters: story('Dropdown + ActionList — типичное меню действий.'),
};

export const Interaction: Story<DropdownProps> = {
	render: () => (
		<Dropdown
			widthMode='content'
			mobileTitle='Меню'
			trigger={(props, ref) => (
				<Button
					variant='primary'
					{...props}
					rootRef={ref}
				>
					Открыть меню
				</Button>
			)}
		>
			<div style={{padding: 12}}>
				<Text size='sm'>
					Панель открыта сценарием play
				</Text>
			</div>
		</Dropdown>
	),
	play: async ({canvasElement}) => {
		const trigger = canvasElement.querySelector('button');
		trigger?.click();
	},
	parameters: story('Play: клик по триггеру открывает панель.'),
};
