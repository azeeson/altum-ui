import type {Meta} from '@storybook/react';
import React, {useMemo, useState} from 'react';
import {Table, TableContentProps, type TableSortDirection, type Column} from './Table';
import {Chip} from '../Chip/Chip';
import {Text} from '../Text/Text';
import {Stack} from '../Layout/Layout';
import {Button} from '../Button/Button';
import {TextField} from '../TextField/TextField';
import {componentParameters, story, Story} from '../../storybook/meta';

interface UserRow {
	id: string;
	name: string;
	email: string;
	role: string;
	department: string;
	notes: string;
}

type OrderRow = {
	id: string;
	name: string;
	status: string;
	amount: number;
};

const COLUMNS = [
	{
		key: 'name',
		header: 'Имя пользователя',
		sortable: true,
		sticky: 'left' as const,
		width: 180,
	},
	{
		key: 'email',
		header: 'Электронная почта',
		sortable: true,
		width: 220,
	},
	{
		key: 'department',
		header: 'Отдел',
		sortable: true,
		width: 140,
	},
	{
		key: 'role',
		header: 'Роль',
		render: (row: UserRow) => (
			<Chip mode='tag' variant={row.role === 'Админ' ? 'primary' : 'secondary'}>
				{row.role}
			</Chip>
		),
		width: 120,
	},
	{
		key: 'notes',
		header: 'Заметки',
		width: 280,
	},
];

const DATA: UserRow[] = [
	{
		id: '1',
		name: 'Алексей Иванов',
		email: 'alex@example.com',
		role: 'Админ',
		department: 'Инженерия',
		notes: 'Ответственный за инфраструктуру',
	},
	{
		id: '2',
		name: 'Мария Сидорова',
		email: 'maria@example.com',
		role: 'Менеджер',
		department: 'Продажи',
		notes: 'Ведёт ключевых клиентов B2B',
	},
	{
		id: '3',
		name: 'Петр Петров',
		email: 'peter@example.com',
		role: 'Пользователь',
		department: 'Поддержка',
		notes: 'Первая линия поддержки',
	},
	{
		id: '4',
		name: 'Елена Козлова',
		email: 'elena@example.com',
		role: 'Менеджер',
		department: 'Маркетинг',
		notes: 'Кампании и аналитика',
	},
	{
		id: '5',
		name: 'Дмитрий Смирнов',
		email: 'dmitry@example.com',
		role: 'Пользователь',
		department: 'Инженерия',
		notes: 'Frontend-разработчик',
	},
];

const ORDER_ROWS: OrderRow[] = Array.from({length: 23}, (_, index) => ({
	id: String(index + 1),
	name: `Заказ #${1000 + index}`,
	status: index % 3 === 0 ? 'Новый' : index % 3 === 1 ? 'В работе' : 'Закрыт',
	amount: 1200 + index * 37,
}));

const ORDER_COLUMNS: Column<OrderRow>[] = [
	{
		key: 'name',
		header: 'Заказ',
		sortable: true
	},
	{
		key: 'status',
		header: 'Статус',
		sortable: true
	},
	{
		key: 'amount',
		header: 'Сумма',
		sortable: true,
		render: (row) => `${row.amount} ₽`,
	},
];

export default {
	title: 'altum/Components/Table',
	component: Table,
	tags: ['autodocs'],
	parameters: componentParameters(
		'Таблица: sort, selection, loading / empty / pagination / toolbar / row actions, expandable rows, sticky columns.',
	),
	argTypes: {},
} satisfies Meta<typeof Table>;

export const Playground: Story<TableContentProps<UserRow>> = {
	render: function PlaygroundRender() {
		const [selected, setSelected] = useState<Set<string | number>>(new Set());
		return (
			<div style={{maxWidth: '800px'}}>
				<Table.Root aria-label='Пользователи'>
					<Table.Content
						columns={COLUMNS.slice(0, 3)}
						data={DATA}
						rowKey={(row) => row.id}
						selectedKeys={selected}
						onSelectionChange={setSelected}
					/>
				</Table.Root>
			</div>
		);
	},
	parameters: story('Интерактивная таблица с выбором строк и сортировкой.'),
};

