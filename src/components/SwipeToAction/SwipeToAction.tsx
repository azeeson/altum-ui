import {
	useCallback,
	useEffect,
	useRef,
	useState,
	useSyncExternalStore,
	type MouseEvent,
} from 'react';
import {
	type SwipeToActionProps,
	type TouchState,
} from './SwipeToAction.types';
import {
	calculateCappedX,
	findSwipeTriggerIndex,
	getSwipeTriggerAction,
} from './SwipeToAction.utils';
import {SwipeActionButtons} from './SwipeActionButtons';
import {getTranslateXFromTransform} from '../../core/utils/transform';
import {uRef} from '../../core/utils/bundle';
import {setPointerCapture, releasePointerCapture, setTranslate3d} from '../../core/utils/dom';
import {pointerDelta, lockPointerAxis} from '../../core/utils/math';
import {cn} from '../../core/utils/cn';
import styles from './SwipeToAction.module.css';

const DEFAULT_ACTION_WIDTH = 76;
const DEFAULT_TRIGGER_THRESHOLD = 200;
/** Порог (px), после которого жест считается свайпом и long-press отменяется. */
const SWIPE_LOCK_THRESHOLD = 10;
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

/**
 * Touch-обёртка: свайп раскрывает действия (как уведомления iOS).
 * Без собственного chrome строки — визуал только у кнопок действий.
 * На устройствах без touch / при reduced-motion рендерит только `children`.
 * Сдвиг пальца пишется в DOM и не перерисовывает строку.
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
export const SwipeToAction = ({
	children,
	leftActions = [],
	rightActions = [],
	closeOnOutsideClick = true,
	swipeToTriggerThreshold = DEFAULT_TRIGGER_THRESHOLD,
	actionWidth = DEFAULT_ACTION_WIDTH,
	className = '',
	style,
	rootRef,
	...rest
}: SwipeToActionProps) => {
	const isTouchDevice = useSyncExternalStore(
		() => () => {},
		() => 'ontouchstart' in window || navigator.maxTouchPoints > 0,
		() => false,
	);
	const [prefersReducedMotion] = useState(
		() => typeof window !== 'undefined' && window.matchMedia(REDUCED_MOTION_QUERY).matches,
	);

	const containerRef = useRef<HTMLDivElement>(null);
	const contentRef = useRef<HTMLDivElement>(null);
	const leftContainerRef = useRef<HTMLDivElement>(null);
	const rightContainerRef = useRef<HTMLDivElement>(null);
	const leftActionsRef = useRef(leftActions);
	const rightActionsRef = useRef(rightActions);
	leftActionsRef.current = leftActions;
	rightActionsRef.current = rightActions;

	const touchStartRef = useRef<TouchState>({
		x: 0,
		y: 0,
		currentX: 0,
	});
	const isSwipingRef = useRef(false);
	const swipeDirectionRef = useRef<'horizontal' | 'vertical' | null>(null);
	const activePointerRef = useRef<number | null>(null);

	const leftOpenWidth = leftActions.length * actionWidth;
	const rightOpenWidth = rightActions.length * actionWidth;
	const leftTriggerIndex = findSwipeTriggerIndex(leftActions);
	const rightTriggerIndex = findSwipeTriggerIndex(rightActions);
	const hasLeftTrigger = leftTriggerIndex >= 0;
	const hasRightTrigger = rightTriggerIndex >= 0;

	const swipeEnabled = isTouchDevice
		&& !prefersReducedMotion
		&& (leftActions.length > 0 || rightActions.length > 0);

	const syncContainersDOM = useCallback((
		cappedX: number,
		activeSide: 'left' | 'right' | null,
		transitionStr?: string,
	) => {
		const left = leftContainerRef.current;
		const right = rightContainerRef.current;
		const container = containerRef.current;

		if (left) {
			if (transitionStr !== undefined) left.style.transition = transitionStr;
			left.style.width = cappedX > 0 ? `${Math.abs(cappedX)}px` : '0px';
			left.style.visibility = cappedX > 0 ? 'visible' : 'hidden';
		}
		if (right) {
			if (transitionStr !== undefined) right.style.transition = transitionStr;
			right.style.width = cappedX < 0 ? `${Math.abs(cappedX)}px` : '0px';
			right.style.visibility = cappedX < 0 ? 'visible' : 'hidden';
		}

		if (container) {
			if (activeSide) container.setAttribute('data-full-swipe-active', activeSide);
			else container.removeAttribute('data-full-swipe-active');
		}
	}, []);

	const handleAnimateTo = useCallback((targetX: number, callback?: () => void) => {
		const contentEl = contentRef.current;
		if (!contentEl) return;

		const duration = prefersReducedMotion ? '0.01s' : '0.32s';
		const animConfig = `transform ${duration} cubic-bezier(0.32, 0.72, 0, 1)`;
		const sizeConfig = `width ${duration} cubic-bezier(0.32, 0.72, 0, 1), visibility ${duration}`;

		contentEl.style.transition = animConfig;
		setTranslate3d(contentEl, targetX);

		syncContainersDOM(targetX, null, sizeConfig);

		touchStartRef.current.currentX = targetX;

		if (callback) {
			window.setTimeout(callback, prefersReducedMotion ? 0 : 300);
		}
	}, [prefersReducedMotion, syncContainersDOM]);

	useEffect(() => {
		if (!closeOnOutsideClick || !swipeEnabled) return;
		const onPointerDown = (event: PointerEvent) => {
			const root = containerRef.current;
			if (!root || root.contains(event.target as Node)) return;
			if (touchStartRef.current.currentX === 0) return;
			handleAnimateTo(0);
		};
		document.addEventListener('pointerdown', onPointerDown);
		return () => document.removeEventListener('pointerdown', onPointerDown);
	}, [closeOnOutsideClick, swipeEnabled, handleAnimateTo]);

	useEffect(() => {
		const contentEl = contentRef.current;
		if (!contentEl || !swipeEnabled) return;

		const onPointerDown = (e: PointerEvent) => {
			if (e.pointerType === 'mouse' && e.button !== 0) return;

			touchStartRef.current = {
				x: e.clientX,
				y: e.clientY,
				currentX: touchStartRef.current.currentX,
			};

			isSwipingRef.current = true;
			swipeDirectionRef.current = null;
			activePointerRef.current = e.pointerId;
			contentEl.style.transition = 'none';

			syncContainersDOM(touchStartRef.current.currentX, null, 'none');
		};

		const onPointerMove = (e: PointerEvent) => {
			if (!isSwipingRef.current || activePointerRef.current !== e.pointerId) return;

			const diffX = pointerDelta(e.clientX, touchStartRef.current.x)
				+ touchStartRef.current.currentX;
			const diffY = pointerDelta(e.clientY, touchStartRef.current.y);

			if (swipeDirectionRef.current === null) {
				const axis = lockPointerAxis(
					pointerDelta(e.clientX, touchStartRef.current.x),
					diffY,
					SWIPE_LOCK_THRESHOLD,
				);
				if (axis) {
					swipeDirectionRef.current = axis;
					if (axis === 'horizontal') {
						setPointerCapture(contentEl, e.pointerId);
						const host = containerRef.current?.closest<HTMLElement>('[data-action-sheet-trigger]');
						if (host?.hasAttribute('data-overflow-open')) {
							host.querySelector<HTMLElement>('[data-overflow-trigger]')?.click();
						}
					}
				}
			}

			if (swipeDirectionRef.current === 'vertical') {
				isSwipingRef.current = false;
				activePointerRef.current = null;
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

				setTranslate3d(contentEl, cappedX);
				syncContainersDOM(cappedX, activeSide);
			}
		};

		const endSwipe = (e: PointerEvent) => {
			if (activePointerRef.current !== e.pointerId) return;
			releasePointerCapture(contentEl, e.pointerId);
			activePointerRef.current = null;

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

		contentEl.addEventListener('pointerdown', onPointerDown);
		contentEl.addEventListener('pointermove', onPointerMove);
		contentEl.addEventListener('pointerup', endSwipe);
		contentEl.addEventListener('pointercancel', endSwipe);

		return () => {
			contentEl.removeEventListener('pointerdown', onPointerDown);
			contentEl.removeEventListener('pointermove', onPointerMove);
			contentEl.removeEventListener('pointerup', endSwipe);
			contentEl.removeEventListener('pointercancel', endSwipe);
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
		syncContainersDOM,
	]);

	const handleActionClick = useCallback((actionFn: () => void): void => {
		handleAnimateTo(0, actionFn);
	}, [handleAnimateTo]);

	const onRootClick = (event: MouseEvent<HTMLDivElement>) => {
		const button = (event.target as HTMLElement).closest<HTMLButtonElement>('button[data-action-id]');
		if (!button || !event.currentTarget.contains(button)) return;
		const id = button.getAttribute('data-action-id');
		if (!id) return;
		const action = leftActionsRef.current.find((item) => item.id === id)
			?? rightActionsRef.current.find((item) => item.id === id);
		if (action) handleActionClick(action.onClick);
	};

	if (!swipeEnabled) {
		return (
			<div
				ref={rootRef}
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
			ref={uRef(containerRef, rootRef)}
			className={cn(styles.root, className)}
			style={{
				...style,
				['--altum-swipe-action-width' as string]: `${actionWidth}px`,
			}}
			onClick={onRootClick}
			{...rest}
		>
			<SwipeActionButtons
				actions={leftActions}
				side='left'
				triggerIndex={leftTriggerIndex}
				containerRef={leftContainerRef}
			/>
			<SwipeActionButtons
				actions={rightActions}
				side='right'
				triggerIndex={rightTriggerIndex}
				containerRef={rightContainerRef}
			/>
			<div ref={contentRef} className={styles.content}>
				{children}
			</div>
		</div>
	);
};
