/**
 * Сопоставление KeyboardEvent со строкой шортката.
 * Парсинг — {@link parseKeyboardShortcut} в `keyboardShortcut.ts`.
 */

import {parseKeyboardShortcut} from './keyboardShortcut';

function isApplePlatform(): boolean {
	if (typeof navigator === 'undefined') return false;
	return /Mac|iPhone|iPad|iPod/i.test(navigator.platform)
		|| /Mac|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

/**
 * Проверяет, соответствует ли событие клавиатуры заданному шорткату.
 * Учитывает платформенный `mod` и неявный Shift для символов вроде `?`.
 *
 * @param event - Событие keydown/keyup.
 * @param shortcut - Строка шортката в формате {@link parseKeyboardShortcut}.
 * @returns `true`, если клавиша и все модификаторы совпали.
 */
export function matchesKeyboardShortcut(
	event: KeyboardEvent,
	shortcut: string,
): boolean {
	const parts = parseKeyboardShortcut(shortcut);
	if (!parts) return false;

	const eventKey = event.key === ' ' ? ' ' : event.key.toLowerCase();
	if (eventKey !== parts.key) return false;

	const apple = isApplePlatform();
	const wantMeta = parts.meta || (parts.mod && apple);
	const wantCtrl = parts.ctrl || (parts.mod && !apple);

	if (Boolean(event.metaKey) !== wantMeta) return false;
	if (Boolean(event.ctrlKey) !== wantCtrl) return false;
	if (Boolean(event.altKey) !== parts.alt) return false;

	const shiftImpliedBySymbol = !parts.shift
		&& parts.key.length === 1
		&& event.key === parts.key
		&& event.shiftKey;
	if (!shiftImpliedBySymbol && Boolean(event.shiftKey) !== parts.shift) return false;

	return true;
}
