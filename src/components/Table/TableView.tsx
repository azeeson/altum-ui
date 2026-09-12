import React, {forwardRef, useCallback, useMemo, useRef, useState} from 'react';
import styles from './Table.module.css';
import scroll from '../../styles/scroll.module.css';
import unstyled from '../../styles/unstyledControl.module.css';
import {cn} from '../../utils/cn';
import {mergeStyles} from '../../utils/mergeStyles';
import {toggleSet} from '../../utils/toggleSet';
import {useControlledState, useControlledStateWithCallback} from '../../hooks/useControlledState';
import {useLocale} from '../../locales/localeContext';
import {Checkbox} from '../Checkbox/Checkbox';
import {TableRow} from './TableRow';
import type {TableSortDirection, TableViewProps} from './Table.types';

/**
 * Разметка `<table>`: сортировка, выбор, expand, sticky columns, density и resize.
 */
function getSortValue(row: object, key: string): unknown {
	return (row as Record<string, unknown>)[key];
}

interface SortState {
	key: string | null;
	direction: TableSortDirection;
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
	const [sort, setSort] = useControlledState<SortState>(
		onSortChange != null
			? {
				key: controlledSortKey ?? null,
				direction: controlledSortDirection ?? 'asc',
			}
			: undefined,
		{
			key: null,
			direction: 'asc',
		},
	);
	const [expandedKeys, setExpandedKeys] = useControlledStateWithCallback(
		controlledExpanded,
		new Set<string | number>(),
		onExpandedChange,
	);
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

	const {key: sortKey, direction: sortDirection} = sort;
	const canExpand = !!renderExpandedRow;
	const isSortControlled = onSortChange != null;

	const handleSort = (key: string) => {
		const nextDir: TableSortDirection = sortKey === key && sortDirection === 'asc' ? 'desc' : 'asc';
		if (isSortControlled) {
			onSortChange(key, nextDir);
			return;
		}
		setSort({
			key,
			direction: sortKey === key ? nextDir : 'asc',
		});
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
		onSelectionChange(toggleSet(selectedKeys, key));
	};

	const toggleExpand = (key: string | number) => {
		setExpandedKeys(toggleSet(expandedKeys, key));
	};

	const stickyLeftOffsets = useMemo(() => {
		const offsets: Record<string, number> = {};
		let left = 0;
		if (canExpand) left += 40;
		if (onSelectionChange) left += 40;
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
	const controlSticky = columns.some((col) => col.sticky === 'left');
	const selectStickyLeft = canExpand ? 40 : 0;
	const stickyLeftEdgeKey = [...columns].reverse().find((col) => col.sticky === 'left');
	const stickyLeftEdgeKeyId = stickyLeftEdgeKey ? String(stickyLeftEdgeKey.key) : undefined;

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
		<div className={cn(scroll.area, styles.frame, className)}>
			<table
				ref={ref}
				className={cn(
					styles.table,
					stickyHeader && styles.stickyHeader,
					density === 'compact' && styles.compact,
				)}
				aria-label={ariaLabel}
				{...rest}
			>
				<thead>
					<tr>
						{canExpand && (
							<th
								scope='col'
								className={cn(styles.controlCol, controlSticky && styles.stickyLeft)}
								style={controlSticky ? {left: 0} : undefined}
								aria-label={t('table.expandColumn')}
							/>
						)}
						{onSelectionChange && (
							<th
								scope='col'
								className={cn(styles.controlCol, controlSticky && styles.stickyLeft)}
								style={controlSticky ? {left: selectStickyLeft} : undefined}
							>
								<Checkbox
									size='sm'
									labelVisibility='hidden'
									checked={isAllSelected || false}
									indeterminate={isSomeSelected}
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
								? cn(styles.stickyLeft, key === stickyLeftEdgeKeyId && styles.stickyLeftEdge)
								: col.sticky === 'right'
									? cn(styles.stickyRight, styles.stickyRightEdge)
									: '';

							return (
								<th
									key={key}
									scope='col'
									className={cn(col.sortable && styles.sortable, stickyClass)}
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
											className={cn(unstyled.control, styles.sortButton)}
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
								stickyLeftOffsets={stickyLeftOffsets}
								controlSticky={controlSticky}
								selectStickyLeft={selectStickyLeft}
								stickyLeftEdgeKeyId={stickyLeftEdgeKeyId}
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
