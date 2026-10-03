import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {Popover, type PopoverProps} from './Popover';
import {Button} from '../Button/Button';
import {Text} from '../Text/Text';
import {TextField} from '../TextField/TextField';
import {Stack, Inline} from '../Layout';
import {componentParameters, story, Story} from '../../storybook/meta';

const centerPad: React.CSSProperties = {
	display: 'flex',
	justifyContent: 'center',
	padding: 'var(--altum-g-space-8)',
};

export default {
	title: 'altum/Components/Popover',
	component: Popover,
	tags: ['autodocs'],
	parameters: {
		...componentParameters(
			'Немодальная панель: клик по кнопке через popovertarget, закрытие — браузер. Якорь — trigger.',
		),
		controls: {
			exclude: [
				'children',
				'onToggle',
				'trigger',
				'panelRef',
			]
		},
	},
	argTypes: {
		defaultOpen: {
			control: 'boolean',
			description: 'Показать панель после монтирования',
		},
		side: {
			control: 'select',
			options: [
				'top',
				'bottom',
				'left',
				'right'
			],
		},
		align: {
			control: 'select',
			options: ['start', 'center', 'end'],
		},
		variant: {
			control: 'select',
			options: ['panel', 'plain'],
		},
		disabled: {control: 'boolean'},
		onToggle: {action: 'onToggle'},
	},
} satisfies Meta<typeof Popover>;

export const Playground: Story<PopoverProps> = {
	render: (args) => (
		<div style={centerPad}>
			<Popover
				defaultOpen={args.defaultOpen}
				side={args.side}
				align={args.align}
				variant={args.variant}
				disabled={args.disabled}
				trigger={(props, ref) => (
					<Button
						variant='secondary'
						{...props}
						rootRef={ref}
					>
						Открыть popover
					</Button>
				)}
			>
				<Text>
					Описание или форма внутри всплывающей панели.
				</Text>
			</Popover>
		</div>
	),
	args: {
		side: 'bottom',
		align: 'center',
		defaultOpen: false,
		variant: 'panel',
		disabled: false,
	},
	parameters: story('Якорь — элемент Button. Настройте side / align в Controls. Наведение — Tooltip.'),
};

export const Sides: Story<PopoverProps> = {
	render: () => (
		<div
			style={{
				display: 'flex',
				flexWrap: 'wrap',
				gap: 'var(--altum-g-space-6)',
				justifyContent: 'center',
				padding: 'var(--altum-g-space-10)',
			}}
		>
			{([
				'top',
				'right',
				'bottom',
				'left'
			] as const).map((side) => (
				<Popover
					key={side}
					side={side}
					align='center'
					trigger={(props, ref) => (
						<Button
							variant='secondary'
							{...props}
							rootRef={ref}
						>
							{side}
						</Button>
					)}
				>
					<Text size='sm'>
						Сторона
						{' '}
						{side}
					</Text>
				</Popover>
			))}
		</div>
	),
	parameters: story('Предпочтительная сторона панели относительно якоря.'),
};

export const Opened: Story<PopoverProps> = {
	render: () => (
		<div style={centerPad}>
			<Popover
				defaultOpen
				side='bottom'
				trigger={(props, ref) => (
					<Button
						variant='secondary'
						{...props}
						rootRef={ref}
					>
						Открыт
					</Button>
				)}
			>
				<Text>
					Панель сразу видна.
				</Text>
			</Popover>
		</div>
	),
	parameters: story('`defaultOpen` для визуальной регрессии chrome.'),
};

export const Disabled: Story<PopoverProps> = {
	render: () => (
		<div style={centerPad}>
			<Popover
				disabled
				trigger={(props, ref) => (
					<Button
						variant='secondary'
						disabled
						{...props}
						rootRef={ref}
					>
						Недоступно
					</Button>
				)}
			>
				<Text>
					Не откроется
				</Text>
			</Popover>
		</div>
	),
	parameters: story('`disabled` — панель не открывается.'),
};

