import {Fragment, memo, type ReactElement, type ReactNode} from 'react';
import styles from './Table.module.css';
import unstyled from '../../styles/unstyledControl.module.css';
import {cn} from '../../core/utils/cn';
import {Checkbox} from '../Checkbox/Checkbox';
import type {TableRowComponentProps} from './Table.types';
import {tableColCellStyle, tableControlStickyStyle} from './Table.utils';

const noopChange = () => {};

function renderCellValue<T extends object>(row: T, key: string): ReactNode {
	const value = (row as Record<string, unknown>)[key];
	if (value == null) return null;
	if (typeof value === 'string' || typeof value === 'number') return value;
	return String(value);
}

function stickyAttrs(sticky: 'left' | 'right' | undefined, isEdge: boolean) {
	if (!sticky) return undefined;
	return {
		'data-sticky': sticky,
		'data-sticky-edge': isEdge ? sticky : undefined,
	};
}

function TableRowImpl<T extends object>({
	row,
	rowKey: rKey,
	columns,
	canExpand,
	isExpanded,
	isRowSelected,
	onSelectionChange,
	stickyLeftOffsets,
	totalColPx,
	controlSticky = false,
	selectStickyLeft = 0,
	stickyLeftEdgeKeyId,
	colCount,
	renderExpandedRow,
	t,
}: TableRowComponentProps<T>) {
	return (
		<Fragment>
			<tr
				data-row-key={rKey}
				className={isExpanded ? styles.rowExpanded : undefined}
				aria-selected={onSelectionChange ? isRowSelected : undefined}
			>
				{canExpand && (
					<td
						className={styles.controlCol}
						{...stickyAttrs(controlSticky ? 'left' : undefined, false)}
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
							data-row-action='expand'
						>
							▶
						</button>
					</td>
				)}
				{onSelectionChange && (
					<td
						className={styles.controlCol}
						{...stickyAttrs(controlSticky ? 'left' : undefined, false)}
						style={controlSticky ? tableControlStickyStyle(selectStickyLeft) : undefined}
					>
						<Checkbox
							size='sm'
							labelVisibility='hidden'
							checked={isRowSelected || false}
							aria-label={t('table.selectRow', {id: rKey})}
							data-row-action='select'
							onChange={noopChange}
						/>
					</td>
				)}
				{columns.map((col) => {
					const key = String(col.key);
					const isLeftEdge = key === stickyLeftEdgeKeyId;
					return (
						<td
							key={key}
							data-col={key}
							{...stickyAttrs(
								col.sticky,
								col.sticky === 'left' ? isLeftEdge : col.sticky === 'right',
							)}
							style={tableColCellStyle(key, {
								width: col.width,
								sticky: col.sticky,
								stickyLeft: stickyLeftOffsets[key] ?? 0,
								totalPx: totalColPx,
							})}
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
		</Fragment>
	);
}

export const TableRow = memo(TableRowImpl) as <T extends object>(
	props: TableRowComponentProps<T>
) => ReactElement;
