import type {
	SafeAreaEdges,
	SafeAreaProps,
} from './SafeArea.types';
export type {
	SafeAreaEdges,
	SafeAreaProps,
} from './SafeArea.types';

import {forwardRef, type CSSProperties, type ElementType} from 'react';
import styles from './SafeArea.module.css';
import {cn} from '../../utils/cn';
import {mergeStyles} from '../../utils/mergeStyles';

function resolveEdges(edges: SafeAreaEdges | SafeAreaEdges[]): Set<string> {
	const list = Array.isArray(edges) ? edges : [edges];
	const set = new Set<string>();
	list.forEach((edge) => {
		if (edge === 'all') {
			set.add('top');
			set.add('right');
			set.add('bottom');
			set.add('left');
		} else if (edge === 'x') {
			set.add('left');
			set.add('right');
		} else if (edge === 'y') {
			set.add('top');
			set.add('bottom');
		} else {
			set.add(edge);
		}
	});
	return set;
}

/**
 * Отступы под системные «небезопасные» зоны экрана.
 *
 * @component
 * @example
 * <SafeArea edges="top" fill as="main">{content}</SafeArea>
 */
export const SafeArea = forwardRef<HTMLElement, SafeAreaProps>(function SafeArea(
	{
		edges = 'all',
		padding,
		fill = false,
		as: Component = 'div',
		children,
		className,
		style,
		...rest
	},
	ref,
) {
	const edgeSet = resolveEdges(edges);
	const pad = typeof padding === 'number' ? `${padding}px` : padding;

	const insetStyle = mergeStyles(
		{
			...(pad ? {['--altum-safe-pad' as string]: pad} : {}),
			paddingTop: edgeSet.has('top')
				? 'calc(env(safe-area-inset-top, 0px) + var(--altum-safe-pad, 0px))'
				: undefined,
			paddingRight: edgeSet.has('right')
				? 'calc(env(safe-area-inset-right, 0px) + var(--altum-safe-pad, 0px))'
				: undefined,
			paddingBottom: edgeSet.has('bottom')
				? 'calc(env(safe-area-inset-bottom, 0px) + var(--altum-safe-pad, 0px))'
				: undefined,
			paddingLeft: edgeSet.has('left')
				? 'calc(env(safe-area-inset-left, 0px) + var(--altum-safe-pad, 0px))'
				: undefined,
		} as CSSProperties,
		style,
	);

	const Element = Component as ElementType;

	return (
		<Element
			ref={ref as never}
			className={cn(styles.root, fill ? styles.fill : '', className)}
			style={insetStyle}
			{...rest}
			data-edges={Array.from(edgeSet).join(' ')}
		>
			{children}
		</Element>
	);
});

SafeArea.displayName = 'SafeArea';
