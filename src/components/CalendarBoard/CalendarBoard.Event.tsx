import React, {forwardRef} from 'react';
import styles from './CalendarBoard.Event.module.css';
import {cn} from '../../utils/cn';
import type {CalendarBoardEventProps} from './CalendarBoard.types';

export type {CalendarBoardEventProps} from './CalendarBoard.types';

/**
 * Полоса all-day (`bar`) или блок timed-события.
 *
 * @component
 */
export const CalendarBoardEvent = forwardRef<HTMLButtonElement | HTMLDivElement, CalendarBoardEventProps>(
	function CalendarBoardEvent(
		{
			title,
			timeLabel,
			color,
			layout = 'bar',
			continuesBefore = false,
			continuesAfter = false,
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
		const timed = layout === 'timed';
		const colorStyle = color
			? ({'--altum-calendar-board-event-color': color} as React.CSSProperties)
			: undefined;

		return (
			<Tag
				ref={ref as React.Ref<HTMLButtonElement & HTMLDivElement>}
				type={onClick ? 'button' : undefined}
				className={cn(
					styles.event,
					timed ? styles.timed : styles.bar,
					continuesBefore ? styles.continuesBefore : '',
					continuesAfter ? styles.continuesAfter : '',
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
				title={timed && timeLabel ? `${title} (${timeLabel})` : title}
				aria-label={ariaLabel ?? (timed && timeLabel ? `${title}, ${timeLabel}` : title)}
			>
				<span className={styles.title}>
					{title}
				</span>
				{timed && timeLabel ? (
					<span className={styles.time}>
						{timeLabel}
					</span>
				) : null}
			</Tag>
		);
	},
);

CalendarBoardEvent.displayName = 'CalendarBoard.Event';
