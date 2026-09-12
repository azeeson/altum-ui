import type {
	DescriptionListProps,
} from './DescriptionList.types';
export type {
	DescriptionListItem,
	DescriptionListProps,
} from './DescriptionList.types';

import {forwardRef, type CSSProperties} from 'react';
import styles from './DescriptionList.module.css';
import {cn} from '../../utils/cn';

/**
 * Список описаний (key–value) для карточки сущности и read-only настроек.
 *
 * @component
 * @example
 * <DescriptionList items={[{ label: 'Эл. почта', value: 'a@b.c' }]} />
 */
export const DescriptionList = forwardRef<HTMLDListElement, DescriptionListProps>(
	function DescriptionList(
		{
			items,
			layout = 'stacked',
			columns = 1,
			className,
			style,
			...rest
		},
		ref,
	) {
		return (
			<dl
				ref={ref}
				className={cn(styles.list, styles[layout], className)}
				{...rest}
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
	},
);

DescriptionList.displayName = 'DescriptionList';
