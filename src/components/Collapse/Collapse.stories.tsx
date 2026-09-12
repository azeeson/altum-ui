import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {Collapse, CollapseProps} from './Collapse';
import {Button} from '../Button/Button';
import {Card} from '../Card/Card';
import {Stack} from '../Layout/Layout';
import {Text} from '../Text/Text';
import {Box} from '../Box/Box';
import {componentParameters, story, Story} from '../../storybook/meta';

const LONG_TEXT = 'Дополнительные детали секции с очень длинным текстом, который проверяет переполнение блока: описание условий, ограничений и сопутствующих примечаний. '.repeat(4);

export default {
	title: 'altum/Components/Collapse',
	component: Collapse,
	tags: ['autodocs'],
	parameters: componentParameters('Плавное раскрытие и сворачивание по высоте (`open`).'),
	argTypes: {
		open: {
			control: 'boolean',
			description: 'Состояние раскрытия',
		},
		reducedMotion: {
			control: 'boolean',
			description: 'Отключить анимацию высоты',
		},
		children: {
			control: 'text',
			description: 'Содержимое блока',
		},
	},
} satisfies Meta<typeof Collapse>;

function CollapseDemo({
	open: openArg,
	reducedMotion,
	children,
}: CollapseProps) {
	const [open, setOpen] = useState(openArg);

	return (
		<Stack gap='sm' style={{maxWidth: 360}}>
			<Button
				variant='secondary'
				onClick={() => setOpen((value) => !value)}
			>
				{open ? 'Скрыть спойлер' : 'Показать спойлер'}
			</Button>
			<Collapse
				open={open}
				reducedMotion={reducedMotion}
			>
				<Box
					variant='muted'
					padding='md'
					radius='md'
				>
					<Text size='sm'>
						{children}
					</Text>
				</Box>
			</Collapse>
		</Stack>
	);
}

export const Playground: Story<CollapseProps> = {
	args: {
		open: false,
		reducedMotion: false,
		children: 'Плавный раскрывающийся текст под спойлером!',
	},
	render: (args) => (
		<CollapseDemo
			key={String(args.open)}
			{...args}
		/>
	),
	parameters: story('Controls: `open`, `reducedMotion`, текст содержимого.'),
};

export const Open: Story<CollapseProps> = {
	render: () => (
		<div style={{maxWidth: 320}}>
			<Collapse open>
				<Box
					variant='outlined'
					padding='md'
					border
				>
					<Text size='sm'>
						Контент виден сразу при `open` без анимации переключения.
					</Text>
				</Box>
			</Collapse>
		</div>
	),
	parameters: story('Статически раскрытый блок.'),
};

export const Closed: Story<CollapseProps> = {
	render: () => (
		<div style={{maxWidth: 320}}>
			<Collapse open={false}>
				<Box
					variant='outlined'
					padding='md'
					border
				>
					<Text size='sm'>
						Этот текст скрыт (`aria-hidden` + `inert`).
					</Text>
				</Box>
			</Collapse>
			<Text size='xs' color='muted'>
				Свёрнутый Collapse занимает нулевую высоту.
			</Text>
		</div>
	),
	parameters: story('Свёрнутое состояние: контент в DOM, но недоступен.'),
};

export const ReducedMotion: Story<CollapseProps> = {
	render: () => (
		<CollapseDemo
			open
			reducedMotion
		>
			Мгновенное раскрытие без анимации высоты.
		</CollapseDemo>
	),
	parameters: story('`reducedMotion` отключает CSS-анимацию.'),
};

export const OverflowText: Story<CollapseProps> = {
	render: () => (
		<CollapseDemo open>
			{LONG_TEXT}
		</CollapseDemo>
	),
	parameters: story('Длинный текст внутри раскрытого блока.'),
};

export const Interaction: Story<CollapseProps> = {
	args: {
		open: false,
		children: 'Плавный раскрывающийся текст под спойлером!',
	},
	render: (args) => (
		<CollapseDemo {...args} />
	),
	play: async ({canvasElement}) => {
		const button = canvasElement.querySelector('button');
		if (!(button instanceof HTMLButtonElement)) {
			throw new Error('Не найдена кнопка переключения Collapse');
		}
		button.click();
	},
	parameters: story('Play: клик по кнопке раскрывает блок.'),
};

export const UsageExample: Story<CollapseProps> = {
	render: function UsageExampleRender() {
		const [open, setOpen] = useState(false);
		return (
			<Card
				variant='outlined'
				header={(
					<Text weight='bold'>
						Условия доставки
					</Text>
				)}
				actions={(
					<Button
						size='sm'
						variant='ghost'
						onClick={() => setOpen((value) => !value)}
					>
						{open ? 'Свернуть' : 'Подробнее'}
					</Button>
				)}
				style={{maxWidth: 420}}
			>
				<Text size='sm'>
					Доставка по городу — 1–2 рабочих дня.
				</Text>
				<Collapse open={open}>
					<Stack
						gap='xs'
						style={{marginTop: 'var(--altum-g-space-3)'}}
					>
						<Text size='sm' color='secondary'>
							Заказы до 16:00 уезжают в тот же день. Самовывоз бесплатный.
						</Text>
						<Text size='xs' color='muted'>
							Возврат в течение 14 дней при сохранённой упаковке.
						</Text>
					</Stack>
				</Collapse>
			</Card>
		);
	},
	parameters: story('Collapse внутри Card: краткое описание + раскрываемые детали.'),
};
