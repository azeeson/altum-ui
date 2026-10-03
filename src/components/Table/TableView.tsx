import {useMemo, useRef, type FormEvent, type MouseEvent, type PointerEvent} from 'react';
import styles from './Table.module.css';
import scroll from '../../styles/scrollable.module.css';
import unstyled from '../../styles/unstyledControl.module.css';
import {cn} from '../../core/utils/cn';
import {uRef} from '../../core/utils/bundle';
import {toggleSet} from '../../core/utils/toggleSet';
import {useControlledState, useControlledStateWithCallback} from '../../hooks/useControlledState';
import {useLocale} from '../../locales/localeContext';
import {Checkbox} from '../Checkbox/Checkbox';
import {VirtualList} from '../VirtualList/VirtualList';
import {TableRow} from './TableRow';
import type {TableSortDirection, TableViewProps} from './Table.types';
import {
	declaredColWidth,
	tableColCellStyle,
	tableColLeftVar,
	tableColRatio,
	tableColWidthVar,
	tableControlStickyStyle,
} from './Table.utils';
import {ruSlice as ru_table} from '../../locales/slices/table.ru';

const localeFallback = {
	table: ru_table,
};

const DEFAULT_ESTIMATE_ROW = 49;

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

interface ResizeSession {
	key: string;
	startX: number;
	startW: number;
	widths: Map<string, number>;
}

function stickyAttrs(sticky: 'left' | 'right' | undefined, isEdge: boolean) {
	if (!sticky) return undefined;
	return {
		'data-sticky': sticky,
		'data-sticky-edge': isEdge ? sticky : undefined,
	};
}

