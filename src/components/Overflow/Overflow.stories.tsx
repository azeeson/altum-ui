import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {
	Overflow,
	type OverflowProps,
} from './Overflow';
import {Chip} from '../Chip/Chip';
import {Card} from '../Card/Card';
import {Inline, Stack} from '../Layout';
import {Text} from '../Text/Text';
import {Button} from '../Button/Button';
import {IconCopy} from '../../icons/icons/IconCopy';
import {IconPencil} from '../../icons/icons/IconPencil';
import {IconTrash} from '../../icons/icons/IconTrash';
import {IconExport} from '../../icons/icons/IconExport';
import {IconStar} from '../../icons/icons/IconStar';
import {componentParameters, story, Story} from '../../storybook/meta';
import {playClick} from '../../storybook/play';

const CHIP_LABELS = [
	'React',
	'TypeScript',
	'CSS Modules',
	'Storybook',
	'a11y',
	'Дизайн-токены',
	'Формы',
	'Оверлей',
	'Выпадающий список',
	'Темизация',
];

export default {
	title: 'altum/Components/Overflow',
	component: Overflow,
	tags: ['autodocs'],
	parameters: componentParameters(
		'Лишние пункты за ⋯ в Dropdown. Дети Overflow.Item — панель действий (`visibleCount`, `display`); '
		+ 'произвольные дети — измерение ширины (`fit`, `maxVisible`, `gap`).',
	),
	argTypes: {
		visibleCount: {
			control: {
				type: 'number',
				min: 0,
				max: 8,
			},
			description: 'Сколько Overflow.Item показывать снаружи. 0 — все за ⋯',
		},
		display: {
			control: {
				type: 'select',
				options: ['icon', 'icon-label',],
			},
			description: 'Вид видимых действий',
		},
		size: {
			control: {
				type: 'select',
				options: ['sm', 'md', 'lg',],
			},
			description: 'Размер видимых кнопок и ⋯',
		},
		showOverflowTrigger: {
			control: 'boolean',
			description: 'Показать кнопку ⋯',
		},
		longPress: {
			control: 'boolean',
			description: 'Long-press по хосту открывает меню',
		},
		gap: {
			control: {
				type: 'select',
				options: ['sm', 'md', 'lg',],
			},
			description: 'Промежуток между измеряемыми children',
		},
		fit: {
			control: {
				type: 'select',
				options: ['content', 'container',],
			},
			description: 'Ширина корня в режиме измерения',
		},
		maxVisible: {
			control: 'number',
			description: 'Верхний предел видимых элементов поверх измерения',
		},
		align: {
			control: {
				type: 'select',
				options: [
					'left',
					'center',
					'right',
					'auto',
				],
			},
			description: 'Выравнивание Dropdown в режиме измерения',
		},
		moreLabel: {
			control: 'text',
			description: 'Подпись кнопки ⋯ в режиме измерения',
		},
	},
} satisfies Meta<typeof Overflow>;

function useLog() {
	const [log, setLog] = useState('—');
	const on = (name: string) => () => setLog(name);
	return {
		log,
		on,
	};
}

function actionItems(on: (name: string) => () => void) {
	return (
		<>
			<Overflow.Item
				icon={<IconPencil size={16} />}
				label='Изменить'
				onSelect={on('Изменить')}
			/>
			<Overflow.Item
				icon={<IconCopy size={16} />}
				label='Копировать'
				onSelect={on('Копировать')}
			/>
			<Overflow.Item
				icon={<IconExport size={16} />}
				label='Поделиться'
				onSelect={on('Поделиться')}
			/>
			<Overflow.Item
				icon={<IconTrash size={16} />}
				label='Удалить'
				onSelect={on('Удалить')}
			/>
		</>
	);
}

export const Playground: Story<OverflowProps> = {
	args: {
		visibleCount: 2,
		display: 'icon-label',
		size: 'sm',
		showOverflowTrigger: true,
	},
	render: function PlaygroundRender(args) {
		const {log, on} = useLog();
		return (
			<Stack gap='md'>
				<Overflow {...args}>
					{actionItems(on)}
				</Overflow>
				<Text size='sm' color='muted'>
					Последнее действие:
					{' '}
					{log}
				</Text>
			</Stack>
		);
	},
	parameters: story('Панель Controls: visibleCount, display, size, ⋯.'),
};

