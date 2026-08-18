import type {
	PaginationRootProps,
	PaginationSummaryProps,
	PaginationControlsProps,
	PaginationPageSizeProps,
} from './Pagination.types';
export type {
	PaginationRootProps,
	PaginationSummaryProps,
	PaginationControlsProps,
	PaginationPageSizeProps,
	PaginationProps,
} from './Pagination.types';

import React, {createContext, forwardRef, useContext, useMemo} from 'react';
import styles from './Pagination.module.css';
import {useLocale} from '../LocaleProvider/LocaleProvider';
import {cn} from '../../utils/cn';

interface PaginationContextValue {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
}

const PaginationContext = createContext<PaginationContextValue | null>(null);

function usePaginationContext() {
	const ctx = useContext(PaginationContext);
	if (!ctx) throw new Error('Вложенный компонент Pagination должен использоваться внутри Pagination');
	return ctx;
}

const PaginationRoot = forwardRef<HTMLElement, PaginationRootProps>(function PaginationRoot(
	{
		currentPage,
		totalPages,
		onPageChange,
		className,
		children,
		...rest
	},
	ref,
) {
	const {t} = useLocale();
	const {'aria-label': restAriaLabel, ...navRest} = rest;
	const contextValue = useMemo(() => ({
		currentPage,
		totalPages,
		onPageChange,
	}), [currentPage, totalPages, onPageChange]);
	return (
		<PaginationContext.Provider value={contextValue}>
			<nav
				ref={ref}
				className={cn(styles.pagination, className)}
				aria-label={restAriaLabel ?? t('pagination.ariaLabel')}
				{...navRest}
			>
				{children}
			</nav>
		</PaginationContext.Provider>
	);
});

function buildPageItems(current: number, total: number): Array<number | 'ellipsis'> {
	if (total <= 7) {
		return Array.from({length: total}, (_, i) => i + 1);
	}

	const items: Array<number | 'ellipsis'> = [1];
	const left = Math.max(2, current - 1);
	const right = Math.min(total - 1, current + 1);

	if (left > 2) items.push('ellipsis');
	for (let page = left; page <= right; page += 1) {
		items.push(page);
	}
	if (right < total - 1) items.push('ellipsis');
	items.push(total);
	return items;
}

const PaginationSummary = forwardRef<HTMLSpanElement, PaginationSummaryProps>(function PaginationSummary(
	{totalItems, pageSize, className, ...rest},
	ref,
) {
	const {currentPage} = usePaginationContext();
	const {t} = useLocale();

	const summary = useMemo(() => {
		if (totalItems == null || pageSize == null || totalItems <= 0) return null;
		const start = Math.min(totalItems, (currentPage - 1) * pageSize + 1);
		const end = Math.min(totalItems, currentPage * pageSize);
		return t('pagination.summary', {
			start,
			end,
			total: totalItems,
		});
	}, [
		currentPage,
		pageSize,
		t,
		totalItems
	]);

	if (!summary) return null;
	return (
		<span
			ref={ref}
			className={cn(styles.summary, className)}
			{...rest}
		>
			{summary}
		</span>
	);
});

const PaginationControls = forwardRef<HTMLDivElement, PaginationControlsProps>(function PaginationControls(
	{className, ...rest},
	ref,
) {
	const {currentPage, totalPages, onPageChange} = usePaginationContext();
	const {t} = useLocale();
	const pages = useMemo(
		() => buildPageItems(currentPage, Math.max(1, totalPages)),
		[currentPage, totalPages],
	);

	return (
		<div
			ref={ref}
			className={cn(styles.controls, className)}
			{...rest}
		>
			<button
				type='button'
				className={styles.pagBtn}
				disabled={currentPage <= 1}
				aria-label={t('pagination.prev')}
				onClick={() => onPageChange(currentPage - 1)}
			>
				{'<'}
			</button>

			{pages.map((page, index) => {
				if (page === 'ellipsis') {
					return (
						<span
							key={`e-${index}`}
							className={styles.ellipsis}
							aria-hidden
						>
							…
						</span>
					);
				}
				const isActive = page === currentPage;
				return (
					<button
						key={page}
						type='button'
						className={cn(styles.pagBtn, isActive ? styles.active : '')}
						aria-label={t('pagination.page', {page})}
						aria-current={isActive ? 'page' : undefined}
						onClick={() => onPageChange(page)}
					>
						{page}
					</button>
				);
			})}

			<button
				type='button'
				className={styles.pagBtn}
				disabled={currentPage >= totalPages}
				aria-label={t('pagination.next')}
				onClick={() => onPageChange(currentPage + 1)}
			>
				{'>'}
			</button>
		</div>
	);
});

const PaginationPageSize = forwardRef<HTMLLabelElement, PaginationPageSizeProps>(function PaginationPageSize(
	{
		pageSize,
		onPageSizeChange,
		pageSizeOptions = [
			10,
			25,
			50,
			100
		],
		className,
		...rest
	},
	ref,
) {
	const {t} = useLocale();
	return (
		<label
			ref={ref}
			className={cn(styles.pageSize, className)}
			{...rest}
		>
			<span className={styles.pageSizeLabel}>
				{t('pagination.pageSizeLabel')}
			</span>
			<select
				className={styles.pageSizeSelect}
				value={pageSize}
				aria-label={t('pagination.pageSizeAria')}
				onChange={(event) => onPageSizeChange(Number(event.target.value))}
			>
				{pageSizeOptions.map((size) => (
					<option key={size} value={size}>
						{size}
					</option>
				))}
			</select>
		</label>
	);
});

PaginationRoot.displayName = 'Pagination';
PaginationSummary.displayName = 'Pagination.Summary';
PaginationControls.displayName = 'Pagination.Controls';
PaginationPageSize.displayName = 'Pagination.PageSize';

/**
 * Постраничная навигация (составной API).
 *
 * @component
 * @example
 * <Pagination currentPage={page} totalPages={50} onPageChange={setPage}>
 *   <Pagination.Summary totalItems={1200} pageSize={25} />
 *   <Pagination.Controls />
 *   <Pagination.PageSize pageSize={25} onPageSizeChange={setPageSize} />
 * </Pagination>
 */
export const Pagination = Object.assign(PaginationRoot, {
	Summary: PaginationSummary,
	Controls: PaginationControls,
	PageSize: PaginationPageSize,
});
