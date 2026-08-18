 
import React, {memo} from 'react';
import styles from './Table.module.css';
import {cn} from '../../utils/cn';
import type {TableRowComponentProps} from './Table.types';

function renderCellValue<T extends object>(row: T, key: string): React.ReactNode {
	const value = (row as Record<string, unknown>)[key];
	if (value == null) return null;
	if (typeof value === 'string' || typeof value === 'number') return value;
	return String(value);
}

const TableRowInner = memo(function TableRow<T extends object>({
	row,
	rowKey: rKey,
	columns,
	canExpand,
	isExpanded,
	isRowSelected,
	onSelectionChange,
	stickyLeftOffsets,
	colWidths,
	colCount,
	renderExpandedRow,
	onToggleExpand,
	onSelectRow,
	t,
}: TableRowComponentProps<T>) {
	return (
		<React.Fragment>
			<tr
				className={isExpanded ? styles.rowExpanded : undefined}
				aria-selected={onSelectionChange ? isRowSelected : undefined}
			>
				{canExpand && (
					<td className={styles.controlCol}>
						<button
							type='button'
							className={cn(styles.expandBtn, isExpanded ? styles.expandBtnOpen : '')}
							aria-expanded={isExpanded}
							aria-label={isExpanded ? t('common.collapse') : t('table.expandColumn')}
							onClick={() => onToggleExpand(rKey)}
						>
							▶
						</button>
					</td>
				)}
				{onSelectionChange && (
					<td className={styles.controlCol}>
						<input
							type='checkbox'
							checked={isRowSelected || false}
							aria-label={t('table.selectRow', {id: rKey})}
							onChange={() => onSelectRow(rKey)}
						/>
					</td>
				)}
				{columns.map((col) => {
					const key = String(col.key);
					const stickyClass = col.sticky === 'left'
						? styles.stickyLeft
						: col.sticky === 'right'
							? styles.stickyRight
							: '';
					return (
						<td
							key={key}
							className={stickyClass}
							style={{
								left: col.sticky === 'left'
									? stickyLeftOffsets[key]
									: undefined,
								width: colWidths[key],
							}}
						>
							{col.render ? col.render(row) : renderCellValue(row, key)}
						</td>
					);
				})}
			</tr>
			{canExpand && isExpanded && (
				<tr className={styles.expandedRow}>
					<td colSpan={colCount}>
						<div className={styles.expandedContent}>
							{renderExpandedRow?.(row)}
						</div>
					</td>
				</tr>
			)}
		</React.Fragment>
	);
});

TableRowInner.displayName = 'Table.Row';

export const TableRow = TableRowInner as <T extends object>(
	props: TableRowComponentProps<T>
) => React.ReactElement;
