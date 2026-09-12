import type React from 'react';

export interface DayStripDayRenderProps {
	date: Date;
	dayOfMonth: number;
	weekdayLabel: string;
	isSelected: boolean;
	isToday: boolean;
}

export interface DayStripCalendarProps extends Omit<React.ComponentPropsWithoutRef<'div'>, 'onChange'> {
	value?: Date;
	onChange: (date: Date) => void;
	/**
	 * Первая видимая дата полосы (контролируемая).
	 * По умолчанию — начало недели, содержащей `value` / сегодня.
	 */
	viewDate?: Date;
	onViewDateChange?: (date: Date) => void;
	/** Сколько дней показывать. По умолчанию 7 (неделя). */
	daysCount?: number;
	/** Начало недели для авто-`viewDate`: `1` = пн (по умолчанию), `0` = вс. */
	weekStartsOn?: 0 | 1;
	/** Заголовок месяца/года над полосой. */
	showHeader?: boolean;
	/** Кнопки prev / next: выбирают соседний день; полоса сдвигается на `daysCount / 2`, если дата вне окна. */
	showNav?: boolean;
	renderDay?: (props: DayStripDayRenderProps) => React.ReactNode;
}
