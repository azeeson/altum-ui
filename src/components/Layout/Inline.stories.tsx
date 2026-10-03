import type {Meta} from '@storybook/react';
import React from 'react';
import {Inline, type InlineProps} from './Inline';
import {Stack} from './Stack';
import {Badge} from '../Badge/Badge';
import {Button} from '../Button/Button';
import {Chip} from '../Chip/Chip';
import {Kbd, KbdGroup} from '../Kbd/Kbd';
import {Text} from '../Text/Text';
import {componentParameters, story, Story} from '../../storybook/meta';

export default {
	title: 'altum/Components/Inline',
	component: Inline,
	tags: ['autodocs'],
	parameters: componentParameters(
		'Горизонтальный кластер с переносом: чипы, теги, бейджи, мелкие кнопки. '
		+ 'Не для «заголовок слева / действия справа» (Split) и не для ряда полей (ControlRow).',
	),
	argTypes: {
		gap: {
			control: {
				type: 'select',
				options: [
					'none',
					'xs',
					'sm',
					'md',
					'lg',
					'xl'
				],
			},
		},
		align: {
			control: {
				type: 'select',
				options: [
					'start',
					'center',
					'end',
					'baseline',
					'stretch'
				],
			},
		},
		justify: {
			control: {
				type: 'select',
				options: [
					'start',
					'center',
					'end',
					'between',
					'around',
					'evenly'
				],
			},
		},
		wrap: {
			control: 'boolean',
		},
		as: {
			control: {
				type: 'select',
				options: [
					'div',
					'ul',
					'ol',
					'nav',
					'span'
				],
			},
		},
	},
} satisfies Meta<typeof Inline>;

export const Playground: Story<InlineProps> = {
	args: {
		gap: 'sm',
		align: 'center',
		wrap: true,
	},
	render: (args) => (
		<Inline {...args}>
			<Badge
				label='Новый'
				variant='info'
				position='standalone'
			/>
			<Text size='sm'>
				Заказ #1024
			</Text>
			<Chip
				mode='tag'
				variant='tinted'
				size='sm'
			>
				v0.2
			</Chip>
		</Inline>
	),
	parameters: story('Controls: gap / align / justify / wrap.'),
};

export const TagsAndBadges: Story<InlineProps> = {
	render: () => (
		<Stack gap='md'>
			<Text size='sm' color='muted'>
				Метаданные и статусные метки в одной линии с wrap.
			</Text>
			<Inline gap='sm' align='center'>
				<Badge
					label='Новый'
					variant='info'
					position='standalone'
				/>
				<Text size='sm'>
					Заказ #1024
				</Text>
				<Chip
					mode='tag'
					variant='tinted'
					size='sm'
				>
					v0.2
				</Chip>
				<Chip variant='info' size='sm'>
					Срочно
				</Chip>
			</Inline>
		</Stack>
	),
	parameters: story('Бейдж + текст + тег + чип.'),
};

export const ButtonCluster: Story<InlineProps> = {
	render: () => (
		<Inline gap='sm'>
			<Button variant='primary' size='sm'>
				Сохранить
			</Button>
			<Button variant='secondary' size='sm'>
				Черновик
			</Button>
			<Button variant='ghost' size='sm'>
				Отмена
			</Button>
		</Inline>
	),
	parameters: story('Группа кнопок без разнесения по краям.'),
};

export const Wrap: Story<InlineProps> = {
	render: () => (
		<div style={{maxWidth: 280}}>
			<Inline gap='xs'>
				{[
					'React',
					'TypeScript',
					'CSS Modules',
					'Storybook',
					'a11y',
					'Дизайн-токены'
				].map((label) => (
					<Chip
						mode='tag'
						key={label}
						size='sm'
						variant='secondary'
					>
						{label}
					</Chip>
				))}
			</Inline>
		</div>
	),
	parameters: story('Перенос на узкой ширине (`wrap` по умолчанию).'),
};

export const NoWrapOverflow: Story<InlineProps> = {
	render: () => (
		<div style={{
			maxWidth: 240,
			overflow: 'hidden'
		}}
		>
			<Inline
				gap='sm'
				wrap={false}
			>
				<Chip mode='tag' size='sm'>
					Очень длинный тег без переноса
				</Chip>
				<Chip mode='tag' size='sm'>
					Ещё один
				</Chip>
				<Chip mode='tag' size='sm'>
					И третий
				</Chip>
			</Inline>
		</div>
	),
	parameters: story('`wrap={false}` — кластер может выйти за край.'),
};

export const UsageExample: Story<InlineProps> = {
	render: () => (
		<Inline
			gap='sm'
			align='center'
			justify='between'
		>
			<Text size='sm' weight='medium'>
				Горячие клавиши
			</Text>
			<KbdGroup>
				<Kbd>
					⌘
				</Kbd>
				<Kbd>
					K
				</Kbd>
			</KbdGroup>
		</Inline>
	),
	parameters: story('Подпись и сочетание клавиш в одной линии.'),
};
