import type {
	SafeAreaEdges,
	SafeAreaProps,
} from './SafeArea.types';
export type {
	SafeAreaEdges,
	SafeAreaProps,
} from './SafeArea.types';

import type {CSSProperties, ElementType} from 'react';
import styles from './SafeArea.module.css';
import {cn} from '../../core/utils/cn';

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
export const SafeArea = ({
	edges = 'all',
	padding,
	fill = false,
	as: Component = 'div',
	children,
	className,
	style,
	rootRef,
	...rest
}: SafeAreaProps) => {
	const edgeSet = resolveEdges(edges);
	const pad = typeof padding === 'number' ? `${padding}px` : padding;
	const Element = Component as ElementType;

	return (
		<Element
			ref={rootRef}
			className={cn(styles.root, className)}
			data-fill={fill ? '' : undefined}
			data-top={edgeSet.has('top') ? '' : undefined}
			data-right={edgeSet.has('right') ? '' : undefined}
			data-bottom={edgeSet.has('bottom') ? '' : undefined}
			data-left={edgeSet.has('left') ? '' : undefined}
			style={{
				...(pad ? {'--altum-safe-pad': pad} : {}),
				...style,
			} as CSSProperties}
			{...rest}
		>
			{children}
		</Element>
	);
};
