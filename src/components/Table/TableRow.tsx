import React, {memo} from 'react';
import styles from './Table.module.css';
import unstyled from '../../styles/unstyledControl.module.css';
import {cn} from '../../utils/cn';
import {Checkbox} from '../Checkbox/Checkbox';
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
	controlSticky = false,
	selectStickyLeft = 0,
	stickyLeftEdgeKeyId,
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
					<td
						className={cn(styles.controlCol, controlSticky && styles.stickyLeft)}
						style={controlSticky ? {left: 0} : undefined}
					>
						<button
							type='button'
							className={cn(
								unstyled.control,
								styles.expandBtn,
								isExpanded && styles.expandBtnOpen,
							)}
							aria-expanded={isExpanded}
							aria-label={isExpanded ? t('common.collapse') : t('table.expandColumn')}
							onClick={() => onToggleExpand(rKey)}
						>
							▶
						</button>
					</td>
				)}
				{onSelectionChange && (
					<td
						className={cn(styles.controlCol, controlSticky && styles.stickyLeft)}
						style={controlSticky ? {left: selectStickyLeft} : undefined}
					>
						<Checkbox
							size='sm'
							labelVisibility='hidden'
							checked={isRowSelected || false}
							aria-label={t('table.selectRow', {id: rKey})}
							onChange={() => onSelectRow(rKey)}
						/>
					</td>
				)}
				{columns.map((col) => {
					const key = String(col.key);
					const stickyClass = col.sticky === 'left'
						? cn(styles.stickyLeft, key === stickyLeftEdgeKeyId && styles.stickyLeftEdge)
						: col.sticky === 'right'
							? cn(styles.stickyRight, styles.stickyRightEdge)
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
						{renderExpandedRow?.(row)}
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
