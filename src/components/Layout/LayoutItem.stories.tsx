import type {Meta} from '@storybook/react';
import React from 'react';
import {LayoutItem, type LayoutItemProps} from './LayoutItem';
import {ControlRow} from './ControlRow';
import {Split} from './Split';
import {Stack} from './Stack';
import {Inline} from './Inline';
import {Button} from '../Button/Button';
import {TextField} from '../TextField/TextField';
import {Text} from '../Text/Text';
import {Card} from '../Card/Card';
import {Chip} from '../Chip/Chip';
import {componentParameters, story, Story} from '../../storybook/meta';

export default {
	title: 'altum/Components/LayoutItem',
	component: LayoutItem,
	tags: ['autodocs'],
	parameters: componentParameters(
		'Flex-ячейка с grow / shrink внутри Stack, Inline, Split или ControlRow. '
		+ 'Оборачивайте только элементы, которым нужно растянуться или не сжиматься. '
		+ 'Алиас: ControlRow.Item, Layout.Item.',
	),
	argTypes: {
		grow: {
			control: 'boolean',
			description: 'Занять оставшееся место по главной оси',
		},
		shrink: {
			control: 'boolean',
			description: 'Разрешить сжатие; false — ширина по контенту',
		},
		as: {
			control: 'select',
			options: ['div', 'li'],
		},
	},
} satisfies Meta<typeof LayoutItem>;

export const Playground: Story<LayoutItemProps> = {
	render: (args) => (
		<Stack gap='md'>
			<Text size='sm' color='muted'>
				Поле занимает оставшуюся ширину, кнопка — по содержимому (`shrink=
				{false}
				`).
			</Text>
			<ControlRow>
				<LayoutItem grow={args.grow ?? true}>
					<TextField label='Поиск' width='full' />
				</LayoutItem>
				<LayoutItem shrink={args.shrink ?? false}>
					<Button variant='primary'>
						Найти
					</Button>
				</LayoutItem>
			</ControlRow>
		</Stack>
	),
	args: {
		grow: true,
		shrink: false,
	},
	parameters: story('grow у поля, shrink={false} у кнопки.'),
};

export const WithSplitRow: Story<LayoutItemProps> = {
	render: () => (
		<Split gap='md'>
			<LayoutItem grow>
				<Text size='sm'>
					Растягивается (`grow`)
				</Text>
			</LayoutItem>
			<LayoutItem shrink={false}>
				<Button size='sm' variant='secondary'>
					Действие
				</Button>
			</LayoutItem>
		</Split>
	),
	parameters: story('LayoutItem внутри Split: grow + shrink={false}.'),
};

export const OverflowText: Story<LayoutItemProps> = {
	render: () => (
		<div style={{maxWidth: 280}}>
			<ControlRow>
				<LayoutItem grow>
					<Text size='sm'>
						Очень длинный заголовок фильтра который должен уступить кнопке и не вытолкнуть её за край
					</Text>
				</LayoutItem>
				<LayoutItem shrink={false}>
					<Button size='sm' variant='secondary'>
						Сбросить
					</Button>
				</LayoutItem>
			</ControlRow>
		</div>
	),
	parameters: story('Длинный текст сжимается, кнопка с shrink={false} остаётся целой.'),
};

export const Empty: Story<LayoutItemProps> = {
	render: () => (
		<ControlRow>
			<LayoutItem grow>
				{null}
			</LayoutItem>
			<LayoutItem shrink={false}>
				<Button variant='secondary'>
					Только действие
				</Button>
			</LayoutItem>
		</ControlRow>
	),
	parameters: story('Пустая grow-ячейка не ломает ряд.'),
};

export const UsageExample: Story<LayoutItemProps> = {
	render: () => (
		<Card
			variant='outlined'
			header={(
				<Text weight='bold'>
					Панель поиска
				</Text>
			)}
			style={{maxWidth: 560}}
		>
			<Stack gap='md'>
				<ControlRow>
					<LayoutItem grow>
						<TextField label='Запрос' width='full' />
					</LayoutItem>
					<LayoutItem shrink={false}>
						<Button variant='primary'>
							Найти
						</Button>
					</LayoutItem>
				</ControlRow>
				<Inline gap='sm'>
					<LayoutItem shrink={false}>
						<Chip>
							Черновик
						</Chip>
					</LayoutItem>
					<LayoutItem grow>
						<Text size='sm' color='muted'>
							Найдено 12 документов по текущим фильтрам
						</Text>
					</LayoutItem>
				</Inline>
			</Stack>
		</Card>
	),
	parameters: story('Тулбар поиска: поле, кнопка и чип в одной карточке.'),
};

export const Interaction: Story<LayoutItemProps> = {
	render: function InteractionRender() {
		const [query, setQuery] = React.useState('');
		return (
			<ControlRow>
				<LayoutItem grow>
					<TextField
						label='Поиск'
						width='full'
						value={query}
						onChange={(event) => setQuery(event.target.value)}
					/>
				</LayoutItem>
				<LayoutItem shrink={false}>
					<Button variant='primary'>
						Найти
					</Button>
				</LayoutItem>
			</ControlRow>
		);
	},
	play: async ({canvasElement}) => {
		const input = canvasElement.querySelector('input');
		if (!(input instanceof HTMLInputElement)) return;
		input.focus();
		const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
		setter?.call(input, 'договор');
		input.dispatchEvent(new Event('input', {bubbles: true}));
		const button = canvasElement.querySelector('button');
		button?.click();
	},
	parameters: story('Play: ввод в растянутое поле и клик по кнопке.'),
};
