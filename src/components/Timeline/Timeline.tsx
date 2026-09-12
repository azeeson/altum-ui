import type {
	TimelineProps,
} from './Timeline.types';
export type {
	TimelineItemStatus,
	TimelineItem,
	TimelineProps,
} from './Timeline.types';

import {forwardRef} from 'react';
import styles from './Timeline.module.css';
import {cn} from '../../utils/cn';

/**
 * Таймлайн: vertical/horizontal, collapsible details, current крупнее.
 *
 * @component
 * @example
 * <Timeline
 *   orientation="horizontal"
 *   currentId="2"
 *   items={[{ id: '1', title: 'Создан', details: '…' }]}
 * />
 */
export const Timeline = forwardRef<HTMLOListElement, TimelineProps>(function Timeline(
	{
		items,
		orientation = 'vertical',
		currentId,
		defaultExpandedIds,
		className,
		...rest
	},
	ref,
) {
	return (
		<ol
			ref={ref}
			className={cn(styles.timeline, styles[orientation], className)}
			{...rest}
		>
			{items.map((item) => (
				<li
					key={item.id}
					className={cn(styles.item, currentId === item.id && styles.current)}
					data-status={item.status ?? 'default'}
				>
					<div className={styles.rail} aria-hidden>
						<span className={styles.dot}>
							{item.icon}
						</span>
						<span className={styles.line} />
					</div>
					<div className={styles.body}>
						<div className={styles.header}>
							<span className={styles.title}>
								{item.title}
							</span>
							{item.time != null && (
								<span className={styles.time}>
									{item.time}
								</span>
							)}
						</div>
						{item.description != null && (
							<div className={styles.description}>
								{item.description}
							</div>
						)}
						{item.details != null && (
							<details
								className={styles.details}
								ref={(node) => {
									if (!node || node.dataset.o != null) return;
									node.dataset.o = '';
									if (defaultExpandedIds?.includes(item.id)) node.open = true;
								}}
							>
								<summary className={styles.summary}>
									›
								</summary>
								<div className={styles.panel}>
									{item.details}
								</div>
							</details>
						)}
					</div>
				</li>
			))}
		</ol>
	);
});

Timeline.displayName = 'Timeline';
