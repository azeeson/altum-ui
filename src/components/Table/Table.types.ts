import type React from 'react';
import type {ComponentPropsWithoutRef, ReactNode} from 'react';
import type {ActionListItem} from '../ActionList/ActionList.types';
import type {Density} from '../../types';

export type TableSortDirection = 'asc' | 'desc';
/** Плотность строк — алиас `Density`. */
export type TableDensity = Density;

export interface Column<T> {
	key: keyof T | string;
	header: string;
	render?: (row: T) => React.ReactNode;
	sortable?: boolean;
	/** Закрепить колонку */
	sticky?: 'left' | 'right';
	/** Разрешить ресайз. @default false */
	resizable?: boolean;
	/** Ширина (px или CSS) */
	width?: number | string;
	minWidth?: number;
}

/**
 * Пагинация таблицы.
 */
export interface TablePagination {
	page: number;
	totalPages: number;
	onPageChange: (page: number) => void;
	pageSize?: number;
	onPageSizeChange?: (pageSize: number) => void;
	pageSizeOptions?: number[];
	totalItems?: number;
}

export interface TableEmptyConfig {
	title?: string;
	description?: string;
	action?: ReactNode;
}

/**
 * Свойства `Table`.
 */
export interface TableProps<T> extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
	columns: Column<T>[];
	data: T[];
	stickyHeader?: boolean;
	rowKey: (row: T) => string | number;
	selectedKeys?: Set<string | number>;
	onSelectionChange?: (keys: Set<string | number>) => void;
	/** Плотность строк. @default 'default' */
	density?: TableDensity;
	/**
	 * Контролируемая сортировка (серверная).
	 * Без `onSortChange` — клиентская сортировка.
	 */
	sortKey?: string | null;
	sortDirection?: TableSortDirection;
	onSortChange?: (key: string, direction: TableSortDirection) => void;
	/** Раскрытые строки */
	expandedKeys?: Set<string | number>;
	onExpandedChange?: (keys: Set<string | number>) => void;
	/** Контент раскрытой строки */
	renderExpandedRow?: (row: T) => React.ReactNode;
	/** Меню действий строки (⋯) */
	rowActions?: (row: T) => ActionListItem[];
	rowActionsLabel?: string;
	toolbar?: ReactNode;
	loading?: boolean;
	/** Количество строк скелетона. @default 5 */
	loadingRows?: number;
	empty?: ReactNode | TableEmptyConfig;
	footer?: TablePagination;
}

/** @deprecated Используйте {@link TableProps}. */
export type TableContentProps<T> = TableProps<T>;

export interface TableViewProps<T> extends Omit<ComponentPropsWithoutRef<'table'>, 'children'> {
	data: T[];
	stickyHeader?: boolean;
	rowKey: (row: T) => string | number;
	selectedKeys?: Set<string | number>;
	onSelectionChange?: (keys: Set<string | number>) => void;
	density?: TableDensity;
	sortKey?: string | null;
	sortDirection?: TableSortDirection;
	onSortChange?: (key: string, direction: TableSortDirection) => void;
	expandedKeys?: Set<string | number>;
	onExpandedChange?: (keys: Set<string | number>) => void;
	renderExpandedRow?: (row: T) => React.ReactNode;
	effectiveColumns: Column<T>[];
}

export interface TableRowActionsProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
	items: ActionListItem[];
}

export interface TableRowComponentProps<T> {
	row: T;
	rowKey: string | number;
	columns: Column<T>[];
	canExpand: boolean;
	isExpanded: boolean;
	isRowSelected: boolean;
	onSelectionChange?: (keys: Set<string | number>) => void;
	stickyLeftOffsets: Record<string, number>;
	controlSticky?: boolean;
	selectStickyLeft?: number;
	stickyLeftEdgeKeyId?: string;
	colWidths: Record<string, number>;
	colCount: number;
	renderExpandedRow?: (row: T) => React.ReactNode;
	onToggleExpand: (key: string | number) => void;
	onSelectRow: (key: string | number) => void;
	t: (key: string, params?: Record<string, string | number>) => string;
}
