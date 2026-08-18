import React from 'react';
import styles from './VirtualList.module.css';
import type {VirtualListItemCellProps} from './VirtualList.types';
import {ITEM_CONTENT_STYLE} from './VirtualList.utils';

const VirtualListItemCellInner = React.memo(function VirtualListItemCell<T>({
	item,
	index,
	top,
	count,
	itemKey,
	invokeRenderItem,
	assignNode,
}: VirtualListItemCellProps<T>) {
	return (
		<div
			key={itemKey}
			role='listitem'
			aria-posinset={index + 1}
			aria-setsize={count}
			className={styles.item}
			style={{transform: `translateY(${top}px)`}}
			ref={(node) => assignNode(index, node)}
		>
			{invokeRenderItem({
				item,
				index,
				style: ITEM_CONTENT_STYLE,
			})}
		</div>
	);
});

VirtualListItemCellInner.displayName = 'VirtualListItemCell';

export const VirtualListItemCell = VirtualListItemCellInner as <T>(
	props: VirtualListItemCellProps<T>
) => React.ReactElement;
