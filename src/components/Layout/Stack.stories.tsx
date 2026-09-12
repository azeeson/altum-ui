import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {Stack, type StackProps} from './Stack';
import {ControlRow} from './ControlRow';
import {Inline} from './Inline';
import {Button} from '../Button/Button';
import {Chip} from '../Chip/Chip';
import {TextField} from '../TextField/TextField';
import {Select} from '../Select/Select';
import {Text} from '../Text/Text';
import {Card} from '../Card/Card';
import {Title} from '../Title/Title';
import {componentParameters, story, Story} from '../../storybook/meta';

const GAPS = [
	'none',
	'xs',
	'sm',
	'md',
	'lg',
	'xl'
] as const;

const ALIGNS = [
	'start',
	'center',
	'end',
	'baseline',
	'stretch'
] as const;

const JUSTIFY = [
	'start',
	'center',
	'end',
	'between',
	'around',
	'evenly'
] as const;

export default {
	title: 'altum/Components/Stack',
	component: Stack,
	tags: ['autodocs'],
	parameters: componentParameters(
		'Вертикальный flex-стек с токенным gap. Для секций формы, колонок в сайдбаре и списков блоков. '
		+ 'Не для горизонтальных рядов — там Inline / ControlRow / Split.',
	),
	argTypes: {
		gap: {
			control: {
				type: 'select',
				options: [...GAPS],
			},
		},
		align: {
			control: {
				type: 'select',
				options: [...ALIGNS],
			},
		},
		justify: {
			control: {
				type: 'select',
				options: [...JUSTIFY],
			},
		},
	},
} satisfies Meta<typeof Stack>;

const CITY_OPTIONS = [
	{
		label: 'Москва',
		value: 'msk'
	},
	{
		label: 'Казань',
		value: 'kzn'
	},
];

export const Playground: Story<StackProps> = {
	args: {
		gap: 'md',
		align: 'stretch',
		justify: 'start',
	},
	render: function FormSectionsRender(args) {
		const [city, setCity] = useState('');
		return (
			<Stack
				{...args}
				style={{maxWidth: 420}}
			>
				<Text size='sm' color='muted'>
					Поля друг под другом с единым вертикальным ритмом.
				</Text>
				<TextField label='Имя' width='full' />
				<ControlRow gap='sm' align='end'>
					<ControlRow.Item grow>
						<Select
							options={CITY_OPTIONS}
							value={city}
							onChange={(value) => { if (!Array.isArray(value)) setCity(value); }}
							label='Город'
							width='full'
						/>
					</ControlRow.Item>
					<Button variant='secondary'>
						Сброс
					</Button>
				</ControlRow>
				<Inline gap='xs'>
					<Chip variant='success' size='sm'>
						Готово
					</Chip>
					<Chip variant='info' size='sm'>
						Черновик
					</Chip>
					<Chip
						as='tag'
						variant='secondary'
						size='sm'
					>
						v0.2
					</Chip>
				</Inline>
				<Button variant='primary'>
					Сохранить
				</Button>
			</Stack>
		);
	},
	parameters: story('Типичная форма: Stack → поля → ControlRow → Inline чипов. Controls: gap / align / justify.'),
};

export const WithGapScale: Story<StackProps> = {
	render: () => (
		<Stack gap='lg'>
			{GAPS.filter((gap) => gap !== 'none').map((gap) => (
				<Stack
					key={gap}
					gap={gap}
				>
					<Text size='sm' color='muted'>
						{`gap="${gap}"`}
					</Text>
					<div style={{
						height: 8,
						background: 'var(--altum-color-bg-muted, var(--altum-color-surface))',
						borderRadius: 'var(--altum-g-radius-sm)',
					}}
					/>
					<div style={{
						height: 8,
						background: 'var(--altum-color-bg-muted, var(--altum-color-surface))',
						borderRadius: 'var(--altum-g-radius-sm)',
					}}
					/>
				</Stack>
			))}
		</Stack>
	),
	parameters: story('Шкала токенных отступов Stack.'),
};

export const AlignCenter: Story<StackProps> = {
	render: () => (
		<Stack
			gap='sm'
			align='center'
			style={{
				maxWidth: 320,
				padding: 'var(--altum-g-space-4)',
				border: '1px solid var(--altum-color-border)',
				borderRadius: 'var(--altum-g-radius)',
			}}
		>
			<Text size='sm'>
				Короткая строка
			</Text>
			<Button size='sm'>
				По центру
			</Button>
		</Stack>
	),
	parameters: story('`align="center"` — дети по поперечной оси.'),
};

export const UsageExample: Story<StackProps> = {
	render: function UsageExampleRender() {
		const [city, setCity] = useState('msk');
		return (
			<div style={{maxWidth: 420}}>
				<Card
					header={(
						<Title level={4}>
							Новый участник
						</Title>
					)}
					actions={(
						<Button size='sm'>
							Пригласить
						</Button>
					)}
				>
					<Stack gap='md'>
						<TextField label='Эл. почта' width='full' />
						<Select
							options={CITY_OPTIONS}
							value={city}
							onChange={(value) => { if (!Array.isArray(value)) setCity(value); }}
							label='Офис'
							width='full'
						/>
						<Text size='xs' color='muted'>
							Приглашение придёт на указанный адрес.
						</Text>
					</Stack>
				</Card>
			</div>
		);
	},
	parameters: story('Форма внутри Card: поля в Stack, действие в actions карточки.'),
};
