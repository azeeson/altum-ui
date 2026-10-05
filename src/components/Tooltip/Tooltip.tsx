import type {TooltipProps, TooltipSide, TooltipTriggerProps} from './Tooltip.types';
export type {
	TooltipSide,
	TooltipTriggerProps,
	TooltipProps,
} from './Tooltip.types';

import {
	useId,
	useLayoutEffect,
	useRef,
	useState,
	type CSSProperties,
	type ReactNode,
	type Ref,
	type RefCallback,
} from 'react';
import {cn} from '../../core/utils/cn';
import {
	anchorNameFor,
	hidePopover,
	popoverDomId,
	positionArea,
	showPopover,
} from '../../core/utils/popover';
import styles from './Tooltip.module.css';

/**
 * Сторона, которой пузырь реально прижат к якорю после `position-try` flip.
 * Меньший неотрицательный зазор — грань со стрелкой.
 */
function placedSide(bubble: DOMRect, anchor: DOMRect): TooltipSide {
	const gaps: Array<[TooltipSide, number]> = [
		['top', anchor.top - bubble.bottom],
		['bottom', bubble.top - anchor.bottom],
		['left', anchor.left - bubble.right],
		['right', bubble.left - anchor.right],
	];
	const touching = gaps
		.filter(([, gap]) => gap >= -2)
		.sort((a, b) => a[1] - b[1]);
	if (touching.length > 0) return touching[0][0];
	return gaps.sort((a, b) => b[1] - a[1])[0][0];
}

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
 * Пузырь — `popover="manual"` в top layer, его не режет `overflow` предка.
 * Показ — CSS `:hover` и `:has(:focus-visible)`. Позиция — CSS Anchor Positioning.
 * Popover открыт с маунта, видимость решает CSS. Стрелка после flip берётся из фактической стороны пузыря.
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
	const hostRef = useRef<HTMLSpanElement | null>(null);
	const bubbleRef = useRef<HTMLSpanElement>(null);
	const [arrow, setArrow] = useState<TooltipSide>(side);
	const hidden = disabled || content == null || content === '';

	useLayoutEffect(() => {
		if (hidden) return;
		const host = hostRef.current;
		const bubble = bubbleRef.current;
		if (!host || !bubble) return;
		showPopover(bubble);

		const sync = () => {
			const next = placedSide(bubble.getBoundingClientRect(), host.getBoundingClientRect());
			setArrow((current) => (current === next ? current : next));
		};

		sync();
		const frame = requestAnimationFrame(sync);
		const observer = new ResizeObserver(sync);
		observer.observe(host);
		window.addEventListener('resize', sync);
		window.addEventListener('scroll', sync, true);
		return () => {
			cancelAnimationFrame(frame);
			observer.disconnect();
			window.removeEventListener('resize', sync);
			window.removeEventListener('scroll', sync, true);
			hidePopover(bubble);
		};
	}, [hidden, side]);

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
			ref={(node) => {
				hostRef.current = node;
				assignRef(rootRef, node);
			}}
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
				ref={bubbleRef}
				id={tipId}
				popover='manual'
				role='tooltip'
				className={cn(styles.bubble, className)}
				data-side={side}
				data-arrow={arrow}
			>
				{content}
			</span>
		</span>
	);
};
