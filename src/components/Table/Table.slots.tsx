 
import React, {forwardRef, useMemo} from 'react';
import styles from './Table.module.css';
import {cn} from '../../utils/cn';
import {Pagination} from '../Pagination/Pagination';
import {EmptyState} from '../EmptyState/EmptyState';
import {Skeleton} from '../Skeleton/Skeleton';
import {Split} from '../Layout/Layout';
import {useLocale} from '../LocaleProvider/LocaleProvider';
import {TableContext, getTableState, useTableContext} from './TableContext';
import {TableView} from './TableView';
import {TableRowActions} from './TableRowActions';
import type {
	TableContentProps,
	TableEmptyProps,
	TableFooterProps,
	TableLoadingProps,
	TableRootProps,
	TableToolbarProps,
} from './Table.types';

export const TableRoot = forwardRef<HTMLDivElement, TableRootProps>(function TableRoot(
	{children, className, 'aria-label': ariaLabel, ...rest},
	ref,
) {
	const {loading, isEmpty} = getTableState(children);
	return (
		<TableContext.Provider value={{
			ariaLabel,
			loading,
			isEmpty,
		}}
		>
			<div
				ref={ref}
				className={cn(styles.root, className)}
				aria-label={ariaLabel}
				{...rest}
			>
				{children}
			</div>
		</TableContext.Provider>
	);
});

TableRoot.displayName = 'Table.Root';

/**
 * Основная таблица с сортировкой, выбором, expand, sticky columns, density и resize.
 * В пустом или loading-состоянии заменяется sibling-слотами `Table.Empty` и `Table.Loading`.
 *
 * @component
 * @example
 * <Table.Content columns={columns} data={rows} rowKey={(row) => row.id} />
 */
const TableContentInner = forwardRef(function TableContent<T extends object>(
	props: TableContentProps<T>,
	ref: React.ForwardedRef<HTMLTableElement>,
) {
	const {loading, isEmpty, ariaLabel} = useTableContext('Table.Content');
	const {rowActions, rowActionsLabel, columns, ...rest} = props;
	const {t} = useLocale();
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
					<div className={styles.rowActions} onClick={(event) => event.stopPropagation()}>
						<TableRowActions groups={rowActions(row)} aria-label={actionsLabel} />
					</div>
				),
			},
		];
	}, [actionsLabel, columns, rowActions]);

	if (loading || isEmpty) return null;
	return (
		<TableView
			{...rest}
			columns={columns}
			ref={ref}
			aria-label={ariaLabel}
			effectiveColumns={effectiveColumns}
		/>
	);
});

TableContentInner.displayName = 'Table.Content';

export const TableContent = TableContentInner as <T extends object>(
	props: TableContentProps<T> & {ref?: React.Ref<HTMLTableElement>}
) => React.ReactElement | null;

/**
 * Тулбар-обёртка для `Table` в data-режиме (layout-хелпер).
 */
export const TableToolbar = forwardRef<HTMLDivElement, TableToolbarProps>(
	function TableToolbar({children, className, ...rest}, ref) {
		return (
			<div
				ref={ref}
				className={styles.toolbar}
				{...rest}
			>
				<Split
					align='center'
					gap='md'
					className={cn(styles.toolbarInner, className)}
				>
					{children}
				</Split>
			</div>
		);
	},
);

TableToolbar.displayName = 'Table.Toolbar';

/**
 * Скелетон таблицы. Рендерится, когда `loading` имеет значение `true`.
 */
export const TableLoading = forwardRef<HTMLDivElement, TableLoadingProps>(
	function TableLoading({
		loading = false,
		rows = 5,
		className,
		...rest
	}, ref) {
		const {isEmpty} = useTableContext('Table.Loading');
		if (!loading) return null;
		return (
			<div
				ref={ref}
				className={cn(styles.loading, className)}
				aria-busy
				aria-live='polite'
				{...rest}
			>
				<Skeleton.Table rows={rows} columns={isEmpty ? 2 : 5} />
			</div>
		);
	},
);

TableLoading.displayName = 'Table.Loading';

/** Пустое состояние для `Table.Content` без строк. @component */
export const TableEmpty = forwardRef<HTMLDivElement, TableEmptyProps>(
	function TableEmpty({
		children,
		title,
		description,
		action,
		className,
		...rest
	}, ref) {
		const {loading, isEmpty} = useTableContext('Table.Empty');
		const {t} = useLocale();
		if (loading || !isEmpty) return null;
		return (
			<div
				ref={ref}
				className={cn(styles.empty, className)}
				{...rest}
			>
				{children ?? (
					<EmptyState
						size='sm'
						title={title ?? t('table.emptyTitle')}
						description={description}
						action={action}
					/>
				)}
			</div>
		);
	},
);

TableEmpty.displayName = 'Table.Empty';

/** Пагинация таблицы, включая опциональное саммари и выбор размера страницы. @component */
export const TableFooter = forwardRef<HTMLDivElement, TableFooterProps>(
	function TableFooter({pagination, className, ...rest}, ref) {
		const {loading, isEmpty} = useTableContext('Table.Footer');
		const show = !loading && !isEmpty && (
			pagination.totalPages > 1
			|| pagination.pageSize != null
			|| pagination.totalItems != null
		);
		if (!show) return null;
		return (
			<div
				ref={ref}
				className={cn(styles.footer, className)}
				{...rest}
			>
				<Pagination
					currentPage={pagination.page}
					totalPages={Math.max(1, pagination.totalPages)}
					onPageChange={pagination.onPageChange}
				>
					{pagination.totalItems != null && pagination.pageSize != null && (
						<Pagination.Summary totalItems={pagination.totalItems} pageSize={pagination.pageSize} />
					)}
					<Pagination.Controls />
					{pagination.onPageSizeChange != null && pagination.pageSize != null && (
						<Pagination.PageSize
							pageSize={pagination.pageSize}
							onPageSizeChange={pagination.onPageSizeChange}
							pageSizeOptions={pagination.pageSizeOptions}
						/>
					)}
				</Pagination>
			</div>
		);
	},
);

TableFooter.displayName = 'Table.Footer';
