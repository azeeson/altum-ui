import {useCallback, useEffect, useRef} from 'react';
import type {KeyboardEvent} from 'react';
import {focusElement, type ArrowOrientation} from '../core/utils/a11y';
import {handleRovingFocusKeyDown} from '../core/utils/keyboard';

/** Маркер пункта roving-списка. */
export const ROVING_ITEM_ATTR = 'data-roving-item';

/**
 * Стрелки / Home / End по `[data-roving-item]` внутри `event.currentTarget`.
 * Disabled и `aria-disabled` пункты пропускаются. Фокус переносится на следующий;
 * `onMove` — только побочный эффект (выбор значения), без своей навигации.
 *
 * @param orientation - Ось стрелок. @default `'horizontal'`
 * @param onMove - После перевода фокуса.
 */
export function handleRovingListKeyDown(
	event: KeyboardEvent<HTMLElement>,
	orientation: ArrowOrientation = 'horizontal',
	onMove?: (el: HTMLElement) => void,
): void {
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
			onMove?.(next);
		},
	});
}

/**
 * `onKeyDown` для контейнера списка. Ось замыкается в хуке.
 *
 * @param orientation - Ось стрелок. @default `'horizontal'`
 * @param onMove - После перевода фокуса.
 * @returns Обработчик клавиатуры.
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
		handleRovingListKeyDown(event, orientation, (el) => onMoveRef.current?.(el));
	}, [orientation]);
}
