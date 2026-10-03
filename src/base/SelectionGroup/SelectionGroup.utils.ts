import type {KeyboardEvent as ReactKeyboardEvent, MouseEvent as ReactMouseEvent} from 'react';
import {focusElement, type ArrowOrientation} from '../../core/utils/a11y';
import {handleRovingFocusKeyDown} from '../../core/utils/keyboard';

export type SelectionType = 'radio' | 'checkbox';

/** Корень группы: общий предок пунктов и панелей. */
export const SELECTION_ROOT_ATTR = 'data-selection-root';

/** Значение пункта. По нему клик и стрелки находят кнопку. */
export const SELECTION_VALUE_ATTR = 'data-selection-value';

/** Список, который ловит клик. Вложенный список не отдаёт событие внешнему. */
export const SELECTION_LIST_ATTR = 'data-selection-list';

/** Пункт выбран. Стили и синхронизация читают атрибут, не React-state. */
export const SELECTION_SELECTED_ATTR = 'data-selected';

/**
 * tabindex пункта: у checkbox каждый доступный пункт в порядке Tab,
 * у radio — только выбранный.
 */
export function selectionItemTabIndex(
	type: SelectionType,
	selected: boolean,
	disabled: boolean,
	readOnly: boolean,
): number {
	if (type === 'checkbox') return disabled || readOnly ? -1 : 0;
	return selected && !disabled && !readOnly ? 0 : -1;
}

/**
 * Пункт выбран: у `radio` значение совпадает, у `checkbox` входит в массив.
 */
export function isSelectionSelected(
	type: SelectionType,
	value: string | readonly string[],
	itemValue: string,
): boolean {
	if (type === 'checkbox') {
		return Array.isArray(value) && value.includes(itemValue);
	}
	return value === itemValue;
}

/**
 * Следующее значение группы.
 * `radio` заменяет выбор. `checkbox` добавляет пункт или снимает его.
 */
export function nextSelectionValue(
	type: SelectionType,
	current: string | readonly string[],
	itemValue: string,
): string | string[] {
	if (type !== 'checkbox') return itemValue;
	const list = Array.isArray(current) ? [...current] : [];
	if (list.includes(itemValue)) {
		return list.filter((entry) => entry !== itemValue);
	}
	return [...list, itemValue];
}

function itemEnabled(el: HTMLElement): boolean {
	return !el.hasAttribute('disabled') && el.getAttribute('aria-disabled') !== 'true';
}

/**
 * Клик по пункту. Вложенная группа не отдаёт событие внешней:
 * ближайший `[data-selection-list]` должен быть текущим контейнером.
 */
export function handleSelectionClick(
	event: ReactMouseEvent<HTMLElement>,
	trigger: (itemValue: string) => void,
): void {
	if (event.defaultPrevented) return;
	const item = (event.target as HTMLElement).closest<HTMLElement>(`[${SELECTION_VALUE_ATTR}]`);
	if (
		item == null
		|| item.hasAttribute('disabled')
		|| item.getAttribute('aria-disabled') === 'true'
	) return;
	if (item.closest(`[${SELECTION_LIST_ATTR}]`) !== event.currentTarget) return;
	const itemValue = item.getAttribute(SELECTION_VALUE_ATTR);
	if (!itemValue) return;
	trigger(itemValue);
}

/**
 * Стрелки по пунктам. Ось и `activateOnFocus` читаются с корня.
 * Фокус переносит браузер, выбор — `trigger`.
 * Стрелка вне пункта (поле внутри панели) группу не двигает.
 */
export function handleSelectionKeyDown(
	event: ReactKeyboardEvent<HTMLElement>,
	trigger: (itemValue: string) => void,
): void {
	if (event.defaultPrevented) return;
	const root = event.currentTarget.closest<HTMLElement>(`[${SELECTION_ROOT_ATTR}]`);
	if (root == null || root.hasAttribute('data-disabled') || root.hasAttribute('data-readonly')) return;

	const orientation: ArrowOrientation = root.getAttribute('data-orientation') === 'vertical'
		? 'vertical'
		: 'horizontal';
	const activate = root.getAttribute('data-activate-on-focus') !== 'false';
	const list = event.currentTarget;
	const items = Array.from(
		list.querySelectorAll<HTMLElement>(`[${SELECTION_VALUE_ATTR}]`),
	).filter((el) => itemEnabled(el) && el.closest(`[${SELECTION_LIST_ATTR}]`) === list);
	if (items.length === 0) return;

	const currentIndex = items.findIndex(
		(el) => el === event.target || el.contains(event.target as Node),
	);

	handleRovingFocusKeyDown(event, {
		currentIndex,
		length: items.length,
		orientation,
		onMove: (nextIndex) => {
			const next = items[nextIndex];
			focusElement(next);
			if (!activate) return;
			const itemValue = next.getAttribute(SELECTION_VALUE_ATTR);
			if (itemValue) trigger(itemValue);
		},
	});
}
