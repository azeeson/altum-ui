import type {Meta} from '@storybook/react';
import React from 'react';
import {Spinner, type SpinnerProps, type SpinnerSize, type SpinnerVariant} from './Spinner';
import {Inline, Stack} from '../Layout/Layout';
import {Text} from '../Text/Text';
import {componentParameters, story, Story} from '../../storybook/meta';

const SIZES: SpinnerSize[] = ['sm', 'md', 'lg'];
const VARIANTS: SpinnerVariant[] = [
	'spin',
	'dots',
	'pulse',
	'typing'
];

export default {
	title: 'altum-ui/Components/Spinner',
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

export const DotsAndPulse: Story<SpinnerProps> = {
	render: () => (
		<Stack gap='md'>
			<Inline gap='md' align='center'>
				<Spinner variant='dots' size='sm' />
				<Spinner
					variant='dots'
					size='md'
					label='Загрузка'
				/>
				<Spinner variant='dots' size='lg' />
			</Inline>
			<Inline gap='md' align='center'>
				<Spinner variant='pulse' size='sm' />
				<Spinner variant='pulse' size='md' />
				<Spinner variant='pulse' size='lg' />
			</Inline>
		</Stack>
	),
	parameters: story('`dots` — inline-точки; `pulse` — пульсирующий диск.'),
};

export const Typing: Story<SpinnerProps> = {
	render: () => (
		<Stack gap='md'>
			<Spinner variant='typing' size='sm' />
			<Spinner variant='typing' size='md' />
			<Spinner
				variant='typing'
				size='lg'
				label='Ассистент печатает'
			/>
		</Stack>
	),
	parameters: story('`variant="typing"` — точки в пузыре «печатает…».'),
};
