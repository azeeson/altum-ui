import type {DescriptionListProps} from './DescriptionList.types';
export type {
	DescriptionListItem,
	DescriptionListProps,
} from './DescriptionList.types';

import type {CSSProperties} from 'react';
import styles from './DescriptionList.module.css';
import {cn} from '../../core/utils/cn';

/**
 * Список описаний (key–value) для карточки сущности и read-only настроек.
 *
 * @component
 * @example
 * <DescriptionList items={[{ label: 'Эл. почта', value: 'a@b.c' }]} />
 */
export function DescriptionList({
	items,
	layout = 'stacked',
	columns = 1,
	className,
	style,
	rootRef,
	...rest
}: DescriptionListProps) {
	return (
		<dl
			{...rest}
			ref={rootRef}
			className={cn(styles.list, className)}
			data-layout={layout}
			style={{
				'--altum-dl-cols': columns,
				...style,
			} as CSSProperties}
		>
			{items.map((item, index) => (
				<div key={item.id ?? index} className={styles.row}>
					<dt className={styles.label}>
						{item.label}
					</dt>
					<dd className={styles.value}>
						{item.value}
					</dd>
				</div>
			))}
		</dl>
	);
}