export const VisibleTwo: Story<OverflowProps> = {
	render: function VisibleTwoRender() {
		const {log, on} = useLog();
		return (
			<Stack gap='md'>
				<Overflow visibleCount={2} display='icon-label'>
					{actionItems(on)}
				</Overflow>
				<Text size='sm' color='muted'>
					Последнее действие:
					{' '}
					{log}
				</Text>
			</Stack>
		);
	},
	parameters: story('Два действия снаружи, остальные в ⋯ (без иконки — только лейбл).'),
};

export const IconsOnly: Story<OverflowProps> = {
	render: () => (
		<Overflow visibleCount={3} display='icon'>
			<Overflow.Item
				icon={<IconStar size={16} />}
				label='В избранное'
				onSelect={() => undefined}
			/>
			<Overflow.Item
				icon={<IconPencil size={16} />}
				label='Изменить'
				onSelect={() => undefined}
			/>
			<Overflow.Item
				icon={<IconCopy size={16} />}
				label='Копировать'
				onSelect={() => undefined}
			/>
			<Overflow.Item
				icon={<IconTrash size={16} />}
				label='Удалить'
				onSelect={() => undefined}
			/>
		</Overflow>
	),
	parameters: story('`display="icon"` — снаружи только иконки; в меню всегда иконка + лейбл.'),
};

export const Sizes: Story<OverflowProps> = {
	render: () => (
		<Stack gap='lg'>
			{(['sm', 'md', 'lg',] as const).map((size) => (
				<Stack key={size} gap='xs'>
					<Text size='xs' color='muted'>
						{size}
					</Text>
					<Overflow visibleCount={2} size={size}>
						<Overflow.Item
							icon={<IconPencil size={16} />}
							label='Изменить'
							onSelect={() => undefined}
						/>
						<Overflow.Item
							icon={<IconCopy size={16} />}
							label='Копировать'
							onSelect={() => undefined}
						/>
						<Overflow.Item
							icon={<IconTrash size={16} />}
							label='Удалить'
							onSelect={() => undefined}
						/>
					</Overflow>
				</Stack>
			))}
		</Stack>
	),
	parameters: story('Размеры видимых кнопок и ⋯: `sm` / `md` / `lg`.'),
};

export const Disabled: Story<OverflowProps> = {
	render: () => (
		<Overflow visibleCount={2}>
			<Overflow.Item
				icon={<IconPencil size={16} />}
				label='Изменить'
				onSelect={() => undefined}
			/>
			<Overflow.Item
				icon={<IconCopy size={16} />}
				label='Копировать'
				disabled
			/>
			<Overflow.Item
				icon={<IconExport size={16} />}
				label='Поделиться'
				onSelect={() => undefined}
			/>
			<Overflow.Item
				icon={<IconTrash size={16} />}
				label='Удалить'
				disabled
			/>
		</Overflow>
	),
	parameters: story('Заблокированные пункты снаружи и в меню ⋯.'),
};

export const AllInOverflow: Story<OverflowProps> = {
	render: () => (
		<Overflow visibleCount={0}>
			<Overflow.Item
				icon={<IconPencil size={16} />}
				label='Изменить'
				onSelect={() => undefined}
			/>
			<Overflow.Item
				icon={<IconCopy size={16} />}
				label='Копировать'
				onSelect={() => undefined}
			/>
			<Overflow.Item label='Архивировать' onSelect={() => undefined} />
			<Overflow.Item
				icon={<IconTrash size={16} />}
				label='Удалить'
				onSelect={() => undefined}
			/>
		</Overflow>
	),
	parameters: story('`visibleCount={0}` — все действия только за ⋯.'),
};

export const OverflowText: Story<OverflowProps> = {
	render: () => (
		<Overflow visibleCount={1} size='md'>
			<Overflow.Item
				icon={<IconPencil size={16} />}
				label='Переименовать документ с очень длинным названием отчёта'
				onSelect={() => undefined}
			/>
			<Overflow.Item
				icon={<IconExport size={16} />}
				label='Экспортировать в PDF с водяным знаком и подписью'
				onSelect={() => undefined}
			/>
			<Overflow.Item
				icon={<IconTrash size={16} />}
				label='Удалить безвозвратно вместе с вложениями'
				onSelect={() => undefined}
			/>
		</Overflow>
	),
	parameters: story('Длинные подписи действий.'),
};