export const WithToolbar: Story<Record<string, never>> = {
	render: function Render() {
		const [page, setPage] = useState(1);
		const [query, setQuery] = useState('');
		const [loading, setLoading] = useState(false);
		const pageSize = 5;

		const filtered = useMemo(
			() => ORDER_ROWS.filter((row) => row.name.toLowerCase().includes(query.toLowerCase())),
			[query],
		);
		const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
		const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);

		return (
			<Table.Root aria-label='Заказы'>
				<Table.Toolbar>
					<TextField
						label='Поиск'
						labelPlacement='none'
						width='md'
						value={query}
						onChange={(event) => {
							setQuery(event.target.value);
							setPage(1);
						}}
					/>
					<Button
						variant='secondary'
						size='sm'
						onClick={() => {
							setLoading(true);
							window.setTimeout(() => setLoading(false), 900);
						}}
					>
						Обновить
					</Button>
				</Table.Toolbar>
				<Table.Content
					columns={ORDER_COLUMNS}
					data={pageRows}
					rowKey={(row) => row.id}
					rowActions={(row) => [
						{
							id: 'ops',
							label: 'Действия',
							items: [
								{
									id: 'open',
									label: `Открыть ${row.name}`
								},
								{
									id: 'delete',
									label: 'Удалить'
								},
							],
						},
					]}
				/>
				<Table.Loading loading={loading} rows={5} />
				<Table.Empty
					title='Заказы не найдены'
					description='Измените фильтр или создайте заказ'
					action={(
						<Button size='sm'>
							Создать
						</Button>
					)}
				/>
				<Table.Footer pagination={{
					page: Math.min(page, totalPages),
					totalPages,
					onPageChange: setPage,
				}}
				/>
			</Table.Root>
		);
	},
	parameters: story('Поиск, loading, pagination, ⋯ меню (`Table.Toolbar`).'),
};

export const ClientSort: Story<TableContentProps<UserRow>> = {
	render: () => (
		<div style={{maxWidth: 720}}>
			<Table.Root>
				<Table.Content
					columns={COLUMNS.slice(0, 3)}
					data={DATA}
					rowKey={(row) => row.id}
				/>
			</Table.Root>
		</div>
	),
	parameters: story('Клиентская сортировка — клик по заголовку без `onSortChange`.'),
};

export const ServerSort: Story<TableContentProps<UserRow>> = {
	render: function ServerSortRender() {
		const [sortKey, setSortKey] = useState<string | null>('name');
		const [sortDirection, setSortDirection] = useState<TableSortDirection>('asc');

		return (
			<Stack gap='sm' style={{maxWidth: 720}}>
				<Text size='sm'>
					Сортировка: 
					{' '}
					{sortKey ?? '—'}
					{' '}
					(
					{sortDirection}
					)
				</Text>
				<Table.Root>
					<Table.Content
						columns={COLUMNS.slice(0, 3)}
						data={DATA}
						rowKey={(row) => row.id}
						sortKey={sortKey}
						sortDirection={sortDirection}
						onSortChange={(key, direction) => {
							setSortKey(key);
							setSortDirection(direction);
						}}
					/>
				</Table.Root>
			</Stack>
		);
	},
	parameters: story('Контролируемая сортировка — данные сортируются на сервере, таблица только отображает состояние.'),
};

export const Loading: Story<Record<string, never>> = {
	render: () => (
		<Table.Root>
			<Table.Content
				columns={ORDER_COLUMNS}
				data={[]}
				rowKey={(row) => row.id}
			/>
			<Table.Loading loading rows={6} />
		</Table.Root>
	),
	parameters: story('Скелетон-таблица при `loading`.'),
};

export const Empty: Story<Record<string, never>> = {
	render: () => (
		<Table.Root>
			<Table.Content
				columns={ORDER_COLUMNS}
				data={[]}
				rowKey={(row) => row.id}
			/>
			<Table.Empty
				title='Заказов пока нет'
				description='Создайте первый заказ, чтобы начать работу'
				action={(
					<Button size='sm'>
						Создать заказ
					</Button>
				)}
			/>
		</Table.Root>
	),
	parameters: story('EmptyState при пустом `data`.'),
};

