import type {CSSProperties, ElementType, Ref} from 'react';
import styles from './CalendarBoard.Event.module.css';
import {cn} from '../../core/utils/cn';
import type {CalendarBoardEventProps} from './CalendarBoard.types';

export type {CalendarBoardEventProps} from './CalendarBoard.types';

/**
 * Полоса all-day (`bar`) или блок timed-события.
 * Состояния — `data-layout`, `data-continues-*`, `data-highlighted`.
 * Цвет — `--altum-calendar-board-event-color`.
 *
 * @component
 */
export const CalendarBoardEvent = ({
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
	className,
	style,
	rootRef,
	'aria-label': ariaLabel,
	...rest
}: CalendarBoardEventProps) => {
	const attrs = rest as Record<string, unknown>;
	const actionable = Boolean(onClick || attrs['data-event-id'] || attrs['data-task-id']);
	const Tag = (actionable ? 'button' : 'div') as ElementType;
	const colorStyle = color
		? ({'--altum-calendar-board-event-color': color} as CSSProperties)
		: undefined;

	return (
		<Tag
			{...rest}
			{...(actionable ? {type: 'button' as const} : null)}
			ref={rootRef as Ref<HTMLButtonElement>}
			className={cn(styles.event, className)}
			style={{
				...colorStyle,
				...style,
			}}
			data-layout={layout}
			data-continues-before={continuesBefore ? '' : undefined}
			data-continues-after={continuesAfter ? '' : undefined}
			data-highlighted={highlighted ? '' : undefined}
			onClick={onClick}
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
			title={layout === 'timed' && timeLabel ? `${title} (${timeLabel})` : title}
			aria-label={ariaLabel ?? (layout === 'timed' && timeLabel ? `${title}, ${timeLabel}` : title)}
		>
			<span className={styles.title}>
				{title}
			</span>
			{layout === 'timed' && timeLabel ? (
				<span className={styles.time}>
					{timeLabel}
				</span>
			) : null}
		</Tag>
	);
};
