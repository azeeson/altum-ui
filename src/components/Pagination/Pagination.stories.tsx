import type {Meta} from '@storybook/react';
import React, {useMemo, useState} from 'react';
import {Pagination, PaginationProps} from './Pagination';
import {Card} from '../Card/Card';
import {Stack} from '../Layout/Layout';
import {Text} from '../Text/Text';
import {Table} from '../Table/Table';
import {componentParameters, story, Story} from '../../storybook/meta';

export default {
	title: 'altum/Components/Pagination',
	component: Pagination,
	tags: ['autodocs'],
	parameters: componentParameters('Постраничная навигация для списков и таблиц.'),
	argTypes: {
		totalPages: {
			control: {
				type: 'number',
				min: 1,
				max: 200,
			},
			description: 'Общее число страниц',
		},
		currentPage: {
			control: 'number',
			description: 'Текущая страница (в playground — локальный state)',
		},
		totalItems: {
			control: 'number',
			description: 'Всего элементов для Pagination.Summary',
		},
		pageSize: {
			control: 'number',
			description: 'Размер страницы',
		},
		onPageChange: {
			action: 'pageChange',
			description: 'Колбэк смены страницы',
		},
		onPageSizeChange: {
			action: 'pageSizeChange',
			description: 'Колбэк смены размера страницы',
		},
	},
} satisfies Meta<typeof Pagination>;

export const Playground: Story<PaginationProps> = {
	render: function PlaygroundRender(args) {
		const [page, setPage] = useState(1);
		return (
			<Pagination
				{...args}
				currentPage={page}
				totalPages={args.totalPages ?? 6}
				onPageChange={setPage}
			/>
		);
	},
	args: {totalPages: 6},
	parameters: story('Используйте панель Controls для настройки.'),
};

export const SinglePage: Story<PaginationProps> = {
	render: function SinglePageRender() {
		const [page, setPage] = useState(1);
		return (
			<Pagination
				currentPage={page}
				totalPages={1}
				onPageChange={setPage}
			/>
		);
	},
	parameters: story('Одна страница: prev/next заблокированы.'),
};

export const FirstPage: Story<PaginationProps> = {
	render: function FirstPageRender() {
		const [page, setPage] = useState(1);
		return (
			<Pagination
				currentPage={page}
				totalPages={8}
				onPageChange={setPage}
			/>
		);
	},
	parameters: story('Первая страница — кнопка «назад» disabled.'),
};

export const LastPage: Story<PaginationProps> = {
	render: function LastPageRender() {
		const [page, setPage] = useState(8);
		return (
			<Pagination
				currentPage={page}
				totalPages={8}
				onPageChange={setPage}
			/>
		);
	},
	parameters: story('Последняя страница — кнопка «вперёд» disabled.'),
};

export const WithEllipsis: Story<PaginationProps> = {
	render: function WithEllipsisRender() {
		const [page, setPage] = useState(12);
		return (
			<Pagination
				currentPage={page}
				totalPages={50}
				onPageChange={setPage}
			>
				<Pagination.Controls />
			</Pagination>
		);
	},
	parameters: story('Много страниц — ellipsis между блоками номеров.'),
};

export const WithPageSize: Story<PaginationProps> = {
	render: function WithPageSizeRender() {
		const [page, setPage] = useState(1);
		const [pageSize, setPageSize] = useState(25);
		return (
			<Pagination
				currentPage={page}
				totalPages={20}
				onPageChange={setPage}
			>
				<Pagination.Controls />
				<Pagination.PageSize
					pageSize={pageSize}
					onPageSizeChange={setPageSize}
				/>
			</Pagination>
		);
	},
	parameters: story('`Pagination.PageSize` для селекта «На странице».'),
};

export const TotalItems: Story<PaginationProps> = {
	render: function TotalItemsRender() {
		const [page, setPage] = useState(3);
		const [pageSize, setPageSize] = useState(10);
		return (
			<Pagination
				currentPage={page}
				totalPages={48}
				onPageChange={setPage}
			>
				<Pagination.Summary totalItems={475} pageSize={pageSize} />
				<Pagination.Controls />
				<Pagination.PageSize
					pageSize={pageSize}
					onPageSizeChange={setPageSize}
				/>
			</Pagination>
		);
	},
	parameters: story('Саммари «N–M из K» через `Pagination.Summary`.'),
};

export const Interaction: Story<PaginationProps> = {
	render: function InteractionRender() {
		const [page, setPage] = useState(1);
		return (
			<Stack gap='sm'>
				<Pagination
					currentPage={page}
					totalPages={6}
					onPageChange={setPage}
				/>
				<Text size='sm' color='muted'>
					Страница:
					{' '}
					{page}
				</Text>
			</Stack>
		);
	},
	play: async ({canvasElement}) => {
		const next = canvasElement.querySelector('[aria-label="Следующая страница"]');
		if (next instanceof HTMLButtonElement) next.click();
	},
	parameters: story('Play переходит на следующую страницу.'),
};

const ORDERS = [
	{
		id: '1',
		name: 'Заказ 1042',
		status: 'Оплачен',
	},
	{
		id: '2',
		name: 'Заказ 1043',
		status: 'Сборка',
	},
	{
		id: '3',
		name: 'Заказ 1044',
		status: 'Доставка',
	},
	{
		id: '4',
		name: 'Заказ 1045',
		status: 'Оплачен',
	},
	{
		id: '5',
		name: 'Заказ 1046',
		status: 'Новый',
	},
	{
		id: '6',
		name: 'Заказ 1047',
		status: 'Оплачен',
	},
];

export const UsageExample: Story<PaginationProps> = {
	render: function UsageExampleRender() {
		const [page, setPage] = useState(1);
		const [pageSize, setPageSize] = useState(3);
		const totalPages = Math.max(1, Math.ceil(ORDERS.length / pageSize));
		const rows = useMemo(
			() => ORDERS.slice((page - 1) * pageSize, page * pageSize),
			[page, pageSize],
		);

		return (
			<Card
				style={{maxWidth: 560}}
				header={(
					<Text weight='bold'>
						Заказы
					</Text>
				)}
			>
				<Stack gap='md'>
					<Table
						aria-label='Заказы'
						columns={[
							{
								key: 'name',
								header: 'Заказ',
							},
							{
								key: 'status',
								header: 'Статус',
							},
						]}
						data={rows}
						rowKey={(row) => row.id}
					/>
					<Pagination
						currentPage={Math.min(page, totalPages)}
						totalPages={totalPages}
						onPageChange={setPage}
					>
						<Pagination.Summary totalItems={ORDERS.length} pageSize={pageSize} />
						<Pagination.Controls />
						<Pagination.PageSize
							pageSize={pageSize}
							onPageSizeChange={(next) => {
								setPageSize(next);
								setPage(1);
							}}
						/>
					</Pagination>
				</Stack>
			</Card>
		);
	},
	parameters: story('Таблица в карточке с саммари, номерами и размером страницы.'),
};
