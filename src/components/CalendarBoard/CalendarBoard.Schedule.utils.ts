import {startOfDay, startOfWeek} from '../Calendar/Calendar.utils';

export function formatTimeRange(start: Date, end: Date): string {
	const fmt = (date: Date) => {
		const h = String(date.getHours()).padStart(2, '0');
		const m = String(date.getMinutes()).padStart(2, '0');
		return `${h}:${m}`;
	};
	return `${fmt(start)} – ${fmt(end)}`;
}

export function resolveWindowStart(
	viewDate: Date,
	daysCount: 1 | 5 | 7,
	weekStartsOn: 0 | 1,
): Date {
	const day = startOfDay(viewDate);
	if (daysCount === 1) return day;
	const weekStart = startOfWeek(day, weekStartsOn);
	if (daysCount === 5) {
		return startOfWeek(day, 1);
	}
	return weekStart;
}
