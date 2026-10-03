import type {TooltipProps, TooltipTriggerProps} from './Tooltip.types';
export type {
	TooltipSide,
	TooltipTriggerProps,
	TooltipProps,
} from './Tooltip.types';

import {
	useId,
	type CSSProperties,
	type ReactNode,
	type Ref,
	type RefCallback,
} from 'react';
import {cn} from '../../core/utils/cn';
import {anchorNameFor, popoverDomId, positionArea} from '../../core/utils/popover';
import styles from './Tooltip.module.css';

function assignRef(ref: Ref<HTMLElement> | undefined, node: HTMLElement | null) {
	if (typeof ref === 'function') {
		(ref as RefCallback<HTMLElement | null>)(node);
		return;
	}
	if (ref != null) {
		(ref as {current: HTMLElement | null}).current = node;
	}
}

function renderTrigger(
	children: TooltipProps['children'],
	props: TooltipTriggerProps,
	contentRef: Ref<HTMLElement> | undefined,
	fallback: 'span' | 'fragment',
): ReactNode {
	if (typeof children === 'function') {
		const refCallback: RefCallback<HTMLElement> = (node) => {
			assignRef(contentRef, node);
		};
		return children(props, refCallback);
	}

	if (fallback === 'fragment') return (<>
		{children}
	</>);
	return (<span {...props}>
		{children}
	</span>);
}

/**
 * Текстовая подсказка при наведении или фокусе.
 * Показ — CSS `:hover` / `:focus-within` на общем хосте. Позиция — CSS Anchor Positioning.
 * JS не ставит таймеры и не слушает pointer.
 *
 * Триггер: render-prop `(props, ref) => …` или любой children (оборачивается в `span`).
 *
 * @component
 * @example
 * <Tooltip content="Сохранить" openDelay={300}>
 *   <Button variant="ghost">Сохранить</Button>
 * </Tooltip>
 * @example
 * <Tooltip content="Подсказка">
 *   {(props, ref) => <button type="button" {...props} ref={ref}>?</button>}
 * </Tooltip>
 * @example
 * <Tooltip content="Недоступно">
 *   <Button disabled>Действие</Button>
 * </Tooltip>
 */
export const Tooltip = ({
	content,
	side = 'top',
	children,
	className,
	disabled,
	open,
	defaultOpen,
	openDelay = 200,
	closeDelay = 100,
	wrap: _wrap,
	rootRef,
}: TooltipProps) => {
	const tipId = popoverDomId(useId());
	const anchorName = anchorNameFor(tipId);
	const hidden = disabled || content == null || content === '';

	if (hidden) {
		return renderTrigger(children, {}, rootRef, 'fragment');
	}

	const hostStyle = {
		anchorName,
		'--altum-tooltip-anchor': anchorName,
		'--altum-tooltip-area': positionArea(side, 'center'),
		'--altum-tooltip-open-delay': `${openDelay}ms`,
		'--altum-tooltip-close-delay': `${closeDelay}ms`,
	} as CSSProperties;

	return (
		<span
			ref={rootRef}
			className={styles.host}
			style={hostStyle}
			data-open={open || defaultOpen ? '' : undefined}
		>
			{renderTrigger(
				children,
				{'aria-describedby': tipId},
				undefined,
				'span',
			)}
			<span
				id={tipId}
				role='tooltip'
				className={cn(styles.bubble, className)}
				data-side={side}
			>
				{content}
			</span>
		</span>
	);
};
