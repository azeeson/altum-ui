import type {Ref} from 'react';
import type {SwipeAction} from './SwipeToAction.types';
import {cn} from '../../core/utils/cn';
import styles from './SwipeToAction.module.css';

interface SwipeActionButtonsProps {
	actions: SwipeAction[];
	side: 'left' | 'right';
	/** Индекс действия с `swipeToTrigger` (−1 если нет). */
	triggerIndex: number;
	/** Панель действий: ширина пишется напрямую во время жеста. */
	containerRef: Ref<HTMLDivElement>;
}

/**
 * Кнопки действий за контентом (iOS-стиль): на всю высоту строки.
 * Растяжение полного свайпа — CSS по `data-full-swipe-active` на корне.
 * Клики делегируются на корень `SwipeToAction` через `data-action-id`.
 */
export const SwipeActionButtons = ({
	actions,
	side,
	triggerIndex,
	containerRef,
}: SwipeActionButtonsProps) => {
	if (actions.length === 0) return null;

	const isLeft = side === 'left';
	const containerClass = isLeft ? styles.actionContainerLeft : styles.actionContainerRight;

	return (
		<div
			ref={containerRef}
			className={cn(styles.actionContainer, containerClass)}
			data-side={side}
			aria-hidden={false}
		>
			{actions.map((act, index) => (
				<button
					key={act.id}
					type='button'
					className={styles.actionButton}
					style={{background: act.bg || 'var(--altum-color-brand)'}}
					aria-label={act.label}
					data-action-id={act.id}
					data-swipe-trigger={triggerIndex === index ? '' : undefined}
				>
					{act.icon != null && (
						<span className={styles.actionIcon} aria-hidden>
							{act.icon}
						</span>
					)}
					<span className={styles.actionLabel}>
						{act.label}
					</span>
				</button>
			))}
		</div>
	);
};
