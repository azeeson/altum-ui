import React, {
	forwardRef,
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react';
import {
	type SwipeToActionProps,
	type TouchState,
} from './SwipeToAction.types';
import {
	calculateCappedX,
	findSwipeTriggerIndex,
	getSwipeActionContainers,
	getSwipeTriggerAction,
	getTouchCoordinates,
	syncSwipeActionContainers,
} from './SwipeToAction.utils';
import {SwipeActionButtons} from './SwipeActionButtons';
import {useActionSheetContext} from '../ActionSheetTrigger/actionSheetContext';
import {useOutsideClick} from '../../hooks/useOutsideClick';
import {usePrefersReducedMotion} from '../../hooks/usePrefersReducedMotion';
import {getTranslateXFromTransform} from '../../utils/transform';
import {cn} from '../../utils/cn';
import {composeRefs} from '../../utils/composeRefs';
import styles from './SwipeToAction.module.css';

const DEFAULT_ACTION_WIDTH = 76;
const DEFAULT_TRIGGER_THRESHOLD = 200;
/** Порог (px), после которого жест считается свайпом и long-press отменяется. */
const SWIPE_LOCK_THRESHOLD = 10;

/**
 * Touch-обёртка: свайп раскрывает действия (как уведомления iOS).
 * Без собственного chrome строки — визуал только у кнопок действий.
 * На устройствах без touch / при reduced-motion рендерит только `children`.
 *
 * @component
 * @example
 * <SwipeToAction
 *   rightActions={[
 *     { id: 'archive', label: 'Архив', icon: <IconArchive />, onClick: … },
 *     { id: 'delete', label: 'Удалить', icon: <IconTrash />, onClick: …, swipeToTrigger: true, bg: 'var(--altum-color-status-error)' },
 *   ]}
 * >
 *   <Item interactive>…</Item>
 * </SwipeToAction>
 */
export const SwipeToAction = forwardRef<HTMLDivElement, SwipeToActionProps>(function SwipeToAction(
	{
		children,
		leftActions = [],
		rightActions = [],
		closeOnOutsideClick = true,
		swipeToTriggerThreshold = DEFAULT_TRIGGER_THRESHOLD,
		actionWidth = DEFAULT_ACTION_WIDTH,
		className = '',
		style,
		...rest
	},
	ref,
) {
	const [isTouchDevice, setIsTouchDevice] = useState(false);
	const [isFullSwipeActive, setIsFullSwipeActive] = useState<'left' | 'right' | null>(null);
	const prefersReducedMotion = usePrefersReducedMotion();
	const actionSheet = useActionSheetContext();
	const actionSheetRef = useRef(actionSheet);
	useEffect(() => {
		actionSheetRef.current = actionSheet;
	});

	const containerRef = useRef<HTMLDivElement>(null);
	const contentRef = useRef<HTMLDivElement>(null);
	const isFullSwipeActiveRef = useRef<'left' | 'right' | null>(null);

	const touchStartRef = useRef<TouchState>({
		x: 0,
		y: 0,
		currentX: 0,
	});
	const isSwipingRef = useRef(false);
	const swipeDirectionRef = useRef<'horizontal' | 'vertical' | null>(null);

	const leftOpenWidth = leftActions.length * actionWidth;
	const rightOpenWidth = rightActions.length * actionWidth;
	const leftTriggerIndex = findSwipeTriggerIndex(leftActions);
	const rightTriggerIndex = findSwipeTriggerIndex(rightActions);
	const hasLeftTrigger = leftTriggerIndex >= 0;
	const hasRightTrigger = rightTriggerIndex >= 0;

	const swipeEnabled = isTouchDevice
		&& !prefersReducedMotion
		&& (leftActions.length > 0 || rightActions.length > 0);

	const setFullSwipeActive = useCallback((side: 'left' | 'right' | null) => {
		if (isFullSwipeActiveRef.current === side) return;
		isFullSwipeActiveRef.current = side;
		setIsFullSwipeActive(side);
	}, []);

	useEffect(() => {
		 
		setIsTouchDevice(
			typeof window !== 'undefined'
			&& ('ontouchstart' in window || navigator.maxTouchPoints > 0),
		);
	}, []);

	const handleAnimateTo = useCallback((targetX: number, callback?: () => void) => {
		const contentEl = contentRef.current;
		const containerEl = containerRef.current;
		if (!contentEl) return;

		const duration = prefersReducedMotion ? '0.01s' : '0.32s';
		const animConfig = `transform ${duration} cubic-bezier(0.32, 0.72, 0, 1)`;
		const sizeConfig = `width ${duration} cubic-bezier(0.32, 0.72, 0, 1), visibility ${duration}`;

		contentEl.style.transition = animConfig;
		contentEl.style.transform = `translateX(${targetX}px)`;

		if (containerEl) {
			syncSwipeActionContainers(
				getSwipeActionContainers(
					containerEl,
					styles.actionContainerLeft,
					styles.actionContainerRight,
				),
				targetX,
				{transition: sizeConfig},
			);
		}

		touchStartRef.current.currentX = targetX;
		setFullSwipeActive(null);

		if (callback) {
			window.setTimeout(callback, prefersReducedMotion ? 0 : 300);
		}
	}, [prefersReducedMotion, setFullSwipeActive]);

	useOutsideClick(
		containerRef,
		() => handleAnimateTo(0),
		{enabled: closeOnOutsideClick && swipeEnabled},
	);

	useEffect(() => {
		const contentEl = contentRef.current;
		if (!contentEl || !swipeEnabled) return;

		const onTouchStart = (e: globalThis.TouchEvent) => {
			const coords = getTouchCoordinates(e);
			if (!coords) return;

			touchStartRef.current = {
				x: coords.clientX,
				y: coords.clientY,
				currentX: touchStartRef.current.currentX,
			};

			isSwipingRef.current = true;
			swipeDirectionRef.current = null;
			contentEl.style.transition = 'none';

			const containerEl = containerRef.current;
			if (containerEl) {
				syncSwipeActionContainers(
					getSwipeActionContainers(
						containerEl,
						styles.actionContainerLeft,
						styles.actionContainerRight,
					),
					touchStartRef.current.currentX,
					{transition: 'none'},
				);
			}
		};

		const onTouchMove = (e: globalThis.TouchEvent) => {
			const coords = getTouchCoordinates(e);
			if (!isSwipingRef.current || !coords) return;

			const diffX = coords.clientX - touchStartRef.current.x + touchStartRef.current.currentX;
			const diffY = coords.clientY - touchStartRef.current.y;

			if (swipeDirectionRef.current === null) {
				const absX = Math.abs(coords.clientX - touchStartRef.current.x);
				const absY = Math.abs(diffY);
				if (absX > SWIPE_LOCK_THRESHOLD || absY > SWIPE_LOCK_THRESHOLD) {
					swipeDirectionRef.current = absX > absY ? 'horizontal' : 'vertical';
					if (swipeDirectionRef.current === 'horizontal') {
						// Не даём ActionSheetTrigger открыть меню во время свайпа
						actionSheetRef.current?.cancelLongPress();
						if (actionSheetRef.current?.overflowOpen) {
							actionSheetRef.current.setOverflowOpen(false);
						}
					}
				}
			}

			if (swipeDirectionRef.current === 'vertical') {
				isSwipingRef.current = false;
				return;
			}

			if (swipeDirectionRef.current === 'horizontal') {
				if (e.cancelable) e.preventDefault();

				const {cappedX, activeSide} = calculateCappedX({
					diffX,
					leftOpenWidth,
					rightOpenWidth,
					swipeToTriggerThreshold,
					hasLeftTrigger,
					hasRightTrigger,
					hasLeftActions: leftActions.length > 0,
					hasRightActions: rightActions.length > 0,
				});

				setFullSwipeActive(activeSide);
				contentEl.style.transform = `translateX(${cappedX}px)`;

				const containerEl = containerRef.current;
				if (containerEl) {
					syncSwipeActionContainers(
						getSwipeActionContainers(
							containerEl,
							styles.actionContainerLeft,
							styles.actionContainerRight,
						),
						cappedX,
					);
				}
			}
		};

		const onTouchEnd = () => {
			if (!isSwipingRef.current) return;
			isSwipingRef.current = false;

			const finalX = getTranslateXFromTransform(contentEl.style.transform);

			if (finalX > swipeToTriggerThreshold && hasLeftTrigger) {
				const trigger = getSwipeTriggerAction(leftActions);
				handleAnimateTo(0, () => trigger?.onClick());
				return;
			}
			if (finalX < -swipeToTriggerThreshold && hasRightTrigger) {
				const trigger = getSwipeTriggerAction(rightActions);
				handleAnimateTo(0, () => trigger?.onClick());
				return;
			}

			let targetX = 0;
			if (finalX > 0 && leftActions.length > 0) {
				targetX = finalX > leftOpenWidth * 0.4 ? leftOpenWidth : 0;
			} else if (finalX < 0 && rightActions.length > 0) {
				targetX = finalX < -rightOpenWidth * 0.4 ? -rightOpenWidth : 0;
			}

			handleAnimateTo(targetX);
		};

		contentEl.addEventListener('touchstart', onTouchStart);
		contentEl.addEventListener('touchmove', onTouchMove, {passive: false});
		contentEl.addEventListener('touchend', onTouchEnd);

		return () => {
			contentEl.removeEventListener('touchstart', onTouchStart);
			contentEl.removeEventListener('touchmove', onTouchMove);
			contentEl.removeEventListener('touchend', onTouchEnd);
		};
	}, [
		swipeEnabled,
		leftActions,
		rightActions,
		leftOpenWidth,
		rightOpenWidth,
		swipeToTriggerThreshold,
		hasLeftTrigger,
		hasRightTrigger,
		handleAnimateTo,
		setFullSwipeActive,
	]);

	const handleActionClick = (actionFn: () => void): void => {
		handleAnimateTo(0, actionFn);
	};

	if (!swipeEnabled) {
		return (
			<div
				ref={ref}
				className={cn(styles.passthrough, className)}
				style={style}
				{...rest}
			>
				{children}
			</div>
		);
	}

	return (
		<div
			ref={composeRefs(ref, containerRef)}
			className={cn(styles.root, className)}
			style={{
				...style,
				['--altum-swipe-action-width' as string]: `${actionWidth}px`,
			}}
			{...rest}
		>
			<SwipeActionButtons
				actions={leftActions}
				side='left'
				triggerIndex={leftTriggerIndex}
				isFullSwipeActive={isFullSwipeActive === 'left'}
				onActionClick={handleActionClick}
			/>
			<SwipeActionButtons
				actions={rightActions}
				side='right'
				triggerIndex={rightTriggerIndex}
				isFullSwipeActive={isFullSwipeActive === 'right'}
				onActionClick={handleActionClick}
			/>
			<div ref={contentRef} className={styles.content}>
				{children}
			</div>
		</div>
	);
});

SwipeToAction.displayName = 'SwipeToAction';
