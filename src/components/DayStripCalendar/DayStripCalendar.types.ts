import type React from 'react';
import type {Ref} from 'react';

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
	 * Без пропа окно начинается с недели `value` или сегодня и дальше не возвращается к выбранному дню.
	 */
	viewDate?: Date;
	onViewDateChange?: (date: Date) => void;
	/** Сколько дней показывать. По умолчанию 7 (неделя). */
	daysCount?: number;
	/** Начало недели для авто-`viewDate`: `1` = пн (по умолчанию), `0` = вс. */
	weekStartsOn?: 0 | 1;
	/** Заголовок месяца/года над полосой. */
	showHeader?: boolean;
	/** Кнопки prev / next сдвигают видимое окно на `daysCount` и не меняют выбранный день. */
	showNav?: boolean;
	renderDay?: (props: DayStripDayRenderProps) => React.ReactNode;
	/** DOM-узел корня. */
	rootRef?: Ref<HTMLDivElement>;
}
