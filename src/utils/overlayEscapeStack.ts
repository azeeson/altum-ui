/**
 * Стек открытых overlay для Escape: закрывается только верхний слой.
 */

type EscapeEntry = {
	id: number;
	onEscape: () => void;
};

let nextId = 1;
const stack: EscapeEntry[] = [];

export function pushOverlayEscapeHandler(onEscape: () => void): number {
	const id = nextId++;
	stack.push({
		id,
		onEscape,
	});
	return id;
}

export function updateOverlayEscapeHandler(id: number, onEscape: () => void): void {
	const entry = stack.find((item) => item.id === id);
	if (entry) {
		entry.onEscape = onEscape;
	}
}

export function popOverlayEscapeHandler(id: number): void {
	const index = stack.findIndex((item) => item.id === id);
	if (index >= 0) {
		stack.splice(index, 1);
	}
}

export function isTopOverlayEscapeHandler(id: number): boolean {
	const top = stack[stack.length - 1];
	return top != null && top.id === id;
}
