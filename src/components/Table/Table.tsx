import type {TableEmptyConfig, TableProps} from './Table.types';
export type {
	TableSortDirection,
	TableDensity,
	Column,
	TablePagination,
	TableEmptyConfig,
	TableProps,
	TableContentProps,
	TableRowActionsProps,
} from './Table.types';

import React, {forwardRef, useMemo} from 'react';
import styles from './Table.module.css';
import scroll from '../../styles/scroll.module.css';
import {cn} from '../../utils/cn';
import {Pagination} from '../Pagination/Pagination';
import {EmptyState} from '../EmptyState/EmptyState';
import {Skeleton} from '../Skeleton/Skeleton';
import {useLocale} from '../../locales/localeContext';
import {TableView} from './TableView';
import {TableRowActions} from './TableRowActions';

function isEmptyConfig(value: TableProps<object>['empty']): value is TableEmptyConfig {
	return value != null && typeof value === 'object' && !React.isValidElement(value);
}

/**
 * Таблица: `columns`, `data`, опционально `toolbar`, `loading`, `empty`, `footer`.
 *
 * @component
 * @example
 * <Table
 *   aria-label="Пользователи"
 *   columns={columns}
 *   data={rows}
 *   rowKey={(row) => row.id}
 *   empty={{title: 'Пользователей нет'}}
 * />
 */
const TableInner = forwardRef(function Table<T extends object>(
	{
		columns,
		data,
		rowKey,
		rowActions,
		rowActionsLabel,
		toolbar,
		loading = false,
		loadingRows = 5,
		empty,
		footer,
		className,
		'aria-label': ariaLabel,
		stickyHeader,
		selectedKeys,
		onSelectionChange,
		density,
		sortKey,
		sortDirection,
		onSortChange,
		expandedKeys,
		onExpandedChange,
		renderExpandedRow,
		...rest
	}: TableProps<T>,
	ref: React.ForwardedRef<HTMLDivElement>,
) {
	const {t} = useLocale();
	const isEmpty = data.length === 0;
	const actionsLabel = rowActionsLabel ?? t('table.rowActions');
	const effectiveColumns = useMemo(() => {
		if (!rowActions) return columns;
		return [
			...columns,
			{
				key: '__actions',
				header: '',
				sticky: 'right' as const,
				render: (row: T) => (
					<TableRowActions
						items={rowActions(row)}
						aria-label={actionsLabel}
						className={styles.rowActions}
						onClick={(event) => event.stopPropagation()}
					/>
				),
			},
		];
	}, [actionsLabel, columns, rowActions]);

	const emptyNode = empty == null
		? (
			<EmptyState
				size='sm'
				title={t('table.emptyTitle')}
			/>
		)
		: isEmptyConfig(empty)
			? (
				<EmptyState
					size='sm'
					title={empty.title ?? t('table.emptyTitle')}
					description={empty.description}
					action={empty.action}
				/>
			)
			: empty;

	const showFooter = !loading && !isEmpty && footer != null && (
		footer.totalPages > 1
		|| footer.pageSize != null
		|| footer.totalItems != null
	);

	const frame = cn(scroll.area, styles.frame);

	return (
		<div
			ref={ref}
			className={cn(styles.root, className)}
			aria-label={ariaLabel}
			{...rest}
		>
			{toolbar != null ? (
				<div className={styles.toolbar}>
					{toolbar}
				</div>
			) : null}
			{loading ? (
				<div
					className={frame}
					aria-busy
					aria-live='polite'
				>
					<Skeleton
						variant='table'
						rows={loadingRows}
						columns={isEmpty ? 2 : 5}
					/>
				</div>
			) : isEmpty ? (
				<div className={frame}>
					{emptyNode}
				</div>
			) : (
				<TableView
					data={data}
					rowKey={rowKey}
					stickyHeader={stickyHeader}
					selectedKeys={selectedKeys}
					onSelectionChange={onSelectionChange}
					density={density}
					sortKey={sortKey}
					sortDirection={sortDirection}
					onSortChange={onSortChange}
					expandedKeys={expandedKeys}
					onExpandedChange={onExpandedChange}
					renderExpandedRow={renderExpandedRow}
					aria-label={ariaLabel}
					effectiveColumns={effectiveColumns}
				/>
			)}
			{showFooter && footer ? (
				<div className={styles.footer}>
					<Pagination
						currentPage={footer.page}
						totalPages={Math.max(1, footer.totalPages)}
						onPageChange={footer.onPageChange}
					>
						{footer.totalItems != null && footer.pageSize != null && (
							<Pagination.Summary totalItems={footer.totalItems} pageSize={footer.pageSize} />
						)}
						<Pagination.Controls />
						{footer.onPageSizeChange != null && footer.pageSize != null && (
							<Pagination.PageSize
								pageSize={footer.pageSize}
								onPageSizeChange={footer.onPageSizeChange}
								pageSizeOptions={footer.pageSizeOptions}
							/>
						)}
					</Pagination>
				</div>
			) : null}
		</div>
	);
});

TableInner.displayName = 'Table';

export const Table = TableInner as <T extends object>(
	props: TableProps<T> & {ref?: React.Ref<HTMLDivElement>}
) => React.ReactElement;
