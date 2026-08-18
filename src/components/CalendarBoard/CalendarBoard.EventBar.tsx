import React, {forwardRef} from 'react';
import styles from './CalendarBoard.EventBar.module.css';
import {cn} from '../../utils/cn';
import type {CalendarBoardEventBarProps} from './CalendarBoard.types';

export type {CalendarBoardEventBarProps} from './CalendarBoard.types';

export const CalendarBoardEventBar = forwardRef<HTMLButtonElement | HTMLDivElement, CalendarBoardEventBarProps>(
	function CalendarBoardEventBar(
		{
			title,
			color,
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
		const colorStyle = color
			? ({'--altum-calendar-board-event-color': color} as React.CSSProperties)
			: undefined;

		return (
			<Tag
				ref={ref as React.Ref<HTMLButtonElement & HTMLDivElement>}
				type={onClick ? 'button' : undefined}
				className={cn(
					styles.bar,
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
				title={title}
				aria-label={ariaLabel ?? title}
			>
				<span className={styles.title}>
					{title}
				</span>
			</Tag>
		);
	},
);

CalendarBoardEventBar.displayName = 'CalendarBoard.EventBar';
