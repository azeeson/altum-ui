import type React from 'react';
import type {Ref} from 'react';

/** Свойства корня `Pagination`. */
export interface PaginationRootProps extends Omit<React.ComponentPropsWithoutRef<'nav'>, 'children'> {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
	children?: React.ReactNode;
	/** Для дефолтного chrome: `Pagination.Summary`. */
	totalItems?: number;
	pageSize?: number;
	onPageSizeChange?: (pageSize: number) => void;
	pageSizeOptions?: number[];
	/** Узел `<nav>`. */
	rootRef?: Ref<HTMLElement>;
}

export interface PaginationSummaryProps extends React.HTMLAttributes<HTMLSpanElement> {
	totalItems?: number;
	pageSize?: number;
	/** Узел саммари. */
	rootRef?: Ref<HTMLSpanElement>;
}

export type PaginationControlsProps = React.HTMLAttributes<HTMLDivElement> & {
	/** Узел блока кнопок. */
	rootRef?: Ref<HTMLDivElement>;
};

export interface PaginationPageSizeProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
	pageSize: number;
	onPageSizeChange: (pageSize: number) => void;
	pageSizeOptions?: number[];
	/** Узел селекта размера страницы. */
	rootRef?: Ref<HTMLDivElement>;
}

export type PaginationProps = PaginationRootProps;
