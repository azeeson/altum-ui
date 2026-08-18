import type React from 'react';

/** Свойства корня `Pagination`. */
export interface PaginationRootProps extends Omit<React.ComponentPropsWithoutRef<'nav'>, 'children'> {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
	children?: React.ReactNode;
}

export interface PaginationSummaryProps extends React.HTMLAttributes<HTMLSpanElement> {
	totalItems?: number;
	pageSize?: number;
}

export type PaginationControlsProps = React.HTMLAttributes<HTMLDivElement>;

export interface PaginationPageSizeProps extends Omit<React.LabelHTMLAttributes<HTMLLabelElement>, 'children'> {
	pageSize: number;
	onPageSizeChange: (pageSize: number) => void;
	pageSizeOptions?: number[];
}

export type PaginationProps = PaginationRootProps;
