 
import React, {forwardRef, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import styles from './Table.module.css';
import {cn} from '../../utils/cn';
import {mergeStyles} from '../../utils/mergeStyles';
import {useLocale} from '../LocaleProvider/LocaleProvider';
import {TableRow} from './TableRow';
import type {TableSortDirection, TableViewProps} from './Table.types';

/**
 * Разметка `<table>`: сортировка, выбор, expand, sticky columns, density и resize.
 */
function getSortValue(row: object, key: string): unknown {
	return (row as Record<string, unknown>)[key];
}

const TableViewInner = forwardRef(function TableView<T extends object>(
	{
		effectiveColumns: columns,
		data,
		stickyHeader = false,
		rowKey,
		selectedKeys,
		onSelectionChange,
		density = 'default',
		sortKey: controlledSortKey,
		sortDirection: controlledSortDirection,
		onSortChange,
		expandedKeys: controlledExpanded,
		onExpandedChange,
		renderExpandedRow,
		className,
		'aria-label': ariaLabel,
		...rest
	}: TableViewProps<T>,
	ref: React.ForwardedRef<HTMLTableElement>,
) {
	const {t} = useLocale();
	const [internalSortKey, setInternalSortKey] = useState<string | null>(null);
	const [internalSortDirection, setInternalSortDirection] = useState<TableSortDirection>('asc');
	const [internalExpanded, setInternalExpanded] = useState<Set<string | number>>(new Set());
	const [colWidths, setColWidths] = useState<Record<string, number>>({});
	const resizeRef = useRef<{
		key: string;
		startX: number;
		startW: number;
	} | null>(null);
	const pendingResizeRef = useRef<{
		key: string;
		width: number;
	} | null>(null);
	const resizeRafRef = useRef(0);

	const isSortControlled = onSortChange != null;
	const sortKey = isSortControlled ? (controlledSortKey ?? null) : internalSortKey;
	const sortDirection = isSortControlled
		? (controlledSortDirection ?? 'asc')
		: internalSortDirection;

	const isExpandControlled = controlledExpanded !== undefined;
	const expandedKeys = isExpandControlled ? controlledExpanded! : internalExpanded;
	const canExpand = !!renderExpandedRow;

	const setExpandedKeys = useCallback((next: Set<string | number>) => {
		if (!isExpandControlled) setInternalExpanded(next);
		onExpandedChange?.(next);
	}, [isExpandControlled, onExpandedChange]);

	const handleSort = (key: string) => {
		const nextDir: TableSortDirection = sortKey === key && sortDirection === 'asc' ? 'desc' : 'asc';
		if (isSortControlled) {
			onSortChange?.(key, nextDir);
			return;
		}
		setInternalSortKey(key);
		setInternalSortDirection(sortKey === key ? nextDir : 'asc');
	};

	const sortedData = useMemo(() => {
		if (isSortControlled || !sortKey) return data;
		const sorted = [...data];
		sorted.sort((a, b) => {
			const aVal = getSortValue(a, sortKey);
			const bVal = getSortValue(b, sortKey);
			if (typeof aVal === 'string' && typeof bVal === 'string') {
				return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
			}
			if (typeof aVal === 'number' && typeof bVal === 'number') {
				return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
			}
			const aText = aVal == null ? '' : String(aVal);
			const bText = bVal == null ? '' : String(bVal);
			return sortDirection === 'asc' ? aText.localeCompare(bText) : bText.localeCompare(aText);
		});
		return sorted;
	}, [
		data,
		isSortControlled,
		sortDirection,
		sortKey
	]);

	const isAllSelected = selectedKeys && data.length > 0 && selectedKeys.size === data.length;
	const isSomeSelected = Boolean(
		selectedKeys && selectedKeys.size > 0 && !isAllSelected,
	);
	const selectAllRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (selectAllRef.current) {
			selectAllRef.current.indeterminate = isSomeSelected;
		}
	}, [isSomeSelected]);

	const handleSelectAll = () => {
		if (!onSelectionChange) return;
		if (isAllSelected) {
			onSelectionChange(new Set());
		} else {
			onSelectionChange(new Set(data.map(rowKey)));
		}
	};

	const handleSelectRow = (key: string | number) => {
		if (!onSelectionChange || !selectedKeys) return;
		const newKeys = new Set(selectedKeys);
		if (newKeys.has(key)) newKeys.delete(key);
		else newKeys.add(key);
		onSelectionChange(newKeys);
	};

	const toggleExpand = (key: string | number) => {
		const next = new Set(expandedKeys);
		if (next.has(key)) next.delete(key);
		else next.add(key);
		setExpandedKeys(next);
	};

	const stickyLeftOffsets = useMemo(() => {
		const offsets: Record<string, number> = {};
		let left = onSelectionChange || canExpand ? (onSelectionChange && canExpand ? 80 : 40) : 0;
		if (onSelectionChange && canExpand) {
			// чекбокс 40 + раскрытие 40
		} else if (onSelectionChange || canExpand) {
			left = 40;
		}
		columns.forEach((col) => {
			if (col.sticky === 'left') {
				offsets[String(col.key)] = left;
				const w = colWidths[String(col.key)]
					?? (typeof col.width === 'number' ? col.width : 120);
				left += w;
			}
		});
		return offsets;
	}, [
		canExpand,
		colWidths,
		columns,
		onSelectionChange
	]);

	const flushPendingResize = useCallback(() => {
		const pending = pendingResizeRef.current;
		if (!pending) return;
		setColWidths((prev) => {
			if (prev[pending.key] === pending.width) return prev;
			return {
				...prev,
				[pending.key]: pending.width,
			};
		});
	}, []);

	const scheduleResizeFlush = useCallback(() => {
		if (resizeRafRef.current) return;
		resizeRafRef.current = requestAnimationFrame(() => {
			resizeRafRef.current = 0;
			flushPendingResize();
		});
	}, [flushPendingResize]);

	const onResizeStart = (key: string, event: React.PointerEvent, currentWidth: number) => {
		event.preventDefault();
		event.stopPropagation();
		resizeRef.current = {
			key,
			startX: event.clientX,
			startW: currentWidth,
		};
		(event.target as HTMLElement).setPointerCapture?.(event.pointerId);
	};

	const onResizeMove = (event: React.PointerEvent, minWidth = 60) => {
		const state = resizeRef.current;
		if (!state) return;
		const next = Math.max(minWidth, state.startW + (event.clientX - state.startX));
		pendingResizeRef.current = {
			key: state.key,
			width: next,
		};
		scheduleResizeFlush();
	};

	const onResizeEnd = (event: React.PointerEvent) => {
		if (resizeRafRef.current) {
			cancelAnimationFrame(resizeRafRef.current);
			resizeRafRef.current = 0;
		}
		flushPendingResize();
		resizeRef.current = null;
		pendingResizeRef.current = null;
		(event.target as HTMLElement).releasePointerCapture?.(event.pointerId);
	};

	const colCount = columns.length
		+ (onSelectionChange ? 1 : 0)
		+ (canExpand ? 1 : 0);

	return (
		<div className={cn(styles.tableContainer, className)}>
			<table
				ref={ref}
				className={cn(
					styles.table,
					stickyHeader ? styles.stickyHeader : '',
					density === 'compact' ? styles.compact : '',
				)}
				aria-label={ariaLabel}
				{...rest}
			>
				<thead>
					<tr>
						{canExpand && (
							<th
								scope='col'
								className={styles.controlCol}
								aria-label={t('table.expandColumn')}
							/>
						)}
						{onSelectionChange && (
							<th scope='col' className={styles.controlCol}>
								<input
									ref={selectAllRef}
									type='checkbox'
									checked={isAllSelected || false}
									aria-label={t('table.selectAll')}
									onChange={handleSelectAll}
								/>
							</th>
						)}
						{columns.map((col) => {
							const key = String(col.key);
							const isColSorted = sortKey === key;
							const width = colWidths[key]
								?? (typeof col.width === 'number' ? col.width : col.width);
							const stickyClass = col.sticky === 'left'
								? styles.stickyLeft
								: col.sticky === 'right'
									? styles.stickyRight
									: '';

							return (
								<th
									key={key}
									scope='col'
									className={cn(col.sortable ? styles.sortable : '', stickyClass)}
									style={mergeStyles({
										width: width ?? undefined,
										minWidth: col.minWidth,
										left: col.sticky === 'left' ? stickyLeftOffsets[key] : undefined,
									})}
									aria-sort={
										col.sortable && isColSorted
											? sortDirection === 'asc' ? 'ascending' : 'descending'
											: col.sortable ? 'none' : undefined
									}
								>
									{col.sortable ? (
										<button
											type='button'
											className={styles.sortButton}
											onClick={() => handleSort(key)}
										>
											<span>
												{col.header}
											</span>
											{isColSorted && (
												<span aria-hidden>
													{sortDirection === 'asc' ? '▲' : '▼'}
												</span>
											)}
										</button>
									) : (
										<span className={styles.headerText}>
											{col.header}
										</span>
									)}
									{col.resizable && (
										<span
											className={styles.resizeHandle}
											role='separator'
											aria-orientation='vertical'
											aria-label={t('table.resizeColumn', {header: col.header})}
											onPointerDown={(event) => {
												const el = event.currentTarget.parentElement;
												const w = el?.getBoundingClientRect().width
													?? (typeof width === 'number' ? width : 120);
												onResizeStart(key, event, w);
											}}
											onPointerMove={(event) => onResizeMove(event, col.minWidth ?? 60)}
											onPointerUp={onResizeEnd}
											onPointerCancel={onResizeEnd}
										/>
									)}
								</th>
							);
						})}
					</tr>
				</thead>
				<tbody>
					{sortedData.map((row) => {
						const rKey = rowKey(row);
						return (
							<TableRow
								key={rKey}
								row={row}
								rowKey={rKey}
								columns={columns}
								canExpand={canExpand}
								isExpanded={expandedKeys.has(rKey)}
								isRowSelected={selectedKeys?.has(rKey) ?? false}
								onSelectionChange={onSelectionChange}
								selectedKeys={selectedKeys}
								stickyLeftOffsets={stickyLeftOffsets}
								colWidths={colWidths}
								colCount={colCount}
								renderExpandedRow={renderExpandedRow}
								onToggleExpand={toggleExpand}
								onSelectRow={handleSelectRow}
								t={t}
							/>
						);
					})}
				</tbody>
			</table>
		</div>
	);
});

TableViewInner.displayName = 'Table.View';

export const TableView = TableViewInner as <T extends object>(
	props: TableViewProps<T> & {ref?: React.Ref<HTMLTableElement>}
) => React.ReactElement;