export const WithPagination: Story<Record<string, never>> = {
	render: function Render() {
		const [page, setPage] = useState(1);
		const [pageSize, setPageSize] = useState(5);
		const totalPages = Math.max(1, Math.ceil(ORDER_ROWS.length / pageSize));
		const pageRows = ORDER_ROWS.slice((page - 1) * pageSize, page * pageSize);

		return (
			<Table.Root>
				<Table.Content
					columns={ORDER_COLUMNS}
					data={pageRows}
					rowKey={(row) => row.id}
				/>
				<Table.Footer pagination={{
					page: Math.min(page, totalPages),
					totalPages,
					totalItems: ORDER_ROWS.length,
					pageSize,
					pageSizeOptions: [5, 10, 20],
					onPageChange: setPage,
					onPageSizeChange: (size) => {
						setPageSize(size);
						setPage(1);
					},
				}}
				/>
			</Table.Root>
		);
	},
	parameters: story('Пагинация с выбором размера страницы и счётчиком записей.'),
};

export const RowActions: Story<Record<string, never>> = {
	render: () => (
		<Table.Root>
			<Table.Content
				columns={ORDER_COLUMNS}
				data={ORDER_ROWS.slice(0, 5)}
				rowKey={(row) => row.id}
				rowActions={(row) => [
					{
						id: 'main',
						label: 'Действия',
						items: [
							{
								id: 'view',
								label: `Открыть ${row.name}`
							},
							{
								id: 'duplicate',
								label: 'Дублировать'
							},
							{
								id: 'archive',
								label: 'В архив'
							},
						],
					},
				]}
			/>
		</Table.Root>
	),
	parameters: story('Колонка ⋯ с `rowActions` (sticky справа).'),
};

export const Compact: Story<TableContentProps<UserRow>> = {
	render: () => (
		<div style={{maxWidth: 720}}>
			<Table.Root>
				<Table.Content
					columns={COLUMNS.slice(0, 4)}
					data={DATA}
					rowKey={(row) => row.id}
					density='compact'
				/>
			</Table.Root>
		</div>
	),
	parameters: story('Плотные строки через `density="compact"`.'),
};

export const ExpandableRows: Story<Record<string, never>> = {
	render: function Render() {
		const [expandedKeys, setExpandedKeys] = useState<Set<string | number>>(new Set(['1']));
		return (
			<Table.Root>
				<Table.Content
					columns={ORDER_COLUMNS}
					data={ORDER_ROWS.slice(0, 6)}
					rowKey={(row) => row.id}
					expandedKeys={expandedKeys}
					onExpandedChange={setExpandedKeys}
					renderExpandedRow={(row) => (
						<Stack gap='sm'>
							<Text size='sm' weight='medium'>
								Детали 
								{' '}
								{row.name}
							</Text>
							<Text size='sm'>
								Статус: 
								{' '}
								{row.status}
								{' '}
								· Сумма: 
								{' '}
								{row.amount}
								{' '}
								₽
							</Text>
						</Stack>
					)}
				/>
			</Table.Root>
		);
	},
	parameters: story('Раскрываемые строки через `renderExpandedRow`.'),
};

export const StickyColumns: Story<TableContentProps<UserRow>> = {
	render: () => (
		<div style={{
			maxWidth: 480,
			overflow: 'auto'
		}}
		>
			<Table.Root>
				<Table.Content
					columns={COLUMNS}
					data={DATA}
					rowKey={(row) => row.id}
					stickyHeader
					density='compact'
				/>
			</Table.Root>
		</div>
	),
	parameters: story('Липкий заголовок и закреплённая колонка `name` слева при горизонтальной прокрутке.'),
};

export const StickyHeader: Story<Record<string, never>> = {
	render: () => (
		<div style={{
			maxHeight: 240,
			overflow: 'auto'
		}}
		>
			<Table.Root>
				<Table.Content
					columns={ORDER_COLUMNS}
					data={ORDER_ROWS}
					rowKey={(row) => row.id}
					stickyHeader
					density='compact'
				/>
			</Table.Root>
		</div>
	),
	parameters: story('Липкий заголовок при прокрутке длинного списка.'),
};
