import type {
	TimelineProps,
} from './Timeline.types';
export type {
	TimelineItemStatus,
	TimelineItem,
	TimelineProps,
} from './Timeline.types';

import React, {forwardRef, useState} from 'react';
import styles from './Timeline.module.css';
import {cn} from '../../utils/cn';
import {useLocale} from '../LocaleProvider/LocaleProvider';

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
	const {t} = useLocale();
	const [expanded, setExpanded] = useState<Set<string>>(
		() => new Set(defaultExpandedIds ?? []),
	);

	const toggle = (id: string) => {
		setExpanded((prev) => {
			const next = new Set(prev);
			if (next.has(id)) next.delete(id);
			else next.add(id);
			return next;
		});
	};

	return (
		<ol
			ref={ref}
			className={cn(styles.timeline, styles[orientation], className)}
			data-orientation={orientation}
			{...rest}
		>
			{items.map((item, index) => {
				const status = item.status ?? 'default';
				const isLast = index === items.length - 1;
				const isCurrent = currentId === item.id;
				const isOpen = expanded.has(item.id);
				const hasDetails = item.details != null;

				return (
					<li
						key={item.id}
						className={cn(
							styles.item,
							styles[status],
							isLast ? styles.last : '',
							isCurrent ? styles.current : '',
						)}
					>
						<div className={styles.rail} aria-hidden>
							<span className={styles.dot}>
								{item.icon}
							</span>
							{!isLast && <span className={styles.line} />}
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
							{hasDetails && (
								<>
									<button
										type='button'
										className={styles.detailsToggle}
										aria-expanded={isOpen}
										onClick={() => toggle(item.id)}
									>
										{isOpen ? t('timeline.hide') : t('timeline.more')}
									</button>
									{isOpen && (
										<div className={styles.details}>
											{item.details}
										</div>
									)}
								</>
							)}
						</div>
					</li>
				);
			})}
		</ol>
	);
});

Timeline.displayName = 'Timeline';
