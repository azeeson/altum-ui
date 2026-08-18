import type {TooltipTriggerProps, TooltipProps} from './Tooltip.types';
export type {
	TooltipPosition,
	TooltipTriggerProps,
	TooltipProps,
} from './Tooltip.types';

import React, {forwardRef, isValidElement, useRef} from 'react';
import {composeRefs} from '../../utils/composeRefs';
import {Popover, type PopoverTriggerSlotProps} from '../Popover/Popover';
import styles from './Tooltip.module.css';
import {renderChildren, type RenderChildrenFn} from '../../utils/renderChildren';

function isDisabledElement(node: React.ReactNode): boolean {
	if (!isValidElement(node)) return false;
	const props = node.props as {
		disabled?: boolean;
		'aria-disabled'?: boolean | 'true' | 'false';
	};
	return !!(props.disabled || props['aria-disabled'] === true || props['aria-disabled'] === 'true');
}

/**
 * Контекстная подсказка при наведении или фокусе — на базе `Popover.Content variant="tooltip"`.
 *
 * Триггер рендерится через `renderChildren` / `WithEnrichedChildren`.
 *
 * @component
 * @example
 * <Tooltip content="Сохранить" asChild openDelay={300}>
 *   <Button variant="ghost">Сохранить</Button>
 * </Tooltip>
 * @example
 * <Tooltip content="Подсказка" asChild={false}>
 *   {(props, ref) => <button type="button" {...props} ref={ref}>?</button>}
 * </Tooltip>
 * @example
 * <Tooltip content="Недоступно" asChild wrap>
 *   <Button disabled>Действие</Button>
 * </Tooltip>
 */
export const Tooltip = forwardRef<HTMLElement, TooltipProps>(function Tooltip(props, ref) {
	const {
		content,
		position = 'top',
		children,
		asChild,
		className = '',
		open: controlledOpen,
		defaultOpen = false,
		onOpenChange,
		openDelay,
		closeDelay = 100,
		disabled = false,
		wrap,
		arrow = false,
	} = props;

	const resolvedAsChild = asChild === true;
	const resolvedOpenDelay = openDelay ?? 200;
	const shouldWrap = wrap ?? (
		resolvedAsChild
		&& isValidElement(children)
		&& isDisabledElement(children)
	);
	const forceOpenOnly = controlledOpen === true && !onOpenChange;
	const triggerRef = useRef<HTMLElement | null>(null);

	if (content == null || content === '') {
		const triggerSlotProps: TooltipTriggerProps = {
			...(!resolvedAsChild && shouldWrap ? {className: styles.wrap} : {}),
		};
		const triggerChildren = resolvedAsChild && shouldWrap
			? (
				<span className={styles.wrap}>
					{children as React.ReactElement}
				</span>
			)
			: children;

		return (
			<>
				{renderChildren({
					asChild: resolvedAsChild,
					children: triggerChildren,
					props: triggerSlotProps,
					contentRef: composeRefs(ref, triggerRef),
				})}
			</>
		);
	}

	return (
		<Popover
			ref={ref}
			side={position}
			trigger={forceOpenOnly ? 'manual' : 'hover'}
			open={forceOpenOnly ? true : controlledOpen}
			defaultOpen={forceOpenOnly ? true : defaultOpen}
			onOpenChange={forceOpenOnly ? undefined : onOpenChange}
			openDelay={forceOpenOnly ? 0 : resolvedOpenDelay}
			closeDelay={closeDelay}
			closeOnOutsideClick={false}
			closeOnEscape
			disabled={disabled}
		>
			{resolvedAsChild ? (
				<Popover.Trigger asChild wrap={wrap}>
					{children as React.ReactElement}
				</Popover.Trigger>
			) : (
				<Popover.Trigger asChild={false} wrap={wrap}>
					{children as RenderChildrenFn<PopoverTriggerSlotProps>}
				</Popover.Trigger>
			)}
			<Popover.Content
				variant='tooltip'
				arrow={arrow}
				className={className}
			>
				{content}
			</Popover.Content>
		</Popover>
	);
});

Tooltip.displayName = 'Tooltip';
