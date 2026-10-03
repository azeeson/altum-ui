import type {Meta} from '@storybook/react';
import React from 'react';
import {Split, type SplitProps} from './Split';
import {Inline} from './Inline';
import {Stack} from './Stack';
import {Button} from '../Button/Button';
import {SearchField} from '../SearchField/SearchField';
import {Chip} from '../Chip/Chip';
import {Text} from '../Text/Text';
import {Card} from '../Card/Card';
import {Avatar} from '../Avatar/Avatar';
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

export default {
	title: 'altum/Components/Split',
	component: Split,
	tags: ['autodocs'],
	parameters: componentParameters(
		'Ряд с space-between: левый и правый блоки у противоположных краёв. '
		+ 'Для page header, toolbar, строки списка.',
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
	},
} satisfies Meta<typeof Split>;

export const Playground: Story<SplitProps> = {
	args: {
		gap: 'md',
		align: 'center',
	},
	render: (args) => (
		<Split {...args}>
			<Inline gap='sm' align='center'>
				<Text size='md'>
					Проекты
				</Text>
				<Chip
					mode='tag'
					variant='tinted'
					size='sm'
				>
					12
				</Chip>
			</Inline>
			<Inline gap='sm'>
				<SearchField label='Фильтр' />
				<Button variant='primary' size='sm'>
					Создать
				</Button>
			</Inline>
		</Split>
	),
	parameters: story('Заголовок слева, поиск и действие справа. Controls: gap, align.'),
};

export const WithListRow: Story<SplitProps> = {
	render: () => (
		<Split
			gap='md'
			style={{
				padding: 'var(--altum-g-space-3)',
				border: '1px solid var(--altum-color-border)',
				borderRadius: 'var(--altum-g-radius)',
			}}
		>
			<div>
				<Text size='sm'>
					Алексей Иванов
				</Text>
				<Text size='xs' color='muted'>
					alex@example.com
				</Text>
			</div>
			<Button size='sm' variant='ghost'>
				Открыть
			</Button>
		</Split>
	),
	parameters: story('Строка списка: контент слева, действие справа.'),
};

export const AlignStart: Story<SplitProps> = {
	render: () => (
		<Split
			gap='md'
			align='start'
			style={{
				padding: 'var(--altum-g-space-3)',
				border: '1px solid var(--altum-color-border)',
				borderRadius: 'var(--altum-g-radius)',
			}}
		>
			<Stack gap='none'>
				<Text size='sm'>
					Многострочный блок
				</Text>
				<Text size='xs' color='muted'>
					Выравнивание по верху (align=&quot;start&quot;).
				</Text>
			</Stack>
			<Button size='sm' variant='secondary'>
				Действие
			</Button>
		</Split>
	),
	parameters: story('`align="start"` — кнопка у верхнего края.'),
};

export const OverflowText: Story<SplitProps> = {
	render: () => (
		<div style={{maxWidth: 320}}>
			<Split gap='sm'>
				<Text size='sm'>
					Очень длинное название рабочего пространства без сокращения
				</Text>
				<Button size='sm' variant='ghost'>
					Открыть
				</Button>
			</Split>
		</div>
	),
	parameters: story('Длинный левый текст в узком ряду — gap сохраняется.'),
};

export const UsageExample: Story<SplitProps> = {
	render: () => (
		<div style={{maxWidth: 480}}>
			<Card>
				<Split gap='md'>
					<Inline gap='sm' align='center'>
						<Avatar name='Мария Сидорова' size='sm' />
						<div>
							<Text size='sm' weight='medium'>
								Мария Сидорова
							</Text>
							<Text size='xs' color='muted'>
								Редактор
							</Text>
						</div>
					</Inline>
					<Inline gap='xs'>
						<Button size='sm' variant='ghost'>
							Сообщение
						</Button>
						<Button size='sm' variant='secondary'>
							Профиль
						</Button>
					</Inline>
				</Split>
			</Card>
		</div>
	),
	parameters: story('Строка участника в карточке: аватар слева, действия справа.'),
};
