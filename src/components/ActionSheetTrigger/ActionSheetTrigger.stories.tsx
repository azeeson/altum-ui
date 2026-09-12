import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {ActionSheetTrigger, type ActionSheetTriggerProps} from './ActionSheetTrigger';
import {Overflow} from '../Overflow/Overflow';
import {Item} from '../Item/Item';
import {Stack} from '../Layout/Layout';
import {Text} from '../Text/Text';
import {Card} from '../Card/Card';
import {IconCopy} from '../../icons/icons/IconCopy';
import {IconTrash} from '../../icons/icons/IconTrash';
import {componentParameters, story, Story} from '../../storybook/meta';

export default {
	title: 'altum/Components/ActionSheetTrigger',
	component: ActionSheetTrigger,
	tags: ['autodocs'],
	parameters: componentParameters(
		'Обёртка: long-press открывает вложенный Overflow. На touch+mobile скрывает кнопку ⋯. Публичный шорткат — `Overflow longPress`.',
	),
	argTypes: {
		showOverflowTrigger: {
			control: 'boolean',
			description: 'Показать кнопку ⋯ даже на touch+mobile',
		},
		longPressMs: {
			control: 'number',
			description: 'Задержка long-press, мс',
		},
		moveThreshold: {
			control: 'number',
			description: 'Порог смещения (px) для отмены жеста',
		},
		disabled: {
			control: 'boolean',
		},
	},
} satisfies Meta<typeof ActionSheetTrigger>;

export const Playground: Story<ActionSheetTriggerProps> = {
	render: function PlaygroundRender(args) {
		const [log, setLog] = useState('—');
		return (
			<Stack gap='md' style={{maxWidth: 360}}>
				<Text size='sm' color='muted'>
					Зажмите карточку. На узком экране / touch эмулируйте device toolbar — ⋯ исчезнет,
					меню откроется long-press.
				</Text>
				<ActionSheetTrigger {...args}>
					<Item
						title='Карточка задачи'
						description='Зажмите, чтобы открыть меню'
					/>
					<Overflow
						visibleCount={0}
						display='icon'
					>
						<Overflow.Item
							icon={<IconCopy size={16} />}
							label='Дублировать'
							onSelect={() => setLog('Дублировать')}
						/>
						<Overflow.Item
							icon={<IconTrash size={16} />}
							label='Удалить'
							onSelect={() => setLog('Удалить')}
						/>
					</Overflow>
				</ActionSheetTrigger>
				<Text size='sm' color='muted'>
					Действие:
					{' '}
					{log}
				</Text>
			</Stack>
		);
	},
	args: {
		showOverflowTrigger: false,
		longPressMs: 500,
		disabled: false,
	},
	parameters: story('`ActionSheetTrigger` + `Overflow`: long-press по хосту открывает меню.'),
};

export const WithDesktopOverflow: Story<ActionSheetTriggerProps> = {
	render: function DesktopOverflowRender() {
		const [log, setLog] = useState('—');
		return (
			<Stack gap='md' style={{maxWidth: 360}}>
				<Text size='sm' color='muted'>
					`showOverflowTrigger` — кнопка ⋯ всегда видна.
				</Text>
				<ActionSheetTrigger showOverflowTrigger>
					<Item
						title='Заметка'
						description='На десктопе откройте ⋯'
					/>
					<Overflow
						visibleCount={0}
						display='icon'
					>
						<Overflow.Item
							icon={<IconCopy size={16} />}
							label='Копировать'
							onSelect={() => setLog('Копировать')}
						/>
						<Overflow.Item
							icon={<IconTrash size={16} />}
							label='Удалить'
							onSelect={() => setLog('Удалить')}
						/>
					</Overflow>
				</ActionSheetTrigger>
				<Text size='sm' color='muted'>
					Действие:
					{' '}
					{log}
				</Text>
			</Stack>
		);
	},
	parameters: story('`showOverflowTrigger` — кнопка ⋯ всегда видна.'),
};

export const Disabled: Story<ActionSheetTriggerProps> = {
	render: () => (
		<ActionSheetTrigger disabled>
			<Item
				title='Заблокировано'
				description='Long-press не открывает меню'
			/>
			<Overflow
				visibleCount={0}
				display='icon'
			>
				<Overflow.Item
					icon={<IconCopy size={16} />}
					label='Копировать'
				/>
			</Overflow>
		</ActionSheetTrigger>
	),
	parameters: story('`disabled` отменяет long-press.'),
};

export const UsageExample: Story<ActionSheetTriggerProps> = {
	render: function UsageExampleRender() {
		const [log, setLog] = useState('—');
		return (
			<Card style={{maxWidth: 400}}>
				<Stack gap='md'>
					<Text weight='bold'>
						Список задач
					</Text>
					<Text size='sm' color='muted'>
						Каноничный API: `Overflow longPress` сам оборачивает хост в ActionSheetTrigger.
					</Text>
					<Overflow
						longPress
						visibleCount={0}
						display='icon'
					>
						<Item
							title='Подготовить релиз'
							description='Зажмите строку'
						/>
						<Overflow.Item
							icon={<IconCopy size={16} />}
							label='Дублировать'
							onSelect={() => setLog('Дублировать')}
						/>
						<Overflow.Item
							icon={<IconTrash size={16} />}
							label='Удалить'
							onSelect={() => setLog('Удалить')}
						/>
					</Overflow>
					<Text size='sm' color='muted'>
						Действие:
						{' '}
						{log}
					</Text>
				</Stack>
			</Card>
		);
	},
	parameters: story('Рекомендуемый юзкейс: `Overflow longPress` внутри карточки списка.'),
};
