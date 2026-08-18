import React, {cloneElement, isValidElement} from 'react';
import {composeRefs, type PossibleRef} from './composeRefs';
import {cn} from './cn';

/**
 * Children как render-prop: получает slot-пропсы и ref контентного узла.
 */
export type RenderChildrenFn<P> = (
	props: P,
	contentRef: React.RefCallback<HTMLElement>,
) => React.ReactNode;

/**
 * Режим render-prop: `children` — функция `(props, contentRef) => ReactNode`.
 * `asChild` можно опустить или передать `false`.
 */
export interface EnrichedThroughFn<P> {
	asChild?: false;
	children: RenderChildrenFn<P>;
}

/**
 * Режим cloneElement: единственный React-элемент получает slot-пропсы.
 */
export interface EnrichedThroughChild {
	asChild: true;
	children: React.ReactElement;
}

/**
 * Дискриминированный union `asChild` + `children` для API вроде Overlay / Tooltip.
 *
 * @example
 * type Props = WithEnrichedChildren<{ content: React.ReactNode }, SlotProps>;
 */
export type WithEnrichedChildren<T, P> = T & (EnrichedThroughFn<P> | EnrichedThroughChild);

export type RenderChildrenOptions<P> = {
	/** `true` — `cloneElement` единственного child; `false` — children как render-prop. */
	asChild: boolean;
	children: React.ReactNode | RenderChildrenFn<P>;
	/** Пропсы, которые Overlay навешивает на контентный узел. */
	props: P;
	contentRef: PossibleRef<HTMLElement | null>;
};

/**
 * Отрисовка children без лишней обёртки:
 * - `asChild` — мержит `props` + `contentRef` в единственный React-элемент через `cloneElement`;
 * - иначе — вызывает children как функцию `(props, contentRef) => ReactNode`.
 */
export function renderChildren<P extends object>({
	asChild,
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

	if (asChild) {
		if (!isValidElement(children)) {
			throw new Error('renderChildren: asChild требует единственный дочерний React-элемент');
		}

		const child = children as React.ReactElement<{
			className?: string;
			style?: React.CSSProperties;
			ref?: PossibleRef<HTMLElement>;
		}>;

		const childProps = child.props;
		const slotProps = props as P & {
			className?: string;
			style?: React.CSSProperties;
		};

		return cloneElement(child, {
			...slotProps,
			className: cn(slotProps.className, childProps.className),
			// Slot (позиционирование Overlay) перекрывает декоративный style child.
			style: {
				...childProps.style,
				...slotProps.style,
			},
			ref: composeRefs(refCallback, childProps.ref),
		} as Partial<typeof child.props> & {ref: React.RefCallback<HTMLElement>});
	}

	if (typeof children !== 'function') {
		throw new Error(
			'renderChildren: если asChild равен false, children должен быть функцией (props, contentRef) => ReactNode',
		);
	}

	return (children as RenderChildrenFn<P>)(props, refCallback);
}
