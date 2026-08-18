import React, {forwardRef} from 'react';
import styles from './CalendarBoard.TimedEvent.module.css';
import {cn} from '../../utils/cn';
import type {CalendarBoardTimedEventProps} from './CalendarBoard.types';

export type {CalendarBoardTimedEventProps} from './CalendarBoard.types';

export const CalendarBoardTimedEvent = forwardRef<HTMLButtonElement | HTMLDivElement, CalendarBoardTimedEventProps>(
	function CalendarBoardTimedEvent(
		{
			title,
			timeLabel,
			color,
			highlighted = false,
			onClick,
			onMouseEnter,
			onMouseLeave,
			className = '',
			style,
			'aria-label': ariaLabel,
		},
		ref,
	) {
		const Tag = onClick ? 'button' : 'div';
		const colorStyle = color
			? ({'--altum-calendar-board-event-color': color} as React.CSSProperties)
			: undefined;

		return (
			<Tag
				ref={ref as React.Ref<HTMLButtonElement & HTMLDivElement>}
				type={onClick ? 'button' : undefined}
				className={cn(
					styles.event,
					onClick ? styles.clickable : '',
					highlighted ? styles.highlighted : '',
					className,
				)}
				style={{
					...colorStyle,
					...style,
				}}
				onClick={onClick}
				onMouseEnter={onMouseEnter}
				onMouseLeave={onMouseLeave}
				title={timeLabel ? `${title} (${timeLabel})` : title}
				aria-label={ariaLabel ?? (timeLabel ? `${title}, ${timeLabel}` : title)}
			>
				<span className={styles.title}>
					{title}
				</span>
				{timeLabel && (
					<span className={styles.time}>
						{timeLabel}
					</span>
				)}
			</Tag>
		);
	},
);

CalendarBoardTimedEvent.displayName = 'CalendarBoard.TimedEvent';
