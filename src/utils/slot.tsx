import React, {cloneElement, forwardRef, isValidElement} from 'react';
import type {ReactElement} from 'react';
import {composeRefs, type PossibleRef} from './composeRefs';
import {cn} from './cn';
import {mergeStyles} from './mergeStyles';

type AnyProps = Record<string, unknown>;

/**
 * Мержит slot-пропсы в единственный React-элемент (asChild).
 * className склеивается через {@link cn}, style — через {@link mergeStyles}
 * (slot перекрывает decorative style child).
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

	return {
		...childProps,
		...slotProps,
		className: cn(slotClassName, childClassName),
		style: mergeStyles(childStyle, slotStyle),
		ref: composeRefs(ref, childRef),
	};
}

export type SlotProps = React.HTMLAttributes<HTMLElement> & {
	children?: React.ReactNode;
	/** Доп. attrs для child (например `type` у button→Slot). */
	[key: string]: unknown;
};

/**
 * Slot: рендерит children as-is или (при одном элементе) пробрасывает ref/props.
 * Используется Button/Link `asChild` без лишней DOM-обёртки.
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
		throw new Error('Slot: asChild требует единственный дочерний React-элемент');
	}

	return cloneElement(
		children as ReactElement,
		mergeSlotProps(slotProps as AnyProps, children as ReactElement, ref),
	);
});

Slot.displayName = 'Slot';
