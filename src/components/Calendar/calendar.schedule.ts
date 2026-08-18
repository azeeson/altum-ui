import {addDays, startOfDay} from './Calendar.utils';

/** Событие планировщика: all-day или с временем. `end` — exclusive. */
export interface CalendarScheduleEvent {
	id: string;
	title: string;
	start: Date;
	/** Exclusive конец интервала. */
	end: Date;
	allDay?: boolean;
	color?: string;
}

export interface SpanSegment {
	/** Индекс первой колонки (включительно). */
	startIndex: number;
	/** Индекс последней колонки (включительно). */
	endIndex: number;
	continuesBefore: boolean;
	continuesAfter: boolean;
}

interface TimedEventLayout {
	/** % от высоты дня (оси времени). */
	topPercent: number;
	heightPercent: number;
	start: Date;
	end: Date;
}

function endOfDay(date: Date): Date {
	return addDays(startOfDay(date), 1);
}

/**
 * Минуты от полуночи для позиционирования на временной оси (дробная часть — секунды).
 *
 * @param date - Момент времени.
 * @returns Число минут от 00:00 (может быть дробным).
 */
function minutesFromMidnight(date: Date): number {
	return date.getHours() * 60 + date.getMinutes() + date.getSeconds() / 60;
}

function clamp(value: number, min: number, max: number): number {
	return Math.min(max, Math.max(min, value));
}

/**
 * Строит массив целых часов для меток временной шкалы в видимом диапазоне дня.
 *
 * @param dayStartHour - Начало видимого диапазона (может быть дробным, округляется вниз).
 * @param dayEndHour - Конец диапазона (округляется вверх).
 * @returns Массив часов `[start, …, end-1]` или пустой, если диапазон некорректен.
 */
export function buildHourMarks(dayStartHour: number, dayEndHour: number): number[] {
	const start = Math.floor(dayStartHour);
	const end = Math.ceil(dayEndHour);
	if (end <= start) return [];
	return Array.from({length: end - start}, (_, index) => start + index);
}

/**
 * Форматирует метку часа для оси времени (`HH:00`).
 *
 * @param hour - Час (может выходить за 0–23, нормализуется по модулю 24).
 * @returns Строка вида `08:00`.
 */
export function formatHourLabel(hour: number): string {
	const h = ((hour % 24) + 24) % 24;
	return `${String(h).padStart(2, '0')}:00`;
}

/**
 * Обрезает интервал события по границам конкретного календарного дня.
 * Используется для отрисовки timed-сетки, когда событие пересекает полночь.
 *
 * @param start - Начало события.
 * @param end - Exclusive конец события.
 * @param day - Календарный день, в котором нужен фрагмент.
 * @returns Обрезанный интервал или `null`, если пересечения нет.
 */
export function clipEventToDay(
	start: Date,
	end: Date,
	day: Date,
): {
	start: Date;
	end: Date
} | null {
	const dayStart = startOfDay(day);
	const dayEnd = endOfDay(day);
	const clippedStart = start > dayStart ? start : dayStart;
	const clippedEnd = end < dayEnd ? end : dayEnd;
	if (clippedEnd <= clippedStart) return null;
	return {
		start: clippedStart,
		end: clippedEnd
	};
}

/**
 * Вычисляет вертикальную позицию timed-события на оси часа в процентах.
 * Короткие события получают минимальную высоту (~32 минуты), чтобы не схлопываться в полоску.
 *
 * @param start - Начало события.
 * @param end - Exclusive конец события.
 * @param dayStartHour - Начало видимого диапазона (например, 8).
 * @param dayEndHour - Конец видимого диапазона (например, 20).
 * @returns `topPercent` и `heightPercent` или `null`, если событие вне диапазона или нулевой длины.
 */
function layoutTimedEvent(
	start: Date,
	end: Date,
	dayStartHour: number,
	dayEndHour: number,
): Omit<TimedEventLayout, 'start' | 'end'> | null {
	const rangeStart = dayStartHour * 60;
	const rangeEnd = dayEndHour * 60;
	if (rangeEnd <= rangeStart) return null;

	const startMin = clamp(minutesFromMidnight(start), rangeStart, rangeEnd);
	const endMin = clamp(minutesFromMidnight(end), rangeStart, rangeEnd);
	if (endMin <= startMin) return null;

	const total = rangeEnd - rangeStart;
	const heightPercent = ((endMin - startMin) / total) * 100;
	/** Минимум ~32 минуты визуально — короткий standup не схлопывается в полоску */
	const minPercent = (32 / total) * 100;
	return {
		topPercent: ((startMin - rangeStart) / total) * 100,
		heightPercent: Math.max(heightPercent, minPercent),
	};
}

/**
 * Сегмент multi-day bar внутри ряда колонок (день/неделя).
 * Для all-day `end` — exclusive calendar day.
 */
export function segmentSpanInColumns(
	rangeStart: Date,
	rangeEnd: Date,
	columns: Date[],
): SpanSegment | null {
	if (columns.length === 0) return null;

	const start = startOfDay(rangeStart);
	const end = startOfDay(rangeEnd);
	if (end <= start) return null;

	const first = columns[0]!;
	const last = columns[columns.length - 1]!;
	const windowEnd = endOfDay(last);

	if (end <= first || start >= windowEnd) return null;

	const indices = columns
		.map((column, index) => ({
			column,
			index
		}))
		.filter(({column}) => column >= start && column < end)
		.map(({index}) => index);

	if (indices.length === 0) return null;

	return {
		startIndex: indices[0]!,
		endIndex: indices[indices.length - 1]!,
		continuesBefore: start < first,
		continuesAfter: end > windowEnd,
	};
}