export const LongPress: Story<OverflowProps> = {
	render: function LongPressRender() {
		const {log, on} = useLog();
		return (
			<Stack
				gap='md'
				style={{maxWidth: 420}}
			>
				<Text size='sm' color='muted'>
					Удерживайте строку (~500 мс): откроется меню. На touch+mobile кнопка ⋯ скрыта
					(`longPress`, default showOverflowTrigger=false).
				</Text>
				<Overflow longPress visibleCount={0}>
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
							gap: 'var(--altum-g-space-3)',
							padding: 'var(--altum-g-space-3)',
							border: '1px solid var(--altum-color-border)',
							borderRadius: 'var(--altum-g-radius)',
							background: 'var(--altum-color-surface)',
						}}
					>
						<Stack gap='xs'>
							<Text size='sm'>
								Отчёт за июль
							</Text>
							<Text size='xs' color='muted'>
								Long-press → действия
							</Text>
						</Stack>
					</div>
					<Overflow.Item
						icon={<IconExport size={16} />}
						label='Поделиться'
						onSelect={on('Поделиться')}
					/>
					<Overflow.Item
						icon={<IconPencil size={16} />}
						label='Переименовать'
						onSelect={on('Переименовать')}
					/>
					<Overflow.Item
						icon={<IconTrash size={16} />}
						label='Удалить'
						onSelect={on('Удалить')}
					/>
				</Overflow>
				<Inline gap='sm'>
					<Text size='sm' color='muted'>
						Лог:
						{' '}
						{log}
					</Text>
				</Inline>
			</Stack>
		);
	},
	parameters: story('`longPress`: долгое нажатие открывает Overflow; на мобиле ⋯ можно скрыть.'),
};

export const GroupPlayground: Story<OverflowProps & {containerWidth: number}> = {
	args: {
		gap: 'md',
		size: 'md',
		containerWidth: 280,
	},
	render: function GroupPlaygroundRender({gap, size, maxVisible, containerWidth}) {
		return (
			<div style={{
				width: containerWidth,
				maxWidth: '100%',
			}}
			>
				<Overflow
					gap={gap}
					size={size}
					maxVisible={maxVisible}
				>
					{CHIP_LABELS.map((label) => (
						<Chip
							key={label}
							variant='tinted'
							size={size === 'lg' ? 'lg' : size === 'sm' ? 'sm' : 'md'}
						>
							{label}
						</Chip>
					))}
				</Overflow>
			</div>
		);
	},
	parameters: story('Произвольные children: лимит по ширине контейнера, ⋯ справа.'),
};

export const Interaction: Story<OverflowProps> = {
	render: function InteractionRender() {
		const {log, on} = useLog();
		return (
			<Stack gap='md'>
				<Overflow visibleCount={2}>
					{actionItems(on)}
				</Overflow>
				<Text size='sm' color='muted'>
					Последнее действие:
					{' '}
					{log}
				</Text>
			</Stack>
		);
	},
	play: async ({canvasElement}) => {
		await playClick(canvasElement, 'button');
	},
	parameters: story('Play кликает первое видимое действие.'),
};

export const UsageExample: Story<OverflowProps> = {
	render: function UsageExampleRender() {
		const [log, setLog] = useState('—');
		return (
			<Card
				style={{maxWidth: 480}}
				header={(
					<Inline justify='between' align='center'>
						<Text weight='bold'>
							Отчёт Q3
						</Text>
						<Overflow visibleCount={1} size='sm'>
							<Overflow.Item
								icon={<IconExport size={16} />}
								label='Экспорт'
								onSelect={() => setLog('Экспорт')}
							/>
							<Overflow.Item
								icon={<IconPencil size={16} />}
								label='Переименовать'
								onSelect={() => setLog('Переименовать')}
							/>
							<Overflow.Item
								icon={<IconTrash size={16} />}
								label='Удалить'
								onSelect={() => setLog('Удалить')}
							/>
						</Overflow>
					</Inline>
				)}
			>
				<Stack gap='md'>
					<Text size='sm'>
						Сводка по продажам и возвратам за квартал.
					</Text>
					<Inline gap='sm'>
						<Button variant='primary' size='sm'>
							Открыть
						</Button>
						<Text size='sm' color='muted'>
							Действие:
							{' '}
							{log}
						</Text>
					</Inline>
				</Stack>
			</Card>
		);
	},
	parameters: story('Панель действий карточки: одно действие снаружи, остальное за ⋯.'),
};
