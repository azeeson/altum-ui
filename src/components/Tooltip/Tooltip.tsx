import type {TooltipTriggerProps, TooltipProps} from './Tooltip.types';
export type {
	TooltipPosition,
	TooltipSide,
	TooltipTriggerProps,
	TooltipProps,
} from './Tooltip.types';

import React, {forwardRef, isValidElement} from 'react';
import {composeRefs} from '../../utils/composeRefs';
import {Popover} from '../Popover/Popover';
import styles from './Tooltip.module.css';
import {renderChildren} from '../../utils/renderChildren';

function isDisabledElement(node: React.ReactNode): boolean {
	if (!isValidElement(node)) return false;
	const props = node.props as {
		disabled?: boolean;
		'aria-disabled'?: boolean | 'true' | 'false';
	};
	return !!(props.disabled || props['aria-disabled'] === true || props['aria-disabled'] === 'true');
}

/**
 * Контекстная подсказка при наведении или фокусе — на базе `Popover` (`variant="tooltip"`).
 *
 * Триггер: единственный элемент (slot) или render-prop `(props, ref) => …`.
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
 * <Tooltip content="Недоступно" wrap>
 *   <Button disabled>Действие</Button>
 * </Tooltip>
 */
export const Tooltip = forwardRef<HTMLElement, TooltipProps>(function Tooltip(
	{
		content,
		side,
		position = 'top',
		children,
		className,
		open,
		defaultOpen = false,
		onOpenChange,
		openDelay = 200,
		closeDelay = 100,
		disabled = false,
		wrap,
		arrow = true,
	},
	ref,
) {
	const isSlot = isValidElement(children);
	const shouldWrap = wrap ?? (isSlot && isDisabledElement(children));
	const triggerChildren = isSlot && shouldWrap
		? (
			<span className={styles.wrap}>
				{children}
			</span>
		)
		: children;

	const renderAnchor = (
		slotProps: TooltipTriggerProps,
		slotRef: React.RefCallback<HTMLElement>,
	) => renderChildren({
		children: triggerChildren,
		props: slotProps,
		contentRef: composeRefs(ref, slotRef),
	});

	const resolvedSide = side ?? position;

	if (content == null || content === '') {
		return renderAnchor({}, () => undefined);
	}

	return (
		<Popover
			trigger='hover'
			open={open}
			defaultOpen={defaultOpen}
			onOpenChange={onOpenChange}
			disabled={disabled}
			wrap={false}
			variant='tooltip'
			arrow={arrow}
			panelClassName={className}
			side={resolvedSide}
			openDelay={openDelay}
			closeDelay={closeDelay}
			dismiss='escape'
			renderTrigger={renderAnchor}
		>
			{content}
		</Popover>
	);
});

Tooltip.displayName = 'Tooltip';
