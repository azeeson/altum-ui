import type {
	TimelineProps,
} from './Timeline.types';
export type {
	TimelineItemStatus,
	TimelineItem,
	TimelineProps,
} from './Timeline.types';

import styles from './Timeline.module.css';
import utilities from '../../styles/utilities.module.css';
import {cn} from '../../core/utils/cn';

/** React на каждом коммите заново пишет атрибут `open` и сбрасывает жест пользователя. */
const openedOnce = new WeakSet<HTMLDetailsElement>();

function openDetailsOnce(node: HTMLDetailsElement | null) {
	if (!node || openedOnce.has(node)) return;
	openedOnce.add(node);
	node.open = true;
}

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
export function Timeline({
	items,
	orientation = 'vertical',
	currentId,
	defaultExpandedIds,
	className,
	rootRef,
	...rest
}: TimelineProps) {
	return (
		<ol
			ref={rootRef}
			className={cn(styles.timeline, className)}
			data-orientation={orientation}
			{...rest}
		>
			{items.map((item) => (
				<li
					key={item.id}
					className={styles.item}
					data-status={item.status ?? 'default'}
					data-current={currentId === item.id ? '' : undefined}
				>
					<div className={styles.rail} aria-hidden>
						<span className={cn(utilities.fCenter, styles.dot)}>
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
								ref={defaultExpandedIds?.includes(item.id) ? openDetailsOnce : undefined}
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
}