/**
 * Режет multi-day интервал по недельным рядам (для месячной доски).
 * Каждая неделя — массив дат колонок (обычно 7).
 */
export function segmentSpanByWeeks(
	rangeStart: Date,
	rangeEnd: Date,
	weeks: Date[][],
): Array<{
	weekIndex: number;
	segment: SpanSegment
}> {
	const result: Array<{
		weekIndex: number;
		segment: SpanSegment
	}> = [];
	weeks.forEach((week, weekIndex) => {
		const dates = week.filter(Boolean);
		const segment = segmentSpanInColumns(rangeStart, rangeEnd, dates);
		if (segment) {
			result.push({
				weekIndex,
				segment
			});
		}
	});
	return result;
}

export interface PackedSpanItem<T> {
	item: T;
	segment: SpanSegment;
	lane: number;
}

/**
 * Жадная упаковка multi-day полос в горизонтальные «дорожки» без пересечений.
 * Сначала сортирует по startIndex, затем по длине span (длинные — раньше).
 *
 * @template T - Тип данных события/задачи.
 * @param items - Элементы с уже вычисленным {@link SpanSegment}.
 * @returns Упакованные элементы с номером lane и общее число дорожек.
 */
export function packSpanSegments<T>(
	items: Array<{
		item: T;
		segment: SpanSegment
	}>,
): {
	packed: Array<PackedSpanItem<T>>;
	laneCount: number
} {
	const sorted = [...items].sort((a, b) => {
		if (a.segment.startIndex !== b.segment.startIndex) {
			return a.segment.startIndex - b.segment.startIndex;
		}
		const aSpan = a.segment.endIndex - a.segment.startIndex;
		const bSpan = b.segment.endIndex - b.segment.startIndex;
		return bSpan - aSpan;
	});

	const laneEnds: number[] = [];
	const packed: Array<PackedSpanItem<T>> = [];

	for (const entry of sorted) {
		let lane = laneEnds.findIndex((end) => end < entry.segment.startIndex);
		if (lane === -1) {
			lane = laneEnds.length;
			laneEnds.push(entry.segment.endIndex);
		} else {
			laneEnds[lane] = entry.segment.endIndex;
		}
		packed.push({
			item: entry.item,
			segment: entry.segment,
			lane,
		});
	}

	return {
		packed,
		laneCount: laneEnds.length
	};
}

export interface PackedTimedItem<T> {
	item: T;
	layout: TimedEventLayout;
	lane: number;
	laneCount: number;
}

/**
 * Раскладывает перекрывающиеся timed-события одного дня в параллельные lane.
 * События вне видимого диапазона часов или с нулевой длительностью отбрасываются.
 *
 * @template T - Тип данных события.
 * @param items - События с start/end в пределах дня.
 * @param dayStartHour - Начало видимого часового диапазона.
 * @param dayEndHour - Конец видимого часового диапазона.
 * @returns Элементы с layout, lane и laneCount для горизонтального деления колонки.
 */
export function packTimedEventsInDay<T>(
	items: Array<{
		item: T;
		start: Date;
		end: Date
	}>,
	dayStartHour: number,
	dayEndHour: number,
): Array<PackedTimedItem<T>> {
	const withLayout = items
		.map((entry) => {
			const position = layoutTimedEvent(
				entry.start,
				entry.end,
				dayStartHour,
				dayEndHour,
			);
			if (!position) return null;
			return {
				item: entry.item,
				layout: {
					...position,
					start: entry.start,
					end: entry.end,
				},
			};
		})
		.filter((entry): entry is {
			item: T;
			layout: TimedEventLayout
		} => entry !== null)
		.sort((a, b) => a.layout.start.getTime() - b.layout.start.getTime());

	const active: Array<{
		end: number;
		lane: number
	}> = [];
	const assigned: Array<{
		item: T;
		layout: TimedEventLayout;
		lane: number
	}> = [];
	let maxLane = 0;

	for (const entry of withLayout) {
		const startMs = entry.layout.start.getTime();
		const endMs = entry.layout.end.getTime();
		for (let i = active.length - 1; i >= 0; i -= 1) {
			if (active[i]!.end <= startMs) active.splice(i, 1);
		}
		const used = new Set(active.map((slot) => slot.lane));
		let lane = 0;
		while (used.has(lane)) lane += 1;
		active.push({
			end: endMs,
			lane
		});
		maxLane = Math.max(maxLane, lane + 1);
		assigned.push({
			item: entry.item,
			layout: entry.layout,
			lane,
		});
	}

	return assigned.map((entry) => ({
		...entry,
		laneCount: Math.max(maxLane, 1),
	}));
}

/**
 * Определяет, является ли событие all-day: явный флаг `allDay` или эвристика
 * (интервал ≥ суток с границами в полночь, end exclusive).
 *
 * @param event - Событие планировщика.
 * @returns `true` для целодневных событий.
 */
export function resolveAllDay(event: CalendarScheduleEvent): boolean {
	if (event.allDay === true) return true;
	if (event.allDay === false) return false;
	const durationMs = event.end.getTime() - event.start.getTime();
	return durationMs >= 24 * 60 * 60 * 1000
		&& minutesFromMidnight(event.start) === 0
		&& minutesFromMidnight(event.end) === 0;
}
