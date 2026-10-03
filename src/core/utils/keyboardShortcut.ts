/**
 * Универсальные клавиатурные шорткаты вида `mod+z`, `ctrl+shift+k`, `escape`.
 * `mod` = Meta на Apple, Control на остальных платформах.
 */

/**
 * Разобранное сочетание клавиш после {@link parseKeyboardShortcut}.
 */
export type KeyboardShortcutParts = {
	key: string;
	mod: boolean;
	ctrl: boolean;
	meta: boolean;
	alt: boolean;
	shift: boolean;
};

const MODIFIER_TOKENS = new Set([
	'mod',
	'meta',
	'cmd',
	'command',
	'ctrl',
	'control',
	'alt',
	'option',
	'shift',
]);

function normalizeKeyToken(token: string): string {
	const normalized = token.trim().toLowerCase();
	if (normalized === 'space' || normalized === 'spacebar') return ' ';
	if (normalized === 'esc') return 'escape';
	if (normalized === 'return') return 'enter';
	if (normalized === 'del') return 'delete';
	if (normalized.length === 1) return normalized;
	return normalized;
}

/**
 * Разбирает строку шортката в структуру модификаторов и клавиши.
 *
 * @param shortcut - Строка вида `mod+shift+z`, `ctrl+alt+delete`, `escape`.
 * @returns Разобранные части или `null`, если строка пустая или некорректна
 *   (нет клавиши, только модификаторы, неизвестный токен).
 *
 * @example
 * parseKeyboardShortcut('mod+z'); // { mod: true, key: 'z', ... }
 */
export function parseKeyboardShortcut(shortcut: string): KeyboardShortcutParts | null {
	const raw = shortcut.trim();
	if (!raw) return null;

	const tokens = raw.split('+').map((part) => part.trim().toLowerCase()).filter(Boolean);
	if (tokens.length === 0) return null;

	const keyToken = tokens[tokens.length - 1];
	if (!keyToken || MODIFIER_TOKENS.has(keyToken)) return null;

	const modifiers = tokens.slice(0, -1);
	const parts: KeyboardShortcutParts = {
		key: normalizeKeyToken(keyToken),
		mod: false,
		ctrl: false,
		meta: false,
		alt: false,
		shift: false,
	};

	for (const modifier of modifiers) {
		if (modifier === 'mod') parts.mod = true;
		else if (modifier === 'meta' || modifier === 'cmd' || modifier === 'command') parts.meta = true;
		else if (modifier === 'ctrl' || modifier === 'control') parts.ctrl = true;
		else if (modifier === 'alt' || modifier === 'option') parts.alt = true;
		else if (modifier === 'shift') parts.shift = true;
		else return null;
	}

	return parts;
}

function isApplePlatform(): boolean {
	if (typeof navigator === 'undefined') return false;
	return /Mac|iPhone|iPad|iPod/i.test(navigator.platform)
		|| /Mac|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function formatKeyLabel(key: string): string {
	if (key === ' ') return 'Space';
	if (key === 'escape') return 'Esc';
	if (key === 'enter') return 'Enter';
	if (key === 'arrowup') return '↑';
	if (key === 'arrowdown') return '↓';
	if (key === 'arrowleft') return '←';
	if (key === 'arrowright') return '→';
	if (key.length === 1) return key.toUpperCase();
	return key.charAt(0).toUpperCase() + key.slice(1);
}

/**
 * Форматирует шорткат для отображения пользователю (⌘Z на macOS, Ctrl+Z на Windows/Linux).
 *
 * @param shortcut - Строка шортката.
 * @returns Человекочитаемая подпись; при некорректной строке возвращает исходный shortcut.
 *
 * @example
 * formatKeyboardShortcut('mod+s'); // "⌘S" или "Ctrl+S"
 */
export function formatKeyboardShortcut(shortcut: string): string {
	const parts = parseKeyboardShortcut(shortcut);
	if (!parts) return shortcut;

	const apple = isApplePlatform();
	const chunks: string[] = [];

	if (parts.mod) {
		chunks.push(apple ? '⌘' : 'Ctrl');
	} else {
		if (parts.ctrl) chunks.push(apple ? '⌃' : 'Ctrl');
		if (parts.meta) chunks.push(apple ? '⌘' : 'Meta');
	}
	if (parts.alt) chunks.push(apple ? '⌥' : 'Alt');
	if (parts.shift) chunks.push(apple ? '⇧' : 'Shift');
	chunks.push(formatKeyLabel(parts.key));

	if (apple && (parts.mod || parts.meta || parts.ctrl || parts.alt || parts.shift)) {
		return chunks.join('');
	}

	return chunks.join('+');
}

/**
 * Форматирует шорткат для атрибута `aria-keyshortcuts` (Control+Z / Meta+Z, не `mod+z`).
 *
 * @param shortcut - Строка шортката.
 * @returns Строка в формате WAI-ARIA или `undefined`, если shortcut некорректен.
 * @see https://www.w3.org/TR/wai-aria-1.2/#aria-keyshortcuts
 *
 * @example
 * formatAriaKeyShortcuts('mod+z'); // "Meta+Z" или "Control+Z"
 */
export function formatAriaKeyShortcuts(shortcut: string): string | undefined {
	const parts = parseKeyboardShortcut(shortcut);
	if (!parts) return undefined;

	const apple = isApplePlatform();
	const tokens: string[] = [];

	if (parts.mod) {
		tokens.push(apple ? 'Meta' : 'Control');
	} else {
		if (parts.ctrl) tokens.push('Control');
		if (parts.meta) tokens.push('Meta');
	}
	if (parts.alt) tokens.push('Alt');
	if (parts.shift) tokens.push('Shift');

	if (parts.key === ' ') tokens.push('Space');
	else if (parts.key === 'escape') tokens.push('Escape');
	else if (parts.key.length === 1) tokens.push(parts.key.toUpperCase());
	else tokens.push(parts.key.charAt(0).toUpperCase() + parts.key.slice(1));

	return tokens.join('+');
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
