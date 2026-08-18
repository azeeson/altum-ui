import type React from 'react';
import type {
	ComponentPropsWithoutRef,
} from 'react';
import type {ActionListGroup} from '../ActionList/ActionList.types';
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
 * Пагинация таблицы (toolbar / data-режим).
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

/**
 * Свойства `Table.Content`.
 */
export interface TableContentProps<T> extends Omit<
	ComponentPropsWithoutRef<'table'>,
	'children'
> {
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
	rowActions?: (row: T) => ActionListGroup[];
	rowActionsLabel?: string;
}

export interface TableRootProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
	children: React.ReactNode;
}

export interface TableContextValue {
	ariaLabel?: string;
	loading: boolean;
	isEmpty: boolean;
}

export interface TableToolbarProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
	children: React.ReactNode;
}

export interface TableLoadingProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
	/** Показывает скелетон вместо содержимого таблицы. */
	loading?: boolean;
	/** Количество строк в скелетоне. @default 5 */
	rows?: number;
}

export interface TableEmptyProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
	children?: React.ReactNode;
	title?: string;
	description?: string;
	action?: React.ReactNode;
}

export interface TableFooterProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
	pagination: TablePagination;
}

export interface TableRowActionsProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
	groups: ActionListGroup[];
}

export interface TableViewProps<T> extends Omit<
	TableContentProps<T>,
	'rowActions' | 'rowActionsLabel'
> {
	effectiveColumns: Column<T>[];
}

export interface TableRowComponentProps<T> {
	row: T;
	rowKey: string | number;
	columns: Column<T>[];
	canExpand: boolean;
	isExpanded: boolean;
	isRowSelected: boolean;
	onSelectionChange?: (keys: Set<string | number>) => void;
	selectedKeys?: Set<string | number>;
	stickyLeftOffsets: Record<string, number>;
	colWidths: Record<string, number>;
	colCount: number;
	renderExpandedRow?: (row: T) => React.ReactNode;
	onToggleExpand: (key: string | number) => void;
	onSelectRow: (key: string | number) => void;
	t: (key: string, params?: Record<string, string | number>) => string;
}
