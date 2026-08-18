/**
 * Глобальный мьютекс для оверлеев по наведению (подсказки).
 * Одновременно открыта не больше одной; быстрый переход пропускает задержку открытия.
 */

type HoverTriggerForceClose = () => void;

const SKIP_DELAY_MS = 300;

type Entry = {
	forceClose: HoverTriggerForceClose;
};

const entries = new Map<string, Entry>();
let activeId: string | null = null;
let lastCloseAt = 0;
let nextId = 0;

/** Выдаёт стабильный id для одного экземпляра hover-триггера. */
export function createHoverTriggerId(): string {
	nextId += 1;
	return `hover-trigger-${nextId}`;
}

export function registerHoverTrigger(
	id: string,
	forceClose: HoverTriggerForceClose,
): () => void {
	entries.set(id, {forceClose});
	return () => {
		entries.delete(id);
		if (activeId === id) {
			activeId = null;
			lastCloseAt = Date.now();
		}
	};
}

/**
 * Захватывает эксклюзивное открытие. Сразу принудительно закрывает любую другую зарегистрированную подсказку.
 * @returns фактическая задержка открытия (0 при переходе внутри окна пропуска).
 */
export function claimHoverTriggerOpen(
	id: string,
	openDelay: number,
): number {
	if (activeId != null && activeId !== id) {
		const peer = entries.get(activeId);
		peer?.forceClose();
		activeId = null;
		lastCloseAt = Date.now();
	}
	activeId = id;
	const elapsed = Date.now() - lastCloseAt;
	if (elapsed < SKIP_DELAY_MS) {
		return 0;
	}
	return openDelay;
}

export function releaseHoverTrigger(id: string): void {
	if (activeId === id) {
		activeId = null;
		lastCloseAt = Date.now();
	}
}
