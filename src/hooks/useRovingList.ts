import {useCallback, useEffect, useRef} from 'react';
import type {KeyboardEvent} from 'react';
import {focusElement, type ArrowOrientation} from '../utils/a11y';
import {handleRovingFocusKeyDown} from '../utils/keyboard';

/** Маркер пункта roving-списка. */
export const ROVING_ITEM_ATTR = 'data-roving-item';

/**
 * Стрелки / Home / End по `[data-roving-item]` внутри `event.currentTarget`.
 * Disabled и `aria-disabled` пункты пропускаются. Фокус переносится на следующий;
 * `onMove` — только побочный эффект (выбор значения), без своей навигации.
 *
 * @param orientation - Ось стрелок. @default `'horizontal'`
 * @param onMove - После перевода фокуса.
 * @returns `onKeyDown` для контейнера списка.
 * @example
 * <div onKeyDown={useRovingList('horizontal', (el) => select(el.dataset.value))}>
 */
export function useRovingList(
	orientation: ArrowOrientation = 'horizontal',
	onMove?: (el: HTMLElement) => void,
): (event: KeyboardEvent<HTMLElement>) => void {
	const onMoveRef = useRef(onMove);
	useEffect(() => {
		onMoveRef.current = onMove;
	}, [onMove]);

	return useCallback((event: KeyboardEvent<HTMLElement>) => {
		const items = Array.from(
			event.currentTarget.querySelectorAll<HTMLElement>(`[${ROVING_ITEM_ATTR}]`),
		).filter((el) => !el.hasAttribute('disabled') && el.getAttribute('aria-disabled') !== 'true');
		if (items.length === 0) return;

		const currentIndex = items.findIndex(
			(el) => el === event.target || el.contains(event.target as Node),
		);

		handleRovingFocusKeyDown(event, {
			currentIndex: currentIndex === -1 ? 0 : currentIndex,
			length: items.length,
			orientation,
			onMove: (nextIndex) => {
				const next = items[nextIndex];
				focusElement(next);
				onMoveRef.current?.(next);
			},
		});
	}, [orientation]);
}