export function TableView<T extends object>({
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
	virtualized = false,
	estimateRowSize = DEFAULT_ESTIMATE_ROW,
	className,
	'aria-label': ariaLabel,
	tableRef,
	...rest
}: TableViewProps<T>) {
	const {t} = useLocale(localeFallback);
	const frameRef = useRef<HTMLDivElement>(null);
	const innerTableRef = useRef<HTMLTableElement>(null);
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
	const resizeRef = useRef<ResizeSession | null>(null);

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
		sortKey,
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
				left += declaredColWidth(col.width);
			}
		});
		return offsets;
	}, [canExpand, columns, onSelectionChange,]);

	const totalColPx = useMemo(() => {
		let total = 0;
		if (canExpand) total += 40;
		if (onSelectionChange) total += 40;
		columns.forEach((col) => {
			total += declaredColWidth(col.width);
		});
		return Math.max(total, 1);
	}, [canExpand, columns, onSelectionChange]);
	const controlSticky = columns.some((col) => col.sticky === 'left');
	const selectStickyLeft = canExpand ? 40 : 0;
	const stickyLeftEdgeKey = [...columns].reverse().find((col) => col.sticky === 'left');
	const stickyLeftEdgeKeyId = stickyLeftEdgeKey ? String(stickyLeftEdgeKey.key) : undefined;

	const syncStickyLeft = (host: HTMLElement, widths: Map<string, number>) => {
		let left = 0;
		if (canExpand) left += 40;
		if (onSelectionChange) left += 40;
		columns.forEach((col) => {
			if (col.sticky !== 'left') return;
			const key = String(col.key);
			host.style.setProperty(tableColLeftVar(key), `${left}px`);
			left += widths.get(key) ?? declaredColWidth(col.width);
		});
	};

	const varHost = () => (virtualized ? frameRef.current : innerTableRef.current);

	const onResizeStart = (key: string, event: PointerEvent<HTMLElement>, currentWidth: number) => {
		event.preventDefault();
		event.stopPropagation();
		const table = innerTableRef.current;
		const widths = new Map<string, number>();
		columns.forEach((col) => {
			if (col.sticky !== 'left') return;
			const colKey = String(col.key);
			const cell = table?.querySelector(`[data-col="${CSS.escape(colKey)}"]`);
			const measured = cell?.getBoundingClientRect().width;
			widths.set(
				colKey,
				measured != null && measured > 0 ? measured : declaredColWidth(col.width),
			);
		});
		if (widths.has(key)) widths.set(key, currentWidth);
		resizeRef.current = {
			key,
			startX: event.clientX,
			startW: currentWidth,
			widths,
		};
		(event.target as HTMLElement).setPointerCapture?.(event.pointerId);
	};

	const onResizeMove = (event: PointerEvent<HTMLElement>, minWidth = 60) => {
		const state = resizeRef.current;
		const host = varHost();
		if (!state || !host) return;
		const nextWidth = Math.max(minWidth, state.startW + (event.clientX - state.startX));
		const hostW = host.clientWidth || 1;
		host.style.setProperty(tableColWidthVar(state.key), String(tableColRatio(nextWidth, hostW)));
		if (state.widths.has(state.key)) {
			state.widths.set(state.key, nextWidth);
			syncStickyLeft(host, state.widths);
		}
	};

	const onResizeEnd = (event: PointerEvent<HTMLElement>) => {
		resizeRef.current = null;
		(event.target as HTMLElement).releasePointerCapture?.(event.pointerId);
	};

	const onHeadClick = (event: MouseEvent<HTMLTableSectionElement>) => {
		const button = (event.target as HTMLElement).closest<HTMLElement>('button[data-sort-key]');
		if (!button || !event.currentTarget.contains(button)) return;
		const key = button.getAttribute('data-sort-key');
		if (key) handleSort(key);
	};

	const colCount = columns.length
		+ (onSelectionChange ? 1 : 0)
		+ (canExpand ? 1 : 0);

	const onBodyClick = (event: MouseEvent<HTMLElement>) => {
		const action = (event.target as HTMLElement).closest<HTMLElement>('[data-row-action="expand"]');
		if (!action || !event.currentTarget.contains(action)) return;
		const key = action.closest('[data-row-key]')?.getAttribute('data-row-key');
		if (key != null) toggleExpand(key);
	};

	const onBodyChange = (event: FormEvent<HTMLElement>) => {
		const target = event.target as HTMLInputElement;
		if (target.type !== 'checkbox') return;
		const key = target.closest('[data-row-key]')?.getAttribute('data-row-key');
		if (key != null) handleSelectRow(key);
	};

	const renderRow = (row: T) => {
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
				totalColPx={totalColPx}
				controlSticky={controlSticky}
				selectStickyLeft={selectStickyLeft}
				stickyLeftEdgeKeyId={stickyLeftEdgeKeyId}
				colCount={colCount}
				renderExpandedRow={renderExpandedRow}
				t={t}
			/>
		);
	};

	const head = (
		<thead onClick={onHeadClick}>
			<tr>
				{canExpand && (
					<th
						scope='col'
						className={styles.controlCol}
						{...stickyAttrs(controlSticky ? 'left' : undefined, false)}
						aria-label={t('table.expandColumn')}
					/>
				)}
				{onSelectionChange && (
					<th
						scope='col'
						className={styles.controlCol}
						{...stickyAttrs(controlSticky ? 'left' : undefined, false)}
						style={controlSticky ? tableControlStickyStyle(selectStickyLeft) : undefined}
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
					const isLeftEdge = key === stickyLeftEdgeKeyId;

					return (
						<th
							key={key}
							data-col={key}
							scope='col'
							data-sortable={col.sortable ? '' : undefined}
							{...stickyAttrs(
								col.sticky,
								col.sticky === 'left' ? isLeftEdge : col.sticky === 'right',
							)}
							style={tableColCellStyle(key, {
								width: col.width,
								minWidth: col.minWidth,
								sticky: col.sticky,
								stickyLeft: stickyLeftOffsets[key] ?? 0,
								totalPx: totalColPx,
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
									data-sort-key={key}
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
									tabIndex={0}
									aria-orientation='vertical'
									aria-label={t('table.resizeColumn', {header: col.header})}
									data-resize-key={key}
									data-min-width={col.minWidth ?? 60}
									onPointerDown={(event) => {
										const el = event.currentTarget.parentElement;
										const w = el?.getBoundingClientRect().width
											?? declaredColWidth(col.width);
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
	);

	const tableClass = styles.table;
	const tableDataAttrs = {
		'data-density': density === 'compact' ? 'compact' as const : undefined,
		'data-sticky-header': stickyHeader ? '' : undefined,
	};

	if (virtualized) {
		return (
			<div
				ref={frameRef}
				className={cn(scroll.area, styles.frame, className)}
				onClick={onBodyClick}
				onChange={onBodyChange}
			>
				<table
					ref={uRef(tableRef, innerTableRef)}
					className={tableClass}
					aria-label={ariaLabel}
					{...tableDataAttrs}
					{...rest}
				>
					{head}
				</table>
				<VirtualList
					items={sortedData}
					estimateSize={estimateRowSize}
					scrollElement={frameRef}
					getItemKey={(row) => rowKey(row)}
					aria-label={ariaLabel}
					className={styles.virtualList}
					itemWrapper
					renderItem={({item: row}) => (
						<table className={cn(tableClass, styles.virtualRowTable)}>
							<tbody>
								{renderRow(row)}
							</tbody>
						</table>
					)}
				/>
			</div>
		);
	}

	return (
		<div className={cn(scroll.area, styles.frame, className)}>
			<table
				ref={uRef(tableRef, innerTableRef)}
				className={tableClass}
				aria-label={ariaLabel}
				{...tableDataAttrs}
				{...rest}
			>
				{head}
				<tbody
					onClick={onBodyClick}
					onChange={onBodyChange}
				>
					{sortedData.map((row) => renderRow(row))}
				</tbody>
			</table>
		</div>
	);
}
