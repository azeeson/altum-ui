import type {
	ComponentPropsWithoutRef,
} from 'react';

/**
 * Свойства `RelativeTime`.
 */
export interface RelativeTimeProps extends Omit<ComponentPropsWithoutRef<'time'>, 'dateTime'> {
	/** Дата события */
	date: Date | string | number;
	/** Локаль. @default runtime */
	locale?: string;
	/** Интервал пересчёта (мс). `0` — без автообновления. @default 30000 */
	updateInterval?: number;
	/** Абсолютный title / tooltip. @default true */
	showAbsoluteTitle?: boolean;
}
