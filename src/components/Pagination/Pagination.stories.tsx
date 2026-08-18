import type {Meta} from '@storybook/react';
import React, {useState} from 'react';
import {Pagination, PaginationProps} from './Pagination';
import {componentParameters, story, Story} from '../../storybook/meta';

export default {
	title: 'altum-ui/Components/Pagination',
	component: Pagination,
	tags: ['autodocs'],
	parameters: componentParameters('Постраничная навигация для списков и таблиц.'),
	argTypes: {
		totalPages: {
			control: 'number',
			description: 'Общее число страниц'
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
			>
				<Pagination.Controls />
			</Pagination>
		);
	},
	args: {totalPages: 6},
	parameters: story('Используйте панель Controls для настройки.'),
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
