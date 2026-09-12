import React, {cloneElement, forwardRef, isValidElement} from 'react';
import type {ReactElement} from 'react';
import {composeRefs, type PossibleRef} from './composeRefs';
import {composeEventHandlers} from './composeEvents';
import {cn} from './cn';
import {mergeStyles} from './mergeStyles';

type AnyProps = Record<string, unknown>;

function isEventHandlerKey(key: string): boolean {
	return key.length > 2 && key.startsWith('on') && key.charCodeAt(2) >= 65 && key.charCodeAt(2) <= 90;
}

/**
 * Мержит slot-пропсы в единственный React-элемент.
 * className склеивается через {@link cn}, style — через {@link mergeStyles}
 * (slot перекрывает decorative style child). Обработчики `on*` склеиваются:
 * сначала child, затем slot, если `defaultPrevented` ещё false.
 */
export function mergeSlotProps<P extends AnyProps>(
	slotProps: P,
	child: ReactElement,
	ref?: PossibleRef<HTMLElement>,
): AnyProps {
	const childProps = child.props as AnyProps;
	const slotClassName = typeof slotProps.className === 'string' ? slotProps.className : undefined;
	const childClassName = typeof childProps.className === 'string' ? childProps.className : undefined;
	const slotStyle = slotProps.style as React.CSSProperties | undefined;
	const childStyle = childProps.style as React.CSSProperties | undefined;
	const childRef = childProps.ref as PossibleRef<HTMLElement> | undefined;

	const merged: AnyProps = {
		...childProps,
		...slotProps,
		className: cn(slotClassName, childClassName),
		style: mergeStyles(childStyle, slotStyle),
		ref: composeRefs(ref, childRef),
	};

	for (const key of Object.keys(merged)) {
		if (!isEventHandlerKey(key)) continue;
		const slotHandler = slotProps[key];
		const childHandler = childProps[key];
		if (typeof slotHandler === 'function' && typeof childHandler === 'function') {
			merged[key] = composeEventHandlers(
				childHandler as (event: {defaultPrevented: boolean}) => void,
				slotHandler as (event: {defaultPrevented: boolean}) => void,
			);
		}
	}

	return merged;
}

export type SlotProps = React.HTMLAttributes<HTMLElement> & {
	children?: React.ReactNode;
	/** Доп. attrs для child (например `type` у button→Slot). */
	[key: string]: unknown;
};

/**
 * Slot: пробрасывает ref/props в единственный дочерний React-элемент без DOM-обёртки.
 *
 * @component
 * @example
 * <Slot className={styles.root} onClick={onClick}>
 *   <a href="/x">Перейти</a>
 * </Slot>
 */
export const Slot = forwardRef<HTMLElement, SlotProps>(function Slot(
	{children, ...slotProps},
	ref,
) {
	if (!isValidElement(children)) {
		throw new Error('Slot требует единственный дочерний React-элемент');
	}

	return cloneElement(
		children as ReactElement,
		mergeSlotProps(slotProps as AnyProps, children as ReactElement, ref),
	);
});

Slot.displayName = 'Slot';
