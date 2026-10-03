import type {KeyboardEvent} from 'react';
import type {ListboxEntry} from '../Listbox/Listbox.types';
import {LISTBOX_HIGHLIGHTED_ATTR, LISTBOX_INDEX_ATTR} from '../Listbox/Listbox.utils';
import type {ActionListEntry, ActionListItem} from './ActionList.types';
import {ActionItem} from './ActionItem';

/** Текст пункта для DOM-фильтра (`data-filter`). */
export const ACTION_LIST_FILTER_ATTR = 'data-filter';

/** Пустое состояние фильтра (`data-action-list-empty`). */
export const ACTION_LIST_EMPTY_ATTR = 'data-action-list-empty';

const VISIBLE_OPTION = '[role="option"]:not([hidden]):not([disabled])';

/** Пункт действия, а не линия. */
export function isActionListItem(entry: ActionListEntry): entry is ActionListItem {
	return !('type' in entry && entry.type === 'separator');
}

/** Склеивает label / keywords / description / id для поиска. */
export function actionListItemText(item: ActionListItem): string {
	const label = item.textValue
		?? (typeof item.label === 'string' || typeof item.label === 'number' ? String(item.label) : item.id);
	return [
		label,
		...(item.keywords ?? []),
		typeof item.description === 'string' ? item.description : '',
		item.id,
	].join(' ');
}

/**
 * Опции Listbox с `data-filter` на кнопке: фильтр прячет строки через `hidden`,
 * без пересборки массива.
 */
export function buildActionListOptions(items: readonly ActionListEntry[]): ListboxEntry[] {
	return items.map((item) => {
		if (!isActionListItem(item)) {
			return {
				type: 'separator' as const,
				id: item.id,
				groupId: item.groupId,
			};
		}
		const text = actionListItemText(item);
		return {
			value: item.id,
			label: (
				<ActionItem
					label={item.label}
					icon={item.icon}
					description={item.description}
					shortcut={item.shortcut}
				/>
			),
			textValue: text,
			disabled: item.disabled,
			groupId: item.groupId,
			buttonProps: {
				...item.buttonProps,
				[ACTION_LIST_FILTER_ATTR]: text.toLowerCase(),
			},
		};
	});
}

function visibleOptions(container: HTMLElement): HTMLElement[] {
	return Array.from(container.querySelectorAll<HTMLElement>(VISIBLE_OPTION));
}

/** Корень списка: подсветка пункта активна — гасим visual focus-chrome фильтра. */
export const ACTION_LIST_FOCUS_ATTR = 'data-list-focus';

/** Подсветка, `aria-activedescendant` и `data-list-focus` пишутся в DOM, без рендера списка. */
export function paintActionListHighlight(
	container: HTMLElement,
	target: HTMLElement | undefined,
	scroll: boolean,
): number {
	const input = container.querySelector('input');
	container.querySelectorAll<HTMLElement>(`[${LISTBOX_HIGHLIGHTED_ATTR}="true"]`).forEach((node) => {
		if (node !== target) node.removeAttribute(LISTBOX_HIGHLIGHTED_ATTR);
	});
	if (!target) {
		input?.removeAttribute('aria-activedescendant');
		container.removeAttribute(ACTION_LIST_FOCUS_ATTR);
		return -1;
	}
	target.setAttribute(LISTBOX_HIGHLIGHTED_ATTR, 'true');
	container.setAttribute(ACTION_LIST_FOCUS_ATTR, '');
	if (target.id && input) input.setAttribute('aria-activedescendant', target.id);
	else input?.removeAttribute('aria-activedescendant');
	if (scroll) target.scrollIntoView({block: 'nearest'});
	const raw = target.getAttribute(LISTBOX_INDEX_ATTR);
	return raw == null ? -1 : Number(raw);
}

/**
 * Прячет несовпавшие строки атрибутом `hidden`.
 * Группа без видимых пунктов прячется вместе с ними.
 */
export function applyActionListFilter(
	container: HTMLElement,
	rawQuery: string,
	onHighlight?: (index: number) => void,
) {
	const query = rawQuery.trim().toLowerCase();
	const rows = container.querySelectorAll<HTMLElement>('[role="option"]');
	let matches = 0;
	rows.forEach((row) => {
		const text = row.getAttribute(ACTION_LIST_FILTER_ATTR) ?? '';
		const match = query.length === 0 || text.includes(query);
		row.toggleAttribute('hidden', !match);
		if (match) matches += 1;
	});
	container.querySelectorAll<HTMLElement>('[role="group"]').forEach((group) => {
		const hasVisible = group.querySelector('[role="option"]:not([hidden])') != null;
		group.toggleAttribute('hidden', !hasVisible);
	});
	container.querySelectorAll<HTMLElement>('[data-separator]').forEach((separator) => {
		if (query.length === 0) {
			separator.toggleAttribute('hidden', false);
			return;
		}
		const parent = separator.parentElement;
		if (!parent) return;
		const nodes = Array.from(parent.children);
		const index = nodes.indexOf(separator);
		const visibleOption = (node: Element) =>
			node.getAttribute('role') === 'option' && !node.hasAttribute('hidden');
		const before = nodes.slice(0, index).some(visibleOption);
		const after = nodes.slice(index + 1).some(visibleOption);
		separator.toggleAttribute('hidden', !(before && after));
	});
	const empty = container.querySelector<HTMLElement>(`[${ACTION_LIST_EMPTY_ATTR}]`);
	if (empty) empty.toggleAttribute('data-visible', rows.length > 0 && matches === 0);
	/* Пустой запрос — без подсветки (focus-chrome фильтра виден); при наборе — первый match. */
	const target = query.length > 0 ? visibleOptions(container)[0] : undefined;
	const index = paintActionListHighlight(container, target, query.length > 0);
	onHighlight?.(index);
}

/** Стрелки / Home / End / Enter по полю фильтра. */
export function moveActionListHighlight(
	container: HTMLElement,
	event: KeyboardEvent<HTMLInputElement>,
	onHighlight?: (index: number) => void,
) {
	const list = visibleOptions(container);
	if (list.length === 0) return;
	const active = container.querySelector<HTMLElement>(
		`[role="option"][${LISTBOX_HIGHLIGHTED_ATTR}="true"]:not([hidden])`,
	);
	let index = active ? list.indexOf(active) : -1;
	const key = event.key;
	if (key === 'ArrowDown') index = (index + 1) % list.length;
	else if (key === 'ArrowUp') index = (index - 1 + list.length) % list.length;
	else if (key === 'Home') index = 0;
	else if (key === 'End') index = list.length - 1;
	else if (key === 'Enter') {
		event.preventDefault();
		(active ?? list[0])?.click();
		return;
	} else return;

	event.preventDefault();
	const highlighted = paintActionListHighlight(container, list[index], true);
	onHighlight?.(highlighted);
}
