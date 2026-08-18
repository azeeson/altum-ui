import type {Meta} from '@storybook/react';
import React from 'react';
import {Container, Page, ContainerProps, type ContainerSize} from './Container';
import {Card} from '../Card/Card';
import {Grid} from '../Grid/Grid';
import {Stack} from '../Layout/Layout';
import {Text} from '../Text/Text';
import {Title} from '../Title/Title';

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
import {componentParameters, story, Story} from '../../storybook/meta';

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
} satisfies Meta<typeof Container>;

export const Playground: Story<ContainerProps> = {
	render: (args) => (
		<Page {...args}>
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
	args: {size: 'lg'},
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
