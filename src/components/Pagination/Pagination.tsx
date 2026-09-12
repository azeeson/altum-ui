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

import {createContext, forwardRef, useMemo, type ButtonHTMLAttributes} from 'react';
import styles from './Pagination.module.css';
import unstyled from '../../styles/unstyledControl.module.css';
import {useLocale} from '../../locales/localeContext';
import {useRequiredContext} from '../../hooks/useRequiredContext';
import {Select} from '../Select';
import {cn} from '../../utils/cn';

interface PaginationContextValue {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
}

const PaginationContext = createContext<PaginationContextValue | null>(null);

function usePaginationContext() {
	return useRequiredContext(
		PaginationContext,
		'Вложенный компонент Pagination должен использоваться внутри Pagination',
	);
}

const DEFAULT_PAGE_SIZES = [
	10,
	25,
	50,
	100,
];

const PaginationRoot = forwardRef<HTMLElement, PaginationRootProps>(function PaginationRoot(
	{
		currentPage,
		totalPages,
		onPageChange,
		className,
		children,
		totalItems,
		pageSize,
		onPageSizeChange,
		pageSizeOptions,
		'aria-label': ariaLabel,
		...rest
	},
	ref,
) {
	const {t} = useLocale();
	const chrome = children ?? (
		<>
			{totalItems != null && pageSize != null ? (
				<PaginationSummary totalItems={totalItems} pageSize={pageSize} />
			) : null}
			<PaginationControls />
			{pageSize != null && onPageSizeChange != null ? (
				<PaginationPageSize
					pageSize={pageSize}
					onPageSizeChange={onPageSizeChange}
					pageSizeOptions={pageSizeOptions}
				/>
			) : null}
		</>
	);
	return (
		<PaginationContext.Provider
			value={{
				currentPage,
				totalPages,
				onPageChange,
			}}
		>
			<nav
				ref={ref}
				className={cn(styles.pagination, className)}
				aria-label={ariaLabel ?? t('pagination.ariaLabel')}
				{...rest}
			>
				{chrome}
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

	if (totalItems == null || pageSize == null || totalItems <= 0) return null;

	const start = Math.min(totalItems, (currentPage - 1) * pageSize + 1);
	const end = Math.min(totalItems, currentPage * pageSize);

	return (
		<span
			ref={ref}
			className={cn(styles.summary, className)}
			{...rest}
		>
			{t('pagination.summary', {
				start,
				end,
				total: totalItems,
			})}
		</span>
	);
});

function PageButton({
	active,
	className,
	...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & {active?: boolean}) {
	return (
		<button
			type='button'
			className={cn(unstyled.control, styles.pagBtn, active && styles.active, className)}
			aria-current={active ? 'page' : undefined}
			{...rest}
		/>
	);
}

const PaginationControls = forwardRef<HTMLDivElement, PaginationControlsProps>(function PaginationControls(
	{className, ...rest},
	ref,
) {
	const {currentPage, totalPages, onPageChange} = usePaginationContext();
	const {t} = useLocale();
	const pages = buildPageItems(currentPage, Math.max(1, totalPages));

	return (
		<div
			ref={ref}
			className={cn(styles.controls, className)}
			{...rest}
		>
			<PageButton
				disabled={currentPage <= 1}
				aria-label={t('pagination.prev')}
				onClick={() => onPageChange(currentPage - 1)}
			>
				{'<'}
			</PageButton>

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
				return (
					<PageButton
						key={page}
						active={page === currentPage}
						aria-label={t('pagination.page', {page})}
						onClick={() => onPageChange(page)}
					>
						{page}
					</PageButton>
				);
			})}

			<PageButton
				disabled={currentPage >= totalPages}
				aria-label={t('pagination.next')}
				onClick={() => onPageChange(currentPage + 1)}
			>
				{'>'}
			</PageButton>
		</div>
	);
});

const PaginationPageSize = forwardRef<HTMLDivElement, PaginationPageSizeProps>(function PaginationPageSize(
	{
		pageSize,
		onPageSizeChange,
		pageSizeOptions = DEFAULT_PAGE_SIZES,
		className,
		...rest
	},
	ref,
) {
	const {t} = useLocale();
	const options = useMemo(
		() => pageSizeOptions.map((size) => ({
			value: String(size),
			label: String(size),
		})),
		[pageSizeOptions],
	);
	const label = t('pagination.pageSizeLabel');

	return (
		<div
			ref={ref}
			className={cn(styles.pageSize, className)}
			{...rest}
		>
			<Select
				label={label}
				labelPlacement='none'
				size='sm'
				width='full'
				options={options}
				value={String(pageSize)}
				onChange={(next) => {
					const raw = Array.isArray(next) ? next[0] : next;
					const size = Number(raw);
					if (Number.isFinite(size)) onPageSizeChange(size);
				}}
			/>
		</div>
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
