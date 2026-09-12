import type {Meta} from '@storybook/react';
import React from 'react';
import {Container, Page, ContainerProps, type ContainerSize} from './Container';
import {Card} from '../Card/Card';
import {Grid} from '../Grid/Grid';
import {Stack} from '../Layout/Layout';
import {Text} from '../Text/Text';
import {Title} from '../Title/Title';
import {Button} from '../Button/Button';
import {componentParameters, story, Story} from '../../storybook/meta';

function DemoKpiCard({
	label,
	value,
	delta,
	deltaColor = 'success',
}: {
	label: React.ReactNode;
	value: React.ReactNode;
	delta?: React.ReactNode;
	deltaColor?: 'success' | 'error' | 'muted';
}) {
	return (
		<Card>
			<Stack gap='xs'>
				<Text size='xs' color='muted'>
					{label}
				</Text>
				<Title level={3}>
					{value}
				</Title>
				{delta != null && (
					<Text size='sm' color={deltaColor}>
						{delta}
					</Text>
				)}
			</Stack>
		</Card>
	);
}

const SIZES: ContainerSize[] = [
	'sm',
	'md',
	'lg',
	'xl',
	'full'
];

export default {
	title: 'altum/Components/Container',
	component: Container,
	tags: ['autodocs'],
	parameters: componentParameters('Контентная колонка и Page-оболочка.'),
	argTypes: {
		size: {
			control: {
				type: 'select',
				options: SIZES,
			},
			description: 'Max-width контентной колонки',
		},
		padded: {
			control: 'boolean',
			description: 'Горизонтальные отступы',
		},
		as: {
			control: {
				type: 'select',
				options: [
					'div',
					'section',
					'main',
					'article'
				],
			},
			description: 'HTML-тег корня',
		},
	},
} satisfies Meta<typeof Container>;

export const Playground: Story<ContainerProps> = {
	render: (args) => (
		<Page
			size={args.size}
			padded={args.padded}
		>
			<Grid columns={3} gap={16}>
				<DemoKpiCard
					label='Выручка'
					value='₽1.2M'
					delta='+8.4%'
				/>
				<DemoKpiCard
					label='Заказы'
					value='384'
					delta='−2.1%'
					deltaColor='error'
				/>
				<DemoKpiCard
					label='Конверсия'
					value='3.8%'
					delta='0%'
					deltaColor='muted'
				/>
			</Grid>
		</Page>
	),
	args: {
		size: 'lg',
		padded: true,
	},
	parameters: story('Page + KPI Card сетка.'),
};

export const Sizes: Story<ContainerProps> = {
	render: () => (
		<Stack gap='lg'>
			{SIZES.map((size) => (
				<Container
					key={size}
					size={size}
					style={{
						background: 'var(--altum-color-surface)',
						borderRadius: 'var(--altum-g-radius-sm)',
						paddingBlock: 'var(--altum-g-space-2)',
					}}
				>
					<Text size='sm' weight='medium'>
						size=&quot;
						{size}
						&quot;
					</Text>
					<Text size='xs'>
						max-width:
						{' '}
						{size === 'full' ? 'none' : `${{
							sm: 640,
							md: 768,
							lg: 960,
							xl: 1200
						}[size]}px`}
					</Text>
				</Container>
			))}
		</Stack>
	),
	parameters: story('Все размеры контентной колонки: sm / md / lg / xl / full.'),
};

export const Flush: Story<ContainerProps> = {
	render: () => (
		<Container
			size='md'
			padded={false}
			style={{
				background: 'var(--altum-color-surface-active)',
				paddingBlock: 'var(--altum-g-space-3)',
			}}
		>
			<Text size='sm'>
				{'padded={false} — без горизонтальных отступов колонки.'}
			</Text>
		</Container>
	),
	parameters: story('Колонка без боковых padding.'),
};

export const Empty: Story<ContainerProps> = {
	render: () => (
		<Container size='sm'>
			<Text size='sm' color='muted'>
				Пустая колонка.
			</Text>
		</Container>
	),
	parameters: story('Минимальное содержимое.'),
};

export const PageAlias: Story<ContainerProps> = {
	render: () => (
		<Page size='xl'>
			<Stack gap='xs'>
				<Title level={3}>
					Заказы
				</Title>
				<Text size='sm' color='muted'>
					Список заказов за текущий месяц
				</Text>
			</Stack>
			<Grid
				columns={{
					xs: 1,
					md: 3
				}}
				gap='md'
				style={{marginTop: 'var(--altum-g-space-4)'}}
			>
				<DemoKpiCard
					label='Новые'
					value='42'
					delta='+5'
				/>
				<DemoKpiCard
					label='В работе'
					value='18'
					delta='−2'
					deltaColor='muted'
				/>
				<DemoKpiCard
					label='Закрыты'
					value='156'
					delta='+12%'
				/>
			</Grid>
		</Page>
	),
	parameters: story('Экспорт `Page` — полноэкранная оболочка с Container внутри.'),
};

export const UsageExample: Story<ContainerProps> = {
	render: () => (
		<Page size='md'>
			<Stack gap='md'>
				<Title level={2}>
					Настройки аккаунта
				</Title>
				<Text size='sm' color='secondary'>
					Контент страницы ограничен колонкой Container внутри Page.
				</Text>
				<Card
					header={(
						<Text weight='bold'>
							Профиль
						</Text>
					)}
					actions={(
						<Button size='sm'>
							Сохранить
						</Button>
					)}
				>
					<Text size='sm'>
						Имя, email и уведомления.
					</Text>
				</Card>
			</Stack>
		</Page>
	),
	parameters: story('Типовая страница: Title + Card внутри Page.'),
};
