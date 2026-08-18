import type {ActionSheetTriggerProps} from './ActionSheetTrigger.types';
export type {
	ActionSheetTriggerProps,
} from './ActionSheetTrigger.types';

import React, {forwardRef, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {MOBILE_MEDIA_QUERY, useMediaQuery} from '../../hooks/useMediaQuery';
import {useLongPress} from '../../hooks/useLongPress';
import {cn} from '../../utils/cn';
import {composeEventHandlers} from '../../utils/composeEvents';
import {Slot} from '../../utils/slot';
import {ActionSheetProvider, type ActionSheetContextValue} from './actionSheetContext';
import styles from './ActionSheetTrigger.module.css';

const TRIGGER_PULSE_MS = 320;

/**
 * Обёртка: long-press открывает вложенный `OverflowActions`.
 * При срабатывании — лёгкий scale-pulse (отключается при `prefers-reduced-motion`).
 * На тач-мобиле может скрывать кнопку ⋯ (`showOverflowTrigger={false}`).
 * Совместим со `SwipeToAction`: движение / свайп отменяет pending long-press.
 * Хост по умолчанию — `div` (зона жеста). Для семантики кнопки — `asChild` на `<button>`.
 * Скрытый ⋯ у вложенного `OverflowActions` остаётся в Tab-порядке.
 *
 * @component
 * @example
 * <ActionSheetTrigger>
 *   <SwipeToAction rightActions={…}>
 *     <Item>…</Item>
 *   </SwipeToAction>
 *   <OverflowActions visibleCount={0}>…</OverflowActions>
 * </ActionSheetTrigger>
 */
export const ActionSheetTrigger = forwardRef<HTMLDivElement, ActionSheetTriggerProps>(
	function ActionSheetTrigger(
		{
			children,
			asChild = false,
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
			...rest
		},
		ref,
	) {
		const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY);
		const [isTouch, setIsTouch] = useState(false);
		const [overflowOpen, setOverflowOpen] = useState(false);
		const [isTriggered, setIsTriggered] = useState(false);
		const pulseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
		const pulseRafRef = useRef<number[]>([]);

		useEffect(() => {
		 
			setIsTouch(typeof window !== 'undefined'
			&& ('ontouchstart' in window || navigator.maxTouchPoints > 0));
		}, []);

		const clearPulseTimers = useCallback(() => {
			pulseRafRef.current.forEach((id) => cancelAnimationFrame(id));
			pulseRafRef.current = [];
			if (pulseTimeoutRef.current != null) {
				clearTimeout(pulseTimeoutRef.current);
				pulseTimeoutRef.current = null;
			}
		}, []);

		useEffect(() => () => clearPulseTimers(), [clearPulseTimers]);

		const isTouchMobile = isTouch && isMobile;
		const shouldShowOverflowTrigger = showOverflowTrigger || !isTouchMobile;

		const playTriggerPulse = useCallback(() => {
			if (typeof window !== 'undefined'
			&& window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
				return;
			}
			clearPulseTimers();
			setIsTriggered(false);
			const outer = requestAnimationFrame(() => {
				const inner = requestAnimationFrame(() => {
					setIsTriggered(true);
					pulseTimeoutRef.current = setTimeout(() => {
						setIsTriggered(false);
						pulseTimeoutRef.current = null;
					}, TRIGGER_PULSE_MS);
				});
				pulseRafRef.current.push(inner);
			});
			pulseRafRef.current.push(outer);
		}, [clearPulseTimers]);

		const openOverflow = useCallback(() => {
			if (disabled) return;
			playTriggerPulse();
			setOverflowOpen(true);
		}, [disabled, playTriggerPulse]);

		const closeOverflow = useCallback(() => {
			setOverflowOpen(false);
		}, []);

		const longPress = useLongPress(openOverflow, {
			delay: longPressMs,
			disabled,
			moveThreshold,
		});

		const contextValue = useMemo<ActionSheetContextValue>(() => ({
			openOverflow,
			closeOverflow,
			overflowOpen,
			setOverflowOpen,
			shouldShowOverflowTrigger,
			cancelLongPress: longPress.cancel,
		}), [
			openOverflow,
			closeOverflow,
			overflowOpen,
			shouldShowOverflowTrigger,
			longPress.cancel,
		]);

		const hostProps = {
			...rest,
			className: cn(
				styles.host,
				isTriggered && styles.hostTriggered,
				className,
			),
			onPointerDown: composeEventHandlers(onPointerDown, longPress.onPointerDown),
			onPointerUp: composeEventHandlers(onPointerUp, longPress.onPointerUp),
			onPointerCancel: composeEventHandlers(onPointerCancel, longPress.onPointerCancel),
			onContextMenu: composeEventHandlers(onContextMenu, longPress.onContextMenu),
			onClick: composeEventHandlers(onClick, longPress.onClick),
			'data-action-sheet-trigger': '',
			'data-triggered': isTriggered ? '' : undefined,
		};

		return (
			<ActionSheetProvider value={contextValue}>
				{asChild ? (
					<Slot ref={ref} {...hostProps}>
						{children}
					</Slot>
				) : (
					<div ref={ref} {...hostProps}>
						{children}
					</div>
				)}
			</ActionSheetProvider>
		);
	}
);

ActionSheetTrigger.displayName = 'ActionSheetTrigger';
