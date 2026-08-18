import {TableRoot, TableContent, TableToolbar, TableLoading, TableEmpty, TableFooter} from './Table.slots';
import {TableRowActions} from './TableRowActions';

export type {
	TableSortDirection,
	TableDensity,
	Column,
	TablePagination,
	TableContentProps,
	TableRootProps,
	TableToolbarProps,
	TableLoadingProps,
	TableEmptyProps,
	TableFooterProps,
	TableRowActionsProps,
} from './Table.types';

export {TableRowActions} from './TableRowActions';
export {TableToolbar} from './Table.slots';

/**
 * Составная таблица. `Root` задаёт только оболочку; данные передавайте в `Content`,
 * а toolbar, loading, empty и pagination собирайте sibling-слотами.
 *
 * @component
 * @example
 * <Table.Root aria-label="Пользователи">
 *   <Table.Toolbar>…</Table.Toolbar>
 *   <Table.Content columns={columns} data={rows} rowKey={(row) => row.id} />
 *   <Table.Empty title="Пользователей нет" />
 * </Table.Root>
 */
export const Table = Object.assign(TableRoot, {
	Root: TableRoot,
	Toolbar: TableToolbar,
	Content: TableContent,
	Loading: TableLoading,
	Empty: TableEmpty,
	Footer: TableFooter,
	RowActions: TableRowActions,
});
