import React, {cloneElement, isValidElement} from 'react';
import type {Ref} from 'react';
import {mergeSlotProps} from './slot';

/**
 * Children как render-prop: получает slot-пропсы и ref контентного узла.
 */
export type RenderChildrenFn<P> = (
	props: P,
	contentRef: React.RefCallback<HTMLElement>,
) => React.ReactNode;

/**
 * Режим render-prop: `children` — функция `(props, contentRef) => ReactNode`.
 */
export interface EnrichedThroughFn<P> {
	children: RenderChildrenFn<P>;
}

/**
 * Режим cloneElement: единственный React-элемент получает slot-пропсы.
 * Сохраняется для триггеров с native attrs (`popovertarget` у Popover/Dropdown).
 */
export interface EnrichedThroughChild {
	children: React.ReactElement;
}

/**
 * Union `children`: элемент (slot) или render-prop. Режим выбирается по типу `children`.
 *
 * @example
 * type Props = WithEnrichedChildren<{ content: React.ReactNode }, TriggerProps>;
 */
export type WithEnrichedChildren<T, P> = T & {
	children: RenderChildrenFn<P> | React.ReactElement;
};

export type RenderChildrenOptions<P> = {
	children: React.ReactNode | RenderChildrenFn<P>;
	/** Пропсы, которые слот навешивает на хост. */
	props: P;
	contentRef: Ref<HTMLElement | null> | undefined;
};

/**
 * Отрисовка children без лишней обёртки:
 * - функция — `(props, contentRef) => ReactNode`;
 * - единственный React-элемент — `mergeSlotProps` + `cloneElement`
 *   (нужно для `popovertarget` на интерактивном триггере).
 *
 * @throws если `children` ни функция, ни элемент.
 */
export function renderChildren<P extends object>({
	children,
	props,
	contentRef,
}: RenderChildrenOptions<P>): React.ReactNode {
	const refCallback: React.RefCallback<HTMLElement> = (node) => {
		if (typeof contentRef === 'function') contentRef(node);
		else if (contentRef != null) {
			(contentRef as React.MutableRefObject<HTMLElement | null>).current = node;
		}
	};

	if (typeof children === 'function') {
		return (children as RenderChildrenFn<P>)(props, refCallback);
	}

	if (!isValidElement(children)) {
		throw new Error(
			'renderChildren: children должен быть функцией (props, contentRef) => ReactNode или единственным React-элементом',
		);
	}

	return cloneElement(
		children,
		mergeSlotProps(props as Record<string, unknown>, children, refCallback),
	);
}
