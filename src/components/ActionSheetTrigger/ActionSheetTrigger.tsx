import type {ActionSheetTriggerProps} from './ActionSheetTrigger.types';
export type {
	ActionSheetTriggerProps,
} from './ActionSheetTrigger.types';

import {forwardRef, useCallback, useMemo, useState} from 'react';
import {MOBILE_MEDIA_QUERY, useMediaQuery} from '../../hooks/useMediaQuery';
import {useLongPress} from '../../hooks/useLongPress';
import {cn} from '../../utils/cn';
import {composeEventHandlers} from '../../utils/composeEvents';
import {ActionSheetProvider, type ActionSheetContextValue} from './actionSheetContext';
import styles from './ActionSheetTrigger.module.css';

/**
 * Обёртка: long-press открывает вложенный `Overflow`.
 * При срабатывании — CSS scale-pulse (отключается при `prefers-reduced-motion`).
 * На coarse + mobile может скрывать кнопку ⋯ (`showOverflowTrigger={false}`).
 * Совместим со `SwipeToAction`: движение / свайп отменяет pending long-press.
 * Хост — `div` (зона жеста). Скрытый ⋯ у вложенного `Overflow` остаётся в Tab-порядке.
 *
 * @component
 * @example
 * <ActionSheetTrigger>
 *   <SwipeToAction rightActions={…}>
 *     <Item>…</Item>
 *   </SwipeToAction>
 *   <Overflow visibleCount={0}>…</Overflow>
 * </ActionSheetTrigger>
 */
export const ActionSheetTrigger = forwardRef<HTMLDivElement, ActionSheetTriggerProps>(
	function ActionSheetTrigger(
		{
			children,
			showOverflowTrigger = false,
			longPressMs = 500,
			moveThreshold = 8,
			disabled = false,
			className,
			onPointerDown,
			onPointerUp,
			onPointerCancel,
			onContextMenu,
			onClick,
			onAnimationEnd,
			...rest
		},
		ref,
	) {
		const coarseMobile = useMediaQuery(`(hover: none) and ${MOBILE_MEDIA_QUERY}`);
		const [overflowOpen, setOverflowOpen] = useState(false);
		const [isTriggered, setIsTriggered] = useState(false);
		const shouldShowOverflowTrigger = showOverflowTrigger || !coarseMobile;

		const openOverflow = useCallback(() => {
			if (disabled) return;
			setIsTriggered(true);
			setOverflowOpen(true);
		}, [disabled]);

		const longPress = useLongPress(openOverflow, {
			delay: longPressMs,
			disabled,
			moveThreshold,
		});

		const contextValue = useMemo<ActionSheetContextValue>(() => ({
			overflowOpen,
			setOverflowOpen,
			shouldShowOverflowTrigger,
			cancelLongPress: longPress.cancel,
		}), [overflowOpen, shouldShowOverflowTrigger, longPress.cancel]);

		return (
			<ActionSheetProvider value={contextValue}>
				<div
					ref={ref}
					{...rest}
					className={cn(
						styles.host,
						isTriggered && styles.hostTriggered,
						className,
					)}
					onPointerDown={composeEventHandlers(onPointerDown, longPress.onPointerDown)}
					onPointerUp={composeEventHandlers(onPointerUp, longPress.onPointerUp)}
					onPointerCancel={composeEventHandlers(onPointerCancel, longPress.onPointerCancel)}
					onContextMenu={composeEventHandlers(onContextMenu, longPress.onContextMenu)}
					onClick={composeEventHandlers(onClick, longPress.onClick)}
					onAnimationEnd={composeEventHandlers(onAnimationEnd, (event) => {
						if (event.target === event.currentTarget) setIsTriggered(false);
					})}
					data-action-sheet-trigger=''
				>
					{children}
				</div>
			</ActionSheetProvider>
		);
	}
);

ActionSheetTrigger.displayName = 'ActionSheetTrigger';
