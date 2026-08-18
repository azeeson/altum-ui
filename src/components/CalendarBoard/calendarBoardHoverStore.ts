/**
 * Лёгкий hover-store для синхронной подсветки сегментов одной задачи
 * (EventBar ↔ TimedEvent ↔ chip) без React state в общем CalendarBoard-контексте.
 */

export type CalendarBoardHoverStore = {
	subscribe: (listener: () => void) => () => void;
	getSnapshot: () => string | null;
	setHovered: (id: string | null) => void;
};

export function createCalendarBoardHoverStore(): CalendarBoardHoverStore {
	let hoveredId: string | null = null;
	const listeners = new Set<() => void>();

	return {
		subscribe(listener) {
			listeners.add(listener);
			return () => {
				listeners.delete(listener);
			};
		},
		getSnapshot() {
			return hoveredId;
		},
		setHovered(id) {
			if (hoveredId === id) return;
			hoveredId = id;
			listeners.forEach((listener) => listener());
		},
	};
}
