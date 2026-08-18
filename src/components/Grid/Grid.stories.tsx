import type {Meta} from '@storybook/react';
import React from 'react';
import {
	Grid,
	GridItem,
	GRID_BREAKPOINTS,
	type GridProps,
} from './Grid';
import {Card} from '../Card/Card';
import {Layout} from '../Layout/Layout';
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
import styles from './Grid.stories.module.css';

const breakpointHint = [
	`xs (<${GRID_BREAKPOINTS.sm}px)`,
	`sm (${GRID_BREAKPOINTS.sm}+)`,
	`md (${GRID_BREAKPOINTS.md}+)`,
	`lg (${GRID_BREAKPOINTS.lg}+)`,
	`xl (${GRID_BREAKPOINTS.xl}+)`,
].join(' · ');

export default {
	title: 'altum/Components/Grid',
	component: Grid,
	tags: ['autodocs'],
	parameters: componentParameters(
		'CSS Grid-контейнер с адаптивными колонками, `GridItem` для span и auto-fit карточных сеток.',
	),
	argTypes: {
		columns: {
			description: 'Число колонок, шаблон или объект по breakpoints',
		},
		gap: {
			description: 'Отступ: px, CSS или токен xs…xl',
		},
		mode: {
			control: 'select',
			options: ['fixed', 'autoFit', 'autoFill'],
		},
	},
} satisfies Meta<typeof Grid>;

export const Playground: Story<GridProps> = {
	render: (args) => (
		<Grid
			{...args}
			columns={args.columns ?? 3}
			gap={args.gap ?? 'md'}
		>
			<div className={styles.cell}>
				Блок 1
			</div>
			<div className={styles.cell}>
				Блок 2
			</div>
			<div className={styles.cell}>
				Блок 3
			</div>
		</Grid>
	),
	args: {
		columns: 3,
		gap: 'md',
		mode: 'fixed',
	},
	parameters: story('Используйте панель Controls для настройки колонок и gap.'),
};

export const AdaptiveGrid: Story<GridProps> = {
	render: () => (
		<div className={styles.sectionBlock}>
			<Text weight='bold'>
				1 → 2 → 4 колонки (xs / md / lg)
			</Text>
			<Text className={styles.caption}>
				{breakpointHint}
			</Text>
			<Grid
				columns={{
					xs: 1,
					md: 2,
					lg: 4,
				}}
				gap={{
					xs: 'sm',
					md: 'md',
					lg: 'lg',
				}}
			>
				{[
					'A',
					'B',
					'C',
					'D'
				].map((label) => (
					<div key={label} className={styles.cell}>
						Блок 
						{' '}
						{label}
					</div>
				))}
			</Grid>
		</div>
	),
	parameters: story('Адаптивное число колонок и отступов по брейкпоинтам.'),
};

export const ResponsiveMetrics: Story<GridProps> = {
	render: () => (
		<div className={styles.sectionBlock}>
			<Text weight='bold'>
				KPI: 1 → 2 → 3 → 4 → 6 колонок
			</Text>
			<Text className={styles.caption}>
				{breakpointHint}
			</Text>
			<Grid
				columns={{
					xs: 1,
					sm: 2,
					md: 3,
					lg: 4,
					xl: 6,
				}}
				gap='md'
			>
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
				<DemoKpiCard
					label='Сессии'
					value='12.4k'
					delta='+14%'
				/>
				<DemoKpiCard
					label='Отказы'
					value='32%'
					delta='−1.2%'
					deltaColor='error'
				/>
				<DemoKpiCard
					label='NPS'
					value='62'
					delta='+3'
				/>
			</Grid>
		</div>
	),
	parameters: story('Шесть KPI Card на xl, меньше колонок на узких экранах.'),
};

export const TwelveColumnDashboard: Story<GridProps> = {
	render: () => (
		<div className={styles.sectionBlock}>
			<Text weight='bold'>
				12-колоночный dashboard с GridItem span
			</Text>
			<Text className={styles.caption}>
				Sidebar 3 + main 9 на lg; виджеты по 4 колонки
			</Text>
			<div className={styles.dashboardShell}>
				<Grid columns={12} gap='md'>
					<GridItem span={{
						xs: 12,
						lg: 3
					}}
					>
						<div className={styles.sidebar}>
							Боковая панель
						</div>
					</GridItem>
					<GridItem span={{
						xs: 12,
						lg: 9
					}}
					>
						<div className={styles.main}>
							Основной контент
						</div>
					</GridItem>
					<GridItem span={{
						xs: 12,
						md: 6,
						lg: 4
					}}
					>
						<div className={styles.widget}>
							Виджет A
						</div>
					</GridItem>
					<GridItem span={{
						xs: 12,
						md: 6,
						lg: 4
					}}
					>
						<div className={styles.widget}>
							Виджет B
						</div>
					</GridItem>
					<GridItem span={{
						xs: 12,
						lg: 4
					}}
					>
						<div className={styles.widget}>
							Виджет C
						</div>
					</GridItem>
				</Grid>
			</div>
		</div>
	),
	parameters: story('12-col сетка: sidebar, main и три виджета с адаптивным span.'),
};

