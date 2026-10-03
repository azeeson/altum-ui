import type React from 'react';
import {type ArrowOrientation, focusElement, getGridIndex, getNextIndex} from './a11y';

export function isKey(
	event: React.KeyboardEvent | KeyboardEvent,
	key: string,
): boolean {
	return event.key === key;
}

export function handleEnterKeyDown(
	event: React.KeyboardEvent,
	action: () => void,
): void {
	if (!isKey(event, 'Enter')) {
		return;
	}

	event.preventDefault();
	action();
}

/**
 * Стрелки, Home и End по `[role="gridcell"]` внутри контейнера.
 * Фокус двигается в DOM, индекс зажимается у краёв сетки.
 *
 * @param event - Клавиатурное событие на контейнере сетки.
 * @param columns - Число колонок (шаг ArrowUp / ArrowDown).
 * @returns `true`, если клавиша была навигационной.
 */
export function handleGridFocusKeyDown(
	event: React.KeyboardEvent<HTMLElement>,
	columns: number,
): boolean {
	const cells = Array.from(
		event.currentTarget.querySelectorAll<HTMLElement>('[role="gridcell"]'),
	);
	const next = getGridIndex(
		cells.indexOf(document.activeElement as HTMLElement),
		cells.length,
		event.key,
		columns,
	);
	if (next === null) return false;
	event.preventDefault();
	focusElement(cells[next]);
	return true;
}

export function handleRovingFocusKeyDown(
	event: React.KeyboardEvent,
	params: {
		currentIndex: number;
		length: number;
		orientation?: ArrowOrientation;
		onMove: (nextIndex: number) => void;
	},
): void {
	if (params.length === 0 || params.currentIndex === -1) {
		return;
	}

	const nextIndex = getNextIndex(
		params.currentIndex,
		params.length,
		event.key,
		params.orientation ?? 'horizontal',
	);

	if (nextIndex === null) {
		return;
	}

	event.preventDefault();
	params.onMove(nextIndex);
}

export function handleArrowPairKeyDown(
	event: React.KeyboardEvent | KeyboardEvent,
	onPrev: () => void,
	onNext: () => void,
): boolean {
	if (isKey(event, 'ArrowLeft')) {
		event.preventDefault();
		onPrev();
		return true;
	}

	if (isKey(event, 'ArrowRight')) {
		event.preventDefault();
		onNext();
		return true;
	}

	return false;
}

interface ListHighlightKeyHandlers {
	onNext: () => void;
	onPrev: () => void;
	onFirst?: () => void;
	onLast?: () => void;
	onSelect?: () => void;
	/** Home/End (по умолчанию true) */
	includeHomeEnd?: boolean;
	/** Пробел как выбор (по умолчанию false — удобнее для search input) */
	includeSpace?: boolean;
}

/** Arrow / Home / End / Enter(+Space) для highlight-списков (ActionList, CommandPalette). */
export function handleListHighlightKeyDown(
	event: React.KeyboardEvent | KeyboardEvent,
	handlers: ListHighlightKeyHandlers,
): boolean {
	const includeHomeEnd = handlers.includeHomeEnd ?? true;
	const includeSpace = handlers.includeSpace ?? false;

	if (isKey(event, 'ArrowDown')) {
		event.preventDefault();
		handlers.onNext();
		return true;
	}
	if (isKey(event, 'ArrowUp')) {
		event.preventDefault();
		handlers.onPrev();
		return true;
	}
	if (includeHomeEnd && isKey(event, 'Home')) {
		event.preventDefault();
		handlers.onFirst?.();
		return true;
	}
	if (includeHomeEnd && isKey(event, 'End')) {
		event.preventDefault();
		handlers.onLast?.();
		return true;
	}
	if (isKey(event, 'Enter') || (includeSpace && isKey(event, ' '))) {
		if (!handlers.onSelect) return false;
		event.preventDefault();
		handlers.onSelect();
		return true;
	}

	return false;
}
