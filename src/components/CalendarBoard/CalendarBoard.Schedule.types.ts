import type {
	CalendarScheduleEvent,
	CalendarScheduleProps,
	CalendarScheduleSpanRenderProps,
	CalendarScheduleTimedRenderProps,
} from './CalendarBoard.types';

/** Реэкспорт типов сетки расписания `CalendarBoard.Schedule`. */
export type {
	CalendarScheduleEvent,
	CalendarScheduleSpanRenderProps,
	CalendarScheduleTimedRenderProps,
	CalendarScheduleProps,
};

/** Высота дорожки all-day события в сетке расписания, px. */
export const SCHEDULE_LANE_HEIGHT = 22;