export const AutoFitGallery: Story<GridProps> = {
	render: () => {
		const products = [
			{
				id: '1',
				title: 'Кроссовки Air',
				price: '₽8 990'
			},
			{
				id: '2',
				title: 'Рюкзак Urban',
				price: '₽4 590'
			},
			{
				id: '3',
				title: 'Кепка Classic',
				price: '₽1 290'
			},
			{
				id: '4',
				title: 'Футболка Basic',
				price: '₽2 490'
			},
			{
				id: '5',
				title: 'Куртка Wind',
				price: '₽12 900'
			},
			{
				id: '6',
				title: 'Сумка Tote',
				price: '₽3 790'
			},
		];

		return (
			<div className={styles.sectionBlock}>
				<Text weight='bold'>
					Auto-fit галерея (min 220px)
				</Text>
				<Text className={styles.caption}>
					Колонки подстраиваются под ширину без явного числа
				</Text>
				<Grid
					mode='autoFit'
					minColumnWidth={220}
					gap='md'
				>
					{products.map((product) => (
						<div key={product.id} className={styles.galleryCard}>
							<div className={styles.galleryThumb} />
							<span className={styles.galleryTitle}>
								{product.title}
							</span>
							<span className={styles.galleryPrice}>
								{product.price}
							</span>
						</div>
					))}
				</Grid>
			</div>
		);
	},
	parameters: story('mode="autoFit" — карточки перестраиваются по minColumnWidth.'),
};

export const HeroAndTiles: Story<GridProps> = {
	render: () => (
		<div className={styles.sectionBlock}>
			<Text weight='bold'>
				Hero + три плитки
			</Text>
			<Text className={styles.caption}>
				Hero на всю ширину; плитки 1 → 3 колонки
			</Text>
			<Grid columns={12} gap='md'>
				<GridItem span={12}>
					<div className={styles.hero}>
						Баннер — span 12
					</div>
				</GridItem>
				<GridItem span={{
					xs: 12,
					md: 4
				}}
				>
					<div className={styles.tile}>
						Плитка 1
					</div>
				</GridItem>
				<GridItem span={{
					xs: 12,
					md: 4
				}}
				>
					<div className={styles.tile}>
						Плитка 2
					</div>
				</GridItem>
				<GridItem span={{
					xs: 12,
					md: 4
				}}
				>
					<div className={styles.tile}>
						Плитка 3
					</div>
				</GridItem>
			</Grid>
		</div>
	),
	parameters: story('Hero на всю ширину и три равные плитки на md+.'),
};

export const ColumnVariations: Story<GridProps> = {
	render: () => (
		<div className={styles.section}>
			<div className={styles.sectionBlock}>
				<Text weight='bold'>
					Трёхколоночная сетка
				</Text>
				<Grid columns={3} gap='md'>
					<div className={styles.cell}>
						Блок 1
					</div>
					<div className={styles.cell}>
						Блок 2
					</div>
					<div className={styles.cell}>
						Блок 3
					</div>
				</Grid>
			</div>
			<div className={styles.sectionBlock}>
				<Text weight='bold'>
					12-колоночная сетка с GridItem
				</Text>
				<Grid columns={12} gap='sm'>
					<GridItem span={4}>
						<div className={styles.cell}>
							Панель (span 4)
						</div>
					</GridItem>
					<GridItem span={8}>
						<div className={styles.cell}>
							Широкий контент (span 8)
						</div>
					</GridItem>
					<GridItem span={3}>
						<div className={styles.cell}>
							Боковая панель (span 3)
						</div>
					</GridItem>
					<GridItem span={6}>
						<div className={styles.cell}>
							Средняя секция (span 6)
						</div>
					</GridItem>
					<GridItem span={3}>
						<div className={styles.cell}>
							Боковая колонка (span 3)
						</div>
					</GridItem>
				</Grid>
			</div>
			<div className={styles.sectionBlock}>
				<Text weight='bold'>
					Кастомный шаблон колонок
				</Text>
				<Grid columns='200px 1fr' gap='lg'>
					<div className={styles.cellMuted}>
						Сайдбар (200px)
					</div>
					<div className={styles.cell}>
						Главное тело (1fr)
					</div>
				</Grid>
			</div>
		</div>
	),
	parameters: story('Различные конфигурации CSS Grid с GridItem.'),
};

export const LayoutNamespace: Story<GridProps> = {
	render: () => (
		<div className={styles.sectionBlock}>
			<Text weight='bold'>
				Layout.Grid + Layout.GridItem
			</Text>
			<Layout.Grid
				columns={{
					xs: 1,
					md: 2
				}}
				gap='md'
			>
				<Layout.GridItem>
					<div className={styles.cell}>
						Через namespace
					</div>
				</Layout.GridItem>
				<Layout.GridItem>
					<div className={styles.cell}>
						Layout.GridItem
					</div>
				</Layout.GridItem>
			</Layout.Grid>
		</div>
	),
	parameters: story('Grid доступен как Layout.Grid и Layout.GridItem.'),
};
