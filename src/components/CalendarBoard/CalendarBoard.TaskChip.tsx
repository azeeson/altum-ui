import type {CSSProperties, ElementType, Ref} from 'react';
import {CalendarBoardEvent} from './CalendarBoard.Event';
import {
	useCalendarBoard,
	useCalendarBoardTaskHover,
	type CalendarBoardTaskRenderProps,
} from './CalendarBoard.context';
import styles from './CalendarBoard.module.css';
import {cn} from '../../core/utils/cn';
import type {CalendarBoardTaskChipProps} from './CalendarBoard.types';

export type {CalendarBoardTaskChipProps} from './CalendarBoard.types';

/**
 * Чип / бар / timed-блок задачи.
 * Клик и hover читает предок по `data-task-id`. Подсветка — внешний hover-store.
 */
export const CalendarBoardTaskChip = ({
	task,
	layout = 'chip',
	continuesBefore = false,
	continuesAfter = false,
	timeLabel,
	className,
	style,
	highlighted: highlightedProp,
	rootRef,
	...rest
}: CalendarBoardTaskChipProps) => {
	const {onTaskClick, renderTask} = useCalendarBoard('CalendarBoard.TaskChip');
	const hover = useCalendarBoardTaskHover(task.id);
	const highlighted = highlightedProp ?? hover.highlighted;
	const actionable = Boolean(onTaskClick);
	const openTask = () => onTaskClick?.(task);

	const renderProps: CalendarBoardTaskRenderProps = {
		task,
		layout,
		highlighted,
		continuesBefore,
		continuesAfter,
		timeLabel,
		onClick: actionable ? openTask : undefined,
		onMouseEnter: hover.onMouseEnter,
		onMouseLeave: hover.onMouseLeave,
		className,
		style,
	};

	if (renderTask) {
		return renderTask(renderProps);
	}

	if (layout === 'bar' || layout === 'timed') {
		return (
			<CalendarBoardEvent
				{...rest}
				rootRef={rootRef}
				layout={layout}
				title={task.title}
				timeLabel={timeLabel}
				color={task.color}
				continuesBefore={continuesBefore}
				continuesAfter={continuesAfter}
				highlighted={highlighted}
				className={className}
				style={style}
				data-task-id={task.id}
			/>
		);
	}

	const Tag = (actionable ? 'button' : 'span') as ElementType;
	const colorStyle = task.color
		? ({
			'--altum-calendar-board-dot-color': task.color,
			'--altum-calendar-board-task-color': task.color,
		} as CSSProperties)
		: undefined;

	return (
		<Tag
			{...rest}
			{...(actionable ? {type: 'button' as const} : null)}
			ref={rootRef as Ref<HTMLButtonElement>}
			className={cn(styles.chip, className)}
			style={{
				...colorStyle,
				...style
			}}
			data-task-id={task.id}
			data-completed={task.completed ? '' : undefined}
			data-highlighted={highlighted ? '' : undefined}
			title={task.title}
		>
			<span className={styles.chipDot} aria-hidden='true' />
			<span className={styles.chipTitle}>
				{task.title}
			</span>
		</Tag>
	);
};
