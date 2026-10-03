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

import {createContext, useMemo, type MouseEvent} from 'react';
import styles from './Pagination.module.css';
import {useLocale} from '../../locales/localeContext';
import {useRequiredContext} from '../../hooks/useRequiredContext';
import {Button} from '../Button/Button';
import {Select} from '../Select';
import {cn} from '../../core/utils/cn';
import utilities from '../../styles/utilities.module.css';
import {ruSlice as ru_pagination} from '../../locales/slices/pagination.ru';

const localeFallback = {
	pagination: ru_pagination,
};

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

function PaginationSummary({
	totalItems,
	pageSize,
	className,
	rootRef,
	...rest
}: PaginationSummaryProps) {
	const {currentPage} = usePaginationContext();
	const {t} = useLocale(localeFallback);

	if (totalItems == null || pageSize == null || totalItems <= 0) return null;

	const start = Math.min(totalItems, (currentPage - 1) * pageSize + 1);
	const end = Math.min(totalItems, currentPage * pageSize);

	return (
		<span
			ref={rootRef}
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
}

function PaginationControls({
	className,
	rootRef,
	onClick,
	...rest
}: PaginationControlsProps) {
	const {currentPage, totalPages, onPageChange} = usePaginationContext();
	const {t} = useLocale(localeFallback);
	const pages = buildPageItems(currentPage, Math.max(1, totalPages));
	const goTo = (event: MouseEvent<HTMLDivElement>) => {
		onClick?.(event);
		const button = (event.target as HTMLElement).closest('button');
		if (!(button instanceof HTMLButtonElement) || button.disabled) return;
		const page = button.dataset.page;
		if (!page) return;
		onPageChange(Number(page));
	};

	return (
		<div
			ref={rootRef}
			className={cn(styles.controls, className)}
			{...rest}
			onClick={goTo}
		>
			<Button
				variant='ghost'
				size='sm'
				className={cn(utilities.fCenter, styles.pagBtn)}
				data-page={currentPage - 1}
				disabled={currentPage <= 1}
				aria-label={t('pagination.prev')}
			>
				{'<'}
			</Button>

			{pages.map((page, index) => {
				if (page === 'ellipsis') {
					return (
						<span
							key={`e-${index}`}
							className={cn(utilities.fCenter, styles.ellipsis)}
							aria-hidden
						>
							…
						</span>
					);
				}
				const active = page === currentPage;
				return (
					<Button
						key={page}
						variant='ghost'
						size='sm'
						className={cn(utilities.fCenter, styles.pagBtn)}
						data-page={page}
						data-active={active ? '' : undefined}
						aria-current={active ? 'page' : undefined}
						aria-label={t('pagination.page', {page})}
					>
						{page}
					</Button>
				);
			})}

			<Button
				variant='ghost'
				size='sm'
				className={cn(utilities.fCenter, styles.pagBtn)}
				data-page={currentPage + 1}
				disabled={currentPage >= totalPages}
				aria-label={t('pagination.next')}
			>
				{'>'}
			</Button>
		</div>
	);
}

function PaginationPageSize({
	pageSize,
	onPageSizeChange,
	pageSizeOptions = DEFAULT_PAGE_SIZES,
	className,
	rootRef,
	...rest
}: PaginationPageSizeProps) {
	const {t} = useLocale(localeFallback);
	const optionsKey = pageSizeOptions.join(',');
	const options = useMemo(
		() => pageSizeOptions.map((size) => ({
			value: String(size),
			label: String(size),
		})),
		// Инлайновый массив опций не должен пересобирать список на каждый рендер.
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[optionsKey],
	);
	const label = t('pagination.pageSizeLabel');

	return (
		<div
			ref={rootRef}
			className={cn(styles.pageSize, className)}
			{...rest}
		>
			<Select
				aria-label={label}
				placeholder={label}
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
}

function PaginationRoot({
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
	style,
	rootRef,
	...rest
}: PaginationRootProps) {
	const {t} = useLocale(localeFallback);
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
				{...rest}
				ref={rootRef}
				className={cn(styles.pagination, className)}
				aria-label={ariaLabel ?? t('pagination.ariaLabel')}
				style={style}
			>
				{chrome}
			</nav>
		</PaginationContext.Provider>
	);
}

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
