import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {Popover, type PopoverProps} from './Popover';
import {Button} from '../Button/Button';
import {Text} from '../Text/Text';
import {TextField} from '../TextField/TextField';
import {Stack, Inline} from '../Layout/Layout';
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
			'Плавающий слой: click по умолчанию; hover — для превью по наведению. Якорь — renderTrigger.',
		),
		controls: {
			exclude: [
				'children',
				'onOpenChange',
				'open',
				'renderTrigger'
			]
		},
	},
	argTypes: {
		trigger: {
			control: {
				type: 'select',
				options: ['click', 'hover', 'manual'],
			},
			description: 'Способ открытия',
		},
		defaultOpen: {
			control: 'boolean',
			description: 'Открыт по умолчанию (неконтролируемый режим)',
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
			options: ['panel', 'tooltip', 'plain'],
		},
		arrow: {control: 'boolean'},
		disabled: {control: 'boolean'},
		dismiss: {
			control: 'select',
			options: [
				'all',
				'outside',
				'escape',
				'none'
			],
		},
		onOpenChange: {action: 'onOpenChange'},
	},
} satisfies Meta<typeof Popover>;

export const Playground: Story<PopoverProps> = {
	render: (args) => (
		<div style={centerPad}>
			<Popover
				trigger={args.trigger}
				defaultOpen={args.defaultOpen}
				side={args.side}
				align={args.align}
				variant={args.variant}
				arrow={args.arrow}
				disabled={args.disabled}
				dismiss={args.dismiss}
				renderTrigger={(props, ref) => (
					<Button
						variant='secondary'
						{...props}
						ref={ref}
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
		trigger: 'click',
		defaultOpen: false,
		variant: 'panel',
		arrow: true,
		disabled: false,
	},
	parameters: story('Якорь — renderTrigger + Button. Настройте side / align / trigger в Controls.'),
};

export const WithHoverTrigger: Story<PopoverProps> = {
	render: () => (
		<div style={centerPad}>
			<Popover
				trigger='hover'
				openDelay={150}
				closeDelay={100}
				side='top'
				renderTrigger={(props, ref) => (
					<Button
						variant='ghost'
						{...props}
						ref={ref}
					>
						Наведи
					</Button>
				)}
			>
				Превью по наведению
			</Popover>
		</div>
	),
	parameters: story('Режим hover: превью по наведению.'),
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
					arrow
					renderTrigger={(props, ref) => (
						<Button
							variant='secondary'
							{...props}
							ref={ref}
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
				arrow
				side='bottom'
				renderTrigger={(props, ref) => (
					<Button
						variant='secondary'
						{...props}
						ref={ref}
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
				wrap
				renderTrigger={(props, ref) => (
					<Button
						variant='secondary'
						disabled
						{...props}
						ref={ref}
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
	parameters: story('`disabled` + `wrap` — слот на span вокруг disabled-кнопки.'),
};

export const OverflowText: Story<PopoverProps> = {
	render: () => (
		<div style={centerPad}>
			<Popover
				defaultOpen
				arrow
				side='bottom'
				renderTrigger={(props, ref) => (
					<Button
						variant='secondary'
						{...props}
						ref={ref}
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
					arrow
					side='bottom'
					align='start'
					renderTrigger={(props, ref) => (
						<Button
							variant='secondary'
							{...props}
							ref={ref}
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

export const Interaction: Story<PopoverProps> = {
	render: () => (
		<div style={centerPad}>
			<Popover
				arrow
				renderTrigger={(props, ref) => (
					<Button
						variant='secondary'
						{...props}
						ref={ref}
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