export const OverflowText: Story<PopoverProps> = {
	render: () => (
		<div style={centerPad}>
			<Popover
				defaultOpen
				side='bottom'
				trigger={(props, ref) => (
					<Button
						variant='secondary'
						{...props}
						rootRef={ref}
					>
						Подсказка
					</Button>
				)}
			>
				<Text size='sm'>
					Очень длинное пояснение к полю, которое должно переноситься внутри панели и не растягивать якорь.
				</Text>
			</Popover>
		</div>
	),
	parameters: story('Длинный текст внутри панели.'),
};

export const UsageExample: Story<PopoverProps> = {
	render: function UsageExampleRender() {
		const [note, setNote] = useState('');
		return (
			<div style={centerPad}>
				<Popover
					side='bottom'
					align='start'
					trigger={(props, ref) => (
						<Button
							variant='secondary'
							{...props}
							rootRef={ref}
						>
							Добавить заметку
						</Button>
					)}
				>
					<Stack gap='sm' style={{minWidth: 240}}>
						<Text weight='medium'>
							Заметка к задаче
						</Text>
						<TextField
							label='Текст'
							value={note}
							onChange={(event) => setNote(event.target.value)}
							width='full'
						/>
						<Inline gap='sm'>
							<Button size='sm' variant='primary'>
								Сохранить
							</Button>
							<Button size='sm' variant='ghost'>
								Отмена
							</Button>
						</Inline>
					</Stack>
				</Popover>
			</div>
		);
	},
	parameters: story('Форма заметки внутри popover.'),
};

const rowStyle: React.CSSProperties = {
	display: 'flex',
	flexWrap: 'wrap',
	gap: 'var(--altum-g-space-3)',
	padding: 'var(--altum-g-space-8)',
	justifyContent: 'center',
};

export const Placement: Story<PopoverProps> = {
	render: () => (
		<div style={rowStyle}>
			<Popover
				side='bottom'
				align='start'
				trigger={(props, ref) => (
					<Button
						variant='secondary'
						{...props}
						rootRef={ref}
					>
						Низ / start
					</Button>
				)}
			>
				<Text>
					Панель снизу, по началу якоря.
				</Text>
			</Popover>
			<Popover
				side='bottom'
				align='end'
				trigger={(props, ref) => (
					<Button
						variant='secondary'
						{...props}
						rootRef={ref}
					>
						Низ / end
					</Button>
				)}
			>
				<Text>
					Панель снизу, по концу якоря.
				</Text>
			</Popover>
			<Popover
				side='top'
				align='center'
				trigger={(props, ref) => (
					<Button
						variant='secondary'
						{...props}
						rootRef={ref}
					>
						Верх / center
					</Button>
				)}
			>
				<Text>
					Панель сверху, по центру якоря.
				</Text>
			</Popover>
			<Popover
				side='right'
				align='start'
				trigger={(props, ref) => (
					<Button
						variant='secondary'
						{...props}
						rootRef={ref}
					>
						Справа / start
					</Button>
				)}
			>
				<Text>
					Панель справа, по началу якоря.
				</Text>
			</Popover>
		</div>
	),
	parameters: story('Сторона и выравнивание панели относительно якоря.'),
};

export const Width: Story<PopoverProps> = {
	render: () => (
		<div style={rowStyle}>
			{(['trigger-fit', 'trigger', 'content'] as const).map((widthMode) => (
				<Popover
					key={widthMode}
					variant='plain'
					widthMode={widthMode}
					side={widthMode === 'content' ? 'top' : 'bottom'}
					trigger={(props, ref) => (
						<Button
							variant='secondary'
							{...props}
							rootRef={ref}
						>
							{widthMode}
						</Button>
					)}
				>
					<Text>
						Ширина (
						{widthMode}
						)
					</Text>
				</Popover>
			))}
		</div>
	),
	parameters: story('`widthMode`: ширина относительно якоря и масштаб от стороны.'),
};

export const Interaction: Story<PopoverProps> = {
	render: () => (
		<div style={centerPad}>
			<Popover
				trigger={(props, ref) => (
					<Button
						variant='secondary'
						{...props}
						rootRef={ref}
					>
						Открыть popover
					</Button>
				)}
			>
				<Text>
					Описание или форма внутри всплывающей панели.
				</Text>
			</Popover>
		</div>
	),
	play: async ({canvasElement}) => {
		const trigger = canvasElement.querySelector('button');
		trigger?.click();
	},
	parameters: story('Play: клик по триггеру открывает панель.'),
};
