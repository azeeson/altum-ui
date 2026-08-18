import React from 'react';
import type {SwipeAction} from './SwipeToAction.types';
import {cn} from '../../utils/cn';
import styles from './SwipeToAction.module.css';

interface SwipeActionButtonsProps {
	actions: SwipeAction[];
	side: 'left' | 'right';
	/** Индекс действия с `swipeToTrigger` (−1 если нет). */
	triggerIndex: number;
	isFullSwipeActive: boolean;
	onActionClick: (actionFn: () => void) => void;
}

/**
 * Кнопки действий за контентом (iOS-стиль): на всю высоту строки.
 */
export const SwipeActionButtons: React.FC<SwipeActionButtonsProps> = ({
	actions,
	side,
	triggerIndex,
	isFullSwipeActive,
	onActionClick,
}) => {
	if (actions.length === 0) return null;

	const isLeft = side === 'left';
	const containerClass = isLeft ? styles.actionContainerLeft : styles.actionContainerRight;
	const expandIndex = isFullSwipeActive && triggerIndex >= 0 ? triggerIndex : -1;

	return (
		<div
			className={cn(styles.actionContainer, containerClass)}
			data-full-swipe={isFullSwipeActive && triggerIndex >= 0 ? 'true' : undefined}
			data-side={side}
			aria-hidden={false}
		>
			{actions.map((act, index) => {
				const isTriggerExpanded = expandIndex === index;
				const isCollapsed = expandIndex >= 0 && expandIndex !== index;

				return (
					<button
						key={act.id}
						type='button'
						onClick={() => onActionClick(act.onClick)}
						className={cn(
							styles.actionButton,
							isTriggerExpanded && styles.actionButtonExpanded,
							isCollapsed && styles.actionButtonCollapsed,
						)}
						style={{background: act.bg || 'var(--altum-color-brand)'}}
						aria-label={act.label}
					>
						{act.icon != null && (
							<span className={styles.actionIcon} aria-hidden>
								{act.icon}
							</span>
						)}
						<span className={styles.actionLabel}>
							{isTriggerExpanded ? act.label : act.label}
						</span>
					</button>
				);
			})}
		</div>
	);
};
