import type {Meta} from '@storybook/react';
import React from 'react';
import {Spinner, type SpinnerProps, type SpinnerSize, type SpinnerVariant} from './Spinner';
import {Inline, Stack} from '../Layout/Layout';
import {Text} from '../Text/Text';
import {Button} from '../Button/Button';
import {Card} from '../Card/Card';
import {componentParameters, story, Story} from '../../storybook/meta';

const SIZES: SpinnerSize[] = ['sm', 'md', 'lg'];
const VARIANTS: SpinnerVariant[] = [
	'spin',
	'dots',
	'pulse',
	'typing'
];

export default {
	title: 'altum/Components/Spinner',
	component: Spinner,
	tags: ['autodocs'],
	parameters: componentParameters(
		'Индикатор загрузки: `spin`, `dots`, `pulse`, `typing`. Размеры `sm` | `md` | `lg` (для spin также число px).',
	),
	argTypes: {
		variant: {
			control: {
				type: 'select',
				options: VARIANTS,
			},
			description: 'spin — круг; typing — точки в пузыре; dots — inline; pulse — диск',
		},
		size: {
			control: {
				type: 'select',
				options: [
					...SIZES,
					20,
					32,
					48
				],
			},
			description: 'sm | md | lg, либо px для spin',
		},
		label: {
			control: 'text',
			description: 'Подпись рядом с индикатором (dots / typing)',
		},
	},
} satisfies Meta<typeof Spinner>;

export const Playground: Story<SpinnerProps> = {
	args: {
		variant: 'spin',
		size: 'md',
	},
	parameters: story('Используйте панель Controls для настройки.'),
};

export const AllVariants: Story<SpinnerProps> = {
	render: () => (
		<Stack gap='lg'>
			{VARIANTS.map((variant) => (
				<Stack key={variant} gap='sm'>
					<Text size='sm' color='muted'>
						{`variant="${variant}"`}
					</Text>
					<Inline gap='lg' align='center'>
						{SIZES.map((size) => (
							<Stack
								key={size}
								gap='xs'
								align='center'
							>
								<Spinner variant={variant} size={size} />
								<Text size='xs' color='muted'>
									{size}
								</Text>
							</Stack>
						))}
					</Inline>
				</Stack>
			))}
		</Stack>
	),
	parameters: story('Все варианты во всех токенных размерах.'),
};

export const SpinSizes: Story<SpinnerProps> = {
	render: () => (
		<Inline gap='lg' align='center'>
			<Spinner size='sm' />
			<Spinner size='md' />
			<Spinner size='lg' />
			<Spinner size={48} />
		</Inline>
	),
	parameters: story('`spin`: токены sm/md/lg и кастомный px.'),
};

export const WithLabel: Story<SpinnerProps> = {
	render: () => (
		<Stack gap='md'>
			<Spinner
				variant='dots'
				size='md'
				label='Загрузка'
			/>
			<Spinner
				variant='typing'
				size='lg'
				label='Ассистент печатает'
			/>
		</Stack>
	),
	parameters: story('Подпись `label` рядом с `dots` и `typing`.'),
};

export const UsageExample: Story<SpinnerProps> = {
	render: () => (
		<Card
			style={{maxWidth: 360}}
			header={(
				<Text weight='bold'>
					Сохранение отчёта
				</Text>
			)}
		>
			<Stack gap='md'>
				<Inline gap='sm' align='center'>
					<Spinner variant='dots' size='sm' />
					<Text size='sm'>
						Отправляем данные на сервер…
					</Text>
				</Inline>
				<Button loading>
					Сохранить
				</Button>
			</Stack>
		</Card>
	),
	parameters: story('Спиннер в карточке рядом с кнопкой в состоянии loading.'),
};
