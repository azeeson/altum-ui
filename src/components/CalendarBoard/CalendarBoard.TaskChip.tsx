import {forwardRef, type CSSProperties, type Ref} from 'react';
import {CalendarBoardEventBar} from './CalendarBoard.EventBar';
import {CalendarBoardTimedEvent} from './CalendarBoard.TimedEvent';
import {useCalendarBoard, useCalendarBoardTaskHover, type CalendarBoardTaskRenderProps} from './CalendarBoard.context';
import styles from './CalendarBoard.module.css';
import {cn} from '../../utils/cn';
import {mergeStyles} from '../../utils/mergeStyles';
import type {CalendarBoardTaskChipProps} from './CalendarBoard.types';

export type {CalendarBoardTaskChipProps} from './CalendarBoard.types';

/**
 * Чип / бар / timed-блок задачи.
 * Hover синхронизируется через внешний store: все сегменты с одним `task.id`
 * подсвечиваются вместе без перерисовки ячеек доски.
 */
export const CalendarBoardTaskChip = forwardRef<HTMLButtonElement | HTMLSpanElement, CalendarBoardTaskChipProps>(
	function CalendarBoardTaskChip(
		{
			task,
			layout = 'chip',
			continuesBefore = false,
			continuesAfter = false,
			timeLabel,
			className = '',
			style,
			highlighted: highlightedProp,
		},
		ref,
	) {
		const {
			onTaskClick,
			renderTask,
		} = useCalendarBoard('CalendarBoard.TaskChip');

		const hover = useCalendarBoardTaskHover(task.id);
		const highlighted = highlightedProp ?? hover.highlighted;
		const handleEnter = hover.onMouseEnter;
		const handleLeave = hover.onMouseLeave;
		const onClick = onTaskClick ? () => onTaskClick(task) : undefined;

		const renderProps: CalendarBoardTaskRenderProps = {
			task,
			layout,
			highlighted,
			continuesBefore,
			continuesAfter,
			timeLabel,
			onClick,
			onMouseEnter: handleEnter,
			onMouseLeave: handleLeave,
			className,
			style,
		};

		if (renderTask) {
			return (
				<>
					{renderTask(renderProps)}
				</>
			);
		}

		if (layout === 'bar') {
			return (
				<CalendarBoardEventBar
					ref={ref as Ref<HTMLButtonElement | HTMLDivElement>}
					title={task.title}
					color={task.color}
					continuesBefore={continuesBefore}
					continuesAfter={continuesAfter}
					highlighted={highlighted}
					onClick={onClick}
					onMouseEnter={handleEnter}
					onMouseLeave={handleLeave}
					className={className}
					style={style}
				/>
			);
		}

		if (layout === 'timed') {
			return (
				<CalendarBoardTimedEvent
					ref={ref as Ref<HTMLButtonElement | HTMLDivElement>}
					title={task.title}
					timeLabel={timeLabel}
					color={task.color}
					highlighted={highlighted}
					onClick={onClick}
					onMouseEnter={handleEnter}
					onMouseLeave={handleLeave}
					className={className}
					style={style}
				/>
			);
		}

		const colorStyle = task.color
			? ({
				'--altum-calendar-board-dot-color': task.color,
				'--altum-calendar-board-task-color': task.color
			} as CSSProperties)
			: undefined;
		const Tag = onClick ? 'button' : 'span';

		return (
			<Tag
				ref={ref as Ref<HTMLButtonElement & HTMLSpanElement>}
				type={onClick ? 'button' : undefined}
				className={cn(
					styles.chip,
					task.completed ? styles.chipCompleted : '',
					onClick ? styles.chipClickable : '',
					highlighted ? styles.chipHighlighted : '',
					className,
				)}
				style={mergeStyles(colorStyle, style)}
				onClick={onClick}
				onMouseEnter={handleEnter}
				onMouseLeave={handleLeave}
				title={task.title}
				data-task-id={task.id}
			>
				<span className={styles.chipDot} aria-hidden='true' />
				<span className={styles.chipTitle}>
					{task.title}
				</span>
			</Tag>
		);
	}
);

CalendarBoardTaskChip.displayName = 'CalendarBoard.TaskChip';
