/**
 * Селектор интерактивных контролов, с которых обычно не начинают drag.
 * Свои атрибуты (`[data-no-task-drag]` и т.п.) добавляет вызывающий код.
 */
export const DEFAULT_DRAG_BLOCKED_SELECTOR = [
	'input',
	'textarea',
	'select',
	'a',
	'[contenteditable="true"]',
].join(', ');

/**
 * Роли и якоря порталов, клик по которым не считается уходом из контейнера.
 * Фрагмент класса (например `Dropdown_`) передаётся отдельно.
 */
export const DEFAULT_PORTAL_SELECTOR = [
	'[role="dialog"]',
	'[role="listbox"]',
	'[role="menu"]',
	'[role="tree"]',
	'[data-side]',
].join(',');

function classIncludesSelector(classNamePart: string): string {
	const escaped = classNamePart.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
	return `[class*="${escaped}"]`;
}

/**
 * Цель события — поле ввода, select или contentEditable.
 *
 * @param target - `event.target`.
 * @returns `true`, если узел можно редактировать.
 *
 * @example
 * isEditableTarget(event.target);
 */
export function isEditableTarget(target: EventTarget | null): boolean {
	if (typeof HTMLElement === 'undefined' || !(target instanceof HTMLElement)) return false;
	const {tagName} = target;
	return tagName === 'INPUT'
		|| tagName === 'TEXTAREA'
		|| tagName === 'SELECT'
		|| target.isContentEditable;
}

/**
 * Цель события лежит внутри узла, с которого нельзя начинать перетаскивание.
 *
 * @param target - `event.target`.
 * @param selector - CSS-селектор блокирующих узлов (`input`, `a`, `[data-no-task-drag]`, …).
 * @returns `true`, если `target` или предок совпадает с `selector`.
 *
 * @example
 * isDragBlockedTarget(event.target, `${DEFAULT_DRAG_BLOCKED_SELECTOR}, [data-no-task-drag]`);
 */
export function isDragBlockedTarget(target: EventTarget | null, selector: string): boolean {
	if (typeof Element === 'undefined' || !(target instanceof Element) || !selector) return false;
	return Boolean(target.closest(selector));
}

/**
 * Клик или фокус пришли снаружи контейнера и не из портала (пикер, меню, dropdown).
 *
 * @param target - `event.target`.
 * @param container - Корень формы или поля. `null` — контейнера нет.
 * @param portalSelector - Селектор порталов (`[role="dialog"]`, …). Пустая строка отключает проверку.
 * @param classNamePart - Фрагмент класса портала, например `Dropdown_`. Без аргумента проверка класса не делается.
 * @returns `true`, если взаимодействие снаружи формы.
 *
 * @example
 * isOutsideFormInteraction(event.target, form, DEFAULT_PORTAL_SELECTOR, 'Dropdown_');
 */
export function isOutsideFormInteraction(
	target: EventTarget | null,
	container: HTMLElement | null,
	portalSelector: string,
	classNamePart?: string,
): boolean {
	if (typeof Node === 'undefined' || !(target instanceof Node)) return true;
	if (container?.contains(target)) return false;

	if (target instanceof Element) {
		if (portalSelector && target.closest(portalSelector)) return false;
		if (classNamePart && target.closest(classIncludesSelector(classNamePart))) return false;
	}

	return true;
}
